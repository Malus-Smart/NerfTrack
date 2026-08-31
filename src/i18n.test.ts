import { describe, expect, it } from 'vitest';
import { detectLocale, formatResetReason, translate } from './i18n';

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

  it('translates routine reset reasons and preserves an English fallback', () => {
    expect(formatResetReason('zh-CN', 'scheduled_reset')).toBe('计划重置');
    expect(formatResetReason('zh-TW', 'Weekly window · reset changed')).toBe('重設已變更');
    expect(formatResetReason('zh-CN', 'unknown_reset_reason')).toBe('Unknown reset reason');
  });
});
