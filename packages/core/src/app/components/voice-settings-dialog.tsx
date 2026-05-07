import { ExternalLink, Loader2, Mic, Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  type Voice,
  type VoiceConfig,
  type VoiceProviderId,
  type VoiceStatus,
  cloneVoice,
  getVoiceConfig,
  getVoiceStatus,
  listVoices,
  saveVoiceConfig,
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
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const PROVIDER_LABELS: Record<VoiceProviderId, string> = {
  elevenlabs: 'ElevenLabs',
  gemini: 'Gemini TTS',
  mmx: 'MiniMax (mmx)',
};

const PROVIDER_DOCS: Record<VoiceProviderId, string> = {
  elevenlabs: 'https://elevenlabs.io/app/settings/api-keys',
  gemini: 'https://aistudio.google.com/app/apikey',
  mmx: 'https://platform.minimax.io/user-center/basic-information/interface-key',
};

const SAMPLE_TEXT_KO = '안녕하세요. 이 목소리로 슬라이드 내레이션을 들어볼 수 있습니다.';
const SAMPLE_TEXT_EN = 'Hello. This is a quick sample of how this voice will narrate your slides.';

export function VoiceSettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [provider, setProvider] = useState<VoiceProviderId>('elevenlabs');
  const [status, setStatus] = useState<VoiceStatus | null>(null);
  const [config, setConfig] = useState<VoiceConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState<string | null>(null);
  const [cloneOpen, setCloneOpen] = useState(false);

  const [apiKey, setApiKey] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getVoiceStatus(), getVoiceConfig()])
      .then(([s, c]) => {
        if (cancelled) return;
        setStatus(s);
        setConfig(c);
        const initial = (s.defaultProvider ?? 'elevenlabs') as VoiceProviderId;
        setProvider(initial);
        setVoiceId(c.defaultVoiceIds[initial] ?? '');
        setApiKey('');
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : 'Voice load failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Refresh voices whenever provider switches and is configured
  useEffect(() => {
    if (!open) return;
    if (!config?.hasKeys[provider]) {
      setVoices([]);
      return;
    }
    let cancelled = false;
    setVoicesLoading(true);
    listVoices(provider)
      .then((vs) => {
        if (cancelled) return;
        setVoices(vs);
        // Pre-select stored default if it exists in the returned list
        const stored = config.defaultVoiceIds[provider];
        if (stored && vs.some((v) => v.voiceId === stored)) setVoiceId(stored);
        else if (vs.length > 0) setVoiceId(vs[0].voiceId);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : 'Voice list failed');
      })
      .finally(() => {
        if (!cancelled) setVoicesLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, provider, config?.hasKeys[provider]]);

  const providerAvailable = status?.providers[provider]?.available ?? false;
  const providerConfigured = config?.hasKeys[provider] ?? false;

  const save = async () => {
    setSaving(true);
    try {
      const payload: Parameters<typeof saveVoiceConfig>[0] = {
        defaultProvider: provider,
      };
      if (apiKey.trim()) {
        if (provider === 'elevenlabs') payload.elevenlabsApiKey = apiKey.trim();
        if (provider === 'gemini') payload.geminiApiKey = apiKey.trim();
        if (provider === 'mmx') payload.mmxApiKey = apiKey.trim();
      }
      if (voiceId.trim()) {
        if (provider === 'elevenlabs') payload.elevenlabsVoiceId = voiceId.trim();
        if (provider === 'gemini') payload.geminiVoiceId = voiceId.trim();
        if (provider === 'mmx') payload.mmxVoiceId = voiceId.trim();
      }
      await saveVoiceConfig(payload);
      toast.success(`Saved. Default voice set to ${PROVIDER_LABELS[provider]}.`);
      // Refetch so subsequent voice listing works without reopen
      const [s, c] = await Promise.all([getVoiceStatus(), getVoiceConfig()]);
      setStatus(s);
      setConfig(c);
      setApiKey('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Voice save failed');
    } finally {
      setSaving(false);
    }
  };

  const previewVoice = async () => {
    if (!voiceId) {
      toast.message('Pick a voice first.');
      return;
    }
    setPreviewLoading(voiceId);
    try {
      const text = sampleTextFor(voiceId, voices);
      const blob = await synthesizeText(text, { provider, voiceId, format: 'mp3' });
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch((err) => toast.error(`Playback failed: ${err.message}`));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Preview failed');
    } finally {
      setPreviewLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-4 border-foreground shadow-overlay sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-black tracking-normal">Voice Settings</DialogTitle>
          <DialogDescription>
            Configure TTS providers for slide narration. API keys persist in your local{' '}
            <span className="font-mono">.env</span> file (gitignored). Use ElevenLabs to clone your
            own voice.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <label className="grid gap-1.5 text-[12px] font-black uppercase">
            Provider
            <Select
              value={provider}
              onValueChange={(v) => setProvider(v as VoiceProviderId)}
              disabled={loading}
            >
              <SelectTrigger className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elevenlabs">ElevenLabs (cloning + presets)</SelectItem>
                <SelectItem value="gemini" disabled={!status?.providers.gemini.available}>
                  Gemini TTS (30 prebuilt voices)
                </SelectItem>
                <SelectItem value="mmx" disabled={!status?.providers.mmx.available}>
                  MiniMax (Korean + multilingual)
                </SelectItem>
              </SelectContent>
            </Select>
          </label>

          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
            <span>Status:</span>
            <span className={providerConfigured ? 'text-green-700' : 'text-amber-700'}>
              {providerConfigured ? '✓ Configured' : 'Not configured'}
            </span>
            <Button asChild variant="ghost" size="sm" className="ml-auto h-7 px-2">
              <a href={PROVIDER_DOCS[provider]} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" /> Get API key
              </a>
            </Button>
          </div>

          {!providerAvailable && (
            <p className="rounded-[2px] border-2 border-amber-600 bg-amber-100 p-3 text-[12px] font-bold leading-relaxed text-amber-900">
              This provider isn't wired up yet. ElevenLabs is available now; Gemini and MiniMax land
              in a follow-up release.
            </p>
          )}

          <label className="grid gap-1.5 text-[12px] font-black uppercase">
            API Key
            <Input
              type="password"
              value={apiKey}
              disabled={loading || saving || !providerAvailable}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                providerConfigured
                  ? 'Saved. Enter a new key to replace it.'
                  : `Enter your ${PROVIDER_LABELS[provider]} API key`
              }
              className="border-2 border-foreground font-mono shadow-[3px_3px_0_var(--foreground)]"
            />
          </label>

          <label className="grid gap-1.5 text-[12px] font-black uppercase">
            Voice
            <div className="flex gap-2">
              <Select
                value={voiceId}
                onValueChange={setVoiceId}
                disabled={!providerConfigured || voicesLoading}
              >
                <SelectTrigger className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]">
                  <SelectValue
                    placeholder={
                      voicesLoading
                        ? 'Loading voices…'
                        : providerConfigured
                          ? 'Pick a voice'
                          : 'Configure API key first'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {voices.map((v) => (
                    <SelectItem key={v.voiceId} value={v.voiceId}>
                      {v.category === 'cloned' ? '🎤 ' : ''}
                      {v.name}
                      {v.labels?.gender ? ` · ${v.labels.gender}` : ''}
                      {v.labels?.accent ? ` · ${v.labels.accent}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!voiceId || previewLoading !== null}
                onClick={previewVoice}
                title="Preview"
              >
                {previewLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
              </Button>
            </div>
            {voiceId && voices.find((v) => v.voiceId === voiceId)?.description && (
              <p className="text-[11px] font-medium text-muted-foreground">
                {voices.find((v) => v.voiceId === voiceId)?.description}
              </p>
            )}
          </label>

          {provider === 'elevenlabs' && providerConfigured && (
            <div className="flex items-center justify-between rounded-[2px] border-2 border-foreground bg-accent px-4 py-3 shadow-[3px_3px_0_var(--foreground)]">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-black uppercase">
                  <Mic className="size-3.5" /> Clone your voice
                </div>
                <p className="mt-1 text-[11px] font-medium leading-relaxed">
                  Upload a 30-60s clear audio sample and ElevenLabs creates a custom voice ID.
                </p>
              </div>
              <Button
                size="sm"
                variant="default"
                disabled={!providerConfigured}
                onClick={() => setCloneOpen(true)}
              >
                Open Cloner
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={save} disabled={saving || loading || !providerAvailable}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Volume2 className="size-4" />}
            Save settings
          </Button>
        </DialogFooter>

        {provider === 'elevenlabs' && (
          <VoiceCloneDialog
            open={cloneOpen}
            onOpenChange={setCloneOpen}
            onCloned={(newVoice) => {
              setCloneOpen(false);
              toast.success(`Voice cloned: ${newVoice.name}`);
              // Refresh voice list
              listVoices('elevenlabs').then(setVoices).catch(() => undefined);
              setVoiceId(newVoice.voiceId);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function sampleTextFor(_voiceId: string, voices: Voice[]): string {
  const v = voices.find((it) => it.voiceId === _voiceId);
  // Heuristic: if voice's labels mention Korean, sample Korean. Else English.
  const lang = (v?.labels?.language ?? v?.labels?.accent ?? '').toLowerCase();
  if (lang.includes('ko') || lang.includes('korea')) return SAMPLE_TEXT_KO;
  return SAMPLE_TEXT_EN;
}

// ─────────────────────────────────────────────────────────────────────────────
// Voice cloning sub-dialog (ElevenLabs only)
// ─────────────────────────────────────────────────────────────────────────────

function VoiceCloneDialog({
  open,
  onOpenChange,
  onCloned,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloned: (voice: { voiceId: string; name: string }) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      toast.message('Name your voice.');
      return;
    }
    if (!file) {
      toast.message('Pick an audio sample.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await cloneVoice('elevenlabs', name.trim(), description.trim(), file, file.name);
      onCloned({ voiceId: result.voiceId, name: name.trim() });
      setName('');
      setDescription('');
      setFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Clone failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-4 border-foreground shadow-overlay sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-black tracking-normal">Clone a Voice</DialogTitle>
          <DialogDescription>
            Upload a clear 30-60 second audio sample. No background music or noise. ElevenLabs will
            create a custom voice you can use as a default.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <label className="grid gap-1.5 text-[12px] font-black uppercase">
            Voice name
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Lecture Voice"
              disabled={submitting}
              className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]"
            />
          </label>

          <label className="grid gap-1.5 text-[12px] font-black uppercase">
            Description (optional)
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Korean, calm, mid-30s"
              disabled={submitting}
              className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]"
            />
          </label>

          <label className="grid gap-1.5 text-[12px] font-black uppercase">
            Audio sample
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={submitting}
              className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]"
            />
            {file && (
              <p className="text-[11px] font-medium text-muted-foreground">
                {file.name} · {(file.size / 1024).toFixed(0)} KB
              </p>
            )}
          </label>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting || !name || !file}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Mic className="size-4" />}
            Create voice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
