import { en_HK as shop_en_HK, zh_HK as shop_zh_HK } from '@components/shops';
import en_HK from './en-HK.json';
import en_UK from './en-UK.json';
import id_ID from './id-ID.json';
import zh_HK from './zh-HK.json';

const messages = {
  'en-HK': { ...en_HK, ...shop_en_HK },
  'en-UK': en_UK,
  'id-ID': id_ID,
  'zh-HK': { ...zh_HK, ...shop_zh_HK },
};

export default messages;
export { en_HK, en_UK, zh_HK, id_ID };
