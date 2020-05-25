import React, { useCallback, useState } from 'react';
import {
  Box,
  PlainText as Text,
  Image,
  ScrollView,
} from '@wrappers/components';
import { connect } from 'react-redux';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { detailAppointment, location, chevronRight } from '@heal/images';
import styled from 'styled-components/native';
import moment from 'moment';
import { isIphoneX } from '@utils';
import { Button } from '@heal/src/wrappers/components';
import { checkInWalkIn } from '@heal/src/store/actions';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import { CHECK_IN_CONFIRMATION } from '@routes';

const Card = styled(Box)`
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05px;
  shadow-color: #000;
  border-radius: 4px;
`;

const CheckInScreen = ({ route, navigation, specialitiesByCode }) => {
  const remoteTicket = route?.params?.remoteTicket ?? {
    id: 0,
    date: '2020-05-19T13:12:56.476Z',
    status: 'Requested',
    token: 'string',
    estimatedConsultationTime: '2020-05-19T13:12:56.476Z',
    position: 0,
    type: 'WalkIn',
    doctor: {
      id: 0,
      locale: 'string',
      name: 'string',
      specialityCode: 'cardiology',
      gender: 'Male',
      email: 'string',
      imageUrl: 'string',
      introduction: 'string',
      qualification: 'string',
      yearOfPractice: 'string',
      isActive: true,
      clinics: [
        {
          id: 0,
          name: 'string',
          latitude: 0,
          longitude: 0,
          qrCode: 'string',
          district: 'string',
          area: 'string',
          distanceToClient: 0,
          address: 'string',
          openingHours: 'string',
          clinicProviderId: 0,
          isActive: true,
          phoneNumber: 'string',
          doctors: [null],
        },
      ],
      clinicProviderId: 0,
    },
    clinic: {
      id: 0,
      name: 'The Clinic Group @Fusionopolis',
      latitude: 0,
      longitude: 0,
      qrCode: 'string',
      district: 'string',
      area: 'string',
      distanceToClient: 0,
      address: 'Cheong Hing Street, Building 709, Singapore 0000',
      openingHours: 'string',
      clinicProviderId: 0,
      isActive: true,
      phoneNumber: 'string',
      doctors: [null],
    },
    memberId: 0,
    clinicProviderId: 0,
    doctorId: 0,
    clinicId: 0,
  };
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const intl = useIntl();

  const confirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));

      await checkInWalkIn({
        clinicProviderId: remoteTicket.clinic.clinicProviderId,
        clinicId: remoteTicket.clinic.clientId,
        doctorId: remoteTicket.doctor.doctorId,
      });
      navigation.navigate(CHECK_IN_CONFIRMATION, { remoteTicket });
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Box flex={1} backgroundColor={theme.heal.colors.backgroundColor}>
      {!isLoading ? (
        <Box flex={1}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text>{intl.formatMessage({ id: 'heal.CheckIn.notice' })}</Text>
            <Text mt={48} textAlign={'center'}>
              {remoteTicket.clinic?.name}
            </Text>
            <Card
              mt={48}
              backgroundColor={theme.heal.colors.white}
              px={24}
              py={44}
            >
              <Box mb={24} alignItems={'center'}>
                <Text fontWeight={'bold'} color={theme.heal.colors.black}>
                  {intl.formatMessage({
                    id: 'heal.CheckIn.estConsultationTime',
                  })}
                </Text>
                <Text fontSize={32} lineHeight={32} mt={16}>
                  {moment(remoteTicket?.estimatedConsultationTime).format(
                    'h:mm A',
                  )}
                </Text>
                <Text>
                  {moment(remoteTicket?.estimatedConsultationTime).format(
                    'DD MMM YYYY',
                  )}
                </Text>
              </Box>

              <Box flexDirection={'row'} alignItems={'center'}>
                <Image source={detailAppointment} />
                <Box ml={16}>
                  <Text>{remoteTicket?.doctor.name}</Text>
                  <Text>
                    {
                      specialitiesByCode[remoteTicket?.doctor.specialityCode]
                        .name
                    }
                  </Text>
                </Box>
              </Box>
              <Box flexDirection={'row'} mt={16}>
                <Image source={location} />
                <Text ml={16}>{remoteTicket?.clinic.address}</Text>
              </Box>
            </Card>
            <TouchableOpacity onPress={() => navigation.navigate('')}>
              <Box
                mt={44}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Text color={theme.heal.colors.gray[3]}>
                  {intl.formatMessage({ id: 'heal.CheckIn.seeAnotherDoctors' })}
                </Text>
                <Image source={chevronRight} mr={2} />
              </Box>
            </TouchableOpacity>
          </ScrollView>
          <Box
            backgroundColor="white"
            position="absolute"
            bottom={0}
            width="100%"
            paddingBottom={isIphoneX() ? 44 : 0}
            borderTopWidth={1}
            borderTopColor={theme.colors.gray[10]}
            paddingHorizontal={32}
            paddingVertical={16}
          >
            <Button
              primary
              title={intl.formatMessage({
                id: 'heal.CheckInForm.confirmAndNext',
              })}
              onPress={confirm}
            />
          </Box>
        </Box>
      ) : (
        <Box flex={1} justifyContent={'center'} alignItems={'center'}>
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
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, padding: 32 },
});

export default connect(
  state => ({
    specialitiesByCode: state.heal.specialitiesByCode,
  }),
  { checkInWalkIn },
)(CheckInScreen);
