import { readFile, writeFile } from 'node:fs/promises';
import type { ServerResponse } from 'node:http';
import path from 'node:path';
import type { Connect, Plugin } from 'vite';

// ─────────────────────────────────────────────────────────────────────────────
// Voice plugin — TTS provider abstraction over /api/voice/*
//
// Mirrors canva-plugin.ts: server-mediated API calls so secrets stay out of
// the browser. Keys persist in `.env` (already gitignored).
//
// Phase 1 ships ElevenLabs (with voice cloning). Add Gemini/mmx by registering
// new entries in PROVIDERS below — the HTTP surface is provider-agnostic.
// ─────────────────────────────────────────────────────────────────────────────

type ProviderId = 'elevenlabs' | 'gemini' | 'mmx';

type Voice = {
  voiceId: string;
  name: string;
  preview?: string;
  description?: string;
  category?: 'cloned' | 'preset' | 'community';
  labels?: Record<string, string>;
};

type SynthesizeOptions = {
  modelId?: string;
  format?: 'mp3' | 'wav' | 'pcm';
};

// Default models per provider — used when neither the request nor the saved
// config specifies one. Kept here (not in VoiceProvider methods) so the UI can
// surface the same defaults.
const DEFAULT_MODELS: Record<ProviderId, string> = {
  elevenlabs: 'eleven_multilingual_v2',
  gemini: 'gemini-2.5-flash-preview-tts',
  mmx: 'speech-2.8-hd',
};

interface VoiceProvider {
  id: ProviderId;
  envKey: string;
  isConfigured(env: NodeJS.ProcessEnv): boolean;
  listVoices(env: NodeJS.ProcessEnv): Promise<Voice[]>;
  synthesize(
    env: NodeJS.ProcessEnv,
    text: string,
    voiceId: string,
    opts?: SynthesizeOptions,
  ): Promise<{ audio: Buffer; contentType: string }>;
  cloneVoice?(
    env: NodeJS.ProcessEnv,
    name: string,
    description: string,
    samples: Array<{ filename: string; data: Buffer; contentType: string }>,
  ): Promise<{ voiceId: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ElevenLabs provider
// ─────────────────────────────────────────────────────────────────────────────

const elevenlabsProvider: VoiceProvider = {
  id: 'elevenlabs',
  envKey: 'ELEVENLABS_API_KEY',
  isConfigured(env) {
    return Boolean(env.ELEVENLABS_API_KEY);
  },
  async listVoices(env) {
    const res = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': requireKey(env, 'ELEVENLABS_API_KEY') },
    });
    if (!res.ok) {
      throw new Error(`ElevenLabs listVoices failed (${res.status}): ${await res.text()}`);
    }
    const data = (await res.json()) as {
      voices?: Array<{
        voice_id: string;
        name: string;
        preview_url?: string;
        description?: string;
        category?: string;
        labels?: Record<string, string>;
      }>;
    };
    return (data.voices ?? []).map((v) => ({
      voiceId: v.voice_id,
      name: v.name,
      preview: v.preview_url,
      description: v.description,
      category:
        v.category === 'cloned'
          ? 'cloned'
          : v.category === 'premade'
            ? 'preset'
            : 'community',
      labels: v.labels,
    }));
  },
  async synthesize(env, text, voiceId, opts = {}) {
    const modelId = opts.modelId ?? env.VOICE_MODEL_ELEVENLABS ?? DEFAULT_MODELS.elevenlabs;
    const format = opts.format ?? 'mp3';
    const formatHeader =
      format === 'mp3' ? 'mp3_44100_128' : format === 'wav' ? 'pcm_44100' : 'pcm_44100';
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${formatHeader}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': requireKey(env, 'ELEVENLABS_API_KEY'),
          'content-type': 'application/json',
          accept: format === 'mp3' ? 'audio/mpeg' : 'audio/wav',
        },
        body: JSON.stringify({ text, model_id: modelId }),
      },
    );
    if (!res.ok) {
      throw new Error(`ElevenLabs synthesize failed (${res.status}): ${await res.text()}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    return {
      audio: Buffer.from(arrayBuffer),
      contentType: format === 'mp3' ? 'audio/mpeg' : 'audio/wav',
    };
  },
  async cloneVoice(env, name, description, samples) {
    const form = new FormData();
    form.append('name', name);
    if (description) form.append('description', description);
    for (const s of samples) {
      form.append('files', new Blob([new Uint8Array(s.data)], { type: s.contentType }), s.filename);
    }
    const res = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: { 'xi-api-key': requireKey(env, 'ELEVENLABS_API_KEY') },
      body: form,
    });
    if (!res.ok) {
      throw new Error(`ElevenLabs cloneVoice failed (${res.status}): ${await res.text()}`);
    }
    const data = (await res.json()) as { voice_id?: string };
    if (!data.voice_id) {
      throw new Error('ElevenLabs returned no voice_id from clone request.');
    }
    return { voiceId: data.voice_id };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Gemini TTS provider — Google AI Studio
// ─────────────────────────────────────────────────────────────────────────────

const GEMINI_PCM_SAMPLE_RATE = 24000;

// Curated list of Gemini 2.5 prebuilt voices with personality hints.
// Gemini does not expose a list endpoint, so this stays in code.
const GEMINI_VOICES: Voice[] = [
  { voiceId: 'Zephyr', name: 'Zephyr', description: 'Bright', category: 'preset' },
  { voiceId: 'Puck', name: 'Puck', description: 'Upbeat', category: 'preset' },
  { voiceId: 'Charon', name: 'Charon', description: 'Informative', category: 'preset' },
  { voiceId: 'Kore', name: 'Kore', description: 'Firm', category: 'preset' },
  { voiceId: 'Fenrir', name: 'Fenrir', description: 'Excitable', category: 'preset' },
  { voiceId: 'Leda', name: 'Leda', description: 'Youthful', category: 'preset' },
  { voiceId: 'Orus', name: 'Orus', description: 'Firm', category: 'preset' },
  { voiceId: 'Aoede', name: 'Aoede', description: 'Breezy', category: 'preset' },
  { voiceId: 'Callirrhoe', name: 'Callirrhoe', description: 'Easy-going', category: 'preset' },
  { voiceId: 'Autonoe', name: 'Autonoe', description: 'Bright', category: 'preset' },
  { voiceId: 'Enceladus', name: 'Enceladus', description: 'Breathy', category: 'preset' },
  { voiceId: 'Iapetus', name: 'Iapetus', description: 'Clear', category: 'preset' },
  { voiceId: 'Umbriel', name: 'Umbriel', description: 'Easy-going', category: 'preset' },
  { voiceId: 'Algieba', name: 'Algieba', description: 'Smooth', category: 'preset' },
  { voiceId: 'Despina', name: 'Despina', description: 'Smooth', category: 'preset' },
  { voiceId: 'Erinome', name: 'Erinome', description: 'Clear', category: 'preset' },
  { voiceId: 'Algenib', name: 'Algenib', description: 'Gravelly', category: 'preset' },
  { voiceId: 'Rasalgethi', name: 'Rasalgethi', description: 'Informative', category: 'preset' },
  { voiceId: 'Laomedeia', name: 'Laomedeia', description: 'Upbeat', category: 'preset' },
  { voiceId: 'Achernar', name: 'Achernar', description: 'Soft', category: 'preset' },
  { voiceId: 'Alnilam', name: 'Alnilam', description: 'Firm', category: 'preset' },
  { voiceId: 'Schedar', name: 'Schedar', description: 'Even', category: 'preset' },
  { voiceId: 'Gacrux', name: 'Gacrux', description: 'Mature', category: 'preset' },
  { voiceId: 'Pulcherrima', name: 'Pulcherrima', description: 'Forward', category: 'preset' },
  { voiceId: 'Achird', name: 'Achird', description: 'Friendly', category: 'preset' },
  { voiceId: 'Zubenelgenubi', name: 'Zubenelgenubi', description: 'Casual', category: 'preset' },
  { voiceId: 'Vindemiatrix', name: 'Vindemiatrix', description: 'Gentle', category: 'preset' },
  { voiceId: 'Sadachbia', name: 'Sadachbia', description: 'Lively', category: 'preset' },
  { voiceId: 'Sadaltager', name: 'Sadaltager', description: 'Knowledgeable', category: 'preset' },
  { voiceId: 'Sulafat', name: 'Sulafat', description: 'Warm', category: 'preset' },
];

const geminiProvider: VoiceProvider = {
  id: 'gemini',
  envKey: 'GEMINI_API_KEY',
  isConfigured(env) {
    return Boolean(env.GEMINI_API_KEY);
  },
  async listVoices() {
    return GEMINI_VOICES;
  },
  async synthesize(env, text, voiceId, opts = {}) {
    const modelId = opts.modelId ?? env.VOICE_MODEL_GEMINI ?? DEFAULT_MODELS.gemini;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': requireKey(env, 'GEMINI_API_KEY'),
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceId },
              },
            },
          },
          model: modelId,
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`Gemini synthesize failed (${res.status}): ${await res.text()}`);
    }
    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ inlineData?: { data?: string } }> };
      }>;
    };
    const base64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64) {
      throw new Error('Gemini returned no audio data.');
    }
    const pcm = Buffer.from(base64, 'base64');
    const wav = pcmToWav(pcm, GEMINI_PCM_SAMPLE_RATE, 1, 16);
    return { audio: wav, contentType: 'audio/wav' };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MiniMax (mmx) T2A v2 provider
// ─────────────────────────────────────────────────────────────────────────────

const MINIMAX_HOST = 'https://api.minimax.io';

const minimaxProvider: VoiceProvider = {
  id: 'mmx',
  envKey: 'MINIMAX_API_KEY',
  isConfigured(env) {
    return Boolean(env.MINIMAX_API_KEY ?? env.MMX_API_KEY);
  },
  async listVoices(env) {
    const key = requireKey(env, 'MINIMAX_API_KEY', 'MMX_API_KEY');
    const res = await fetch(`${MINIMAX_HOST}/v1/get_voice`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ voice_type: 'all' }),
    });
    if (!res.ok) {
      throw new Error(`MiniMax listVoices failed (${res.status}): ${await res.text()}`);
    }
    const data = (await res.json()) as {
      system_voice?: Array<{
        voice_id: string;
        voice_name?: string;
        description?: string[] | string;
      }>;
      voice_cloning?: Array<{
        voice_id: string;
        voice_name?: string;
        description?: string[] | string;
      }>;
    };
    const voices: Voice[] = [];
    for (const v of data.voice_cloning ?? []) {
      voices.push({
        voiceId: v.voice_id,
        name: v.voice_name ?? v.voice_id,
        description: Array.isArray(v.description) ? v.description.join(' ') : v.description,
        category: 'cloned',
      });
    }
    for (const v of data.system_voice ?? []) {
      voices.push({
        voiceId: v.voice_id,
        name: v.voice_name ?? v.voice_id,
        description: Array.isArray(v.description) ? v.description.join(' ') : v.description,
        category: 'preset',
        labels: extractMinimaxLabels(v.voice_id),
      });
    }
    // Sort: Korean first, then English, then everything else; cloned voices stay on top
    return voices.sort(minimaxVoiceCompare);
  },
  async synthesize(env, text, voiceId, opts = {}) {
    const key = requireKey(env, 'MINIMAX_API_KEY', 'MMX_API_KEY');
    const format = opts.format ?? 'mp3';
    const res = await fetch(`${MINIMAX_HOST}/v1/t2a_v2`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: opts.modelId ?? env.VOICE_MODEL_MMX ?? DEFAULT_MODELS.mmx,
        text,
        stream: false,
        voice_setting: { voice_id: voiceId, speed: 1, vol: 1, pitch: 0 },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format,
          channel: 1,
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`MiniMax synthesize failed (${res.status}): ${await res.text()}`);
    }
    const data = (await res.json()) as {
      data?: { audio?: string };
      base_resp?: { status_code?: number; status_msg?: string };
    };
    if (data.base_resp && data.base_resp.status_code !== 0) {
      throw new Error(
        `MiniMax error: ${data.base_resp.status_msg ?? 'unknown'} (code ${data.base_resp.status_code})`,
      );
    }
    const hex = data.data?.audio;
    if (!hex) {
      throw new Error('MiniMax returned no audio data.');
    }
    return {
      audio: Buffer.from(hex, 'hex'),
      contentType: format === 'mp3' ? 'audio/mpeg' : format === 'wav' ? 'audio/wav' : 'audio/aac',
    };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider registry — order here drives the default-fallback order in status.
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDERS: Record<ProviderId, VoiceProvider | undefined> = {
  elevenlabs: elevenlabsProvider,
  gemini: geminiProvider,
  mmx: minimaxProvider,
};

const ENV_KEYS: Record<string, string | undefined> = {
  ELEVENLABS_API_KEY: undefined,
  GEMINI_API_KEY: undefined,
  MMX_API_KEY: undefined,
  MINIMAX_API_KEY: undefined,
  VOICE_DEFAULT_PROVIDER: undefined,
  VOICE_DEFAULT_VOICE_ID_ELEVENLABS: undefined,
  VOICE_DEFAULT_VOICE_ID_GEMINI: undefined,
  VOICE_DEFAULT_VOICE_ID_MMX: undefined,
  VOICE_MODEL_ELEVENLABS: undefined,
  VOICE_MODEL_GEMINI: undefined,
  VOICE_MODEL_MMX: undefined,
};

// ─────────────────────────────────────────────────────────────────────────────
// Plugin
// ─────────────────────────────────────────────────────────────────────────────

type VoicePluginOptions = {
  env?: NodeJS.ProcessEnv;
  userCwd?: string;
};

export function voicePlugin(opts: VoicePluginOptions = {}): Plugin {
  const env = opts.env ?? process.env;
  const userCwd = opts.userCwd ?? process.cwd();
  const envPath = path.join(userCwd, '.env');

  return {
    name: 'open-slide:voice',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', requestOrigin(req));
        if (!url.pathname.startsWith('/api/voice/')) return next();

        try {
          if (url.pathname === '/api/voice/status') {
            const status: Record<string, { available: boolean; configured: boolean }> = {};
            for (const id of Object.keys(PROVIDERS) as ProviderId[]) {
              const provider = PROVIDERS[id];
              status[id] = {
                available: Boolean(provider),
                configured: provider ? provider.isConfigured(env) : false,
              };
            }
            return json(res, 200, {
              providers: status,
              defaultProvider:
                env.VOICE_DEFAULT_PROVIDER ??
                (PROVIDERS.elevenlabs?.isConfigured(env) ? 'elevenlabs' : null),
              defaultVoiceIds: {
                elevenlabs: env.VOICE_DEFAULT_VOICE_ID_ELEVENLABS ?? null,
                gemini: env.VOICE_DEFAULT_VOICE_ID_GEMINI ?? null,
                mmx: env.VOICE_DEFAULT_VOICE_ID_MMX ?? null,
              },
              defaultModelIds: {
                elevenlabs: env.VOICE_MODEL_ELEVENLABS ?? DEFAULT_MODELS.elevenlabs,
                gemini: env.VOICE_MODEL_GEMINI ?? DEFAULT_MODELS.gemini,
                mmx: env.VOICE_MODEL_MMX ?? DEFAULT_MODELS.mmx,
              },
            });
          }

          if (url.pathname === '/api/voice/config') {
            if (req.method === 'GET') {
              return json(res, 200, {
                hasKeys: {
                  elevenlabs: Boolean(env.ELEVENLABS_API_KEY),
                  gemini: Boolean(env.GEMINI_API_KEY),
                  mmx: Boolean(env.MMX_API_KEY ?? env.MINIMAX_API_KEY),
                },
                defaultProvider: env.VOICE_DEFAULT_PROVIDER ?? null,
                defaultVoiceIds: {
                  elevenlabs: env.VOICE_DEFAULT_VOICE_ID_ELEVENLABS ?? null,
                  gemini: env.VOICE_DEFAULT_VOICE_ID_GEMINI ?? null,
                  mmx: env.VOICE_DEFAULT_VOICE_ID_MMX ?? null,
                },
                modelIds: {
                  elevenlabs: env.VOICE_MODEL_ELEVENLABS ?? DEFAULT_MODELS.elevenlabs,
                  gemini: env.VOICE_MODEL_GEMINI ?? DEFAULT_MODELS.gemini,
                  mmx: env.VOICE_MODEL_MMX ?? DEFAULT_MODELS.mmx,
                },
              });
            }
            if (req.method === 'POST') {
              const body = (await readJson(req)) as Record<string, string | undefined>;
              // Sanitize EVERY incoming key string — pasted keys often carry
              // BOM, zero-width chars, "Bearer ", or wrapping quotes that make
              // a perfectly valid key look invalid to the upstream API.
              await persistVoiceEnv(envPath, env, {
                ELEVENLABS_API_KEY: pickKey(body.elevenlabsApiKey),
                GEMINI_API_KEY: pickKey(body.geminiApiKey),
                MMX_API_KEY: pickKey(body.mmxApiKey),
                MINIMAX_API_KEY: pickKey(body.mmxApiKey), // mirror so listVoices works
                VOICE_DEFAULT_PROVIDER: pickString(body.defaultProvider),
                VOICE_DEFAULT_VOICE_ID_ELEVENLABS: pickString(body.elevenlabsVoiceId),
                VOICE_DEFAULT_VOICE_ID_GEMINI: pickString(body.geminiVoiceId),
                VOICE_DEFAULT_VOICE_ID_MMX: pickString(body.mmxVoiceId),
                VOICE_MODEL_ELEVENLABS: pickString(body.elevenlabsModelId),
                VOICE_MODEL_GEMINI: pickString(body.geminiModelId),
                VOICE_MODEL_MMX: pickString(body.mmxModelId),
              });
              return json(res, 200, { ok: true });
            }
          }

          if (url.pathname === '/api/voice/voices') {
            const providerId = (url.searchParams.get('provider') ?? 'elevenlabs') as ProviderId;
            const provider = requireProvider(providerId);
            const voices = await provider.listVoices(env);
            return json(res, 200, { voices });
          }

          if (url.pathname === '/api/voice/synthesize' && req.method === 'POST') {
            const body = (await readJson(req)) as {
              provider?: ProviderId;
              text?: string;
              voiceId?: string;
              modelId?: string;
              format?: 'mp3' | 'wav';
            };
            if (!body.text || typeof body.text !== 'string') {
              return json(res, 400, { error: 'Missing text.' });
            }
            const providerId = (body.provider ?? 'elevenlabs') as ProviderId;
            const provider = requireProvider(providerId);
            const voiceId =
              pickString(body.voiceId) ??
              env[`VOICE_DEFAULT_VOICE_ID_${providerId.toUpperCase()}`] ??
              '';
            if (!voiceId) {
              return json(res, 400, { error: 'No voice selected.' });
            }
            // Resolve modelId: explicit request > stored config > provider default.
            // The provider methods do this same fallback, but doing it here too
            // makes the chosen model visible in error messages.
            const modelId =
              pickString(body.modelId) ??
              env[`VOICE_MODEL_${providerId.toUpperCase()}`] ??
              DEFAULT_MODELS[providerId];
            const { audio, contentType } = await provider.synthesize(env, body.text, voiceId, {
              modelId,
              format: body.format ?? 'mp3',
            });
            res.statusCode = 200;
            res.setHeader('content-type', contentType);
            res.setHeader('cache-control', 'no-store');
            res.end(audio);
            return;
          }

          if (url.pathname === '/api/voice/test' && req.method === 'POST') {
            // Validate the key with the cheapest authenticated call per
            // provider, then PERSIST the key on success so the user doesn't
            // need a separate "Save" round-trip — most users hit Test
            // expecting the key to take effect immediately.
            const body = (await readJson(req)) as {
              provider?: ProviderId;
              apiKey?: string;
              voiceId?: string;
              modelId?: string;
              persist?: boolean;
            };
            const providerId = (body.provider ?? 'elevenlabs') as ProviderId;
            const provider = requireProvider(providerId);
            const persist = body.persist !== false; // default: persist

            const envKeyName = provider.envKey;
            // Strip paste-noise (BOM, zero-width chars, "Bearer ", quotes,
            // internal whitespace) so a correctly-typed key isn't rejected.
            const cleanedKey = sanitizeApiKey(body.apiKey);
            const transient: NodeJS.ProcessEnv = { ...env };
            if (cleanedKey) {
              transient[envKeyName] = cleanedKey;
              // MiniMax provider checks both names — keep them in sync.
              if (envKeyName === 'MINIMAX_API_KEY') transient.MMX_API_KEY = cleanedKey;
            }
            if (!provider.isConfigured(transient)) {
              return json(res, 400, {
                ok: false,
                error: `${envKeyName} is empty — paste a key into the API Key field first.`,
              });
            }

            const startedAt = Date.now();
            try {
              let resultMeta: { bytes: number; voiceId?: string };
              if (providerId === 'gemini') {
                const voiceId =
                  pickString(body.voiceId) ||
                  transient.VOICE_DEFAULT_VOICE_ID_GEMINI ||
                  defaultTestVoiceId(providerId);
                const modelId =
                  pickString(body.modelId) ||
                  transient.VOICE_MODEL_GEMINI ||
                  DEFAULT_MODELS.gemini;
                const { audio } = await provider.synthesize(transient, 'test', voiceId, {
                  modelId,
                  format: 'mp3',
                });
                resultMeta = { bytes: audio.length, voiceId };
              } else {
                // ElevenLabs + MiniMax: listVoices is the cheapest authenticated
                // call. 401 means bad key; anything else means it works.
                const voices = await provider.listVoices(transient);
                resultMeta = { bytes: voices.length };
              }

              // Persist the validated key so the *next* synthesize call (e.g.
              // the user clicking Generate in Audio Studio) actually sees it.
              let saved = false;
              if (persist && cleanedKey) {
                const updates: Record<string, string | undefined> = {};
                updates[envKeyName] = cleanedKey;
                if (envKeyName === 'MINIMAX_API_KEY') updates.MMX_API_KEY = cleanedKey;
                await persistVoiceEnv(envPath, env, updates);
                saved = true;
              }

              return json(res, 200, {
                ok: true,
                provider: providerId,
                ...resultMeta,
                durationMs: Date.now() - startedAt,
                saved,
                message:
                  `${providerId} key works · ${resultMeta.bytes} ${
                    providerId === 'gemini' ? 'audio bytes' : 'voices'
                  }` + (saved ? ' · saved to .env' : ''),
              });
            } catch (err) {
              return json(res, 200, {
                ok: false,
                provider: providerId,
                error: humanizeProviderError(providerId, err),
              });
            }
          }

          if (url.pathname === '/api/voice/clone' && req.method === 'POST') {
            const providerId = (url.searchParams.get('provider') ?? 'elevenlabs') as ProviderId;
            const provider = requireProvider(providerId);
            if (!provider.cloneVoice) {
              return json(res, 400, {
                error: `Provider ${providerId} does not support voice cloning.`,
              });
            }
            const cloneName = url.searchParams.get('name') ?? 'Custom Voice';
            const cloneDescription = url.searchParams.get('description') ?? '';
            const contentType = req.headers['content-type'] ?? '';
            if (!contentType.startsWith('audio/')) {
              return json(res, 400, {
                error: 'Send a single audio sample as the request body (audio/* mime).',
              });
            }
            const filename = url.searchParams.get('filename') ?? 'sample.mp3';
            const data = Buffer.from(await readBody(req));
            const result = await provider.cloneVoice(env, cloneName, cloneDescription, [
              { filename, data, contentType },
            ]);
            return json(res, 200, result);
          }

          return next();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Voice request failed.';
          return json(res, 500, { error: message });
        }
      });
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────────────

// Sensible "always works" voice id per provider for the Test button. Picked
// to match each platform's documented default voice so a stock key can pass
// validation without the user picking a voice up front.
function defaultTestVoiceId(id: ProviderId): string {
  if (id === 'elevenlabs') return '21m00Tcm4TlvDq8ikWAM'; // Rachel — universal default
  if (id === 'gemini') return 'Kore';
  if (id === 'mmx') return 'Korean_PassionateLady';
  return '';
}

function requireProvider(id: ProviderId): VoiceProvider {
  const p = PROVIDERS[id];
  if (!p) {
    throw new Error(`Voice provider "${id}" is not registered yet.`);
  }
  return p;
}

// Some pastes carry hidden BOM / zero-width chars or accidentally include a
// label like "Bearer sk_..." or "xi-api-key: sk_...". Strip all of that so a
// validly typed key isn't rejected for paste-noise alone.
//
// Char class ​-‏﻿ covers ZWSP, ZWNJ, ZWJ, LRM, RLM, BOM —
// the usual suspects when copying from a styled webpage or messenger.
function sanitizeApiKey(raw: string | undefined | null): string {
  if (!raw) return '';
  let v = String(raw).trim();
  // strip wrapping quotes (curly + straight)
  for (const [open, close] of [
    ['"', '"'],
    ["'", "'"],
    ['“', '”'],
    ['‘', '’'],
  ] as const) {
    if (v.startsWith(open) && v.endsWith(close)) {
      v = v.slice(1, -1).trim();
      break;
    }
  }
  // strip common header prefixes the user may have copied alongside the key
  v = v.replace(/^(?:Bearer|xi-api-key|x-api-key|Authorization)\s*[:=]\s*/i, '').trim();
  // strip zero-width and BOM-like chars
  v = v.replace(/[​-‏﻿]/g, '');
  // strip every internal whitespace — API keys never contain spaces
  v = v.replace(/\s+/g, '');
  return v;
}

// Surface a clean, actionable error from raw provider responses. Inputs look
// like `ElevenLabs listVoices failed (401): {"detail":{"message":"Invalid API
// key"}}` — that's noise the user can't act on. Distill to the actionable
// part.
function humanizeProviderError(providerId: ProviderId, err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? 'Validation failed.');
  // Detect status code
  const statusMatch = raw.match(/\((\d{3})\)/);
  const status = statusMatch ? Number(statusMatch[1]) : 0;
  // Try to pull a useful message out of any embedded JSON
  let detailMessage = '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const obj = JSON.parse(jsonMatch[0]) as {
        detail?: { message?: string; status?: string };
        error?: { message?: string };
        message?: string;
        base_resp?: { status_msg?: string };
      };
      detailMessage =
        obj.detail?.message ??
        obj.error?.message ??
        obj.message ??
        obj.base_resp?.status_msg ??
        '';
    } catch {
      // ignore parse errors
    }
  }
  if (status === 401 || /invalid_api_key|invalid api key|unauthorized/i.test(raw)) {
    return `Invalid ${providerId} API key — verify the value in your provider dashboard, then paste it again. (Hidden whitespace and "Bearer " prefixes are now stripped automatically.)`;
  }
  if (status === 403) {
    return `${providerId} key rejected (403) — the key is recognized but lacks permission for this endpoint. ${detailMessage}`.trim();
  }
  if (status === 404 && providerId === 'elevenlabs' && /voice_not_found/i.test(raw)) {
    return `Voice ID not found on this account. Pick a voice from the list, or paste an ID that exists in your ElevenLabs library.`;
  }
  if (status === 429) {
    return `${providerId} rate-limited (429). Wait a moment and try again. ${detailMessage}`.trim();
  }
  return detailMessage ? `${providerId} ${status || 'error'}: ${detailMessage}` : raw;
}

function requireKey(env: NodeJS.ProcessEnv, ...names: string[]): string {
  for (const name of names) {
    const value = env[name];
    if (value) return value;
  }
  throw new Error(
    `${names.join(' or ')} is not configured. Add it via the Voice Settings panel.`,
  );
}

// PCM → WAV header wrap. Gemini returns raw 16-bit signed PCM; browsers can't
// play that without a RIFF/WAV container.
function pcmToWav(pcm: Buffer, sampleRate: number, channels: number, bitsPerSample: number): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM fmt chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

// Pull a few hint labels out of MiniMax voice IDs like "Korean_AthleticGirl"
// so the UI can show language/persona without scraping descriptions.
function extractMinimaxLabels(voiceId: string): Record<string, string> {
  const m = voiceId.match(/^([A-Za-z]+)_(.+)$/);
  if (!m) return {};
  const [, lang, persona] = m;
  return {
    language: lang.toLowerCase(),
    persona: persona.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(),
  };
}

const MINIMAX_LANG_ORDER: Record<string, number> = {
  korean: 0,
  english: 1,
  japanese: 2,
  chinese: 3,
};

function minimaxVoiceCompare(a: Voice, b: Voice): number {
  if (a.category === 'cloned' && b.category !== 'cloned') return -1;
  if (b.category === 'cloned' && a.category !== 'cloned') return 1;
  const la = MINIMAX_LANG_ORDER[a.labels?.language ?? ''] ?? 99;
  const lb = MINIMAX_LANG_ORDER[b.labels?.language ?? ''] ?? 99;
  if (la !== lb) return la - lb;
  return a.name.localeCompare(b.name);
}

function pickString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

// Same as pickString but also strips paste-noise — apply to API keys.
function pickKey(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const cleaned = sanitizeApiKey(value);
  return cleaned.length === 0 ? undefined : cleaned;
}

function requestOrigin(req: Connect.IncomingMessage): string {
  const proto = (req.headers['x-forwarded-proto'] as string | undefined) ?? 'http';
  const host = req.headers.host ?? '127.0.0.1:5173';
  return `${proto}://${host}`;
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readBody(req: Connect.IncomingMessage): Promise<Uint8Array> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req: Connect.IncomingMessage): Promise<unknown> {
  const bytes = await readBody(req);
  const text = Buffer.from(bytes).toString('utf8');
  if (!text.trim()) return {};
  return JSON.parse(text);
}

async function persistVoiceEnv(
  envPath: string,
  env: NodeJS.ProcessEnv,
  values: Record<string, string | undefined>,
): Promise<void> {
  let current = '';
  try {
    current = await readFile(envPath, 'utf8');
  } catch (err) {
    if (!(err instanceof Error) || !('code' in err) || err.code !== 'ENOENT') throw err;
  }

  const trackedKeys = Object.keys(ENV_KEYS);
  const lines = current ? current.split(/\r?\n/) : [];
  const filtered = lines.filter((line) => {
    if (!line) return true;
    return !trackedKeys.some((k) => line.startsWith(`${k}=`));
  });

  const updates: string[] = [];
  for (const key of trackedKeys) {
    const value = values[key];
    if (value !== undefined) {
      // explicit value provided in request → write it, also mirror into runtime env
      updates.push(`${key}=${quoteEnv(value)}`);
      env[key] = value;
    } else if (env[key]) {
      // already set in runtime env (from an earlier session) → preserve
      updates.push(`${key}=${quoteEnv(env[key] as string)}`);
    }
    // else: leave unset — user is clearing it
  }

  const body = [
    ...filtered.filter((line, index, arr) => line || index < arr.length - 1),
    ...updates,
  ]
    .filter((line, index, arr) => line || index < arr.length - 1)
    .join('\n');

  await writeFile(envPath, `${body}\n`, 'utf8');
}

function quoteEnv(value: string): string {
  return JSON.stringify(value);
}
