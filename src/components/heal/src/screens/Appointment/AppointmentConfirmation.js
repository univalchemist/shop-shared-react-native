import React, { useState } from 'react';
import { Modal, Alert } from 'react-native';
import { THANK_YOU } from '../../../routes';
import { DOCTOR_LANDING } from '@routes';
import { Box } from '@heal/src/wrappers/components';
import { useIntl } from '@wrappers/core/hooks';
import { connect } from 'react-redux';
import { acceptAppointment } from '@heal/src/store/actions';

const AppointmentConfirmation = ({ navigation, route, acceptAppointment }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const { id, type, data } = route.params || '';
  const intl = useIntl();

  const displyAlert = () => {
    let typeCheck = type === 'reject' || type === 'upcomingReject';
    Alert.alert(
      intl.formatMessage({
        id: !typeCheck
          ? 'appointmentConfirmation.pendingConfirmationTittle'
          : 'appointmentConfirmation.rejectTittle',
      }),
      intl.formatMessage({
        id: !typeCheck
          ? 'appointmentConfirmation.pendingConfirmationMessage'
          : 'appointmentConfirmation.rejectMessage',
      }),
      !typeCheck
        ? [
            {
              text: intl.formatMessage({
                id: 'appointmentConfirmation.Ok',
              }),
              onPress: () => {
                navigation.navigate(THANK_YOU, { data: data });
                setIsAlertVisible(false);
                setIsVisible(false);
              },
            },
          ]
        : [
            {
              text: intl.formatMessage({
                id: 'appointmentConfirmation.confirm',
              }),
              onPress: () => {
                acceptAppointment(false, id);
                navigation.navigate(DOCTOR_LANDING);
                setIsAlertVisible(false);
                setIsVisible(false);
              },
            },
            {
              text: intl.formatMessage({
                id: 'appointmentConfirmation.cancel',
              }),
              onPress: () => {
                navigation.goBack();
                setIsAlertVisible(false);
                setIsVisible(false);
              },
            },
          ],
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <Box
        flex={1}
        alignItems={'center'}
        justifyContent={'center'}
        backgroundColor={'rgba(0,0,0,0.7)'}
      >
        {isAlertVisible && isVisible && displyAlert()}
      </Box>
    </Modal>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  acceptAppointment,
})(AppointmentConfirmation);
