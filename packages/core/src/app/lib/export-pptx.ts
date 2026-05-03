import { toPng } from 'html-to-image';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { CANVAS_HEIGHT, CANVAS_WIDTH, type SlideModule } from './sdk';

type PptxExportOptions = { lang?: string };

const SLIDE_W = 13.333333;
const SLIDE_H = 7.5;
const PPTX_MIME = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

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

  const [{ default: PptxGenJS }, pageImages] = await Promise.all([
    import('pptxgenjs'),
    renderPagesToPng(pages),
  ]);

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Master Of Slide';
  pptx.subject = slide.meta?.title ?? slideId;
  pptx.title = slide.meta?.title ?? slideId;
  pptx.company = 'Master Of Slide, based on open-slide source';
  pptx.theme = {
    headFontFace: 'Aptos Display',
    bodyFontFace: 'Aptos',
  };

  pageImages.forEach((data, i) => {
    const page = pptx.addSlide();
    page.background = { color: 'FFFFFF' };
    page.addImage({ data, x: 0, y: 0, w: SLIDE_W, h: SLIDE_H });
    const note = slide.notes?.[i];
    if (note) {
      const withNotes = page as unknown as { addNotes?: (notes: string) => void };
      withNotes.addNotes?.(note);
    }
  });

  const content = await pptx.write({ outputType: 'arraybuffer' });
  if (!(content instanceof ArrayBuffer)) {
    throw new Error('PPTX export did not produce an ArrayBuffer.');
  }
  return new Blob([content], { type: PPTX_MIME });
}

async function renderPagesToPng(pages: NonNullable<SlideModule['default']>): Promise<string[]> {
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

  const result: string[] = [];
  try {
    for (const Page of pages) {
      const host = document.createElement('div');
      host.style.width = `${CANVAS_WIDTH}px`;
      host.style.height = `${CANVAS_HEIGHT}px`;
      host.style.background = '#fff';
      container.appendChild(host);

      const root = createRoot(host);
      root.render(createElement(Page));
      await nextPaint();
      await waitForImages(host);
      await waitForFonts();

      result.push(
        await toPng(host, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          pixelRatio: 1,
          backgroundColor: '#ffffff',
          cacheBust: true,
        }),
      );
      root.unmount();
      container.removeChild(host);
    }
  } finally {
    container.remove();
  }
  return result;
}

function nextPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function waitForFonts(): Promise<void> {
  if ('fonts' in document) await document.fonts.ready;
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    }),
  );
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
