// { "en": "...", "zh": "..." }
export type LocalizedString = Record<string, string>;

export function getLocalizedText(data: unknown, locale: string): string {
    if (typeof data === 'string') return data;
    if (!data || typeof data !== 'object') return '';

    const localized = data as LocalizedString;
    return localized[locale] || localized['en'] || localized['zh'] || '';
}
