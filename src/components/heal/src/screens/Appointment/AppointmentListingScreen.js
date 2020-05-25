import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import {
  Image,
  Box,
  SectionHeadingText,
  PlainText,
} from '@heal/src/wrappers/components';
import { useTheme, useIntl } from '@heal/src/wrappers/core/hooks';
import { ScrollView } from '@wrappers/components';
import {
  appointmentCalendar,
  appointmentCancel,
  appointmentFinish,
  appointmentTimer,
  chevronRight,
} from '@heal/images';
import { APPOINTMENT_DETAIL } from '../../../routes';
import { connect } from 'react-redux';
import { getAppointmentList } from '@heal/src/store/actions';

const informationArray = [
  {
    image: appointmentTimer,
    title: 'Pending acceptance',
    type: 'DoctorConfirmed',
  },
  { image: appointmentCalendar, title: 'Upcoming', type: 'Accepted' },
  { image: appointmentTimer, title: 'Pending confirmation', type: 'Requested' },
  { image: appointmentFinish, title: 'Finished', type: 'Finished' },
  {
    image: appointmentCancel,
    title: 'Cancelled & Rejected',
    type: ['DoctorRejected', 'Cancelled', 'Rejected'],
  },
];

const AppointmentListingScreen = ({ navigation, route, ...props }) => {
  const theme = useTheme();
  const intl = useIntl();
  let { appointmentList } = props;

  const group = informationArray.reduce((acc, item) => {
    if (!acc[item.title]) {
      acc[item.title] = [];
    }

    acc[item.title].push(item);

    return acc;
  }, {});

  useEffect(() => {
    const fetchAppointment = async () => {
      await props.getAppointmentList();
    };
    fetchAppointment();
  }, []);

  const cardContainer = (innerItem, i, infoData) => {
    const {
      doctor,
      status,
      firstPreferredTime,
      firstSession,
      clinic,
    } = innerItem;

    return (
      <Box key={i} pb={32}>
        {doctor && (
          <Box flexDirection={'row'}>
            <Box justifyContent={'center'} pr={16}>
              <Image source={infoData.image} />
            </Box>
            <Box width={'85%'} mr={8}>
              <PlainText color={theme.colors.gray[0]} fontWeight={500}>
                {clinic.name || ''}
              </PlainText>
              <PlainText color={theme.colors.gray[0]}>
                {intl.formatMessage({ id: 'appointment.doctorPrefix' }) +
                  doctor.name || ''}
              </PlainText>
              <PlainText color={theme.colors.gray[0]}>
                {intl.formatMessage({
                  id: `speciality.name.${doctor.specialityCode}`,
                })}
              </PlainText>
              <PlainText color={theme.colors.gray[8]}>
                {moment(firstPreferredTime).format('DD MMM YYYY') +
                  ', ' +
                  firstSession}
              </PlainText>
            </Box>
            <Box justifyContent={'center'}>
              {status === infoData.type && (
                <Image
                  marginLeft="auto"
                  source={chevronRight}
                  style={styles.chevron}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  if (appointmentList.length === 0) {
    return (
      <Box flex={1} justifyContent={'center'} alignItems={'center'}>
        <PlainText color={theme.heal.colors.gray[0]}>
          {intl.formatMessage({ id: 'appointmentListingScreen.noData' })}
        </PlainText>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <ScrollView>
        <Box mt={24}>
          {[group].map((data, ind) => {
            return (
              <Box mt={16} key={ind} px={4}>
                {Object.keys(data).map(innerData =>
                  data[innerData].map(infoData => (
                    <Box>
                      <SectionHeadingText
                        key={ind}
                        fontSize={16}
                        lineHeight={22}
                        letterSpacing={0.3}
                        pb={32}
                      >
                        {infoData.title}
                      </SectionHeadingText>
                      {appointmentList
                        .filter(
                          app =>
                            app.clinic &&
                            app.clinic.name &&
                            app.doctor &&
                            app.doctor.name,
                        )
                        .map((item, i) =>
                          item.status === infoData.type ? (
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate(APPOINTMENT_DETAIL, {
                                  data: { [innerData]: item },
                                });
                              }}
                            >
                              {cardContainer(item, i, infoData)}
                            </TouchableOpacity>
                          ) : (
                            (item.status === infoData.type ||
                              infoData.type.includes(item.status)) &&
                            cardContainer(item, i, infoData)
                          ),
                        )}
                    </Box>
                  )),
                )}
              </Box>
            );
          })}
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  chevron: { color: '#666666', height: 16, width: 10 },
});

const mapStateToProps = ({ heal: { appointmentList } }) => ({
  appointmentList,
});

export default connect(mapStateToProps, {
  getAppointmentList,
})(AppointmentListingScreen);
