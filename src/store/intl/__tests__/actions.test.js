import * as actions from '../actions';
import { SET_LOCALE } from '../types';
import { configureMockStore } from '@testUtils';
import messages from '@messages/zh-HK.json';
import heal_zh_messages from '@heal/messages/zh-HK';
import heal_en_messages from '@heal/messages/en-HK';
import { DEFAULT_LOCALE } from '@config/locale';
import { en_HK as shop_en_messages } from '@components/shops';
import { zh_HK as shop_zh_messages } from '@components/shops';

import MESSAGES from '../../../../messages';

const momentLocaleMap = {
  'en-HK': 'en-gb',
  'en-UK': 'en-gb',
  'zh-HK': 'zh-hk',
  'id-ID': 'id',
};

it('set intl messages correctly', async () => {
  const expected = {
    type: SET_LOCALE,
    payload: {
      locale: 'zh-HK',
      intlLocale: 'zh-Hant-HK',
      momentLocale: 'zh-hk',
      messages: { ...messages, ...heal_zh_messages, ...shop_zh_messages },
      setLocaleCompleted: true,
    },
  };
  const store = configureMockStore()();
  await store.dispatch(actions.setLocale('zh-HK', true));
  expect(store.getActions()).toEqual([expected]);
});

it('set intl messages correctly to default', async () => {
  const expected = {
    type: SET_LOCALE,
    payload: {
      locale: 'en-US',
      intlLocale: DEFAULT_LOCALE,
      momentLocale: momentLocaleMap[DEFAULT_LOCALE],
      messages: {
        ...MESSAGES[DEFAULT_LOCALE],
        ...heal_en_messages,
        ...shop_en_messages,
      },
      setLocaleCompleted: true,
    },
  };
  const store = configureMockStore()();
  await store.dispatch(actions.setLocale('en-US', true));
  expect(store.getActions()).toEqual([expected]);
});
