import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Image, Box, PlainText, Button } from '@heal/src/wrappers/components';
import { detailAppointment, detailLocation, successImage } from '@heal/images';
import { useTheme, useIntl } from '@heal/src/wrappers/core/hooks';
import { DOCTOR_LANDING } from '@routes';
import moment from 'moment';

const ThankYouScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const intl = useIntl();
  const { data } = route.params;
  const headText = data && Object.keys(data)[0];
  const { firstPreferredTime, doctor, clinic } = data && data[headText];
  const defaultDateFormat = 'DD MMM YYYY';

  return (
    <Box flex={1} backgroundColor={theme.colors.white} as={SafeAreaView}>
      <ScrollView>
        <Box px={4}>
          <Box mt={20}>
            <PlainText
              color={theme.colors.gray[0]}
              fontWeight={300}
              fontSize={32}
              lineHeight={37}
              textAlign={'center'}
              letterSpacing={-1.5}
            >
              {intl.formatMessage({
                id: 'thankYouScreen.headText',
              })}
            </PlainText>
          </Box>
          <Box mt={24} mb={24} alignItems={'center'}>
            <Image source={successImage} />
          </Box>
          <Box>
            <Box mb={46}>
              <PlainText
                color={theme.colors.gray[8]}
                fontSize={14}
                lineHeight={20}
                textAlign={'center'}
                letterSpacing={0.25}
              >
                {intl.formatMessage(
                  { id: 'thankYouScreen.timeText' },
                  {
                    time: moment(firstPreferredTime).format('LT'),
                    date: moment(firstPreferredTime).format(defaultDateFormat),
                  },
                )}
              </PlainText>
            </Box>
            <Box flexDirection={'row'} px={3} mb={28}>
              <Box pr={16} justifyContent={'center'}>
                <Image source={detailAppointment} />
              </Box>
              <Box>
                <PlainText fontSize={14} lineHeight={20} letterSpacing={0.25}>
                  {intl.formatMessage({ id: 'appointment.doctorPrefix' }) +
                    doctor.name}
                </PlainText>
              </Box>
            </Box>
            <Box flexDirection={'row'} px={3}>
              <Box pr={16} justifyContent={'center'}>
                <Image source={detailLocation} />
              </Box>
              <Box width={'60%'}>
                <PlainText fontSize={14} lineHeight={20} letterSpacing={0.25}>
                  {clinic.address}
                </PlainText>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box mt={'35%'} pt={16} px={4} width={'100%'} pb={16}>
          <Button
            primary
            buttonStyle={styles.btnStyle}
            onPress={() => navigation.navigate(DOCTOR_LANDING)}
            title={intl.formatMessage({
              id: 'thankYouScreen.buttonText',
            })}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  btnStyle: { width: '100%', borderRadius: 0 },
});

export default ThankYouScreen;
