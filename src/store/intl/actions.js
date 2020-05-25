import { addLocaleData } from 'react-intl';
import * as localeData from 'react-intl/locale-data/';
import { compose, values, find } from 'ramda';
import moment from 'moment/min/moment-with-locales';
import { Storage } from '@utils';
import { DEFAULT_LOCALE } from '@config/locale';
import MESSAGES from '../../../messages';
import HEAL_MESSAGES from '@heal/messages';
import { SET_LOCALE } from './types';

const momentLocaleMap = {
  'en-HK': 'en-gb',
  'en-UK': 'en-gb',
  'zh-HK': 'zh-hk',
  'id-ID': 'id',
};

const intlLocaleMap = {
  'en-HK': 'en-HK',
  'en-UK': 'en-UK',
  'zh-HK': 'zh-Hant-HK',
  'id-ID': 'id',
};

export const setLocale = (locale, setLocaleCompleted) => async dispatch => {
  const intlLocale = intlLocaleMap[locale] ?? DEFAULT_LOCALE;
  const momentLocale =
    momentLocaleMap[locale] ?? momentLocaleMap[DEFAULT_LOCALE];
  let messages = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
  if (HEAL_MESSAGES) {
    const healMessages = HEAL_MESSAGES[locale] ?? HEAL_MESSAGES[DEFAULT_LOCALE];
    messages = { ...messages, ...healMessages };
  }
  const languageLocale = locale.substr(0, 2);
  const languageOption = compose(
    find(({ locale }) => locale === languageLocale),
    values,
  )(localeData);

  addLocaleData(languageOption);
  moment.locale(momentLocale);

  await Storage.save('preferredLocale', locale);

  dispatch({
    type: SET_LOCALE,
    payload: {
      locale,
      momentLocale,
      intlLocale,
      messages,
      setLocaleCompleted,
    },
  });
};
