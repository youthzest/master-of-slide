import { Loader2, Mic2, Pause, Play, Sparkles, Trash2, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  type ResolvedNarration,
  resolveNarration,
  resolveNarrationWithExtraction,
} from '../lib/narration';
import type { SlideModule } from '../lib/sdk';
import {
  type Voice,
  type VoiceProviderId,
  getVoiceConfig,
  listVoices,
  synthesizeText,
} from '../lib/voice';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// ─────────────────────────────────────────────────────────────────────────────
// Audio cache — singleton in module scope so audio survives dialog reopens
// (but not full page reloads).
// ─────────────────────────────────────────────────────────────────────────────

type AudioEntry = {
  blob: Blob;
  url: string;
  voiceId: string;
  provider: VoiceProviderId;
  text: string;
  durationMs?: number;
};

const audioCache = new Map<string, Map<number, AudioEntry>>();

function getCacheFor(slideId: string): Map<number, AudioEntry> {
  let cache = audioCache.get(slideId);
  if (!cache) {
    cache = new Map();
    audioCache.set(slideId, cache);
  }
  return cache;
}

export function getAudioForSlide(slideId: string, pageIndex: number): AudioEntry | undefined {
  return audioCache.get(slideId)?.get(pageIndex);
}

export function getAllAudioForSlide(slideId: string): Map<number, AudioEntry> {
  return audioCache.get(slideId) ?? new Map();
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

type AudioStudioDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: SlideModule | null;
  slideId: string;
};

type RowState = {
  text: string;
  source: ResolvedNarration['source'];
};

export function AudioStudioDialog({ open, onOpenChange, slide, slideId }: AudioStudioDialogProps) {
  const pages = useMemo(() => slide?.default ?? [], [slide]);
  const total = pages.length;

  const [rows, setRows] = useState<RowState[]>([]);
  const [provider, setProvider] = useState<VoiceProviderId>('elevenlabs');
  const [voiceId, setVoiceId] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [providerConfigured, setProviderConfigured] = useState(false);
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);
  const [, forceTick] = useState(0); // bump after cache writes so UI re-renders
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Initialize narration rows whenever the dialog opens with a fresh slide.
  useEffect(() => {
    if (!open || !slide) return;
    const next: RowState[] = [];
    for (let i = 0; i < total; i++) {
      const r = resolveNarration(slide, i);
      next.push({ text: r.text, source: r.source });
    }
    setRows(next);
  }, [open, slide, total]);

  // Pull provider config + voices when opened.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getVoiceConfig()
      .then(async (cfg) => {
        if (cancelled) return;
        const initialProvider =
          cfg.defaultProvider ??
          (cfg.hasKeys.elevenlabs
            ? 'elevenlabs'
            : cfg.hasKeys.gemini
              ? 'gemini'
              : cfg.hasKeys.mmx
                ? 'mmx'
                : 'elevenlabs');
        setProvider(initialProvider);
        setVoiceId(cfg.defaultVoiceIds[initialProvider] ?? '');
        setProviderConfigured(cfg.hasKeys[initialProvider]);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : 'Voice config failed');
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Refresh voices when provider changes.
  useEffect(() => {
    if (!open || !provider) return;
    let cancelled = false;
    setVoicesLoading(true);
    setVoices([]);
    listVoices(provider)
      .then((vs) => {
        if (cancelled) return;
        setVoices(vs);
        setProviderConfigured(true);
        if (!voiceId && vs[0]) setVoiceId(vs[0].voiceId);
      })
      .catch((err) => {
        if (cancelled) return;
        // Listing failure usually means the provider key isn't configured yet.
        // Gemini's list works without a key, so keep that case quiet.
        if (provider !== 'gemini') {
          setProviderConfigured(false);
          toast.message(
            'Configure this provider in Voice Settings before generating audio.',
          );
        } else {
          toast.error(err instanceof Error ? err.message : 'Voice list failed');
        }
      })
      .finally(() => {
        if (!cancelled) setVoicesLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, provider]);

  const updateRow = (i: number, text: string) => {
    setRows((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], text, source: 'narration' };
      return next;
    });
  };

  const autoFillFrom = useCallback(
    async (i: number) => {
      if (!slide) return;
      const r = await resolveNarrationWithExtraction(slide, i);
      setRows((prev) => {
        const next = [...prev];
        next[i] = { text: r.text, source: r.source };
        return next;
      });
    },
    [slide],
  );

  const synthesizeOne = async (i: number) => {
    const text = rows[i]?.text?.trim();
    if (!text) {
      toast.message(`Page ${i + 1}: write or auto-fill narration text first.`);
      return;
    }
    if (!voiceId) {
      toast.message('Pick a voice first.');
      return;
    }
    setBusyIndex(i);
    try {
      const blob = await synthesizeText(text, { provider, voiceId, format: 'mp3' });
      cacheAudio(slideId, i, { blob, voiceId, provider, text });
      forceTick((n) => n + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Page ${i + 1} synth failed`);
    } finally {
      setBusyIndex(null);
    }
  };

  const synthesizeAll = async () => {
    if (!voiceId) {
      toast.message('Pick a voice first.');
      return;
    }
    const indices = rows
      .map((r, i) => (r.text.trim() ? i : -1))
      .filter((i) => i >= 0);
    if (indices.length === 0) {
      toast.message('No slides have narration text to synthesize.');
      return;
    }
    setBatchProgress({ done: 0, total: indices.length });
    let done = 0;
    for (const i of indices) {
      try {
        const blob = await synthesizeText(rows[i].text.trim(), {
          provider,
          voiceId,
          format: 'mp3',
        });
        cacheAudio(slideId, i, { blob, voiceId, provider, text: rows[i].text.trim() });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Page ${i + 1} failed`);
        // Keep going so a single error doesn't kill the batch.
      }
      done += 1;
      setBatchProgress({ done, total: indices.length });
      forceTick((n) => n + 1);
    }
    setBatchProgress(null);
    toast.success(`Synthesized ${done} / ${indices.length} pages.`);
  };

  const playAudio = (i: number) => {
    const entry = getAudioForSlide(slideId, i);
    if (!entry) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playingIndex === i) {
      setPlayingIndex(null);
      return;
    }
    const audio = new Audio(entry.url);
    audio.onended = () => setPlayingIndex(null);
    audio.onerror = () => setPlayingIndex(null);
    audioRef.current = audio;
    audio.play().catch(() => setPlayingIndex(null));
    setPlayingIndex(i);
  };

  const clearAudio = (i: number) => {
    const cache = getCacheFor(slideId);
    const entry = cache.get(i);
    if (entry) URL.revokeObjectURL(entry.url);
    cache.delete(i);
    forceTick((n) => n + 1);
  };

  const clearAllAudio = () => {
    const cache = getCacheFor(slideId);
    for (const entry of cache.values()) URL.revokeObjectURL(entry.url);
    cache.clear();
    forceTick((n) => n + 1);
    toast.message('Cleared all cached audio.');
  };

  const cachedCount = getCacheFor(slideId).size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] border-4 border-foreground shadow-overlay sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-black tracking-normal">Audio Studio</DialogTitle>
          <DialogDescription>
            Edit per-slide narration, preview voices, and synthesize audio for every page. The
            cached audio is reused by MP4 export.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <label className="grid gap-1.5 text-[12px] font-black uppercase">
            Provider
            <Select value={provider} onValueChange={(v) => setProvider(v as VoiceProviderId)}>
              <SelectTrigger className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="mmx">MiniMax</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-1.5 text-[12px] font-black uppercase col-span-2">
            Voice
            <Select value={voiceId} onValueChange={setVoiceId} disabled={voicesLoading || !providerConfigured}>
              <SelectTrigger className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]">
                <SelectValue
                  placeholder={
                    !providerConfigured
                      ? 'Configure provider in Voice Settings'
                      : voicesLoading
                        ? 'Loading voices…'
                        : 'Pick a voice'
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {voices.map((v) => (
                  <SelectItem key={v.voiceId} value={v.voiceId}>
                    {v.category === 'cloned' ? '🎤 ' : ''}
                    {v.name}
                    {v.description ? ` · ${v.description.slice(0, 40)}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>

        <div className="flex items-center gap-2 border-t-2 border-foreground pt-3 text-[12px] font-bold">
          <Button
            size="sm"
            variant="default"
            disabled={!voiceId || batchProgress !== null}
            onClick={synthesizeAll}
          >
            {batchProgress ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> {batchProgress.done}/
                {batchProgress.total}
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" /> Synthesize all
              </>
            )}
          </Button>
          <span className="text-[11px] font-medium text-muted-foreground">
            {cachedCount} / {total} cached
          </span>
          {cachedCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllAudio}>
              <Trash2 className="size-3.5" /> Clear cache
            </Button>
          )}
        </div>

        <div className="max-h-[55vh] space-y-3 overflow-y-auto border-2 border-foreground bg-background p-3 shadow-[3px_3px_0_var(--foreground)]">
          {rows.map((row, i) => {
            const cached = getAudioForSlide(slideId, i);
            const isPlaying = playingIndex === i;
            return (
              <div
                key={i}
                className="grid grid-cols-[40px_1fr_auto] items-start gap-3 rounded-[2px] border-2 border-foreground bg-card p-3"
              >
                <div className="text-center">
                  <div className="font-mono text-[20px] font-black leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="mt-1 text-[9px] font-bold uppercase text-muted-foreground">
                    {row.source === 'narration'
                      ? 'edited'
                      : row.source === 'notes'
                        ? 'notes'
                        : row.source === 'extracted'
                          ? 'auto'
                          : 'empty'}
                  </div>
                </div>
                <div className="grid gap-2">
                  <textarea
                    value={row.text}
                    onChange={(e) => updateRow(i, e.target.value)}
                    placeholder="Narration script for this slide…"
                    rows={2}
                    className="w-full resize-y rounded-[2px] border-2 border-foreground bg-background p-2 font-medium text-[13px] leading-snug shadow-[2px_2px_0_var(--foreground)] focus:outline-none"
                  />
                  <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                    <Button variant="ghost" size="sm" onClick={() => autoFillFrom(i)}>
                      Auto-fill from slide
                    </Button>
                    {cached && (
                      <span>
                        ▸ {(cached.blob.size / 1024).toFixed(0)} KB · {cached.provider}/
                        {cached.voiceId.slice(0, 20)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {cached ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playAudio(i)}
                        title={isPlaying ? 'Stop' : 'Play'}
                      >
                        {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busyIndex === i}
                        onClick={() => synthesizeOne(i)}
                        title="Re-synthesize"
                      >
                        {busyIndex === i ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Mic2 className="size-3.5" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      disabled={busyIndex === i || !voiceId || !row.text.trim()}
                      onClick={() => synthesizeOne(i)}
                    >
                      {busyIndex === i ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <>
                          <Volume2 className="size-3.5" /> Generate
                        </>
                      )}
                    </Button>
                  )}
                  {cached && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => clearAudio(i)}
                      title="Remove cached audio"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function cacheAudio(
  slideId: string,
  pageIndex: number,
  next: { blob: Blob; voiceId: string; provider: VoiceProviderId; text: string },
) {
  const cache = getCacheFor(slideId);
  const previous = cache.get(pageIndex);
  if (previous) URL.revokeObjectURL(previous.url);
  const url = URL.createObjectURL(next.blob);
  cache.set(pageIndex, {
    blob: next.blob,
    url,
    voiceId: next.voiceId,
    provider: next.provider,
    text: next.text,
  });
}
