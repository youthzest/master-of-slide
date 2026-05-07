import { getAllAudioForSlide } from '../components/audio-studio-dialog';
import { defaultDesign } from './design';
import { renderPagesToPng } from './export-pptx';
import {
  buildScriptEntries,
  downloadBlob as downloadScriptBlob,
  entriesToPlainText,
  entriesToSrt,
} from './export-script';
import type { SlideModule } from './sdk';

// ─────────────────────────────────────────────────────────────────────────────
// MP4 export — renders slides to PNG, attaches per-slide cached audio, and
// posts everything to /api/mp4/render which spawns ffmpeg server-side.
// ─────────────────────────────────────────────────────────────────────────────

export type Mp4ExportOptions = {
  /** Frames per second (default 30). */
  fps?: number;
  /** Used for slides that have no cached audio. Default 5000ms. */
  fallbackDurationMs?: number;
  /** When true, also download a .srt subtitle file and a .txt script. */
  includeScript?: boolean;
  /**
   * When generating the script, fall back to extracting visible text from
   * each rendered page if the deck has no explicit narration/notes for it.
   * Default true — without it, decks that haven't filled in the Audio
   * Studio produce empty SRT/TXT files.
   */
  autoExtractScript?: boolean;
  onProgress?: (phase: 'rendering' | 'uploading' | 'encoding', percent: number) => void;
};

export async function exportSlideAsMp4(
  slide: SlideModule,
  slideId: string,
  opts: Mp4ExportOptions = {},
): Promise<void> {
  const blob = await createMp4Blob(slide, slideId, opts);
  downloadBlob(blob, `${slideId}.mp4`);

  if (opts.includeScript ?? true) {
    try {
      // autoExtract makes the script useful even when the deck has no
      // narration/notes fields filled in: empty rows fall back to the
      // visible text of the rendered page (h1/h2/p/li), so YouTube and
      // LMS uploads always get a meaningful subtitle/transcript.
      const entries = await buildScriptEntries(slide, slideId, {
        fallbackDurationMs: opts.fallbackDurationMs ?? 5000,
        autoExtract: opts.autoExtractScript ?? true,
      });
      const srt = entriesToSrt(entries);
      const txt = entriesToPlainText(entries, slide.meta?.title ?? slideId);
      downloadScriptBlob(srt, `${slideId}.srt`);
      downloadScriptBlob(txt, `${slideId}.script.txt`);
    } catch (err) {
      // Script generation is best-effort — never block the MP4 download.
      console.warn('[open-slide] script export failed', err);
    }
  }
}

export async function createMp4Blob(
  slide: SlideModule,
  slideId: string,
  opts: Mp4ExportOptions = {},
): Promise<Blob> {
  const pages = slide.default ?? [];
  if (pages.length === 0) throw new Error('MP4 export requires at least one slide page.');

  // Sanity-check the server is configured before doing the heavy render work.
  await ensureFfmpegAvailable();

  const design = slide.design ?? defaultDesign;
  opts.onProgress?.('rendering', 0);
  const dataUrls = await renderPagesToPng(pages, design);
  opts.onProgress?.('rendering', 100);

  const audioCache = getAllAudioForSlide(slideId);
  const slidesPayload = await Promise.all(
    dataUrls.map(async (dataUrl, i) => {
      const image = stripDataUrl(dataUrl);
      const audioEntry = audioCache.get(i);
      if (audioEntry) {
        const audio = await blobToBase64(audioEntry.blob);
        return {
          image,
          audio,
          audioMime: audioEntry.blob.type || 'audio/mpeg',
        };
      }
      return {
        image,
        fallbackDurationMs: opts.fallbackDurationMs ?? 5000,
      };
    }),
  );

  opts.onProgress?.('uploading', 0);
  const res = await fetch('/api/mp4/render', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      slides: slidesPayload,
      fps: opts.fps ?? 30,
      resolution: { width: 1920, height: 1080 },
    }),
  });
  opts.onProgress?.('encoding', 50);

  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.error ?? `MP4 render failed (${res.status}).`);
  }
  const result = await res.blob();
  opts.onProgress?.('encoding', 100);
  return result;
}

async function ensureFfmpegAvailable(): Promise<void> {
  const res = await fetch('/api/mp4/check');
  if (!res.ok) throw new Error('MP4 check endpoint unavailable. Is the dev server running?');
  const data = (await res.json()) as { ok?: boolean; message?: string };
  if (!data.ok) {
    throw new Error(
      data.message ??
        'ffmpeg not found on PATH. Install via `brew install ffmpeg` (macOS) or your distro package.',
    );
  }
}

function stripDataUrl(dataUrl: string): string {
  const comma = dataUrl.indexOf(',');
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(stripDataUrl(result));
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

async function safeJson(res: Response): Promise<{ error?: string } | null> {
  try {
    return (await res.json()) as { error?: string };
  } catch {
    return null;
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5_000);
}
