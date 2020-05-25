import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { SafeAreaView } from 'react-native';
import { compose } from 'ramda';
import { Box, Text, Button, Loader, ScrollView } from '@wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { PROFILE_MY_DETAILS } from '@routes';
import {
  updateDependentDoB,
  sendInvitationToDependent,
} from '@store/user/actions';
import InvitationForm from './InvitationForm';
import validator, { validateAge as validateAgeCurryFn } from './validations';
import {
  DEPENDENT_DOB,
  DEPENDENT_EMAIL,
  CONFIRM_EMAIL,
  DATE_FORMAT,
  EMAIL_ALREADY_TAKEN,
} from './constants';
import { showSuccessAlert, showServerError } from './showAlert';
import { IsCategorySpouse, getFormattedDate } from '@utils';
import { getMessageKey } from '@utils/localizeServerError';

const applyFormat = getFormattedDate.setFormat(DATE_FORMAT);

const ProfileDependentInviteScreen = props => {
  const {
    dateOfBirth,
    email,
    fullName,
    validateAge,
    handlePress,
    handleSubmit,
  } = props;
  const { formatMessage } = useIntl();
  const { backgroundColor } = useTheme();
  const [dob, setDoB] = useState({
    email,
    confirm: null,

    // original date (date type - string)
    date: dateOfBirth,

    // only for display (locale issue - formatted date string)
    display: dateOfBirth,
  });
  const [dependantEmailUniqueError, setDependantEmailUniqueError] = useState(
    false,
  );
  const touchedRef = useRef(!!dob.date);

  const showDependantEmailUniqueError = () => {
    setDependantEmailUniqueError(true);
  };

  const hideChangeDependentEmail = () => {
    setDependantEmailUniqueError(false);
  };

  return (
    <Form
      initialValues={{
        [DEPENDENT_DOB]: applyFormat(dob.display),
        [DEPENDENT_EMAIL]: dob.email,
        [CONFIRM_EMAIL]: dob.confirm,
      }}
      onSubmit={handleSubmit({
        isDoBUpdated: dateOfBirth !== dob.date,
        fns: {
          handlePress,
          formatMessage,
          errorCallback: showDependantEmailUniqueError,
        },
      })}
      validate={validator}
      render={formProps => {
        const { values, submitting, errors, touched } = formProps;

        if (submitting) {
          return <Loader primary />;
        }

        const handleConfirm = date => {
          setDoB({
            date,
            display: date,
            email: values[DEPENDENT_EMAIL],
            confirm: values[CONFIRM_EMAIL],
          });

          touchedRef.current = !!date;
        };

        const selectFieldMeta = {
          error: errors[DEPENDENT_DOB],
          touched: touched[DEPENDENT_DOB] || touchedRef.current,
        };

        return (
          <Box
            as={SafeAreaView}
            height="100%"
            backgroundColor={backgroundColor.default}
          >
            <ScrollView>
              <Box px={4} pt={4} pb={2}>
                <Text>
                  {formatMessage({
                    id: 'profile.dependentInvite.instructionsFirst',
                  })}
                </Text>
              </Box>

              <Box px={4} pt={4} pb={2}>
                <Text>
                  {formatMessage(
                    { id: 'profile.dependentInvite.instructionsSecond' },
                    {
                      dependentName: fullName,
                    },
                  )}
                </Text>
              </Box>

              <Box px={4} pt={4} pb={2}>
                <InvitationForm
                  selectFieldMeta={selectFieldMeta}
                  isDisabled={!!dateOfBirth}
                  validateAge={validateAge(dob.date)}
                  handleConfirm={handleConfirm}
                  emailUniqueError={dependantEmailUniqueError}
                  onChangeDependentEmail={hideChangeDependentEmail}
                />

                <Button
                  primary
                  onPress={formProps.handleSubmit}
                  title={formatMessage({
                    id: 'profile.dependentInvite.submitBtn',
                  })}
                />
              </Box>
            </ScrollView>
          </Box>
        );
      }}
    />
  );
};

ProfileDependentInviteScreen.propTypes = {
  fullName: PropTypes.string.isRequired,
  validateAge: PropTypes.func.isRequired,
  handlePress: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dateOfBirth: PropTypes.string,
  email: PropTypes.string,
};

const mapStateToProps = (_, ownProps) => {
  const { route, navigation } = ownProps;
  const { email, fullName, relationshipCategory, dateOfBirth } =
    route.params?.dependent || {};
  const validateAge = compose(
    validateAgeCurryFn,
    IsCategorySpouse,
  )(relationshipCategory);

  return {
    dateOfBirth,
    fullName,
    email,
    validateAge,
    handlePress: () => navigation.navigate(PROFILE_MY_DETAILS),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { route } = ownProps;
  const { memberId } = route.params?.dependent || {};

  return {
    handleSubmit: ({ isDoBUpdated, fns }) => async values => {
      const { formatMessage, handlePress, errorCallback } = fns;

      try {
        if (isDoBUpdated) {
          await dispatch(
            updateDependentDoB({
              dependentId: memberId,
              dateOfBirth: values[DEPENDENT_DOB],
            }),
          );
        }

        await dispatch(
          sendInvitationToDependent({
            dependentId: memberId,
            emailId: values[DEPENDENT_EMAIL],
          }),
        );
        showSuccessAlert({ formatMessage, handlePress });
      } catch (error) {
        if (getMessageKey(error) === EMAIL_ALREADY_TAKEN) {
          errorCallback && errorCallback();
          return;
        }
        await showServerError({ formatMessage, error });
      }
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileDependentInviteScreen);
