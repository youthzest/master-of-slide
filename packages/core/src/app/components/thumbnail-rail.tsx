import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { DesignSystem } from '../lib/design';
import type { Page } from '../lib/sdk';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../lib/sdk';
import { SlideCanvas } from './slide-canvas';

type Orientation = 'vertical' | 'horizontal';

type Props = {
  pages: Page[];
  design?: DesignSystem;
  current: number;
  onSelect: (index: number) => void;
  orientation?: Orientation;
};

const VERTICAL_THUMB_WIDTH = 184;
const HORIZONTAL_THUMB_HEIGHT = 64;

export function ThumbnailRail({
  pages,
  design,
  current,
  onSelect,
  orientation = 'vertical',
}: Props) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `current` triggers re-scroll on selection change
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    activeRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [current]);

  if (orientation === 'horizontal') {
    const scale = HORIZONTAL_THUMB_HEIGHT / CANVAS_HEIGHT;
    const width = CANVAS_WIDTH * scale;
    return (
      <div className="border-t-2 border-foreground bg-sidebar">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5">
            {pages.map((PageComp, i) => {
              const active = i === current;
              return (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: pages list is render-stable
                  key={i}
                  type="button"
                  ref={active ? activeRef : undefined}
                  onClick={() => onSelect(i)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={active ? 'true' : undefined}
                  className={cn('group/thumb relative flex shrink-0 flex-col items-center gap-1.5')}
                >
                  <span
                    className={cn(
                      'font-mono text-[9.5px] font-medium tracking-[0.06em] tabular-nums uppercase',
                      active ? 'text-brand' : 'text-muted-foreground/70',
                    )}
                  >
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <div
                    className={cn(
                      'relative shrink-0 overflow-hidden rounded-[2px] border-2 bg-card motion-safe:transition-all',
                      active
                        ? 'border-foreground shadow-[4px_4px_0_var(--brand)]'
                        : 'border-foreground group-hover/thumb:shadow-[3px_3px_0_var(--foreground)]',
                    )}
                    style={{ width, height: HORIZONTAL_THUMB_HEIGHT }}
                  >
                    <SlideCanvas scale={scale} center={false} flat freezeMotion design={design}>
                      <PageComp />
                    </SlideCanvas>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const scale = VERTICAL_THUMB_WIDTH / CANVAS_WIDTH;
  const height = CANVAS_HEIGHT * scale;
  return (
    <ScrollArea className="h-full border-r-2 border-foreground bg-sidebar">
      <aside className="flex flex-col gap-2 px-3 py-3">
        <div className="flex items-baseline justify-between px-1 pb-1">
          <span className="eyebrow">Pages</span>
          <span className="folio">{pages.length.toString().padStart(2, '0')}</span>
        </div>
        {pages.map((PageComp, i) => {
          const active = i === current;
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: pages list is render-stable
              key={i}
              type="button"
              ref={active ? activeRef : undefined}
              onClick={() => onSelect(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'group/thumb flex items-start gap-2.5 rounded-[2px] border-2 border-transparent p-1.5 text-left motion-safe:transition-colors',
                'hover:border-foreground hover:bg-accent',
                active && 'border-foreground bg-secondary',
              )}
            >
              <span
                className={cn(
                  'mt-1.5 w-7 shrink-0 text-right font-mono text-[10px] font-medium tracking-[0.06em] tabular-nums uppercase',
                  active ? 'text-brand' : 'text-muted-foreground/70',
                )}
              >
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <div
                className={cn(
                  'relative shrink-0 overflow-hidden rounded-[2px] border-2 bg-card motion-safe:transition-all',
                  active
                    ? 'border-foreground shadow-[4px_4px_0_var(--brand)]'
                    : 'border-foreground group-hover/thumb:shadow-[3px_3px_0_var(--foreground)]',
                )}
                style={{ width: VERTICAL_THUMB_WIDTH, height }}
              >
                <SlideCanvas scale={scale} center={false} flat freezeMotion design={design}>
                  <PageComp />
                </SlideCanvas>
                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-brand"
                  />
                )}
              </div>
            </button>
          );
        })}
      </aside>
    </ScrollArea>
  );
}
