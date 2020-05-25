import React, { useCallback, useEffect, useRef } from 'react';
import { formValueSelector, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Box,
  Text,
  PlainText,
  ScrollView,
  Icon,
  Datepicker,
  Divider,
} from '@wrappers/components';
import { CheckBox } from 'react-native-elements';
import {
  InputField,
  RadioButtonGroup,
  SelectField,
} from '@wrappers/components/form';
import { hasValue, validateEmail } from '@wrappers/core/validations';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import moment from 'moment';
import Flex from '@cxa-rn/components/src/Flex';
import { isIphoneX } from '@utils';
import { Button } from '@heal/src/wrappers/components';
import {
  updateMedicalProfile,
  getMedicalProfile,
  getRemoteTickets,
  getAppointmentList,
} from '@heal/src/store/actions';

import { CHECK_IN_CONFIRMATION } from '@routes';
import { CONFIRM_NEXT } from '@heal/routes';

const CheckInFormScreen = ({
  navigation,
  route,
  touch,
  change,
  handleSubmit,
  selectedMember,
  userId,
  clinicQrCode,
  updateMedicalProfile,
  getMedicalProfile,
  appointmentList,
  getAppointmentList,
  getRemoteTickets,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const remoteTicket = useRef(null);
  const acceptAppointmentArray = appointmentList.filter(
    item => item.status === 'Accepted' && item.clinic.qrCode === clinicQrCode,
  );

  useEffect(() => {
    const fetchProfile = async () => {
      await getMedicalProfile();
      await getAppointmentList();
      const { value } = await getRemoteTickets();
      const tick = value.remoteTickets.find(
        t => t.clinic.qrCode.toLowerCase() === clinicQrCode.toLowerCase(),
      );
      if (tick) remoteTicket.current = tick;
    };
    fetchProfile();
  }, []);

  const intlMsg = (field, options) =>
    intl.formatMessage({ id: field }, options);

  const requiredValidation = useCallback(value => {
    if (!hasValue(value))
      return intl.formatMessage({ id: 'heal.CheckInForm.required' });
    return '';
  }, []);

  const dateOfBirthValidation = useCallback(value => {
    if (!hasValue(value)) return 'heal.CheckInForm.required';
    return '';
  }, []);

  return (
    <Box flex={1} backgroundColor={theme.heal.colors.backgroundColor}>
      <ScrollView>
        <Box pt={32} px={32}>
          <PlainText fontWeight="bold" color={theme.heal.colors.gray[3]}>
            {intlMsg('heal.checkin.SelectMember')}
          </PlainText>
          <PlainText mt={16} color={theme.heal.colors.gray[4]}>
            {intlMsg('heal.checkin.NoticeConfirmation')}
          </PlainText>
          <Box ml={-20} mt={16} alignItems="center" flexDirection="row">
            <CheckBox
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={true}
              checkedColor={theme.radioButton.checked}
            />
            <Flex paddingRight={10}>
              <Text fontSize={16} color={theme.heal.colors.gray[3]}>
                {userId === selectedMember.memberId
                  ? intlMsg('heal.myself')
                  : selectedMember.fullName}
              </Text>
            </Flex>
          </Box>
          <PlainText mt={16} mb={32} fontSize={12}>
            Required (*)
          </PlainText>
          <InputField
            name="fullName"
            validate={[requiredValidation]}
            validationErrorsLocalized
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.fullname.label')}
          />
          <InputField
            name="chineseName"
            validationErrorsLocalized
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.chineseFullname.label')}
          />
          <InputField
            name="identificationNumber"
            validate={[requiredValidation]}
            validationErrorsLocalized
            keyboardType="numeric"
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.idNumber.label')}
          />
          <InputField
            name="contactNumber"
            validationErrorsLocalized
            keyboardType="phone-pad"
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.phoneNumber.label')}
          />
          <InputField
            name="email"
            validationErrorsLocalized
            validate={[requiredValidation, validateEmail]}
            keyboardType="email-address"
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.email.label')}
          />
          <RadioButtonGroup
            containerStyle={{
              flex: 1,
              flexDirection: 'row',
              marginBottom: 32,
            }}
            itemStyle={{
              marginRight: 48,
            }}
            label={intl.formatMessage({ id: 'heal.gender' })}
            name="gender"
            options={[
              {
                label: intl.formatMessage({ id: 'heal.gender.male' }),
                value: 'Male',
              },
              {
                label: intl.formatMessage({ id: 'heal.gender.female' }),
                value: 'Female',
              },
            ]}
            validate={[requiredValidation]}
            errorMessageKey={'heal.CheckInForm.required'}
          />
          <Datepicker
            onConfirm={date => {
              change('dateOfBirth', moment(date).toISOString());
            }}
            onCancel={() => touch('dateOfBirth')}
            field={({ setIsVisible }) => (
              <SelectField
                name="dateOfBirth"
                validate={[dateOfBirthValidation]}
                format={date => date && moment(date).format('ll')}
                label={intlMsg('heal.CheckInForm.dateOfBirth.label')}
                onPress={() => setIsVisible(true)}
                onRight={({ color }) => <Icon name="event" color={color} />}
              />
            )}
          />
          <InputField
            name="address"
            validationErrorsLocalized
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.address.label')}
          />
          <PlainText
            color={theme.heal.colors.gray[3]}
            fontWeight="bold"
            mb={32}
          >
            Emergency contact person
          </PlainText>
          <InputField
            name="emergencyContactName"
            validationErrorsLocalized
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.contactPerson.label')}
          />
          <InputField
            name="emergencyRelationship"
            validationErrorsLocalized
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.relationship.label')}
          />
          <InputField
            name="emergencyContactNumber"
            validationErrorsLocalized
            returnKeyType="next"
            label={intlMsg('heal.CheckInForm.contactNumber.label')}
          />
        </Box>
        <Divider />
        <PlainText
          mt={24}
          fontSize={14}
          color={theme.heal.colors.gray[4]}
          px={32}
        >
          {intlMsg('heal.CheckInForm.description')}
        </PlainText>
        <Box mb={160} />
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
          title={intlMsg('heal.next')}
          onPress={handleSubmit(() => {
            updateMedicalProfile();
            if (remoteTicket) {
              navigation.navigate(CHECK_IN_CONFIRMATION, { remoteTicket });
            } else if (acceptAppointmentArray.length > 0) {
              navigation.navigate(CONFIRM_NEXT, {
                data: acceptAppointmentArray,
              });
            }
          })}
        />
      </Box>
    </Box>
  );
};

const selector = formValueSelector('checkinForm');

export default compose(
  connect(
    state => {
      const memberId = selector(state, 'memberId');
      if (!state.heal.medicalProfileData)
        return {
          selectedMember: state.user.membersMap[memberId],
          userId: state.user.userId,
          appointmentList: state.heal.appointmentList,
          clinicQrCode: state.heal.clinicQrCode,
        };
      else
        return {
          initialValues: state.heal.medicalProfileData,
          selectedMember: state.user.membersMap[memberId],
          userId: state.user.userId,
          appointmentList: state.heal.appointmentList,
          clinicQrCode: state.heal.clinicQrCode,
        };
    },
    {
      updateMedicalProfile,
      getMedicalProfile,
      getAppointmentList,
      getRemoteTickets,
    },
  ),
  reduxForm({
    form: 'checkinForm',
    enableReinitialize: true,
  }),
)(CheckInFormScreen);
