import React from 'react';
import { Icon as CommonIcon } from '@cxa-rn/components';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '@config/icomoon.json';
const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);

const Icon = props => {
  const { icomoon } = props;
  const IconCom = icomoon ? IcoMoon : CommonIcon;
  return <IconCom {...props} />;
};

export default Icon;
