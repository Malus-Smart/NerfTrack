import { describe, expect, it } from 'vitest';
import { detectLocale, formatDateTime, translate } from './i18n';

describe('internationalization', () => {
  it('maps supported system languages to the matching interface locale', () => {
    expect(detectLocale(['zh-Hant-HK'])).toBe('zh-TW');
    expect(detectLocale(['zh-CN'])).toBe('zh-CN');
    expect(detectLocale(['en-GB'])).toBe('en-US');
  });

  it('uses the first supported language and falls back to English', () => {
    expect(detectLocale(['fr-FR', 'zh-TW'])).toBe('zh-TW');
    expect(detectLocale(['fr-FR'])).toBe('en-US');
  });

  it('translates interface text and interpolates values', () => {
    expect(translate('zh-CN', 'nav.settings')).toBe('设置');
    expect(translate('zh-TW', 'common.version', { version: '1.1.4' })).toBe('版本 1.1.4');
  });

  it('formats dates with the selected interface locale', () => {
    const timestamp = Date.UTC(2026, 7, 31, 10, 30);
    expect(
      formatDateTime('zh-CN', timestamp, {
        timeZone: 'UTC',
        month: 'short',
        day: 'numeric',
      }),
    ).toContain('8月31日');
  });
});
