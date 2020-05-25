import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import { useIntl, useTheme } from '@heal/src/wrappers/core/hooks';
import {
  ScrollView,
  Box,
  TrackedCarousel,
  PlainText,
} from '@heal/src/wrappers/components';
import { scanQRCode } from '@heal/src/store/actions';
import { DoctorCard } from '@heal/src/components';

import { iconCheckMark } from '@heal/images';

const viewportWidth = Dimensions.get('window').width;
const distanceBetweenCard = 16;
const DOCTOR_CARD_WIDTH = 190;
const DOCTOR_CARD_HEIGHT = 314;
const DOCTOR_CARD_WIDTH_WITH_MARGIN = DOCTOR_CARD_WIDTH + distanceBetweenCard;

const styles = StyleSheet.create({
  slideStyle: {
    left: -72,
    minHeight: DOCTOR_CARD_HEIGHT,
  },
  containerCustomStyle: {
    paddingBottom: 4,
  },
  bookButton: {
    height: 48,
    marginVertical: 16,
    marginHorizontal: 32,
  },
});

const SelectDoctor = ({ route, navigation, qrCodeData, scanQRCode }) => {
  const theme = useTheme();
  const intl = useIntl();

  const { clinicQrCode } = route.params;
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);

  useEffect(() => {
    const func = async () => {
      await scanQRCode(clinicQrCode);
    };
    func();
  }, []);

  return (
    <Box flex={1} as={SafeAreaView}>
      <ScrollView>
        <Box px={32} py={24}>
          <PlainText color={theme.colors.black} fontWeight={'bold'}>
            {intl.formatMessage({ id: 'heal.walkInSelectDoctor.selectTitle' })}
          </PlainText>
        </Box>
        <TrackedCarousel
          useScrollView
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          data={qrCodeData.doctors}
          sliderWidth={viewportWidth}
          itemWidth={DOCTOR_CARD_WIDTH_WITH_MARGIN}
          slideStyle={styles.slideStyle}
          containerCustomStyle={styles.containerCustomStyle}
          renderItem={({ item, index }) => {
            return (
              <DoctorCard
                doctor={item}
                showIcon={index === currentDoctorIndex}
                icon={iconCheckMark}
                width={DOCTOR_CARD_WIDTH}
                height={DOCTOR_CARD_HEIGHT}
                selected={currentDoctorIndex === index}
                onPress={() => {
                  setCurrentDoctorIndex(index);
                }}
              />
            );
          }}
        />
      </ScrollView>
      <TouchableOpacity>
        <Box
          style={styles.bookButton}
          backgroundColor={theme.colors.red}
          alignItems="center"
          justifyContent="center"
        >
          <PlainText color={theme.colors.white}>
            {intl.formatMessage({
              id: 'heal.walkInSelectDoctor.confirmButton',
            })}
          </PlainText>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const mapStateToProps = ({
  heal: {
    walkIn: { qrCodeData },
  },
}) => ({
  qrCodeData,
});

export default connect(mapStateToProps, { scanQRCode })(SelectDoctor);
