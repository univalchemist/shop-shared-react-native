/* istanbul ignore file */
import { Linking } from 'react-native';

const handleIncomingUrl = () => {
  // const { url } = event;
};

const listen = () => {
  Linking.addEventListener('url', handleIncomingUrl);

  Linking.getInitialURL().then(url => {
    if (url) {
      handleIncomingUrl({ url });
    }
  });
};

const removeListener = () => {
  Linking.removeEventListener('url', handleIncomingUrl);
};

export { handleIncomingUrl, listen, removeListener };
