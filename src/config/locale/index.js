import { englishIcon, chineseIcon, bahasaIcon } from '@images/languages';

export const DEFAULT_LANGUAGE = 'English (Hong Kong)';
export const DEFAULT_LOCALE = 'en-HK';
export const MOMENT_LOCALE = 'en-gb';
export const DEFAULT_CURRENCY = 'HKD';
export const SUPPORTED_LANGUAGES = [
  {
    label: DEFAULT_LANGUAGE,
    locale: DEFAULT_LOCALE,
  },
  { label: '中文 (繁體)', locale: 'zh-HK' },
];

export const localeIconMap = {
  'en-HK': englishIcon,
  'en-UK': englishIcon,
  'zh-HK': chineseIcon,
  'id-ID': bahasaIcon,
};

export const localeMapping = {
  EN_HK: 'en-HK',
  EN_UK: 'en-UK',
  ZH_HK: 'zh-HK',
  ID_ID: 'id-ID',
};
