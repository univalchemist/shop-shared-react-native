import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import { PlainText, Box } from '@wrappers/components';
import { RNCamera } from 'react-native-camera';
import { Svg, Defs, Rect, Mask } from 'react-native-svg';
import styled from 'styled-components/native';
import { CHECK_IN_FORM, CHECK_IN_SELECT_MEMBER } from '@routes';
import { connect } from 'react-redux';
import { scanQRCode } from '@heal/src/store/actions';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import Spinner from 'react-native-spinkit';
import { useTheme } from '@wrappers/core/hooks';

const { width: ww } = Dimensions.get('window');
const SQUARE_LENGTH = 240;
const posX = (ww - SQUARE_LENGTH) / 2;
const posY = 180;
const LOADER_CONTAINER_LENGTH = 80;

const ScanQRCodeText = styled(PlainText)`
  position: absolute;
  color: white;
  text-align: center;
  z-index: 1;
  font-weight: bold;
  font-size: 16;
  width: 100%;
  top: ${posY - 40};
`;

export const WrappedSvg = ({ isFetching, theme }) => (
  <Box width="100%" height="100%">
    {isFetching && (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        position="absolute"
        width={LOADER_CONTAINER_LENGTH}
        height={LOADER_CONTAINER_LENGTH}
        top={posY + (SQUARE_LENGTH - LOADER_CONTAINER_LENGTH) / 2}
        left={posX + (SQUARE_LENGTH - LOADER_CONTAINER_LENGTH) / 2}
        borderRadius={10}
      >
        <Box
          flex={1}
          position="absolute"
          width="100%"
          height="100%"
          backgroundColor="black"
          borderRadius={10}
          opacity={0.4}
        />
        {Platform.OS === 'ios' ? (
          <Spinner
            isVisible={true}
            color={theme.heal.colors.crimson}
            size={36}
            type={'Arc'}
          />
        ) : (
          <ActivityIndicator size="large" color={theme.heal.colors.crimson} />
        )}
      </Box>
    )}
    <ScanQRCodeText>Scan the QR code to check-in</ScanQRCodeText>
    <Svg height="100%" width="100%">
      <Defs>
        <Mask id="mask" x="0" y="0">
          <Rect height="100%" width="100%" fill="#fff" />
          <Rect
            x={posX}
            y={posY}
            rx={8}
            ry={8}
            height={SQUARE_LENGTH}
            width={SQUARE_LENGTH}
          />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(0, 0, 0, 0.32)"
        mask="url(#mask)"
      />
      <Rect
        x={posX}
        y={posY}
        rx={8}
        ry={8}
        height="240"
        width="240"
        stroke="white"
        strokeWidth="2"
        fillOpacity={0}
      />
    </Svg>
  </Box>
);

const ScanQRCodeScreen = ({
  navigation,
  membersMap,
  change,
  scanQRCode,
  userId,
}) => {
  const theme = useTheme();
  const camera = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const cb = useCallback(
    async ({ data: qrCode }) => {
      setIsFetching(true);
      const res = await scanQRCode(qrCode);
      const hasDependents = Object.keys(membersMap).length > 1;
      if (hasDependents) navigation.navigate(CHECK_IN_SELECT_MEMBER);
      else {
        change('memberId', userId);
        navigation.navigate(CHECK_IN_FORM, { memberId: userId });
      }
      setIsFetching(false);
    },
    [scanQRCode, membersMap],
  );

  return (
    <Box flex={1}>
      <RNCamera
        ref={camera}
        onBarCodeRead={!isFetching ? cb : null}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <WrappedSvg isFetching={isFetching} theme={theme} />
      </RNCamera>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default compose(
  connect(
    state => ({
      membersMap: state.user.membersMap,
      userId: state.user.userId,
    }),
    { scanQRCode },
  ),
  reduxForm({ form: 'checkinForm' }),
)(ScanQRCodeScreen);
