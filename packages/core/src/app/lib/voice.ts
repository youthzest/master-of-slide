// Client-side helper for the /api/voice/* dev plugin.
// Mirrors the canva.ts pattern: thin fetch wrappers, no secrets in the browser.
//
// Provider IDs are intentionally string-typed so future providers (e.g.
// gemini, mmx) drop in without churning the call sites.

export type VoiceProviderId = 'elevenlabs' | 'gemini' | 'mmx';

export type Voice = {
  voiceId: string;
  name: string;
  preview?: string;
  description?: string;
  category?: 'cloned' | 'preset' | 'community';
  labels?: Record<string, string>;
};

export type VoiceStatus = {
  providers: Record<
    VoiceProviderId,
    { available: boolean; configured: boolean }
  >;
  defaultProvider: VoiceProviderId | null;
  defaultVoiceIds: Record<VoiceProviderId, string | null>;
  defaultModelIds: Record<VoiceProviderId, string>;
};

export type VoiceConfig = {
  hasKeys: Record<VoiceProviderId, boolean>;
  defaultProvider: VoiceProviderId | null;
  defaultVoiceIds: Record<VoiceProviderId, string | null>;
  modelIds: Record<VoiceProviderId, string>;
};

export type VoiceConfigPayload = {
  elevenlabsApiKey?: string;
  geminiApiKey?: string;
  mmxApiKey?: string;
  defaultProvider?: VoiceProviderId;
  elevenlabsVoiceId?: string;
  geminiVoiceId?: string;
  mmxVoiceId?: string;
  elevenlabsModelId?: string;
  geminiModelId?: string;
  mmxModelId?: string;
};

export type SynthesizeOptions = {
  provider?: VoiceProviderId;
  voiceId?: string;
  modelId?: string;
  format?: 'mp3' | 'wav';
};

// ─────────────────────────────────────────────────────────────────────────────
// Model registry — single source of truth for the dropdowns
//
// `id` is the value sent to the provider's API. `label` is for the dropdown.
// `description` shows under the row to help users pick.
// First entry of each provider is the recommended default.
// Users can also paste a custom id via the free-form input below the
// dropdown — useful for bleeding-edge or private models.
// ─────────────────────────────────────────────────────────────────────────────

export type VoiceModel = {
  id: string;
  label: string;
  description: string;
};

export const MODELS_BY_PROVIDER: Record<VoiceProviderId, VoiceModel[]> = {
  elevenlabs: [
    {
      id: 'eleven_multilingual_v2',
      label: 'Multilingual v2 — recommended',
      description: '29 languages, balanced quality/speed. Best default for Korean.',
    },
    {
      id: 'eleven_v3',
      label: 'v3 (alpha) — most expressive',
      description: '70+ languages, latest emotional range. Higher latency.',
    },
    {
      id: 'eleven_turbo_v2_5',
      label: 'Turbo v2.5 — fast',
      description: '32 languages, low-latency streaming.',
    },
    {
      id: 'eleven_flash_v2_5',
      label: 'Flash v2.5 — fastest',
      description: '~75ms latency, 32 languages, lower fidelity.',
    },
    {
      id: 'eleven_monolingual_v1',
      label: 'Monolingual v1 (legacy)',
      description: 'English only.',
    },
  ],
  gemini: [
    {
      id: 'gemini-2.5-flash-preview-tts',
      label: 'Gemini 2.5 Flash TTS — recommended',
      description: 'Fast, low-cost, supports 30 prebuilt voices.',
    },
    {
      id: 'gemini-2.5-pro-preview-tts',
      label: 'Gemini 2.5 Pro TTS',
      description: 'Higher quality, slower, more expensive.',
    },
  ],
  mmx: [
    {
      id: 'speech-2.8-hd',
      label: 'Speech 2.8 HD — recommended',
      description: 'Latest HD model, best Korean and multilingual fidelity.',
    },
    {
      id: 'speech-2.6-hd',
      label: 'Speech 2.6 HD',
      description: 'Stable HD generation, slightly older voice catalog.',
    },
    {
      id: 'speech-02-hd',
      label: 'Speech 02 HD (legacy)',
      description: 'Earlier HD baseline, still supported.',
    },
    {
      id: 'speech-01-turbo',
      label: 'Speech 01 Turbo',
      description: 'Fastest, lower fidelity.',
    },
    {
      id: 'speech-01',
      label: 'Speech 01',
      description: 'Original baseline model.',
    },
  ],
};

export const DEFAULT_MODEL_ID: Record<VoiceProviderId, string> = {
  elevenlabs: MODELS_BY_PROVIDER.elevenlabs[0].id,
  gemini: MODELS_BY_PROVIDER.gemini[0].id,
  mmx: MODELS_BY_PROVIDER.mmx[0].id,
};

export async function getVoiceStatus(): Promise<VoiceStatus> {
  const res = await fetch('/api/voice/status');
  if (!res.ok) throw new Error(`Voice status failed (${res.status}).`);
  return (await res.json()) as VoiceStatus;
}

export async function getVoiceConfig(): Promise<VoiceConfig> {
  const res = await fetch('/api/voice/config');
  if (!res.ok) throw new Error(`Voice config load failed (${res.status}).`);
  const raw = (await res.json()) as VoiceConfig & { modelIds?: Record<VoiceProviderId, string> };
  // Older server builds (pre-model support) may not return modelIds; fill in
  // safe defaults so the UI doesn't crash on an undefined lookup.
  if (!raw.modelIds) raw.modelIds = { ...DEFAULT_MODEL_ID };
  return raw;
}

export async function saveVoiceConfig(payload: VoiceConfigPayload): Promise<void> {
  const res = await fetch('/api/voice/config', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.error ?? `Voice config save failed (${res.status}).`);
  }
}

export async function listVoices(provider: VoiceProviderId = 'elevenlabs'): Promise<Voice[]> {
  const res = await fetch(`/api/voice/voices?provider=${encodeURIComponent(provider)}`);
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.error ?? `Voice list failed (${res.status}).`);
  }
  const data = (await res.json()) as { voices?: Voice[] };
  return data.voices ?? [];
}

export async function synthesizeText(text: string, opts: SynthesizeOptions = {}): Promise<Blob> {
  const res = await fetch('/api/voice/synthesize', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      provider: opts.provider ?? 'elevenlabs',
      text,
      voiceId: opts.voiceId,
      modelId: opts.modelId,
      format: opts.format ?? 'mp3',
    }),
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.error ?? `Synthesize failed (${res.status}).`);
  }
  return await res.blob();
}

export type VoiceTestResult = {
  ok: boolean;
  provider?: VoiceProviderId;
  voiceId?: string;
  bytes?: number;
  durationMs?: number;
  message?: string;
  error?: string;
  saved?: boolean;
};

export async function testVoiceConnection(
  provider: VoiceProviderId,
  opts: { apiKey?: string; voiceId?: string; modelId?: string; persist?: boolean } = {},
): Promise<VoiceTestResult> {
  const res = await fetch('/api/voice/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      provider,
      apiKey: opts.apiKey?.trim() || undefined,
      voiceId: opts.voiceId?.trim() || undefined,
      modelId: opts.modelId?.trim() || undefined,
      persist: opts.persist,
    }),
  });
  // The endpoint returns 200 with { ok: false, error } even on auth failure
  // so the toast renderer can show a useful message instead of "Network error".
  const data = (await safeJson(res)) ?? {};
  return data as VoiceTestResult;
}

export async function cloneVoice(
  provider: VoiceProviderId,
  name: string,
  description: string,
  sample: Blob,
  filename = 'sample.mp3',
): Promise<{ voiceId: string }> {
  const params = new URLSearchParams({ provider, name, description, filename });
  const res = await fetch(`/api/voice/clone?${params.toString()}`, {
    method: 'POST',
    headers: { 'content-type': sample.type || 'audio/mpeg' },
    body: sample,
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.error ?? `Voice clone failed (${res.status}).`);
  }
  return (await res.json()) as { voiceId: string };
}

async function safeJson(res: Response): Promise<{ error?: string } | null> {
  try {
    return (await res.json()) as { error?: string };
  } catch {
    return null;
  }
}
