import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import { useIntl, useTheme } from '@heal/src/wrappers/core/hooks';
import {
  ScrollView,
  Box,
  Text,
  TrackedCarousel,
  Image,
  PlainText,
  Divider,
  ListItemWithRightChevron,
} from '@heal/src/wrappers/components';
import { iconCall, iconNavigation } from '@heal/images';
import { getDoctorsInfo } from '@heal/src/store/actions';
import { WALK_IN_SELECT_DOCTOR, WALK_IN_CHECK_IN } from '@routes';
import { DoctorCard } from '@heal/src/components';
import theme from '@theme';

const viewportWidth = Dimensions.get('window').width;
const distanceBetweenCard = 16;
const DOCTOR_CARD_WIDTH = 190;
const DOCTOR_CARD_HEIGHT = 314;
const DOCTOR_CARD_WIDTH_WITH_MARGIN = DOCTOR_CARD_WIDTH + distanceBetweenCard;
const PublicHoldayLabel = 'Public Holiday';

const styles = StyleSheet.create({
  slideStyle: {
    left: -72,
    minHeight: DOCTOR_CARD_HEIGHT,
  },
  containerCustomStyle: {
    paddingBottom: 4,
  },
  status: {
    marginTop: 4,
  },
  normalDay: {
    marginBottom: 12,
  },
  holiday: {
    marginTop: 12,
  },
  queueButton: {
    height: 48,
    marginVertical: 16,
    marginHorizontal: 32,
  },
  activeButton: {
    opacity: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

const MarginBox = ({ children, flexDirection }) => {
  return (
    <Box px={32} py={24} flexDirection={flexDirection}>
      {children}
    </Box>
  );
};

const DayText = ({ style, title, value, isHoliday }) => {
  const defaultStyle = isHoliday ? styles.holiday : styles.normalDay;
  return (
    <Box
      minHeight={22}
      style={{ ...defaultStyle, ...style }}
      flexDirection="row"
    >
      <Box flex={3}>
        <PlainText>{title}</PlainText>
      </Box>
      <Box flex={7}>
        <PlainText color={theme.colors.gray[0]}>{value}</PlainText>
      </Box>
    </Box>
  );
};

const ClinicDetails = ({
  route,
  navigation,
  detailsClinic,
  getDoctorsInfo,
  platform,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  const { clinic } = route.params;
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [dayValues, setDayValues] = useState([]);

  useEffect(() => {
    const func = async () => {
      await getDoctorsInfo(clinic);
    };
    func();
  }, []);

  useEffect(() => {
    if (detailsClinic.openingHours) {
      setDayValues(parseDayStringToArray(detailsClinic.openingHours));
    }
  }, []);

  const parseDayStringToArray = dayString => {
    const rawArray = dayString.trim().split('\n');
    const resultArray = [];

    for (let i = 0; i < rawArray.length; i += 1) {
      if (rawArray[i] !== '') {
        const value = rawArray[i].split(': ');
        const dayValue = value[1]
          .replace(
            '00:00-00:00, 00:00-00:00',
            intl.formatMessage({ id: 'clinic.closed' }),
          )
          .replace('00:00-00:00', intl.formatMessage({ id: 'clinic.closed' }));
        const dayLabel = value[0];
        resultArray.push({ label: dayLabel, value: dayValue });
      }
    }

    return resultArray;
  };

  return (
    <Box flex={1} as={SafeAreaView}>
      <ScrollView>
        <MarginBox>
          <PlainText color={theme.colors.gray[0]}>
            {detailsClinic.name}
          </PlainText>
        </MarginBox>
        <MarginBox>
          <PlainText>{intl.formatMessage({ id: 'clinic.doctors' })}</PlainText>
        </MarginBox>
        <TrackedCarousel
          useScrollView
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          data={detailsClinic.doctors}
          sliderWidth={viewportWidth}
          itemWidth={DOCTOR_CARD_WIDTH_WITH_MARGIN}
          slideStyle={styles.slideStyle}
          containerCustomStyle={styles.containerCustomStyle}
          renderItem={({ item, index }) => {
            return (
              <DoctorCard
                doctor={item}
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
        <MarginBox>
          <PlainText color={theme.colors.gray[1]}>
            {intl.formatMessage({ id: 'clinic.clinicStatus' })}
          </PlainText>
          <PlainText style={styles.status} color={theme.colors.gray[0]}>
            {detailsClinic.doctors &&
            detailsClinic.doctors[currentDoctorIndex].isOpen
              ? intl.formatMessage({ id: 'clinic.open' })
              : intl.formatMessage({ id: 'clinic.closed' })}
          </PlainText>
        </MarginBox>
        <Divider />
        <MarginBox>
          {dayValues.map(dayValue => {
            return (
              <DayText
                title={
                  dayValue.label
                    ? intl.formatMessage({
                        id: `clinic.openingHours.${dayValue.label}`,
                      })
                    : ''
                }
                value={dayValue.value}
                isHoliday={dayValue.label === PublicHoldayLabel}
              />
            );
          })}
        </MarginBox>
        <Divider />
        {detailsClinic && detailsClinic.phoneNumber ? (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${detailsClinic.phoneNumber}`);
            }}
          >
            <ListItemWithRightChevron testID={'telephone'}>
              <Box flexDirection="row" alignItems="center">
                <Image source={iconCall} />
                <PlainText ml={16} color={theme.colors.gray[1]}>
                  {detailsClinic.phoneNumber}
                </PlainText>
              </Box>
            </ListItemWithRightChevron>
          </TouchableOpacity>
        ) : null}
        {detailsClinic.address ? (
          <TouchableOpacity
            onPress={() => {
              const scheme = Platform.select({
                ios: 'maps:0,0?q=',
                android: 'geo:0,0?q=',
              });
              const latLng = `${detailsClinic.latitude},${detailsClinic.longitude}`;
              let url = Platform.select({
                ios: `${scheme}${detailsClinic.name}@${latLng}`,
                android: `${scheme}${latLng}(${detailsClinic.name})`,
              });

              if (platform) {
                url =
                  platform === 'android'
                    ? `${scheme}${latLng}(${detailsClinic.name})`
                    : `${scheme}${detailsClinic.name}@${latLng}`;
              }

              Linking.openURL(url);
            }}
          >
            <ListItemWithRightChevron testID={'navigation'}>
              <Box flexDirection="row" alignItems="center">
                <Image source={iconNavigation} />
                <PlainText ml={16} mr={16} color={theme.colors.gray[1]}>
                  {detailsClinic.address}
                </PlainText>
              </Box>
            </ListItemWithRightChevron>
          </TouchableOpacity>
        ) : null}
        <Box height={20} />
      </ScrollView>
      <TouchableOpacity
        disabled={
          detailsClinic.doctors &&
          !detailsClinic.doctors[currentDoctorIndex].isOpen
        }
        style={
          detailsClinic.doctors &&
          detailsClinic.doctors[currentDoctorIndex].isOpen
            ? styles.activeButton
            : styles.disabledButton
        }
        onPress={() => {
          // navigation.navigate(WALK_IN_CHECK_IN, {
          //   clinicQrCode: clinic.qrCode,
          // });
          // navigation.navigate(WALK_IN_SELECT_DOCTOR, {
          //   clinicQrCode: clinic.qrCode,
          // });
        }}
      >
        <Box
          style={styles.queueButton}
          backgroundColor={theme.colors.red}
          alignItems="center"
          justifyContent="center"
        >
          <PlainText color={theme.colors.white}>
            {intl.formatMessage({ id: 'clinic.queueButton' })}
          </PlainText>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const mapStateToProps = ({ heal: { detailsClinic } }) => ({
  detailsClinic,
});

export default connect(mapStateToProps, { getDoctorsInfo })(ClinicDetails);
