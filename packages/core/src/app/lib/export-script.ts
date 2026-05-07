// Client-side script + subtitle generation that pairs with export-mp4.ts.
// Walks the AudioStudio cache + narration rows, measures audio durations,
// and produces SRT (subtitle) + TXT (plain script) blobs you can drop into
// any LMS, video editor, or YouTube subtitle field.

import { getAllAudioForSlide } from '../components/audio-studio-dialog';
import { resolveNarration, resolveNarrationWithExtraction } from './narration';
import type { SlideModule } from './sdk';

export type ScriptOptions = {
  /** Used when a slide has no cached audio. Default 5000ms. */
  fallbackDurationMs?: number;
  /** When true, run extraction fallback for any slide whose narration is empty. */
  autoExtract?: boolean;
};

export type ScriptEntry = {
  index: number;
  text: string;
  source: 'narration' | 'notes' | 'extracted' | 'empty';
  startMs: number;
  endMs: number;
  hasAudio: boolean;
};

export async function buildScriptEntries(
  slide: SlideModule,
  slideId: string,
  opts: ScriptOptions = {},
): Promise<ScriptEntry[]> {
  const total = slide.default?.length ?? 0;
  const fallbackMs = opts.fallbackDurationMs ?? 5000;
  const audioCache = getAllAudioForSlide(slideId);

  const entries: ScriptEntry[] = [];
  let cursorMs = 0;
  for (let i = 0; i < total; i++) {
    const resolved = opts.autoExtract
      ? await resolveNarrationWithExtraction(slide, i)
      : resolveNarration(slide, i);
    const cached = audioCache.get(i);

    let durationMs: number;
    if (cached) {
      try {
        const seconds = await readAudioDurationSeconds(cached.blob);
        durationMs = Math.max(500, Math.round(seconds * 1000));
      } catch {
        durationMs = fallbackMs;
      }
    } else {
      durationMs = fallbackMs;
    }

    const startMs = cursorMs;
    const endMs = startMs + durationMs;
    cursorMs = endMs;
    entries.push({
      index: i,
      text: resolved.text,
      source: resolved.source,
      startMs,
      endMs,
      hasAudio: Boolean(cached),
    });
  }
  return entries;
}

export function entriesToSrt(entries: ScriptEntry[]): Blob {
  const parts: string[] = [];
  let cueIndex = 1;
  for (const entry of entries) {
    if (!entry.text.trim()) continue;
    parts.push(`${cueIndex}`);
    parts.push(`${formatSrtTime(entry.startMs)} --> ${formatSrtTime(entry.endMs)}`);
    parts.push(entry.text.trim());
    parts.push('');
    cueIndex += 1;
  }
  return new Blob([parts.join('\n')], { type: 'application/x-subrip;charset=utf-8' });
}

export function entriesToPlainText(entries: ScriptEntry[], title?: string): Blob {
  const lines: string[] = [];
  if (title) {
    lines.push(`# ${title}`);
    lines.push('');
  }
  lines.push(`Total slides: ${entries.length}`);
  lines.push(
    `Total duration: ${formatPlainDuration(entries[entries.length - 1]?.endMs ?? 0)}`,
  );
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const entry of entries) {
    const header = `Slide ${String(entry.index + 1).padStart(2, '0')}` +
      ` · ${formatPlainTime(entry.startMs)} – ${formatPlainTime(entry.endMs)}` +
      ` · ${entry.hasAudio ? 'audio' : 'silent'} · ${entry.source}`;
    lines.push(header);
    if (entry.text.trim()) {
      lines.push(entry.text.trim());
    } else {
      lines.push('[no narration]');
    }
    lines.push('');
  }

  return new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
}

export function downloadBlob(blob: Blob, filename: string): void {
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

function readAudioDurationSeconds(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    const cleanup = () => {
      URL.revokeObjectURL(url);
      audio.src = '';
    };
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      const dur = audio.duration;
      cleanup();
      if (Number.isFinite(dur) && dur > 0) resolve(dur);
      else reject(new Error('Audio reported zero duration'));
    };
    audio.onerror = () => {
      cleanup();
      reject(new Error('Audio metadata failed to load'));
    };
    audio.src = url;
  });
}

function formatSrtTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const millis = Math.floor(ms % 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)},${pad3(millis)}`;
}

function formatPlainTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${pad2(minutes)}:${pad2(seconds)}`;
}

function formatPlainDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}
