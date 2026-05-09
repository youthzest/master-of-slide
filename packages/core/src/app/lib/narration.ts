import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { defaultDesign, designToCssVars } from './design';
import { CANVAS_HEIGHT, CANVAS_WIDTH, type SlideModule } from './sdk';

// ─────────────────────────────────────────────────────────────────────────────
// Narration text resolution
//
// Three sources, in order of precedence:
//   1. slide.narration[i] — explicit script
//   2. slide.notes[i]      — speaker notes (presenter view)
//   3. extracted visible text from the rendered React page
// ─────────────────────────────────────────────────────────────────────────────

export type NarrationSource = 'narration' | 'notes' | 'extracted' | 'empty';

export type ResolvedNarration = {
  text: string;
  source: NarrationSource;
};

export function resolveNarration(slide: SlideModule, index: number): ResolvedNarration {
  const explicit = slide.narration?.[index]?.trim();
  if (explicit) return { text: explicit, source: 'narration' };

  const note = slide.notes?.[index]?.trim();
  if (note) return { text: note, source: 'notes' };

  return { text: '', source: 'empty' };
}

// Render a single Page offscreen and pull its visible text. Skips elements
// that are aria-hidden or inside <ImagePlaceholder>. Cheap whitespace
// normalization on top.
export async function extractVisibleText(
  slide: SlideModule,
  index: number,
): Promise<string> {
  const Page = slide.default?.[index];
  if (!Page) return '';

  const design = slide.design ?? defaultDesign;
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    left: '-99999px',
    top: '0',
    width: `${CANVAS_WIDTH}px`,
    height: `${CANVAS_HEIGHT}px`,
    pointerEvents: 'none',
  });
  container.setAttribute('aria-hidden', 'true');
  document.body.appendChild(container);

  const host = document.createElement('div');
  host.style.width = `${CANVAS_WIDTH}px`;
  host.style.height = `${CANVAS_HEIGHT}px`;
  for (const [k, v] of Object.entries(designToCssVars(design))) {
    host.style.setProperty(k, v);
  }
  container.appendChild(host);

  const root = createRoot(host);
  try {
    flushSync(() => {
      root.render(createElement(Page));
    });
    // One animation frame so layout settles. Don't wait for fonts/images —
    // text extraction doesn't need them.
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    return cleanText(host.innerText);
  } finally {
    root.unmount();
    container.remove();
  }
}

// Resolve narration with the auto-extract fallback already applied. Used by
// batch synthesis when the user opts into "auto-fill empty slides".
export async function resolveNarrationWithExtraction(
  slide: SlideModule,
  index: number,
): Promise<ResolvedNarration> {
  const direct = resolveNarration(slide, index);
  if (direct.source !== 'empty') return direct;

  const extracted = await extractVisibleText(slide, index);
  if (extracted) return { text: extracted, source: 'extracted' };
  return { text: '', source: 'empty' };
}

function cleanText(raw: string): string {
  return raw
    .replace(/\s+/g, ' ')
    .replace(/​|‌|‍|﻿/g, '')
    .trim();
}
