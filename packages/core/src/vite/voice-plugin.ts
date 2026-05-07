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
    const modelId = opts.modelId ?? 'eleven_multilingual_v2';
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
// Provider registry — extend by adding Gemini/mmx entries here.
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDERS: Record<ProviderId, VoiceProvider | undefined> = {
  elevenlabs: elevenlabsProvider,
  gemini: undefined, // Phase 2
  mmx: undefined, // Phase 2
};

const ENV_KEYS: Record<string, string | undefined> = {
  ELEVENLABS_API_KEY: undefined,
  GEMINI_API_KEY: undefined,
  MMX_API_KEY: undefined,
  VOICE_DEFAULT_PROVIDER: undefined,
  VOICE_DEFAULT_VOICE_ID_ELEVENLABS: undefined,
  VOICE_DEFAULT_VOICE_ID_GEMINI: undefined,
  VOICE_DEFAULT_VOICE_ID_MMX: undefined,
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
            });
          }

          if (url.pathname === '/api/voice/config') {
            if (req.method === 'GET') {
              return json(res, 200, {
                hasKeys: {
                  elevenlabs: Boolean(env.ELEVENLABS_API_KEY),
                  gemini: Boolean(env.GEMINI_API_KEY),
                  mmx: Boolean(env.MMX_API_KEY),
                },
                defaultProvider: env.VOICE_DEFAULT_PROVIDER ?? null,
                defaultVoiceIds: {
                  elevenlabs: env.VOICE_DEFAULT_VOICE_ID_ELEVENLABS ?? null,
                  gemini: env.VOICE_DEFAULT_VOICE_ID_GEMINI ?? null,
                  mmx: env.VOICE_DEFAULT_VOICE_ID_MMX ?? null,
                },
              });
            }
            if (req.method === 'POST') {
              const body = (await readJson(req)) as Record<string, string | undefined>;
              await persistVoiceEnv(envPath, env, {
                ELEVENLABS_API_KEY: pickString(body.elevenlabsApiKey),
                GEMINI_API_KEY: pickString(body.geminiApiKey),
                MMX_API_KEY: pickString(body.mmxApiKey),
                VOICE_DEFAULT_PROVIDER: pickString(body.defaultProvider),
                VOICE_DEFAULT_VOICE_ID_ELEVENLABS: pickString(body.elevenlabsVoiceId),
                VOICE_DEFAULT_VOICE_ID_GEMINI: pickString(body.geminiVoiceId),
                VOICE_DEFAULT_VOICE_ID_MMX: pickString(body.mmxVoiceId),
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
              body.voiceId ??
              env[`VOICE_DEFAULT_VOICE_ID_${providerId.toUpperCase()}`] ??
              '';
            if (!voiceId) {
              return json(res, 400, { error: 'No voice selected.' });
            }
            const { audio, contentType } = await provider.synthesize(env, body.text, voiceId, {
              modelId: body.modelId,
              format: body.format ?? 'mp3',
            });
            res.statusCode = 200;
            res.setHeader('content-type', contentType);
            res.setHeader('cache-control', 'no-store');
            res.end(audio);
            return;
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

function requireProvider(id: ProviderId): VoiceProvider {
  const p = PROVIDERS[id];
  if (!p) {
    throw new Error(`Voice provider "${id}" is not registered yet.`);
  }
  return p;
}

function requireKey(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (!value) {
    throw new Error(`${name} is not configured. Add it via the Voice Settings panel.`);
  }
  return value;
}

function pickString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
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
