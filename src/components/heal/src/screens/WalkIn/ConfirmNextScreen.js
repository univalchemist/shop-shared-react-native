import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image, Box, PlainText, Button } from '@heal/src/wrappers/components';
import { chevronRight, detailAppointment, detailLocation } from '@heal/images';
import { useTheme, useIntl } from '@heal/src/wrappers/core/hooks';
import moment from 'moment';

const ConfirmNextScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const intl = useIntl();
  const { data } = route.params || '';
  const { firstPreferredTime, doctor, clinic } = data && data[0];
  const dateDefaultFormat = 'DD MMM YYYY';

  if (data.length === 0) {
    return <Box />;
  }

  return (
    <Box flex={1} as={SafeAreaView} backgroundColor={theme.colors.white}>
      <Box flex={1} backgroundColor={theme.colors.gray[7]}>
        <ScrollView>
          <Box px={4} mb={80}>
            <Box mt={23} width={'70%'}>
              <PlainText color={theme.colors.gray[8]}>
                {intl.formatMessage({
                  id: 'heal.confirmNextScreen.heading',
                })}
              </PlainText>
            </Box>
            <Box mt={48}>
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
                  {intl.formatMessage({
                    id: 'heal.confirmNextScreen.subHeading',
                  })}
                </PlainText>
              </Box>
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
                  {moment(firstPreferredTime).format(dateDefaultFormat)}
                </PlainText>
              </Box>
              {doctor && (
                <Box>
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
                        {intl.formatMessage({
                          id: 'appointment.doctorPrefix',
                        }) + doctor.name}
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
                </Box>
              )}
            </Box>
            <Box mt={48} pr={10} mb={58}>
              <TouchableOpacity onPress={() => console.log('TO DO')}>
                <Box flexDirection={'row'} alignItems={'center'}>
                  <PlainText color={theme.colors.gray[0]}>
                    {intl.formatMessage({
                      id: 'heal.confirmNextScreen.anotherDoctor',
                    })}
                  </PlainText>
                  <Image
                    marginLeft="auto"
                    source={chevronRight}
                    style={styles.chevron}
                  />
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
        </ScrollView>
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
              id: 'heal.confirmNextScreen.btnText',
            })}
            onPress={() => console.log('To DO')}
            buttonStyle={styles.btnStyle}
          />
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  btnStyle: { width: '100%', borderRadius: 0 },
});

export default ConfirmNextScreen;
