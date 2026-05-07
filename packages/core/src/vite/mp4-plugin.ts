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

type RenderRequest = {
  slides?: SlideInput[];
  fps?: number;
  resolution?: { width?: number; height?: number };
};

const DEFAULT_FPS = 30;
const DEFAULT_FALLBACK_MS = 5000;
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

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

            const workdir = await mkdtemp(path.join(tmpdir(), 'mos-mp4-'));
            try {
              const segments = await renderSegments(slides, workdir, { fps, width, height });
              const finalPath = path.join(workdir, 'output.mp4');
              await concatSegments(segments, workdir, finalPath);
              const data = await streamFile(finalPath);

              res.statusCode = 200;
              res.setHeader('content-type', 'video/mp4');
              res.setHeader(
                'content-disposition',
                `attachment; filename="slide-deck.mp4"`,
              );
              res.end(data);
              return;
            } finally {
              // Best-effort cleanup; don't block the response on it.
              rm(workdir, { recursive: true, force: true }).catch(() => undefined);
            }
          }

          if (url.pathname === '/api/mp4/check') {
            const ok = await checkFfmpeg();
            return json(res, 200, { ok, message: ok ? 'ffmpeg ready' : 'ffmpeg not found on PATH' });
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
// ─────────────────────────────────────────────────────────────────────────────

async function renderSegments(
  slides: SlideInput[],
  workdir: string,
  opts: { fps: number; width: number; height: number },
): Promise<string[]> {
  const out: string[] = [];
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const id = String(i + 1).padStart(4, '0');
    const imagePath = path.join(workdir, `frame-${id}.png`);
    await writeFile(imagePath, Buffer.from(s.image, 'base64'));

    const segmentPath = path.join(workdir, `segment-${id}.mp4`);

    if (s.audio) {
      const ext = pickAudioExt(s.audioMime ?? 'audio/mpeg');
      const audioPath = path.join(workdir, `audio-${id}.${ext}`);
      await writeFile(audioPath, Buffer.from(s.audio, 'base64'));
      await runFfmpeg([
        '-y',
        '-loop',
        '1',
        '-i',
        imagePath,
        '-i',
        audioPath,
        '-c:v',
        'libx264',
        '-tune',
        'stillimage',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-pix_fmt',
        'yuv420p',
        '-r',
        String(opts.fps),
        '-vf',
        `scale=${opts.width}:${opts.height}:force_original_aspect_ratio=decrease,pad=${opts.width}:${opts.height}:(ow-iw)/2:(oh-ih)/2:black`,
        '-shortest',
        '-movflags',
        '+faststart',
        segmentPath,
      ]);
    } else {
      const durationSec = Math.max(1, (s.fallbackDurationMs ?? DEFAULT_FALLBACK_MS) / 1000);
      await runFfmpeg([
        '-y',
        '-loop',
        '1',
        '-i',
        imagePath,
        '-f',
        'lavfi',
        '-i',
        'anullsrc=r=44100:cl=stereo',
        '-c:v',
        'libx264',
        '-tune',
        'stillimage',
        '-c:a',
        'aac',
        '-b:a',
        '64k',
        '-pix_fmt',
        'yuv420p',
        '-r',
        String(opts.fps),
        '-vf',
        `scale=${opts.width}:${opts.height}:force_original_aspect_ratio=decrease,pad=${opts.width}:${opts.height}:(ow-iw)/2:(oh-ih)/2:black`,
        '-t',
        durationSec.toFixed(2),
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
  workdir: string,
  outputPath: string,
): Promise<void> {
  const listPath = path.join(workdir, 'list.txt');
  const body = segments.map((p) => `file '${p.replace(/'/g, `'\\''`)}'`).join('\n');
  await writeFile(listPath, body);
  await runFfmpeg([
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    listPath,
    '-c',
    'copy',
    '-movflags',
    '+faststart',
    outputPath,
  ]);
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
