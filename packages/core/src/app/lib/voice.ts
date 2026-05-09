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
};

export type VoiceConfig = {
  hasKeys: Record<VoiceProviderId, boolean>;
  defaultProvider: VoiceProviderId | null;
  defaultVoiceIds: Record<VoiceProviderId, string | null>;
};

export type VoiceConfigPayload = {
  elevenlabsApiKey?: string;
  geminiApiKey?: string;
  mmxApiKey?: string;
  defaultProvider?: VoiceProviderId;
  elevenlabsVoiceId?: string;
  geminiVoiceId?: string;
  mmxVoiceId?: string;
};

export type SynthesizeOptions = {
  provider?: VoiceProviderId;
  voiceId?: string;
  modelId?: string;
  format?: 'mp3' | 'wav';
};

export async function getVoiceStatus(): Promise<VoiceStatus> {
  const res = await fetch('/api/voice/status');
  if (!res.ok) throw new Error(`Voice status failed (${res.status}).`);
  return (await res.json()) as VoiceStatus;
}

export async function getVoiceConfig(): Promise<VoiceConfig> {
  const res = await fetch('/api/voice/config');
  if (!res.ok) throw new Error(`Voice config load failed (${res.status}).`);
  return (await res.json()) as VoiceConfig;
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
};

export async function testVoiceConnection(
  provider: VoiceProviderId,
  opts: { apiKey?: string; voiceId?: string } = {},
): Promise<VoiceTestResult> {
  const res = await fetch('/api/voice/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      provider,
      apiKey: opts.apiKey?.trim() || undefined,
      voiceId: opts.voiceId?.trim() || undefined,
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
