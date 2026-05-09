import { Loader2, Mic2, Pause, Play, Sparkles, Trash2, Volume2, Wand2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  type ResolvedNarration,
  resolveNarration,
  resolveNarrationWithExtraction,
} from '../lib/narration';
import type { SlideModule } from '../lib/sdk';
import {
  DEFAULT_MODEL_ID,
  getVoiceConfig,
  listVoices,
  MODELS_BY_PROVIDER,
  synthesizeText,
  type Voice,
  type VoiceProviderId,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// ─────────────────────────────────────────────────────────────────────────────
// Audio cache — singleton in module scope so audio survives dialog reopens
// (but not full page reloads).
// ─────────────────────────────────────────────────────────────────────────────

type AudioEntry = {
  blob: Blob;
  url: string;
  voiceId: string;
  provider: VoiceProviderId;
  modelId?: string;
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
  const [modelId, setModelId] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
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
        setModelId(cfg.modelIds[initialProvider] ?? DEFAULT_MODEL_ID[initialProvider]);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : 'Voice config failed');
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Refresh voices when provider changes. Gemini's list is hard-coded so it
  // always loads; ElevenLabs/MMX hit their respective APIs and need a saved
  // key in .env (set via Voice Settings) to succeed.
  useEffect(() => {
    if (!open || !provider) return;
    let cancelled = false;
    setVoicesLoading(true);
    setVoices([]);
    listVoices(provider)
      .then((vs) => {
        if (cancelled) return;
        setVoices(vs);
        // Don't override a custom voiceId that's still valid for this
        // provider, but do replace cross-provider leftovers so a switch
        // from elevenlabs → gemini stops carrying an ElevenLabs ID.
        setVoiceId((current) => {
          if (current && vs.some((v) => v.voiceId === current)) return current;
          if (current && provider === 'elevenlabs') return current; // allow custom EL ID
          if (vs[0]) return vs[0].voiceId;
          return '';
        });
      })
      .catch((err) => {
        if (cancelled) return;
        // Listing failure usually means the provider key isn't configured yet.
        // Gemini's list works without a key, so keep that case quiet.
        if (provider !== 'gemini') {
          toast.message('Configure this provider in Voice Settings before generating audio.');
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

  const autoFillAllEmpty = useCallback(async () => {
    if (!slide) return;
    const empties = rows.map((r, i) => (r.text.trim() ? -1 : i)).filter((i) => i >= 0);
    if (empties.length === 0) {
      toast.message('Every slide already has narration text.');
      return;
    }
    let filled = 0;
    for (const i of empties) {
      const r = await resolveNarrationWithExtraction(slide, i);
      if (r.text.trim()) filled += 1;
      setRows((prev) => {
        const next = [...prev];
        next[i] = { text: r.text, source: r.source };
        return next;
      });
    }
    toast.success(`Auto-filled ${filled} of ${empties.length} empty slide(s).`);
  }, [slide, rows]);

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
      const blob = await synthesizeText(text, {
        provider,
        voiceId,
        modelId: modelId || undefined,
        format: 'mp3',
      });
      cacheAudio(slideId, i, { blob, voiceId, provider, modelId, text });
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
    const indices = rows.map((r, i) => (r.text.trim() ? i : -1)).filter((i) => i >= 0);
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
          modelId: modelId || undefined,
          format: 'mp3',
        });
        cacheAudio(slideId, i, {
          blob,
          voiceId,
          provider,
          modelId,
          text: rows[i].text.trim(),
        });
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="grid gap-1.5 text-[12px] font-black uppercase">
            Provider
            <Select
              value={provider}
              onValueChange={(v) => {
                const next = v as VoiceProviderId;
                setProvider(next);
                // Pull the saved voice + model for the new provider so the
                // inputs reflect whatever Voice Settings set up, not the
                // previous provider's leftover values.
                getVoiceConfig()
                  .then((c) => {
                    setVoiceId(c.defaultVoiceIds[next] ?? '');
                    setModelId(c.modelIds[next] ?? DEFAULT_MODEL_ID[next]);
                  })
                  .catch(() => {
                    setVoiceId('');
                    setModelId(DEFAULT_MODEL_ID[next]);
                  });
                setVoices([]);
              }}
            >
              <SelectTrigger className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="mmx">MiniMax</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5 text-[12px] font-black uppercase">
            Model
            <Select
              value={MODELS_BY_PROVIDER[provider].some((m) => m.id === modelId) ? modelId : ''}
              onValueChange={setModelId}
            >
              <SelectTrigger className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]">
                <SelectValue placeholder="Pick a model" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {MODELS_BY_PROVIDER[provider].map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder={`default: ${DEFAULT_MODEL_ID[provider]}`}
              className="w-full rounded-[2px] border-2 border-foreground bg-background px-2.5 py-1.5 font-mono text-[11px] shadow-[2px_2px_0_var(--foreground)] focus:outline-none"
            />
          </div>

          <div className="grid gap-1.5 text-[12px] font-black uppercase">
            Voice
            <div className="flex gap-2">
              <Select
                value={voices.some((v) => v.voiceId === voiceId) ? voiceId : ''}
                onValueChange={setVoiceId}
                disabled={voicesLoading || voices.length === 0}
              >
                <SelectTrigger className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]">
                  <SelectValue
                    placeholder={
                      voicesLoading
                        ? 'Loading voices…'
                        : voices.length === 0
                          ? provider === 'gemini'
                            ? 'No Gemini voices found'
                            : 'Configure provider in Voice Settings'
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
            </div>
            <input
              type="text"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              placeholder={
                provider === 'elevenlabs'
                  ? '21m00Tcm4TlvDq8ikWAM (paste any ID)'
                  : provider === 'gemini'
                    ? 'Kore, Sulafat, …'
                    : 'Korean_AthleticGirl, …'
              }
              className="w-full rounded-[2px] border-2 border-foreground bg-background px-2.5 py-1.5 font-mono text-[12px] shadow-[3px_3px_0_var(--foreground)] focus:outline-none"
            />
          </div>
        </div>
        <p className="text-[10px] font-medium text-muted-foreground normal-case tracking-normal">
          Provider · Model · Voice are independent — each provider has its own saved defaults from
          Voice Settings. Edits here apply to this synth session only; for permanent defaults,
          change them in Voice Settings.
        </p>

        <div className="flex flex-wrap items-center gap-2 border-t-2 border-foreground pt-3 text-[12px] font-bold">
          <Button size="sm" variant="outline" onClick={autoFillAllEmpty}>
            <Wand2 className="size-3.5" /> Auto-fill empty
          </Button>
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
            // Stable per-row key — `i` alone tripped Biome's noArrayIndexKey.
            // Slides keep their position across edits, so concatenating the
            // first 12 chars of text is unique enough and reuses DOM nodes
            // when the user only changes one row's text.
            const rowKey = `${i}-${row.text.slice(0, 12)}`;
            return (
              <div
                key={rowKey}
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
                        {cached.modelId ? ` · ${cached.modelId}` : ''}
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
  next: {
    blob: Blob;
    voiceId: string;
    provider: VoiceProviderId;
    modelId?: string;
    text: string;
  },
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
    modelId: next.modelId,
    text: next.text,
  });
}
