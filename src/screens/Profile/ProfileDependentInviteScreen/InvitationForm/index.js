import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { Icon, Datepicker } from '@wrappers/components';
import { InputField, SelectField } from '@wrappers/components/FinalForm';
import { validateEmail, validateRequired } from '@wrappers/core/validations';
import { DEPENDENT_DOB, DEPENDENT_EMAIL, CONFIRM_EMAIL } from '../constants';

const InvitationForm = props => {
  const {
    validateAge,
    isDisabled,
    selectFieldMeta,
    handleConfirm,
    emailUniqueError,
    onChangeDependentEmail,
  } = props;
  const { formatMessage } = useIntl();
  const theme = useTheme();

  return (
    <>
      <Datepicker
        onConfirm={handleConfirm}
        maximumDate={new Date()}
        field={({ setIsVisible }) => {
          const handlePress = () => setIsVisible(true);

          return (
            <SelectField
              name={DEPENDENT_DOB}
              label={formatMessage({
                id: 'profile.dependentInvite.dateOfBirth',
              })}
              meta={selectFieldMeta}
              validate={[validateRequired, validateAge]}
              disabled={isDisabled}
              onPress={handlePress}
              onRight={({ color }) => <Icon color={color} name="event" />}
            />
          );
        }}
      />

      <InputField
        name={DEPENDENT_EMAIL}
        label={formatMessage({ id: 'profile.dependentInvite.emailInput' })}
        validate={[validateRequired, validateEmail]}
        keyboardType="email-address"
        onTouchStart={onChangeDependentEmail}
        errorAfterSubmit={
          emailUniqueError
            ? formatMessage({
                id: 'profile.dependentInvite.emailExist',
              })
            : null
        }
        customStyles={theme.customInputStyles}
      />

      <InputField
        name={CONFIRM_EMAIL}
        label={formatMessage({ id: 'profile.dependentInvite.emailConfirm' })}
        validate={[validateRequired, validateEmail]}
        keyboardType="email-address"
        customStyles={theme.customInputStyles}
      />
    </>
  );
};

InvitationForm.propTypes = {
  handleConfirm: PropTypes.func.isRequired,
  validateAge: PropTypes.func,
  selectFieldMeta: PropTypes.object,
  isDisabled: PropTypes.bool,
  emailUniqueError: PropTypes.bool,
};

InvitationForm.defaultProps = {
  validateAge: () => '',
  selectFieldMeta: {},
  isDisabled: false,
};

export default InvitationForm;
