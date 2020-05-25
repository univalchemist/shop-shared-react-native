import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import WebView from 'react-native-webview';
import Config from 'react-native-config';
import { setRefs } from '@wrappers/core/utils';

export const doLoginScript = (username, password) => `
  setTimeout(function() {
    doLogin(
      "${username}",
      "${password}",
      function(err) {
        if(err) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LoginError', error: err }));
        }
      }
    );
  });
  true;
`;

const BackgroundSSOLoginWebView = forwardRef(
  ({ accountInfo, onLogin }, ref) => {
    const loginUrl = Config.SHOP_AUTHORIZE_LOGIN_URI;
    const webViewRef = useRef(ref);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (loaded && accountInfo && onLogin) {
        onLogin();
      }
    }, [loaded, accountInfo, onLogin]);

    useImperativeHandle(ref, () => ({
      login: ({ username, password }) => {
        webViewRef.current.injectJavaScript(doLoginScript(username, password));
      },
    }));

    return (
      <WebView
        ref={setRefs(webViewRef, ref)}
        height={0}
        source={{ uri: loginUrl }}
        originWhitelist={['*']}
        onLoad={() => setLoaded(true)}
      />
    );
  },
);

export default BackgroundSSOLoginWebView;
