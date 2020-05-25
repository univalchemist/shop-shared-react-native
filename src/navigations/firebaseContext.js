import React, { createContext, useCallback, useState, useContext } from 'react';
import { bootstrap, useFirebaseRemoteConfig } from '@utils';
import FIREBASE_DEFAULT_VALUE from '@config/remoteConfigData';

bootstrap();

export const FirebaseContext = createContext({
  remoteConfig: null,
  clientId: null,
});

export const FirebaseProvider = ({ children }) => {
  const { value } = useFirebaseRemoteConfig();
  const [clientId, setClientId] = useState(null);

  const updateClientId = useCallback(clientId => {
    setClientId(clientId);
  }, []);

  let remoteConfig;

  if (clientId && value[clientId]?.value) {
    remoteConfig = JSON.parse(value[clientId]?.value);
  } else if (value?.default_config?.value) {
    remoteConfig = JSON.parse(value.default_config?.value);
  } else {
    remoteConfig = FIREBASE_DEFAULT_VALUE.default_config;
  }

  return (
    <FirebaseContext.Provider value={{ remoteConfig, updateClientId }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return useContext(FirebaseContext);
};
