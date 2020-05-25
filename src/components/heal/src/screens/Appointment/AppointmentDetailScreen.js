import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Image, Box, PlainText, Button } from '@heal/src/wrappers/components';
import {
  detailAppointment,
  detailLocation,
  appointmentCalendar,
} from '@heal/images';
import { useTheme, useIntl } from '@heal/src/wrappers/core/hooks';
import { APPOINTMENT_CONFIRMATION } from '../../../routes';
import moment from 'moment';
import { connect } from 'react-redux';
import { acceptAppointment } from '@heal/src/store/actions';

const AppointmentDetailScreen = ({ navigation, route, acceptAppointment }) => {
  const theme = useTheme();
  const intl = useIntl();
  const { data } = route.params || '';
  const headText = data && Object.keys(data)[0];
  const {
    firstPreferredTime,
    doctor,
    clinic,
    firstSession,
    secondPreferredTime,
    secondSession,
    thirdPreferredTime,
    thirdSession,
  } = data && data[headText];
  const defaultDateFormat = 'DD MMM YYYY';

  if (!data) {
    return <Box />;
  }

  return (
    <Box flex={1} as={SafeAreaView} backgroundColor={theme.colors.white}>
      {doctor && (
        <Box flex={1} backgroundColor={theme.colors.gray[7]}>
          <ScrollView>
            <Box px={4} mb={80}>
              <Box mt={24}>
                <PlainText color={theme.colors.gray[0]}>
                  {intl.formatMessage({
                    id: 'appointmentDetailScreen.headText',
                  })}
                </PlainText>
              </Box>
              <Box mt={40} backgroundColor={theme.colors.white} pb={40}>
                <Box pt={44} mb={16}>
                  <PlainText
                    fontWeight={'bold'}
                    textAlign={'center'}
                    color={theme.colors.black}
                  >
                    {headText}
                  </PlainText>
                </Box>
                {headText !== 'Pending confirmation' && (
                  <Box>
                    <Box alignItems={'center'} justifyContent={'center'}>
                      <PlainText
                        fontSize={32}
                        color={theme.colors.gray[0]}
                        lineHeight={37}
                        fontWeight={300}
                        letterSpacing={-1.5}
                      >
                        {moment(firstPreferredTime).format('LT')}
                      </PlainText>
                    </Box>
                    <Box alignItems={'center'} mt={8}>
                      <PlainText
                        fontSize={12}
                        lineHeight={16}
                        color={theme.colors.gray[8]}
                        letterSpacing={0.4}
                      >
                        {moment(firstPreferredTime).format(defaultDateFormat)}
                      </PlainText>
                    </Box>
                  </Box>
                )}
                <Box flexDirection={'row'} paddingLeft={24} pt={20}>
                  <Box pr={16} justifyContent={'center'}>
                    <Image source={detailAppointment} />
                  </Box>
                  <Box>
                    <PlainText
                      fontSize={14}
                      lineHeight={20}
                      letterSpacing={0.25}
                      color={theme.colors.gray[8]}
                    >
                      {intl.formatMessage({ id: 'appointment.doctorPrefix' }) +
                        doctor.name}
                    </PlainText>
                    <PlainText
                      fontSize={14}
                      lineHeight={20}
                      letterSpacing={0.25}
                      color={theme.colors.gray[8]}
                    >
                      {intl.formatMessage({
                        id: `speciality.name.${doctor.specialityCode}`,
                      })}
                    </PlainText>
                  </Box>
                </Box>
                <Box flexDirection={'row'} paddingLeft={24} pt={20}>
                  <Box pr={16} justifyContent={'center'}>
                    <Image source={detailLocation} />
                  </Box>
                  <Box width={'60%'}>
                    <PlainText
                      fontSize={14}
                      lineHeight={20}
                      letterSpacing={0.25}
                      color={theme.colors.gray[8]}
                    >
                      {clinic.address}
                    </PlainText>
                  </Box>
                </Box>
                {headText === 'Pending confirmation' && (
                  <Box flexDirection={'row'} paddingLeft={24} pt={20}>
                    <Box pr={16} justifyContent={'center'}>
                      <Image
                        source={appointmentCalendar}
                        style={{ tintColor: theme.colors.gray[0] }}
                      />
                    </Box>
                    <Box width={'60%'}>
                      <PlainText
                        fontSize={14}
                        lineHeight={20}
                        letterSpacing={0.25}
                        color={theme.colors.gray[8]}
                      >
                        {moment(firstPreferredTime).format(defaultDateFormat) +
                          ', ' +
                          firstSession}
                      </PlainText>
                      {secondPreferredTime && (
                        <PlainText
                          fontSize={14}
                          lineHeight={20}
                          letterSpacing={0.25}
                          color={theme.colors.gray[8]}
                        >
                          {moment(secondPreferredTime).format(
                            defaultDateFormat,
                          ) +
                            ', ' +
                            secondSession}
                        </PlainText>
                      )}
                      {thirdPreferredTime && (
                        <PlainText
                          fontSize={14}
                          lineHeight={20}
                          letterSpacing={0.25}
                          color={theme.colors.gray[8]}
                        >
                          {moment(thirdPreferredTime).format(
                            defaultDateFormat,
                          ) +
                            ', ' +
                            thirdSession}
                        </PlainText>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </ScrollView>
          {headText !== 'Pending confirmation' && headText !== 'Upcoming' && (
            <Box
              pt={16}
              px={4}
              bottom={0}
              position={'absolute'}
              flexDirection={'row'}
              backgroundColor={theme.colors.white}
              width={'100%'}
              pb={16}
            >
              <Button
                secondary
                title={intl.formatMessage({
                  id: 'appointmentDetailScreen.rejectBtnText',
                })}
                onPress={() =>
                  navigation.navigate(APPOINTMENT_CONFIRMATION, {
                    id: data[headText].id,
                    type: 'reject',
                  })
                }
                buttonStyle={styles.btnStyle}
              />
              <Button
                primary
                onPress={() => {
                  acceptAppointment(true, data[headText].id);
                  navigation.navigate(APPOINTMENT_CONFIRMATION, {
                    id: data[headText].id,
                    data: data,
                  });
                }}
                buttonStyle={styles.btnStyle}
                title={intl.formatMessage({
                  id: 'appointmentDetailScreen.acceptBtnText',
                })}
              />
            </Box>
          )}
          {headText === 'Upcoming' && (
            <Box
              pt={16}
              px={4}
              bottom={0}
              position={'absolute'}
              backgroundColor={theme.colors.white}
              width={'100%'}
              pb={16}
            >
              <Button
                primary
                title={intl.formatMessage({
                  id: 'appointmentDetailScreen.upComingBtnText',
                })}
                onPress={() =>
                  navigation.navigate(APPOINTMENT_CONFIRMATION, {
                    id: data[headText].id,
                    type: 'upcomingReject',
                  })
                }
                buttonStyle={[styles.btnStyle, { width: '100%' }]}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  btnStyle: { width: '88%', borderRadius: 0 },
});

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  acceptAppointment,
})(AppointmentDetailScreen);
