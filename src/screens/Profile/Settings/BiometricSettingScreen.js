import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, StyleSheet, Platform, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { Box, Text } from '@wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { useBiometrics, Storage, getBiometricDeviceType } from '@utils';
import { fetchCredentials } from '@services/secureStore';
import { BIOMETRIC_STATUS } from '@screens/Profile/constants';

const getNoteIdList = biometricType => [
  `biometricLogin.${biometricType}.note1`,
  `biometricLogin.${biometricType}.note2`,
  `biometricLogin.${biometricType}.note3`,
];

const getStyles = theme =>
  StyleSheet.create({
    borderBottom: {
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.gray[4],
    },
    dotIcon: {
      marginTop: 10,
      marginRight: 16,
      marginLeft: 2,
    },
  });

const BiometricSettingScreen = ({ clientId }) => {
  const intl = useIntl();
  const theme = useTheme();
  const styles = getStyles(theme);
  const [biometricStatus, setBiometricStatus] = useState(false);
  const { biometryType } = useBiometrics();
  const biometricDeviceType = getBiometricDeviceType();

  useEffect(() => {
    Storage.get(BIOMETRIC_STATUS).then(biometricStatus => {
      setBiometricStatus(JSON.parse(biometricStatus));
    });
  }, []);

  if (!biometryType && !biometricDeviceType) return null;

  const biometricTypeId = biometryType ? biometryType : biometricDeviceType;
  const noteIdList = getNoteIdList(biometricTypeId);

  const handleTriggerBiometric = async () => {
    if (!biometryType) {
      Alert.alert(
        null,
        intl.formatMessage({
          id: `biometricLogin.${biometricTypeId}.enableFail.noBiometric`,
        }),
        [
          {
            text: intl.formatMessage({ id: 'ok' }),
          },
        ],
      );
      return;
    }
    try {
      const { username, password } = await fetchCredentials(clientId);

      if (username && password) {
        Storage.save(BIOMETRIC_STATUS, 'true').then(() => {
          setBiometricStatus(true);
        });
      }
    } catch (error) {
      Alert.alert(
        intl.formatMessage({
          id: `biometricLogin.${biometricTypeId}.enableFail.title`,
        }),
        intl.formatMessage({
          id: 'pleaseTryAgain',
        }),
        [
          {
            text: intl.formatMessage({ id: 'tryAgain' }),
            onPress: handleTriggerBiometric,
          },
          {
            text: intl.formatMessage({ id: 'cancel' }),
          },
        ],
      );
    }
  };

  const handleEnablingBiometric = () => {
    if (Platform.OS === 'ios') {
      // ios
      Alert.alert(
        intl.formatMessage({
          id: `biometricLogin.${biometricTypeId}.enable.title`,
        }),
        intl.formatMessage({
          id: `biometricLogin.${biometricTypeId}.enable.message`,
        }),
        [
          {
            text: intl.formatMessage({ id: 'cancel' }),
            style: 'cancel',
          },
          {
            text: intl.formatMessage({ id: 'ok' }),
            onPress: handleTriggerBiometric,
          },
        ],
      );
    } else {
      // android
      handleTriggerBiometric();
    }
  };

  const handleDisableBiometric = () => {
    Storage.save(BIOMETRIC_STATUS, 'false').then(() => {
      setBiometricStatus(false);
    });
  };

  const handleDisablingBiometric = () => {
    Alert.alert(
      Platform.OS === 'android'
        ? null
        : intl.formatMessage({
            id: `biometricLogin.${biometricTypeId}.enable.title`,
          }),
      intl.formatMessage({
        id: `biometricLogin.${biometricTypeId}.disable.message`,
      }),
      [
        {
          text: intl.formatMessage({ id: 'cancel' }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({ id: 'disable' }),
          onPress: handleDisableBiometric,
        },
      ],
    );
  };

  const handleChange = value => {
    if (value) {
      handleEnablingBiometric();
    } else {
      handleDisablingBiometric();
    }
  };

  return (
    <Box flex={1} px={32} py={24}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        pb={24}
        style={styles.borderBottom}
      >
        <Text>
          {intl.formatMessage({
            id: `biometricLogin.${biometricTypeId}`,
          })}
        </Text>
        <Switch value={biometricStatus} onValueChange={handleChange} />
      </Box>
      <Box py={24}>
        <Text fontSize={14}>
          {intl.formatMessage({
            id: `biometricLogin.${biometricTypeId}.desc`,
          })}
        </Text>
        {noteIdList.map(noteId => (
          <Box pt={8} flexDirection="row" key={noteId}>
            <Icon
              name="fiber-manual-record"
              size={10}
              containerStyle={styles.dotIcon}
            />
            <Text fontSize={14}>{intl.formatMessage({ id: noteId })}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const mapStateToProps = state => ({
  clientId: state.user.clientId,
});

export default connect(mapStateToProps)(BiometricSettingScreen);
