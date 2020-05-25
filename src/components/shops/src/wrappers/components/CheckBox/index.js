import React from 'react';
import { Image } from 'react-native';
import { CheckBox as RNCheckBox } from 'react-native-elements';

import { checkboxActive, checkboxInactive } from '@shops/assets/icons';

const CheckBox = props => {
  return (
    <RNCheckBox
      checkedIcon={<Image source={checkboxActive} />}
      uncheckedIcon={<Image source={checkboxInactive} />}
      {...props}
    />
  );
};

export default CheckBox;
