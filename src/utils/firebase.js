import { useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

const FIREBASE_CACHE_TIME = 0;

export async function bootstrap() {
  await remoteConfig().setConfigSettings({
    isDeveloperModeEnabled: __DEV__,
  });
}

export function useFirebaseRemoteConfig() {
  const [state, setState] = useState({
    isFetching: true,
  });

  useEffect(() => {
    const checkUpdateShopConfig = async () => {
      try {
        await remoteConfig().fetch(FIREBASE_CACHE_TIME);
        await remoteConfig().fetchAndActivate();
      } catch (e) {
        console.log(e);
      } finally {
        const value = await remoteConfig().getAll();
        setState(prev => ({
          ...prev,
          isFetching: false,
          value: { ...value },
        }));
      }
    };

    checkUpdateShopConfig();
  }, []);

  return state;
}
