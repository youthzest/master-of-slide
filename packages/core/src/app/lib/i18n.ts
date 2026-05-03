const LANGUAGE_TAG_RE = /^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/;

export const DEFAULT_DOCUMENT_LANG = 'en';

export function normalizeDocumentLang(lang: unknown): string {
  if (typeof lang !== 'string') return DEFAULT_DOCUMENT_LANG;
  const trimmed = lang.trim();
  if (!LANGUAGE_TAG_RE.test(trimmed)) return DEFAULT_DOCUMENT_LANG;
  return trimmed;
}

export function isKoreanLang(lang: unknown): boolean {
  return normalizeDocumentLang(lang).toLowerCase().startsWith('ko');
}
