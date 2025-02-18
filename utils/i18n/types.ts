export type Language = 'en' | 'ja' | 'ko' | 'zh' | 'th' | 'vi';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
}

export const languages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
];

export const defaultLanguage: Language = 'en';

export type Translations = Record<string, string>; 