import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import type { ServerResponse } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Connect, Plugin } from 'vite';

// ─────────────────────────────────────────────────────────────────────────────
// MP4 render plugin
//
// POST /api/mp4/render
//   {
//     slides: [
//       { image: <base64 png>, audio?: <base64 audio>, audioMime?: string,
//         fallbackDurationMs?: number },
//       ...
//     ],
//     fps?: 30,
//     resolution?: { width: 1920, height: 1080 }
//   }
//
// Each slide becomes a still-image segment with synced audio (or silent
// padding for the requested duration). Segments are concatenated with
// `-c copy` for a fast, lossless mux.
// ─────────────────────────────────────────────────────────────────────────────

type SlideInput = {
  image: string;
  audio?: string;
  audioMime?: string;
  fallbackDurationMs?: number;
};

export type Mp4Quality = 'youtube' | 'standard' | 'draft';

type RenderRequest = {
  slides?: SlideInput[];
  fps?: number;
  resolution?: { width?: number; height?: number };
  quality?: Mp4Quality;
};

const DEFAULT_FPS = 30;
const DEFAULT_FALLBACK_MS = 5000;
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_QUALITY: Mp4Quality = 'youtube';

// ─────────────────────────────────────────────────────────────────────────────
// Quality presets
//
// The export pipeline previously had no `-crf` or `-b:v`, so libx264 fell
// back to crf=23. Combined with `-tune stillimage` and the near-static slide
// content, that produced ~99 kbps 1080p output — far below YouTube's 8 Mbps
// recommended upload bitrate, with visible mosquito noise around photos and
// ringing on small Korean text.
//
// These presets target three real use cases:
//   - youtube : visually-lossless source for re-encoding by YT/Vimeo
//   - standard: comfortable for Drive/Slack/Notion sharing
//   - draft   : quick preview, smallest file
//
// `-tune stillimage` is intentionally OMITTED from youtube/standard. It
// boosts deblock strength and AC quantization in a way that softens text
// edges — the wrong trade-off when slides are mostly typography. Draft
// keeps it because preview file size matters more than text crispness.
//
// `keyint=60:min-keyint=30:scenecut=0` produces a closed GOP every 1–2s,
// which is what YouTube's transcoder prefers and which makes scrubbing
// smooth in any player.
// ─────────────────────────────────────────────────────────────────────────────

type QualitySpec = {
  crf: string;
  preset: string;
  audioBitrate: string;
  tune?: string;
  x264Params: string;
};

const QUALITY_PRESETS: Record<Mp4Quality, QualitySpec> = {
  youtube: {
    crf: '17',
    preset: 'slow',
    audioBitrate: '256k',
    x264Params: 'keyint=60:min-keyint=30:scenecut=0',
  },
  standard: {
    crf: '20',
    preset: 'medium',
    audioBitrate: '192k',
    x264Params: 'keyint=60:min-keyint=30:scenecut=0',
  },
  draft: {
    crf: '23',
    preset: 'fast',
    audioBitrate: '128k',
    tune: 'stillimage',
    x264Params: 'keyint=120:min-keyint=30:scenecut=0',
  },
};

function resolveQuality(q: string | undefined): QualitySpec {
  if (q && q in QUALITY_PRESETS) return QUALITY_PRESETS[q as Mp4Quality];
  return QUALITY_PRESETS[DEFAULT_QUALITY];
}

export function mp4Plugin(): Plugin {
  return {
    name: 'open-slide:mp4',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', requestOrigin(req));
        if (!url.pathname.startsWith('/api/mp4/')) return next();

        try {
          if (url.pathname === '/api/mp4/render' && req.method === 'POST') {
            const body = (await readJson(req)) as RenderRequest;
            const slides = body.slides ?? [];
            if (slides.length === 0) {
              return json(res, 400, { error: 'No slides supplied.' });
            }
            const fps = body.fps ?? DEFAULT_FPS;
            const width = body.resolution?.width ?? DEFAULT_WIDTH;
            const height = body.resolution?.height ?? DEFAULT_HEIGHT;
            const quality = resolveQuality(body.quality);

            const workdir = await mkdtemp(path.join(tmpdir(), 'mos-mp4-'));
            try {
              const segments = await renderSegments(slides, workdir, {
                fps,
                width,
                height,
                quality,
              });
              const finalPath = path.join(workdir, 'output.mp4');
              await concatSegments(segments, workdir, finalPath, quality);
              const data = await streamFile(finalPath);

              res.statusCode = 200;
              res.setHeader('content-type', 'video/mp4');
              res.setHeader('content-disposition', `attachment; filename="slide-deck.mp4"`);
              res.end(data);
              return;
            } finally {
              // Best-effort cleanup; don't block the response on it.
              rm(workdir, { recursive: true, force: true }).catch(() => undefined);
            }
          }

          if (url.pathname === '/api/mp4/check') {
            const ok = await checkFfmpeg();
            return json(res, 200, {
              ok,
              message: ok ? 'ffmpeg ready' : 'ffmpeg not found on PATH',
            });
          }

          return next();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'MP4 render failed';
          return json(res, 500, { error: message });
        }
      });
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline
//
// Each slide becomes a segment whose VIDEO and AUDIO durations are forced to
// the same frame-aligned length. Three failure modes the previous version
// hit, all fixed here:
//
//   1. `-shortest` truncated audio mid-AAC-frame (1024 samples ≈ 23 ms each),
//      so the segment's audio ended ~10–50 ms shorter than its video. Across
//      14 slides this accumulated to ~2 s of drift between the streams.
//      Fix: probe the audio with ffprobe, round its duration UP to the
//      nearest video frame, and force BOTH streams to that exact duration
//      using `-t` for video and `apad,atrim` for audio.
//
//   2. The audio sample rate / channel layout was whatever the input was
//      (TTS sources commonly emit 22050 Hz mono). Different inputs concat'd
//      with `-c copy` cause clicks at every segment boundary.
//      Fix: every segment is encoded with `-ar 48000 -ac 2` so the stream
//      params are bit-identical across segments.
//
//   3. The final concat used the demuxer with `-c copy`, which only stitches
//      packets and does NOT realign timestamps, so any per-segment skew
//      shows up as audio dropouts and lip-sync drift in the player.
//      Fix: assemble all segments with the `concat` FILTER and re-encode
//      once at the end. Slower, but produces a gapless A/V-locked stream.
// ─────────────────────────────────────────────────────────────────────────────

const AUDIO_SAMPLE_RATE = 48000;
const AUDIO_CHANNELS = 2;

async function renderSegments(
  slides: SlideInput[],
  workdir: string,
  opts: { fps: number; width: number; height: number; quality: QualitySpec },
): Promise<string[]> {
  const q = opts.quality;
  const out: string[] = [];
  const frameDurSec = 1 / opts.fps;

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const id = String(i + 1).padStart(4, '0');
    const imagePath = path.join(workdir, `frame-${id}.png`);
    await writeFile(imagePath, Buffer.from(s.image, 'base64'));

    const segmentPath = path.join(workdir, `segment-${id}.mp4`);
    const vfScale =
      `scale=${opts.width}:${opts.height}:force_original_aspect_ratio=decrease,` +
      `pad=${opts.width}:${opts.height}:(ow-iw)/2:(oh-ih)/2:black,setsar=1`;

    if (s.audio) {
      const ext = pickAudioExt(s.audioMime ?? 'audio/mpeg');
      const audioPath = path.join(workdir, `audio-${id}.${ext}`);
      await writeFile(audioPath, Buffer.from(s.audio, 'base64'));

      // Probe the source audio so we know exactly how long the segment must
      // be. Round UP to the next whole video frame so the still-image loop
      // ends on a frame boundary; this prevents the `-shortest` style
      // mid-frame truncation that caused the choppy-audio regression.
      const audioDur = await probeAudioDuration(audioPath);
      const durationSec = Math.max(
        frameDurSec,
        Math.ceil((audioDur + 0.05) / frameDurSec) * frameDurSec,
      );
      const durationStr = durationSec.toFixed(3);

      await runFfmpeg([
        '-y',
        '-loop',
        '1',
        '-framerate',
        String(opts.fps),
        '-t',
        durationStr,
        '-i',
        imagePath,
        '-i',
        audioPath,
        // -map order pins the streams; otherwise ffmpeg may pick the audio
        // from input 0 (anullsrc would fall back) and ignore the real audio.
        '-map',
        '0:v:0',
        '-map',
        '1:a:0',
        '-vf',
        vfScale,
        // `apad` extends the audio with silence so atrim can land exactly
        // on the frame boundary; aresample fixes any rate mismatch between
        // tts outputs (commonly 22050/24000 Hz mono).
        '-af',
        `aresample=${AUDIO_SAMPLE_RATE}:async=1:first_pts=0,apad,atrim=end=${durationStr},asetpts=N/SR/TB`,
        '-c:v',
        'libx264',
        '-preset',
        q.preset,
        '-crf',
        q.crf,
        ...(q.tune ? ['-tune', q.tune] : []),
        '-x264-params',
        q.x264Params,
        '-pix_fmt',
        'yuv420p',
        '-r',
        String(opts.fps),
        '-fps_mode',
        'cfr',
        '-c:a',
        'aac',
        '-b:a',
        q.audioBitrate,
        '-ar',
        String(AUDIO_SAMPLE_RATE),
        '-ac',
        String(AUDIO_CHANNELS),
        '-movflags',
        '+faststart',
        segmentPath,
      ]);
    } else {
      const fallbackMs = s.fallbackDurationMs ?? DEFAULT_FALLBACK_MS;
      const durationSec = Math.max(
        frameDurSec,
        Math.ceil(fallbackMs / 1000 / frameDurSec) * frameDurSec,
      );
      const durationStr = durationSec.toFixed(3);

      await runFfmpeg([
        '-y',
        '-loop',
        '1',
        '-framerate',
        String(opts.fps),
        '-t',
        durationStr,
        '-i',
        imagePath,
        '-f',
        'lavfi',
        '-t',
        durationStr,
        '-i',
        `anullsrc=channel_layout=stereo:sample_rate=${AUDIO_SAMPLE_RATE}`,
        '-map',
        '0:v:0',
        '-map',
        '1:a:0',
        '-vf',
        vfScale,
        '-c:v',
        'libx264',
        '-preset',
        q.preset,
        '-crf',
        q.crf,
        ...(q.tune ? ['-tune', q.tune] : []),
        '-x264-params',
        q.x264Params,
        '-pix_fmt',
        'yuv420p',
        '-r',
        String(opts.fps),
        '-fps_mode',
        'cfr',
        '-c:a',
        'aac',
        '-b:a',
        q.audioBitrate,
        '-ar',
        String(AUDIO_SAMPLE_RATE),
        '-ac',
        String(AUDIO_CHANNELS),
        '-movflags',
        '+faststart',
        segmentPath,
      ]);
    }

    out.push(segmentPath);
  }
  return out;
}

async function concatSegments(
  segments: string[],
  _workdir: string,
  outputPath: string,
  quality: QualitySpec,
): Promise<void> {
  // We intentionally do NOT use the concat demuxer with `-c copy` here.
  // That path is the fastest, but it only stitches packets — segment-to-
  // segment timestamp skew survives untouched and shows up as audio
  // dropouts and A/V lip-sync drift in the player. The concat FILTER
  // graph re-encodes once and yields a gapless, A/V-locked output.
  const args: string[] = ['-y'];
  for (const seg of segments) {
    args.push('-i', seg);
  }

  const n = segments.length;
  const filterParts: string[] = [];
  for (let i = 0; i < n; i++) {
    filterParts.push(`[${i}:v:0]setsar=1,fps=30[v${i}]`);
    filterParts.push(`[${i}:a:0]aresample=${AUDIO_SAMPLE_RATE}:async=1:first_pts=0[a${i}]`);
  }
  let concatInputs = '';
  for (let i = 0; i < n; i++) concatInputs += `[v${i}][a${i}]`;
  filterParts.push(`${concatInputs}concat=n=${n}:v=1:a=1[v][a]`);
  const filter = filterParts.join(';');

  args.push(
    '-filter_complex',
    filter,
    '-map',
    '[v]',
    '-map',
    '[a]',
    '-c:v',
    'libx264',
    '-preset',
    quality.preset,
    '-crf',
    quality.crf,
    ...(quality.tune ? ['-tune', quality.tune] : []),
    '-x264-params',
    quality.x264Params,
    '-pix_fmt',
    'yuv420p',
    '-fps_mode',
    'cfr',
    '-c:a',
    'aac',
    '-b:a',
    quality.audioBitrate,
    '-ar',
    String(AUDIO_SAMPLE_RATE),
    '-ac',
    String(AUDIO_CHANNELS),
    '-movflags',
    '+faststart',
    outputPath,
  );

  await runFfmpeg(args);
}

function probeAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        filePath,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let stdout = '';
    let stderr = '';
    proc.stdout?.on('data', (c: Buffer) => (stdout += c.toString('utf8')));
    proc.stderr?.on('data', (c: Buffer) => (stderr += c.toString('utf8')));
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`ffprobe exited ${code}: ${stderr.slice(0, 400)}`));
      }
      const dur = parseFloat(stdout.trim());
      if (!Number.isFinite(dur) || dur <= 0) {
        return reject(new Error(`ffprobe returned invalid duration: ${stdout}`));
      }
      resolve(dur);
    });
  });
}

async function streamFile(filePath: string): Promise<Buffer> {
  const { readFile } = await import('node:fs/promises');
  return await readFile(filePath);
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', ['-loglevel', 'error', ...args], {
      stdio: ['ignore', 'inherit', 'pipe'],
    });
    let stderr = '';
    proc.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(0, 800)}`));
    });
  });
}

function checkFfmpeg(): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn('ffmpeg', ['-version'], { stdio: 'ignore' });
    proc.on('error', () => resolve(false));
    proc.on('close', (code) => resolve(code === 0));
  });
}

function pickAudioExt(mime: string): string {
  if (mime.includes('mpeg')) return 'mp3';
  if (mime.includes('wav')) return 'wav';
  if (mime.includes('aac')) return 'aac';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('webm')) return 'webm';
  return 'bin';
}

// ─────────────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────────────

function requestOrigin(req: Connect.IncomingMessage): string {
  const proto = (req.headers['x-forwarded-proto'] as string | undefined) ?? 'http';
  const host = req.headers.host ?? '127.0.0.1:5173';
  return `${proto}://${host}`;
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readBody(req: Connect.IncomingMessage): Promise<Uint8Array> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req: Connect.IncomingMessage): Promise<unknown> {
  const bytes = await readBody(req);
  const text = Buffer.from(bytes).toString('utf8');
  if (!text.trim()) return {};
  return JSON.parse(text);
}
