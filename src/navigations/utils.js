import React from 'react';
import { HEALTH, CLAIMS, SHOP, PROFILE } from '@routes';
import { Box, Icon, HeaderButton, ModalBackButton } from '@wrappers/components';
import { ProfilePdfHeader } from '@screens/Profile';
import { showConfirmation } from '@utils';
import { Platform } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';

const iconMaps = {
  [HEALTH]: 'ic-health',
  [CLAIMS]: 'ic-doctors',
  [SHOP]: 'ic-shop',
  [PROFILE]: 'ic-profile',
};

export const getTabBarIcon = (routeName, tintColor) => {
  const iconName = iconMaps[routeName] || 'favorite';

  return (
    <Box>
      <Icon icomoon size={24} name={iconName} color={tintColor} />
    </Box>
  );
};

export const truncate = (str = '', n) => {
  return str.length > n ? str.substr(0, n) + '...' : str;
};

export const getDocumentViewerModalOptions = (route, navigation, intl) => {
  if (route.params) {
    const onRemove = route.params?.onRemove;
    const allowShare = route.params?.allowShare || false;
    const uri = route.params?.uri;
    return {
      ...TransitionPresets.ModalTransition,
      headerBackImage: ModalBackButton,
      headerRight: () => {
        return onRemove ? (
          <HeaderButton
            icon="delete"
            onPress={() => {
              const isIOS = Platform.OS === 'ios';
              showConfirmation({
                title: isIOS
                  ? undefined
                  : intl.formatMessage({
                      id: 'documentViewer.deletePhotoTitle',
                    }),
                message: isIOS
                  ? undefined
                  : intl.formatMessage({
                      id: 'documentViewer.deletePhotoConfirmation',
                    }),
                actionTitle: intl.formatMessage({
                  id: `documentViewer.deletePhoto.${isIOS ? 'ios' : 'android'}`,
                }),
                cancelTitle: intl.formatMessage({
                  id: 'cancel',
                }),
                destructive: true,
                onAction: () => {
                  onRemove();
                  navigation.goBack();
                },
              });
            }}
          />
        ) : allowShare ? (
          <ProfilePdfHeader uri={uri} />
        ) : null;
      },
    };
  }

  return {
    ...TransitionPresets.ModalTransition,
  };
};
