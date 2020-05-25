## Config

In your parent project, if you want to use Shop module, please follow below steps:

1. Config locale: open `messages/index.js`

```
import { en_HK as shop_en_HK, zh_HK as shop_zh_HK } from '@components/shops';

const messages = {
  'en-HK': { ...en_HK, ...shop_en_HK },
  'en-UK': en_UK,
  'id-ID': id_ID,
  'zh-HK': { ...zh_HK, ...shop_zh_HK },
};
```

2. Config reducer: open `store/reducers.js`

```
import shop from '@components/shops/src/store/reducers';

const appReducer = combineReducers({
  ...
  shop,
});
```

3. Config theme: open `theme.js`

```
import shopTheme from '@components/shops/src/theme.js';

const theme = {
  ...
  shop: shopTheme,
};
```

**Note**: You can override shopTheme if you want

4. Config `jsconfig.json`

Add new paths:

```
"@shops": ["./src/components/shops/src"],
"@shops/*": ["./src/components/shops/src/*"]
```

5. Config `babel.config.js`

Add new alias

```
'@shops': ['./src/components/shops/src'],
```

## Dependencies

Add these libs into your parent project

- react-native-modal-dropdown
- react-native-collapsible
- @ptomasroos/react-native-multi-slider
- lodash
- reselect
