import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Image,
  Text,
  PlainText,
  TrackedCarousel,
  Box,
  Button,
  Divider,
  Icon,
} from '@heal/src/wrappers/components';
import { getDoctor } from '@heal/src/store/actions';
import { useIntl, useTheme } from '@heal/src/wrappers/core/hooks';
import { doctorBanner, chevronDown, chevronUp } from '@heal/images';
import { phoneIcon, chevronRightArrow } from '@images';
import theme from '@theme';
import { isIphoneX } from '@utils';
import {
  scheduleMapping,
  sortSchedule,
  MOMENT_INVALID_DATE,
} from '@heal/src/utils/schedule';
import moment from 'moment';
import { HEAL_SELECT_FAMILY_MEMBER } from '@routes';

const { width: ww } = Dimensions.get('window');
const bannerHeight = (ww * 78) / 125;
const CLINIC_CARD_HEIGHT = 110;
const CLINIC_CARD_WIDTH = 284;
const MARGIN_BETWEEN_CARDS = 16;

const styles = StyleSheet.create({
  slide: {
    left: CLINIC_CARD_WIDTH / 2 + 32 - ww / 2,
  },
  banner: {
    position: 'absolute',
    width: '100%',
    height: bannerHeight,
  },
  scroll: {
    marginBottom: 120,
    backgroundColor: theme.colors.backgroundColor,
  },
  favouriteContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  header: {
    marginTop: bannerHeight - 100,
    backgroundColor: 'white',
    marginHorizontal: 32,
    paddingHorizontal: 24,
    paddingVertical: 44,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowColor: 'rgb(0, 0, 0)',
  },
  card: {
    backgroundColor: theme.colors.white,
    paddingVertical: 16,
    paddingHorizontal: 28,
    flexDirection: 'row',
    marginRight: MARGIN_BETWEEN_CARDS,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderColor: 'transparent',
    height: CLINIC_CARD_HEIGHT,
  },
  cardSelected: {
    backgroundColor: theme.colors.white,
    height: CLINIC_CARD_HEIGHT,
    paddingVertical: 16,
    paddingHorizontal: 28,
    flexDirection: 'row',
    marginRight: MARGIN_BETWEEN_CARDS,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderColor: theme.heal.colors.ming,
  },
});

export const ClinicCard = ({ data, selectedClinic, index, onPress }) => {
  return (
    <Box height={CLINIC_CARD_HEIGHT + 8}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress(index)}
        style={selectedClinic === index ? styles.cardSelected : styles.card}
      >
        <Box flex={1}>
          <PlainText
            numberOfLines={1}
            fontSize={18}
            color={theme.colors.black}
            mb={1}
          >
            {data.name}
          </PlainText>
          <Box flexDirection="row" flex={1}>
            <Box mt={1}>
              <Icon name="location-on" size={16} color="#767676" />
            </Box>
            <PlainText
              numberOfLines={2}
              fontSize={14}
              letterSpacing={0.25}
              ml={1}
              style={{ flex: 1 }}
            >
              {data.address}
            </PlainText>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const viewportWidth = Dimensions.get('window').width;

const ClinicCarousel = React.memo(({ clinics }) => {
  const [selectedClinic, setSelectedClinic] = useState(0);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const { openingHours } = clinics[selectedClinic];
    if (!openingHours) return;

    const byDay = openingHours.split(/\r\n|\r|\n|↵/).filter(d => d.length > 0);
    let result = [];
    for (let i = 0; i < byDay.length; i++) {
      const regex = /([a-zA-Z]+[\s]*[a-zA-Z]*)|[,:\s]+([\s0-9:-]+)/g;
      const match = byDay[i]
        .match(regex)
        .filter(m => m.trim().length > 0)
        .map(m => m.trim().replace(/^[,:\s]+/, ''));
      result.push(match);
    }

    setSchedule(sortSchedule(result));
  }, [clinics, selectedClinic]);

  return (
    <>
      <Box>
        <PlainText mb={24} ml={32}>
          Clinics
        </PlainText>
        <TrackedCarousel
          useScrollView={true}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          data={clinics}
          sliderWidth={viewportWidth}
          itemWidth={CLINIC_CARD_WIDTH}
          slideStyle={styles.slide}
          renderItem={({ item, index }) => (
            <ClinicCard
              data={item}
              index={index}
              selectedClinic={selectedClinic}
              onPress={() => setSelectedClinic(index)}
            />
          )}
        />
      </Box>
      <Box flex={1} px={32} mb={24} mt={24}>
        {schedule &&
          schedule.map((s, index) => {
            let weekday = moment(s[0], 'ddd').format('dddd');
            if (weekday.includes(MOMENT_INVALID_DATE)) weekday = s[0];
            return (
              <Box flexDirection={'row'} py={12} key={index}>
                <PlainText width={100} numberOfLines={2}>
                  {weekday}
                </PlainText>
                <PlainText color={theme.colors.black} style={{ flex: 1 }}>
                  {scheduleMapping(s[1], s[2])}
                </PlainText>
              </Box>
            );
          })}
      </Box>

      {clinics[selectedClinic].phoneNumber && (
        <>
          <Divider />
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${clinics[selectedClinic].phoneNumber}`);
            }}
          >
            <Box
              py={24}
              mx={32}
              flexDirection="row"
              flex={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row">
                <Image source={phoneIcon} mr={16} />
                <PlainText>{clinics[selectedClinic].phoneNumber}</PlainText>
              </Box>
              <Image source={chevronRightArrow} />
            </Box>
          </TouchableOpacity>
          <Divider />
        </>
      )}
    </>
  );
});

const Header = ({ doctor }) => {
  const theme = useTheme();
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);

  return (
    <Box flex={1} backgroundColor={theme.backgroundColor.default}>
      <Image style={styles.banner} source={doctorBanner} />
      <TouchableOpacity
        onPress={() => {
          setExpanded(!expanded);
        }}
        activeOpacity={1}
        style={styles.header}
      >
        <View alignItems="center">
          <PlainText
            fontSize={21}
            color={theme.colors.black}
            textAlign="center"
            numberOfLines={2}
          >
            {doctor.name}
          </PlainText>
          <PlainText
            color={theme.heal.colors.gray[0]}
            mt={1}
            numberOfLines={2}
            textAlign="center"
          >
            {intl.formatMessage({
              id: `speciality.name.${doctor.specialityCode}`,
            })}
          </PlainText>
          <Box flexDirection="row" alignItems="center" mt={8}>
            <Box
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor={
                doctor.isActive ? theme.heal.colors.teal : theme.colors.error[3]
              }
            />
            <Text
              color={
                doctor.isActive ? theme.heal.colors.teal : theme.colors.error[3]
              }
              ml={8}
            >
              {doctor.isActive
                ? intl.formatMessage({ id: 'available' })
                : intl.formatMessage({ id: 'unavailable' })}
            </Text>
          </Box>
        </View>
        {!!doctor.introduction && (
          <Box flexDirection="row" marginTop={32}>
            <Box width="90%">
              <Text numberOfLines={expanded ? 0 : 3}>
                {doctor.introduction}
              </Text>
            </Box>
            <Box width="10%" mt={2} alignItems="flex-end">
              <Image
                testID={'expand'}
                source={expanded ? chevronUp : chevronDown}
                width={12}
                height={8}
              />
            </Box>
          </Box>
        )}
      </TouchableOpacity>
    </Box>
  );
};

const DoctorDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const intl = useIntl();
  const doctor = route.params.doctor;

  return (
    <Box flex={1} backgroundColor={theme.colors.backgroundColor}>
      <ScrollView style={styles.scroll}>
        <Header doctor={doctor} />
        <Box height={58} />
        <ClinicCarousel clinics={doctor.clinics} />
      </ScrollView>
      <Box
        backgroundColor="white"
        position="absolute"
        bottom={0}
        width="100%"
        paddingBottom={isIphoneX ? 44 : 0}
        borderTopWidth={1}
        borderTopColor={theme.colors.gray[10]}
        paddingHorizontal={32}
        paddingVertical={16}
      >
        <Button
          primary
          title={intl.formatMessage({ id: 'doctor.bookAppointment' })}
          onPress={() => {
            navigation.navigate(HEAL_SELECT_FAMILY_MEMBER, { doctor: doctor });
          }}
        />
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ intl: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps, { getDoctor })(DoctorDetailScreen);
