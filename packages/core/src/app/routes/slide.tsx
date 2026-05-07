import config from 'virtual:open-slide/config';
import {
  ChevronLeft,
  Download,
  ExternalLink,
  FileCode2,
  FileText,
  Film,
  ImagePlus,
  Loader2,
  LogIn,
  Pencil,
  Play,
  Mic2,
  Presentation,
  Settings,
  Volume2,
} from 'lucide-react';
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AssetView } from '@/components/asset-view';
import { HistoryProvider } from '@/components/history-provider';
import { CommentWidget } from '@/components/inspector/comment-widget';
import { InspectOverlay } from '@/components/inspector/inspect-overlay';
import { InspectorPanel } from '@/components/inspector/inspector-panel';
import {
  InspectorProvider,
  InspectToggleButton,
  useInspector,
} from '@/components/inspector/inspector-provider';
import { SaveBar } from '@/components/inspector/save-bar';
import { DesignProvider } from '@/components/style-panel/design-provider';
import { DesignPanel, DesignToggleButton } from '@/components/style-panel/style-panel';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type AssetEntry, useAssets } from '@/lib/assets';
import { useFolders } from '@/lib/folders';
import { useWheelPageNavigation } from '@/lib/use-wheel-page-navigation';
import { cn } from '@/lib/utils';
import { ClickNavZones } from '../components/click-nav-zones';
import { AudioStudioDialog } from '../components/audio-studio-dialog';
import { PdfProgressToast } from '../components/pdf-progress-toast';
import { VoiceSettingsDialog } from '../components/voice-settings-dialog';
import { Player } from '../components/player';
import { SlideCanvas } from '../components/slide-canvas';
import { ThumbnailRail } from '../components/thumbnail-rail';
import {
  type CanvaStatus,
  getCanvaStatus,
  importSlideToCanva,
  openCanvaLogin,
  saveCanvaConfig,
} from '../lib/canva';
import { exportSlideAsHtml } from '../lib/export-html';
import { exportSlideAsPdf } from '../lib/export-pdf';
import { exportSlideAsMp4 } from '../lib/export-mp4';
import { exportSlideAsPptx } from '../lib/export-pptx';
import {
  buildScriptEntries,
  downloadBlob as downloadScriptBlob,
  entriesToPlainText,
  entriesToSrt,
} from '../lib/export-script';
import type { SlideModule } from '../lib/sdk';
import { loadSlide } from '../lib/slides';

const { showSlideUi, showSlideBrowser, allowHtmlDownload } = config.build;
type LogoTarget = number | 'all';

export function Slide() {
  const { slideId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [slide, setSlide] = useState<SlideModule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [logoInserting, setLogoInserting] = useState(false);
  const [logoAssetOpen, setLogoAssetOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [canvaConfigOpen, setCanvaConfigOpen] = useState(false);
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);
  const [audioStudioOpen, setAudioStudioOpen] = useState(false);
  const { renameSlide } = useFolders();
  const {
    upload: uploadAsset,
    assets,
    loading: assetsLoading,
    available: assetsAvailable,
  } = useAssets(slideId);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoTargetRef = useRef<LogoTarget>(0);
  const slideViewportRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    setSlide(null);
    setError(null);
    loadSlide(slideId)
      .then((mod) => {
        if (!cancelled) setSlide(mod);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message ?? e));
      });
    return () => {
      cancelled = true;
    };
  }, [slideId]);

  const pages = useMemo(() => slide?.default ?? [], [slide]);
  const pageCount = pages.length;
  const rawIndex = Number(searchParams.get('p') ?? '1') - 1;
  const index = Number.isFinite(rawIndex) ? Math.max(0, Math.min(pageCount - 1, rawIndex)) : 0;
  const view = searchParams.get('view') === 'assets' ? 'assets' : 'slides';

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(pageCount - 1, i));
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('p', String(clamped + 1));
          return next;
        },
        { replace: true },
      );
    },
    [pageCount, setSearchParams],
  );

  useEffect(() => {
    if (playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        setPlaying(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, goTo, playing]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-16 text-muted-foreground">
        {showSlideBrowser && (
          <Link to="/" className="text-[12px] font-medium text-foreground/70 hover:text-foreground">
            ← Home
          </Link>
        )}
        <span className="mt-6 block eyebrow text-destructive/80">Load failed</span>
        <h2 className="mt-2 font-heading text-xl font-semibold tracking-tight text-foreground">
          Failed to load slide
        </h2>
        <pre className="mt-4 overflow-auto rounded-[6px] border border-border bg-card p-4 text-[11.5px] leading-relaxed whitespace-pre-wrap shadow-edge">
          {error}
        </pre>
      </div>
    );
  }

  if (!slide) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-16 text-[12.5px] text-muted-foreground">
        <span className="eyebrow">Loading</span>
        <p className="mt-2 font-mono">{slideId}</p>
      </div>
    );
  }

  if (pageCount === 0) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-16 text-muted-foreground">
        {showSlideBrowser && (
          <Link to="/" className="text-[12px] font-medium text-foreground/70 hover:text-foreground">
            ← Home
          </Link>
        )}
        <span className="mt-6 block eyebrow">Empty</span>
        <h2 className="mt-2 font-heading text-xl font-semibold tracking-tight text-foreground">
          Nothing to show.
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed">
          <code className="rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[11.5px]">
            slides/{slideId}/index.tsx
          </code>{' '}
          must{' '}
          <code className="rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[11.5px]">
            export default
          </code>{' '}
          a non-empty array of components.
        </p>
      </div>
    );
  }

  if (!showSlideUi) {
    return (
      <Player
        pages={pages}
        design={slide.design}
        index={index}
        onIndexChange={goTo}
        onExit={() => {}}
        allowExit={false}
      />
    );
  }

  if (playing) {
    return (
      <Player
        pages={pages}
        design={slide.design}
        index={index}
        onIndexChange={goTo}
        onExit={() => setPlaying(false)}
        controls
        slideId={slideId}
      />
    );
  }

  const CurrentPage = pages[index];
  const title = slide.meta?.title ?? slideId;
  const pickLogo = (target: LogoTarget) => {
    logoTargetRef.current = target;
    logoInputRef.current?.click();
  };
  const pickAssetLogo = (target: LogoTarget) => {
    logoTargetRef.current = target;
    setLogoAssetOpen(true);
  };
  const insertLogoAsset = async (asset: AssetEntry, target: LogoTarget) => {
    setLogoInserting(true);
    try {
      const res = await fetch(`/__slides/${slideId}/logo`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          assetPath: `./assets/${asset.name}`,
          page: target,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? `Logo insert failed (${res.status}).`);
      setLogoAssetOpen(false);
      toast.success(
        target === 'all' ? 'Logo inserted on all pages.' : `Logo inserted on slide ${index + 1}.`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Logo insert failed');
    } finally {
      setLogoInserting(false);
    }
  };
  const insertLogo = async (file: File, target: LogoTarget) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Choose an image file for the logo.');
      return;
    }
    setLogoInserting(true);
    try {
      const uploaded = await uploadAsset(file, { overwrite: true });
      if (!uploaded.ok) throw new Error(`Logo upload failed (${uploaded.status}).`);

      const res = await fetch(`/__slides/${slideId}/logo`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          assetPath: `./assets/${file.name}`,
          page: target,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? `Logo insert failed (${res.status}).`);
      toast.success(
        target === 'all' ? 'Logo inserted on all pages.' : `Logo inserted on slide ${index + 1}.`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Logo insert failed');
    } finally {
      setLogoInserting(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  return (
    <HistoryProvider>
      <InspectorProvider slideId={slideId}>
        <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
          {/* Editorial toolbar — three zones, hairline separators, mono-folio center */}
          <header className="relative flex h-12 shrink-0 items-center justify-between border-b-4 border-foreground bg-sidebar px-2 md:px-3">
            <div className="flex items-center gap-1.5 md:gap-2">
              {showSlideBrowser && (
                <Button asChild variant="ghost" size="icon-sm" title="Home">
                  <Link to="/" aria-label="Back to home">
                    <ChevronLeft className="size-4" />
                  </Link>
                </Button>
              )}
              <span aria-hidden className="mx-0.5 hidden h-5 w-0.5 bg-foreground md:block" />
              {import.meta.env.DEV && (
                <Tabs
                  value={view}
                  onValueChange={(next) => {
                    setSearchParams(
                      (prev) => {
                        const params = new URLSearchParams(prev);
                        if (next === 'assets') params.set('view', 'assets');
                        else params.delete('view');
                        return params;
                      },
                      { replace: true },
                    );
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="slides">Slides</TabsTrigger>
                    <TabsTrigger value="assets">Assets</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>

            {/* Centered title — the rail and mobile pill carry the page count. */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center px-2">
              <div className="pointer-events-auto min-w-0 max-w-[min(34rem,calc(100vw-22rem))]">
                <InlineTitleEditor title={title} onSubmit={(next) => renameSlide(slideId, next)} />
              </div>
            </div>

            <div className="flex items-center gap-1">
              {view === 'slides' && import.meta.env.DEV && (
                <>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) void insertLogo(file, logoTargetRef.current);
                    }}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      type="button"
                      disabled={!assetsAvailable || logoInserting}
                      aria-label="Insert logo"
                      title="Insert logo"
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'sm' }),
                        'px-2.5 md:px-3',
                      )}
                    >
                      {logoInserting ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="size-3.5" />
                      )}
                      <span className="hidden md:inline">Logo</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[180px]">
                      <DropdownMenuItem disabled={logoInserting} onSelect={() => pickLogo(index)}>
                        <ImagePlus />
                        Upload to current page
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={logoInserting} onSelect={() => pickLogo('all')}>
                        <ImagePlus />
                        Upload to all pages
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={logoInserting}
                        onSelect={() => pickAssetLogo(index)}
                      >
                        <ImagePlus />
                        Asset to current page
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={logoInserting}
                        onSelect={() => pickAssetLogo('all')}
                      >
                        <ImagePlus />
                        Asset to all pages
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              {view === 'slides' && allowHtmlDownload && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    type="button"
                    disabled={exporting}
                    aria-label="Download"
                    title="Download"
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
                  >
                    {exporting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    <DropdownMenuItem
                      disabled={exporting}
                      onSelect={async () => {
                        if (!slide || exporting) return;
                        setExporting(true);
                        try {
                          await exportSlideAsHtml(slide, slideId, { lang: config.lang });
                        } catch (err) {
                          console.error('[open-slide] export failed', err);
                        } finally {
                          setExporting(false);
                        }
                      }}
                    >
                      <FileCode2 />
                      Export as HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={exporting}
                      onSelect={async () => {
                        if (!slide || exporting) return;
                        setExporting(true);
                        const toastId = `pdf-export-${slideId}`;
                        toast.custom(
                          () => (
                            <PdfProgressToast
                              progress={{
                                phase: 'processing',
                                current: 0,
                                total: pages.length,
                                percent: 0,
                              }}
                            />
                          ),
                          { id: toastId, duration: Infinity },
                        );
                        try {
                          await exportSlideAsPdf(
                            slide,
                            slideId,
                            (p) => {
                              toast.custom(() => <PdfProgressToast progress={p} />, {
                                id: toastId,
                                duration: Infinity,
                              });
                            },
                            { lang: config.lang },
                          );
                        } catch (err) {
                          console.error('[open-slide] pdf export failed', err);
                          toast.error('PDF export failed', { id: toastId, duration: 4000 });
                        } finally {
                          setExporting(false);
                          toast.dismiss(toastId);
                        }
                      }}
                    >
                      <FileText />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={exporting}
                      onSelect={async () => {
                        if (!slide || exporting) return;
                        setExporting(true);
                        try {
                          await exportSlideAsPptx(slide, slideId, { lang: config.lang });
                        } catch (err) {
                          console.error('[open-slide] pptx export failed', err);
                          toast.error('PPTX export failed');
                        } finally {
                          setExporting(false);
                        }
                      }}
                    >
                      <Presentation />
                      Export as PPTX
                    </DropdownMenuItem>
                    {import.meta.env.DEV && (
                      <DropdownMenuItem
                        disabled={exporting}
                        onSelect={async () => {
                          if (!slide || exporting) return;
                          setExporting(true);
                          const id = toast.loading(
                            'Rendering MP4… this can take a few minutes for long decks.',
                          );
                          try {
                            await exportSlideAsMp4(slide, slideId, {
                              fps: 30,
                              fallbackDurationMs: 5000,
                              onProgress: (phase, percent) => {
                                toast.loading(`MP4: ${phase} (${Math.round(percent)}%)`, { id });
                              },
                            });
                            toast.success('MP4 saved.', { id });
                          } catch (err) {
                            console.error('[open-slide] mp4 export failed', err);
                            toast.error(
                              err instanceof Error ? err.message : 'MP4 export failed',
                              { id },
                            );
                          } finally {
                            setExporting(false);
                          }
                        }}
                      >
                        <Film />
                        Export as MP4 + script (.srt + .txt)
                      </DropdownMenuItem>
                    )}
                    {import.meta.env.DEV && (
                      <DropdownMenuItem
                        disabled={exporting || !slide}
                        onSelect={async () => {
                          if (!slide) return;
                          try {
                            const entries = await buildScriptEntries(slide, slideId, {
                              fallbackDurationMs: 5000,
                            });
                            downloadScriptBlob(entriesToSrt(entries), `${slideId}.srt`);
                            downloadScriptBlob(
                              entriesToPlainText(entries, slide.meta?.title ?? slideId),
                              `${slideId}.script.txt`,
                            );
                            toast.success('Script saved (.srt + .txt).');
                          } catch (err) {
                            console.error('[open-slide] script export failed', err);
                            toast.error(
                              err instanceof Error ? err.message : 'Script export failed',
                            );
                          }
                        }}
                      >
                        <FileText />
                        Download script only (.srt + .txt)
                      </DropdownMenuItem>
                    )}
                    {import.meta.env.DEV && (
                      <>
                        <DropdownMenuItem
                          disabled={exporting}
                          onSelect={async () => {
                            try {
                              const status = await getCanvaStatus();
                              if (!status.configured) {
                                setCanvaConfigOpen(true);
                                toast.message('Enter Canva Developer app credentials.');
                                return;
                              }
                              openCanvaLogin();
                              toast.message('Finish Canva login, then choose Open in Canva.');
                            } catch (err) {
                              console.error('[open-slide] canva login failed', err);
                              toast.error('Canva login failed');
                            }
                          }}
                        >
                          <LogIn />
                          Connect Canva
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={exporting}
                          onSelect={async () => {
                            if (!slide || exporting) return;
                            try {
                              const status = await getCanvaStatus();
                              if (!status.configured) {
                                setCanvaConfigOpen(true);
                                toast.message('Enter Canva Developer app credentials first.');
                                return;
                              }
                              if (!status.connected) {
                                openCanvaLogin();
                                toast.message(
                                  'Finish Canva login, then choose Open in Canva again.',
                                );
                                return;
                              }

                              setExporting(true);
                              const editUrl = await importSlideToCanva(slide, slideId, {
                                lang: config.lang,
                              });
                              window.open(editUrl, '_blank', 'noopener');
                            } catch (err) {
                              console.error('[open-slide] canva import failed', err);
                              toast.error(
                                err instanceof Error ? err.message : 'Canva import failed',
                              );
                            } finally {
                              setExporting(false);
                            }
                          }}
                        >
                          <ExternalLink />
                          Open in Canva
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={exporting}
                          onSelect={() => setCanvaConfigOpen(true)}
                        >
                          <Settings />
                          Canva Settings
                        </DropdownMenuItem>
                      </>
                    )}
                    {import.meta.env.DEV && (
                      <>
                        <DropdownMenuItem
                          disabled={exporting || !slide}
                          onSelect={() => setAudioStudioOpen(true)}
                        >
                          <Mic2 />
                          Audio Studio
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={exporting}
                          onSelect={() => setVoiceSettingsOpen(true)}
                        >
                          <Volume2 />
                          Voice Settings
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {view === 'slides' && (
                <DesignToggleButton active={designOpen} onToggle={() => setDesignOpen((v) => !v)} />
              )}
              {view === 'slides' && <InspectToggleButton />}
              <span aria-hidden className="mx-0.5 hidden h-5 w-0.5 bg-foreground md:block" />
              {view === 'slides' && (
                <Button
                  size="sm"
                  variant="brand"
                  onClick={() => setPlaying(true)}
                  className="px-2.5 md:px-3"
                >
                  <Play className="size-3.5 fill-current" />
                  <span className="hidden md:inline">Present</span>
                  <kbd className="ml-1 hidden rounded-[3px] bg-brand-foreground/15 px-1 font-mono text-[9.5px] tracking-[0.04em] md:inline">
                    F
                  </kbd>
                </Button>
              )}
            </div>
          </header>

          {view === 'assets' ? (
            <div className="min-h-0 flex-1">
              <AssetView slideId={slideId} />
            </div>
          ) : (
            <DesignProvider slideId={slideId}>
              <div className="flex min-h-0 flex-1 flex-col md:flex-row">
                <div className="hidden w-[16.5rem] shrink-0 md:block">
                  <ThumbnailRail
                    pages={pages}
                    design={slide.design}
                    current={index}
                    onSelect={goTo}
                  />
                </div>
                <main
                  ref={slideViewportRef}
                  data-inspector-root
                  className="paper relative min-h-0 min-w-0 flex-1 bg-canvas p-3 md:p-10"
                >
                  <SlideWheelNavigation
                    targetRef={slideViewportRef}
                    onPrev={() => goTo(index - 1)}
                    onNext={() => goTo(index + 1)}
                    canPrev={index > 0}
                    canNext={index < pageCount - 1}
                  />
                  <SlideCanvas design={slide.design}>
                    <CurrentPage />
                  </SlideCanvas>
                  <ClickNavZones
                    onPrev={() => goTo(index - 1)}
                    onNext={() => goTo(index + 1)}
                    canPrev={index > 0}
                    canNext={index < pageCount - 1}
                  />
                  <InspectOverlay />
                  <SaveBar />
                  {import.meta.env.DEV && <CommentWidget />}
                </main>
                {/* Mobile-only horizontal rail. Sits below the canvas and
                    pads its bottom for the iOS home indicator / Safari URL bar. */}
                <div
                  className="shrink-0 border-t border-hairline md:hidden"
                  style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                >
                  <ThumbnailRail
                    pages={pages}
                    design={slide.design}
                    current={index}
                    onSelect={goTo}
                    orientation="horizontal"
                  />
                </div>
                <InspectorPanel />
                <DesignPanel open={designOpen} onClose={() => setDesignOpen(false)} />
              </div>
            </DesignProvider>
          )}
          <CanvaConfigDialog
            open={canvaConfigOpen}
            onOpenChange={setCanvaConfigOpen}
            onConnected={() => {
              toast.message('Finish Canva login, then choose Open in Canva.');
            }}
          />
          <VoiceSettingsDialog open={voiceSettingsOpen} onOpenChange={setVoiceSettingsOpen} />
          <AudioStudioDialog
            open={audioStudioOpen}
            onOpenChange={setAudioStudioOpen}
            slide={slide}
            slideId={slideId}
          />
          <LogoAssetDialog
            open={logoAssetOpen}
            slideId={slideId}
            assets={assets}
            loading={assetsLoading}
            inserting={logoInserting}
            target={logoTargetRef.current}
            currentPage={index}
            onOpenChange={setLogoAssetOpen}
            onPick={(asset) => insertLogoAsset(asset, logoTargetRef.current)}
          />
        </div>
      </InspectorProvider>
    </HistoryProvider>
  );
}

function CanvaConfigDialog({
  open,
  onOpenChange,
  onConnected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<CanvaStatus | null>(null);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState('');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    getCanvaStatus()
      .then((next) => {
        if (cancelled) return;
        setStatus(next);
        setClientId(next.clientId ?? '');
        setRedirectUri(next.redirectUri ?? next.defaultRedirectUri ?? '');
        setClientSecret('');
      })
      .catch((err) => {
        if (!cancelled)
          toast.error(err instanceof Error ? err.message : 'Failed to load Canva settings');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const saveAndLogin = async () => {
    setSaving(true);
    try {
      await saveCanvaConfig({ clientId, clientSecret, redirectUri });
      onOpenChange(false);
      openCanvaLogin();
      onConnected();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save Canva settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-4 border-foreground shadow-overlay sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-black tracking-normal">Canva Login Settings</DialogTitle>
          <DialogDescription>
            Enter the OAuth Client ID and Client Secret from your Canva Developer app. This is not
            your Canva account password.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="https://www.canva.com/developers/apps" target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />
                Open Canva Developer Portal
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href="https://www.canva.dev/docs/connect/authentication/"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-3.5" />
                OAuth Docs
              </a>
            </Button>
          </div>
          <ol className="list-decimal space-y-1 rounded-[2px] border-2 border-foreground bg-accent px-7 py-3 text-[12px] font-bold leading-relaxed shadow-[3px_3px_0_var(--foreground)]">
            <li>Open Canva Developer Portal and create a new integration.</li>
            <li>Copy the Client ID from the configuration page.</li>
            <li>Generate and copy the Client Secret. It usually starts with cnvca.</li>
            <li>Open Scopes and enable design:content:write.</li>
            <li>Add the Redirect URI below to the integration authentication settings.</li>
          </ol>
          <label
            htmlFor="canva-client-id"
            className="grid gap-1.5 text-[12px] font-black uppercase"
          >
            Client ID
            <Input
              id="canva-client-id"
              value={clientId}
              disabled={loading || saving}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Canva app Client ID"
              className="border-2 border-foreground font-mono shadow-[3px_3px_0_var(--foreground)]"
            />
          </label>
          <label
            htmlFor="canva-client-secret"
            className="grid gap-1.5 text-[12px] font-black uppercase"
          >
            Client Secret
            <Input
              id="canva-client-secret"
              value={clientSecret}
              disabled={loading || saving}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder={
                status?.hasClientSecret
                  ? 'Saved. Enter a new secret to replace it.'
                  : 'Canva app Client Secret'
              }
              type="password"
              className="border-2 border-foreground font-mono shadow-[3px_3px_0_var(--foreground)]"
            />
          </label>
          <label
            htmlFor="canva-redirect-uri"
            className="grid gap-1.5 text-[12px] font-black uppercase"
          >
            Redirect URI
            <Input
              id="canva-redirect-uri"
              value={redirectUri}
              disabled={loading || saving}
              onChange={(e) => setRedirectUri(e.target.value)}
              placeholder="http://127.0.0.1:5173/api/canva/callback"
              className="border-2 border-foreground font-mono shadow-[3px_3px_0_var(--foreground)]"
            />
          </label>
          <div className="rounded-[2px] border-2 border-foreground bg-secondary px-3 py-2 text-[12px] font-bold leading-relaxed shadow-[3px_3px_0_var(--foreground)]">
            Add the same Redirect URI in Canva Developer app settings. The values are saved to this
            local workspace .env file.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={saveAndLogin} disabled={loading || saving}>
            {saving ? 'Saving...' : 'Save & Login'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SlideWheelNavigation({
  targetRef,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  targetRef: RefObject<HTMLElement>;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  const { active } = useInspector();

  useWheelPageNavigation({
    ref: targetRef,
    enabled: !active,
    canPrev,
    canNext,
    onPrev,
    onNext,
  });

  return null;
}

function LogoAssetDialog({
  open,
  slideId,
  assets,
  loading,
  inserting,
  target,
  currentPage,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  slideId: string;
  assets: AssetEntry[];
  loading: boolean;
  inserting: boolean;
  target: LogoTarget;
  currentPage: number;
  onOpenChange: (open: boolean) => void;
  onPick: (asset: AssetEntry) => void;
}) {
  const images = assets.filter((asset) => asset.mime.startsWith('image/'));
  const targetLabel = target === 'all' ? 'all pages' : `slide ${currentPage + 1}`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-black tracking-normal">Choose logo asset</DialogTitle>
          <DialogDescription>
            Pick an image from <span className="font-mono">slides/{slideId}/assets/</span> for{' '}
            {targetLabel}.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p className="px-1 py-6 text-center text-xs text-muted-foreground">Loading...</p>
          ) : images.length === 0 ? (
            <p className="px-1 py-6 text-center text-xs text-muted-foreground">
              No image assets yet. Use Logo → Upload, or add files from the Assets tab.
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
              {images.map((asset) => (
                <button
                  key={asset.name}
                  type="button"
                  disabled={inserting}
                  onClick={() => onPick(asset)}
                  className={cn(
                    'group flex flex-col overflow-hidden rounded-[4px] border-2 border-foreground bg-card text-left shadow-[4px_4px_0_var(--foreground)] transition-[box-shadow,transform]',
                    'hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_var(--foreground)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                  )}
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-[repeating-conic-gradient(theme(colors.muted)_0_25%,transparent_0_50%)] bg-[length:12px_12px]">
                    <img
                      src={asset.url}
                      alt=""
                      className="size-full object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="min-w-0 border-t-2 border-foreground px-2 py-1.5">
                    <div className="truncate text-[11px] font-black" title={asset.name}>
                      {asset.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InlineTitleEditor({
  title,
  onSubmit,
}: {
  title: string;
  onSubmit: (name: string) => Promise<void> | void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editing) setValue(title);
  }, [title, editing]);

  useEffect(() => {
    if (editing) {
      queueMicrotask(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing]);

  const commit = async () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === title) {
      setValue(title);
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setValue(title);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <input
          ref={inputRef}
          value={value}
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            if (!saving) commit();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
          maxLength={80}
          className="min-w-0 max-w-[min(34rem,90%)] rounded-[5px] border border-foreground/30 bg-card px-2 py-0.5 text-center font-heading text-[13px] font-medium tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </div>
    );
  }

  return (
    <div className="group/title flex min-w-0 items-baseline justify-center gap-1.5">
      <h1 className="truncate font-heading text-[13.5px] font-semibold tracking-[-0.01em]">
        {title}
      </h1>
      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Rename slide"
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-[4px] text-muted-foreground transition-opacity hover:bg-muted hover:text-foreground',
            'opacity-0 group-hover/title:opacity-100 focus-visible:opacity-100',
          )}
        >
          <Pencil className="size-3" />
        </button>
      )}
    </div>
  );
}
