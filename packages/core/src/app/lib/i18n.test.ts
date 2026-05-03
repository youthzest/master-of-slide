import { describe, expect, it } from 'vitest';
import { isKoreanLang, normalizeDocumentLang } from './i18n.ts';

describe('normalizeDocumentLang', () => {
  it('keeps valid BCP 47-style language tags', () => {
    expect(normalizeDocumentLang('ko')).toBe('ko');
    expect(normalizeDocumentLang('ko-KR')).toBe('ko-KR');
    expect(normalizeDocumentLang('en-US')).toBe('en-US');
  });

  it('falls back to English for invalid input', () => {
    expect(normalizeDocumentLang(undefined)).toBe('en');
    expect(normalizeDocumentLang('')).toBe('en');
    expect(normalizeDocumentLang('ko"><script>')).toBe('en');
  });
});

describe('isKoreanLang', () => {
  it('detects Korean primary language tags', () => {
    expect(isKoreanLang('ko')).toBe(true);
    expect(isKoreanLang('ko-KR')).toBe(true);
    expect(isKoreanLang('en')).toBe(false);
  });
});
