import { toPng } from 'html-to-image';
import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { type DesignSystem, defaultDesign, designToCssVars } from './design';
import { CANVAS_HEIGHT, CANVAS_WIDTH, type SlideModule } from './sdk';

type PptxExportOptions = { lang?: string };

const SLIDE_W = 13.333333; // inches
const SLIDE_H = 7.5;
const PPTX_MIME = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Public API — backward compatible
// ─────────────────────────────────────────────────────────────────────────────

export async function exportSlideAsPptx(
  slide: SlideModule,
  slideId: string,
  opts: PptxExportOptions = {},
): Promise<void> {
  const content = await createPptxBlob(slide, slideId, opts);
  downloadBlob(content, pptxFilename(slideId), PPTX_MIME);
}

export async function createPptxBlob(
  slide: SlideModule,
  slideId: string,
  _opts: PptxExportOptions = {},
): Promise<Blob> {
  const pages = slide.default ?? [];
  if (pages.length === 0) throw new Error('PPTX export requires at least one slide page.');

  const design = slide.design ?? defaultDesign;
  const [{ default: PptxGenJS }, pageDataList] = await Promise.all([
    import('pptxgenjs'),
    renderPagesToPptxData(pages, design),
  ]);

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Master Of Slide';
  pptx.subject = slide.meta?.title ?? slideId;
  pptx.title = slide.meta?.title ?? slideId;
  pptx.company = 'Master Of Slide, based on open-slide source';
  pptx.theme = {
    headFontFace: primaryFontFace(design.fonts.display),
    bodyFontFace: primaryFontFace(design.fonts.body),
  };

  pageDataList.forEach((data, i) => {
    const page = pptx.addSlide();
    page.background = { color: hexColor(design.palette.bg, 'FFFFFF') };
    // Layer 1 — background PNG with text rendered transparent so the visual
    // (gradients, shapes, hairlines, photos, mermaid-like vector blocks)
    // matches the on-screen design exactly.
    page.addImage({ data: data.png, x: 0, y: 0, w: SLIDE_W, h: SLIDE_H });

    // Layer 2 — native text overlays so PowerPoint, Keynote, and Canva can
    // edit, search, translate, and reflow every word. Without this every
    // slide is a single rasterized bitmap and every external editor "breaks"
    // the design.
    for (const t of data.texts) {
      try {
        page.addText(t.text, {
          x: t.x,
          y: t.y,
          w: t.w,
          h: t.h,
          fontFace: t.fontFace,
          fontSize: t.fontSize,
          color: t.color,
          bold: t.bold,
          italic: t.italic,
          align: t.align,
          valign: t.valign,
          margin: 0,
          isTextBox: true,
          autoFit: false,
        });
      } catch {
        // pptxgenjs occasionally rejects edge-case font/colors. Skipping a
        // single overlay still keeps the slide visually correct via Layer 1.
      }
    }

    const note = slide.notes?.[i];
    const narration = slide.narration?.[i];
    const speakerNote = narration ?? note;
    if (speakerNote) {
      const withNotes = page as unknown as { addNotes?: (notes: string) => void };
      withNotes.addNotes?.(speakerNote);
    }
  });

  const content = await pptx.write({ outputType: 'arraybuffer' });
  if (!(content instanceof ArrayBuffer)) {
    throw new Error('PPTX export did not produce an ArrayBuffer.');
  }
  return new Blob([content], { type: PPTX_MIME });
}

/**
 * Backward-compatible PNG-only renderer. Used by export-mp4.ts where MP4 is
 * inherently raster and we only need the bitmap stream. For PPTX use
 * `renderPagesToPptxData` instead so the file ships native text overlays.
 */
export async function renderPagesToPng(
  pages: NonNullable<SlideModule['default']>,
  design: DesignSystem,
  opts: { pixelRatio?: number } = {},
): Promise<string[]> {
  const data = await renderPagesToPptxData(pages, design, {
    pixelRatio: opts.pixelRatio ?? 2,
    extractText: false,
  });
  return data.map((d) => d.png);
}

// ─────────────────────────────────────────────────────────────────────────────
// Hybrid renderer — captures background PNG + native text entries.
// ─────────────────────────────────────────────────────────────────────────────

export type PptxTextEntry = {
  text: string;
  /** Inches from slide left. */
  x: number;
  /** Inches from slide top. */
  y: number;
  /** Inches. */
  w: number;
  /** Inches. */
  h: number;
  /** Points. */
  fontSize: number;
  fontFace: string;
  /** Hex without leading '#'. */
  color: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
};

export type PptxPageData = {
  /** Data URL (image/png). Background layer with text rendered transparent. */
  png: string;
  /** Native text overlays in PPTX inch coordinates. */
  texts: PptxTextEntry[];
};

export async function renderPagesToPptxData(
  pages: NonNullable<SlideModule['default']>,
  design: DesignSystem,
  opts: { pixelRatio?: number; extractText?: boolean } = {},
): Promise<PptxPageData[]> {
  const pixelRatio = opts.pixelRatio ?? 2;
  const extractText = opts.extractText ?? true;

  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  Object.assign(container.style, {
    position: 'fixed',
    left: '-99999px',
    top: '0',
    width: `${CANVAS_WIDTH}px`,
    height: `${CANVAS_HEIGHT}px`,
    pointerEvents: 'none',
  });
  document.body.appendChild(container);

  const result: PptxPageData[] = [];
  try {
    for (const Page of pages) {
      const host = document.createElement('div');
      host.setAttribute('data-osd-canvas', '');
      host.style.width = `${CANVAS_WIDTH}px`;
      host.style.height = `${CANVAS_HEIGHT}px`;
      host.style.background = design.palette.bg;
      // CSS custom properties must be set via setProperty(); bracket-style
      // assignment through Object.assign silently fails in some engines and
      // leaves var(--osd-*) references unresolved during PNG capture, which
      // produced the "black text on dark bg" bug in PPTX/Canva export.
      for (const [key, value] of Object.entries(designToCssVars(design))) {
        host.style.setProperty(key, value);
      }
      container.appendChild(host);

      const root = createRoot(host);
      flushSync(() => {
        root.render(createElement(Page));
      });
      await nextPaint(2);
      await waitForImages(host);
      await waitForFonts();
      await waitForAnimations(host);
      await nextPaint();
      materializeComputedStyles(host);

      // 1. Extract text entries while the page is still fully visible.
      const texts = extractText ? extractTextEntries(host) : [];

      // 2. Hide text in the DOM so the captured PNG holds only the visual
      //    backdrop. Without this we'd paint every word twice (raster +
      //    native), and edits to the native overlay would silently disagree
      //    with the bitmap underneath.
      const restoreTextColors = extractText ? hideAllTextColors(host) : () => {};
      await nextPaint();
      const png = await toPng(host, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        pixelRatio,
        backgroundColor: design.palette.bg,
        cacheBust: true,
      });
      restoreTextColors();

      result.push({ png, texts });
      root.unmount();
      container.removeChild(host);
    }
  } finally {
    container.remove();
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Text extraction — DOM walker that finds every visible text node, computes
// its on-canvas rectangle, and projects it into PPTX inch coordinates.
// ─────────────────────────────────────────────────────────────────────────────

function extractTextEntries(host: HTMLElement): PptxTextEntry[] {
  const entries: PptxTextEntry[] = [];
  const hostRect = host.getBoundingClientRect();
  if (hostRect.width === 0 || hostRect.height === 0) return entries;
  const sx = SLIDE_W / hostRect.width;
  const sy = SLIDE_H / hostRect.height;

  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent;
      if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (!isVisibleForExport(parent, host)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    const text = textNode.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    if (!text) continue;
    const parent = textNode.parentElement;
    if (!parent) continue;
    const computed = getComputedStyle(parent);

    // The bounding rect of the parent block is more stable than the range
    // rect for justified / wrapped paragraphs and matches PowerPoint's
    // text-frame model (text fills its container box).
    const rect = parent.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;

    const fontSizePx = parseFloatOr(computed.fontSize, 16);
    const fontWeightNum = parseFloatOr(computed.fontWeight, 400);

    const align: PptxTextEntry['align'] =
      computed.textAlign === 'center'
        ? 'center'
        : computed.textAlign === 'right'
          ? 'right'
          : 'left';

    // Block-level text containers report their full height; align vertically
    // so single-line headings sit centered inside the box.
    const valign: PptxTextEntry['valign'] = inferVerticalAlign(parent, computed);

    entries.push({
      text,
      x: clamp((rect.left - hostRect.left) * sx, 0, SLIDE_W),
      y: clamp((rect.top - hostRect.top) * sy, 0, SLIDE_H),
      w: clamp(rect.width * sx, 0.05, SLIDE_W),
      h: clamp(rect.height * sy, 0.05, SLIDE_H),
      // px → pt (96dpi → 72pt/in)
      fontSize: Math.max(6, +(fontSizePx * 0.75).toFixed(1)),
      fontFace: primaryFontFace(computed.fontFamily),
      color: rgbToHex(computed.color, '111111'),
      bold: fontWeightNum >= 600 || computed.fontWeight === 'bold',
      italic: computed.fontStyle === 'italic',
      align,
      valign,
    });
  }

  // Stable sort by reading order so PowerPoint's tab-cycle through shapes
  // matches the visual top-to-bottom flow.
  entries.sort((a, b) => a.y - b.y || a.x - b.x);
  return entries;
}

function isVisibleForExport(start: Element, host: HTMLElement): boolean {
  let cur: Element | null = start;
  while (cur && cur !== host) {
    if (cur.getAttribute('aria-hidden') === 'true') return false;
    if (cur instanceof HTMLImageElement) return false;
    const cs = getComputedStyle(cur);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (parseFloat(cs.opacity || '1') < 0.05) return false;
    cur = cur.parentElement;
  }
  return true;
}

function inferVerticalAlign(el: HTMLElement, cs: CSSStyleDeclaration): PptxTextEntry['valign'] {
  // Honor inline alignment hints; default to top so multiline copy reads from
  // the box origin (matches HTML behavior).
  if (cs.alignItems === 'center' || cs.justifyContent === 'center') return 'middle';
  if (cs.alignItems === 'flex-end' || cs.justifyContent === 'flex-end') return 'bottom';
  void el;
  return 'top';
}

function hideAllTextColors(host: HTMLElement): () => void {
  const restorations: Array<() => void> = [];
  // Hide text by zeroing the rendered glyph color but keep the box layout
  // intact. We use color: transparent rather than visibility:hidden so spans
  // inside flex/grid containers keep their position.
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_ELEMENT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const el = node as HTMLElement;
    if (!hasDirectTextChild(el)) continue;
    const orig = el.style.color;
    el.style.color = 'transparent';
    restorations.push(() => {
      el.style.color = orig;
    });
  }
  return () => {
    for (const r of restorations) r();
  };
}

function hasDirectTextChild(el: HTMLElement): boolean {
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE && (child.textContent?.trim().length ?? 0) > 0) {
      return true;
    }
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Style materialization — runs after React mounts so `var(--osd-*)` and
// `currentColor` get resolved before html-to-image clones the tree.
// ─────────────────────────────────────────────────────────────────────────────

function materializeComputedStyles(root: HTMLElement): void {
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
  for (const el of elements) {
    const computed = getComputedStyle(el);
    // Typography
    el.style.fontFamily = computed.fontFamily;
    el.style.fontSize = computed.fontSize;
    el.style.fontWeight = computed.fontWeight;
    el.style.fontStyle = computed.fontStyle;
    el.style.lineHeight = computed.lineHeight;
    el.style.letterSpacing = computed.letterSpacing;
    el.style.textAlign = computed.textAlign;
    el.style.textDecoration = computed.textDecoration;
    // Color
    el.style.color = computed.color;
    el.style.backgroundColor = computed.backgroundColor;
    if (computed.backgroundImage && computed.backgroundImage !== 'none') {
      el.style.backgroundImage = computed.backgroundImage;
    }
    // Borders
    el.style.borderTopColor = computed.borderTopColor;
    el.style.borderRightColor = computed.borderRightColor;
    el.style.borderBottomColor = computed.borderBottomColor;
    el.style.borderLeftColor = computed.borderLeftColor;
    el.style.borderTopWidth = computed.borderTopWidth;
    el.style.borderRightWidth = computed.borderRightWidth;
    el.style.borderBottomWidth = computed.borderBottomWidth;
    el.style.borderLeftWidth = computed.borderLeftWidth;
    el.style.borderTopStyle = computed.borderTopStyle;
    el.style.borderRightStyle = computed.borderRightStyle;
    el.style.borderBottomStyle = computed.borderBottomStyle;
    el.style.borderLeftStyle = computed.borderLeftStyle;
    el.style.borderRadius = computed.borderRadius;
    // Effects
    el.style.boxShadow = computed.boxShadow;
    el.style.opacity = computed.opacity;
    el.style.filter = computed.filter;
    el.style.transform = computed.transform;
    el.style.transformOrigin = computed.transformOrigin;
  }
}

function nextPaint(frames = 1): Promise<void> {
  return new Promise((resolve) => {
    const step = (remaining: number) => {
      requestAnimationFrame(() => {
        if (remaining <= 1) resolve();
        else step(remaining - 1);
      });
    };
    step(frames);
  });
}

async function waitForFonts(): Promise<void> {
  if ('fonts' in document) await document.fonts.ready;
}

const ANIMATION_WAIT_TIMEOUT_MS = 1500;

async function waitForAnimations(
  root: HTMLElement,
  timeoutMs = ANIMATION_WAIT_TIMEOUT_MS,
): Promise<void> {
  const animations = root.getAnimations?.({ subtree: true }) ?? [];
  if (animations.length === 0) return;

  for (const animation of animations) {
    if (isLoopingAnimation(animation)) {
      try {
        animation.finish();
      } catch {
        try {
          animation.cancel();
        } catch {
          // Ignore — the current rendered frame is still safe to capture.
        }
      }
    }
  }

  const remaining = root.getAnimations?.({ subtree: true }) ?? [];
  if (remaining.length === 0) return;

  await Promise.race([
    Promise.all(
      remaining.map((animation) =>
        animation.finished.then(
          () => undefined,
          () => undefined,
        ),
      ),
    ),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

function isLoopingAnimation(animation: Animation): boolean {
  const effect = animation.effect;
  if (!effect) return false;
  try {
    const timing = effect.getComputedTiming();
    if (timing.iterations === Infinity) return true;
    if (timing.endTime === Infinity) return true;
  } catch {
    // Some browsers throw on getComputedTiming for cancelled effects.
  }
  return false;
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'));
  const imgWaits = imgs.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.addEventListener('load', () => resolve(), { once: true });
      img.addEventListener('error', () => resolve(), { once: true });
    });
  });

  const bgUrls = new Set<string>();
  for (const el of [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]) {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === 'none') continue;
    for (const m of bg.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
      bgUrls.add(m[2]);
    }
  }
  const bgWaits = Array.from(bgUrls).map(
    (src) =>
      new Promise<void>((resolve) => {
        const probe = new Image();
        probe.onload = () => resolve();
        probe.onerror = () => resolve();
        probe.src = src;
      }),
  );

  await Promise.all([...imgWaits, ...bgWaits]);
}

function downloadBlob(blob: Blob, filename: string, type: string): void {
  const file =
    typeof File === 'function' ? new File([blob], filename, { type }) : new Blob([blob], { type });
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.type = type;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function pptxFilename(slideId: string): string {
  const base = slideId.trim() || 'master-of-slide';
  return base.toLowerCase().endsWith('.pptx') ? base : `${base}.pptx`;
}

function primaryFontFace(stack: string): string {
  const [first] = stack.split(',');
  return first?.trim().replace(/^["']|["']$/g, '') || 'Aptos';
}

function hexColor(value: string, fallback: string): string {
  const trimmed = value.trim();
  const match = /^#?([0-9a-f]{6})$/i.exec(trimmed);
  return match?.[1]?.toUpperCase() ?? fallback;
}

function rgbToHex(color: string, fallback: string): string {
  const trimmed = color.trim();
  const hexMatch = /^#?([0-9a-f]{6})$/i.exec(trimmed);
  if (hexMatch) return hexMatch[1].toUpperCase();
  const rgb = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(trimmed);
  if (!rgb) return fallback.toUpperCase();
  const [, r, g, b] = rgb;
  return [r, g, b]
    .map((v) => Math.max(0, Math.min(255, parseInt(v, 10))).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function parseFloatOr(value: string, fallback: number): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}
