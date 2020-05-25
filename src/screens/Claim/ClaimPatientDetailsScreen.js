import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Box,
  TrackedButton,
  ScrollView,
  StepProgressBar,
  FieldSkeletonPlaceholder,
  ButtonSkeletonPlaceholder,
  Text,
  ErrorPanel,
} from '@wrappers/components';
import { SelectField, InputField } from '@wrappers/components/form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { CLAIM_PATIENT_MODAL, CLAIM_DETAILS_FORM } from '@routes';
import { Icon } from 'react-native-elements';
import { normalizeContactNumber } from '@wrappers/core/normalizers';
import {
  validateContactNumber,
  validateContactNumberLength,
} from '@wrappers/core/validations';
import { FormattedMessage } from 'react-intl';
import {
  useIntl,
  useTheme,
  useBackButtonHandler,
  useFetchActions,
} from '@wrappers/core/hooks';
import { handlePress } from '@screens/Claim';
import { fetchClaimTypes } from '@store/claimType/actions';
import { categories } from '@store/analytics/trackingActions';

const ClaimPatientDetailsSkeletonPlaceholder = () => (
  <Box pt={4} pl={4} pr={4} mb={2}>
    <FieldSkeletonPlaceholder />
    <Box mt={36}>
      <FieldSkeletonPlaceholder />
    </Box>
    <Box mt={52}>
      <ButtonSkeletonPlaceholder />
    </Box>
  </Box>
);

const ClaimPatientDetailsScreen = ({
  handleSubmit,
  reset,
  fetchClaimTypes,
  navigation,
}) => {
  const intl = useIntl();
  const theme = useTheme();
  const intlMsg = message => intl.formatMessage({ id: `claim.${message}` });
  const [isLoading, isError] = useFetchActions([fetchClaimTypes]);

  const onBackButtonPressAndroid = useCallback(() => {
    handlePress(navigation, intl, reset);
    return true;
  }, [navigation, intl, reset]);

  useBackButtonHandler(onBackButtonPressAndroid);

  let component;
  if (isLoading) {
    component = <ClaimPatientDetailsSkeletonPlaceholder />;
  } else if (isError) {
    component = <ErrorPanel />;
  } else {
    component = (
      <ScrollView>
        <StepProgressBar currentStep={1} stepCount={4} />
        <Container>
          <Box mt={2}>
            <Box>
              <SelectField
                name="patientName"
                label={intlMsg('label.patientName')}
                onPress={() => navigation.navigate(CLAIM_PATIENT_MODAL)}
                onRight={({ color }) => (
                  <Icon name="expand-more" color={color} />
                )}
              />
            </Box>
            <Box>
              <InputField
                name="contactNumber"
                keyboardType="phone-pad"
                returnKeyType="done"
                normalize={normalizeContactNumber}
                label={intlMsg('label.contactNumber')}
                hint={intlMsg('label.hint.contactNumber')}
                validate={[validateContactNumber, validateContactNumberLength]}
                customStyles={theme.customInputStyles}
              />
            </Box>

            <Box>
              <TrackedButton
                primary
                onPress={handleSubmit(() =>
                  navigation.navigate(CLAIM_DETAILS_FORM),
                )}
                title={intlMsg('addClaimDetailsButtonText')}
                actionParams={{
                  category: categories.CLAIMS_SUBMISSION,
                  action: 'Add claims details',
                }}
              />
            </Box>
          </Box>

          <Box mt={32}>
            <Text fontSize={12} lineHeight={16} letterSpacing={0.4}>
              <FormattedMessage id="claim.conditionText" />
            </Text>
          </Box>
        </Container>
      </ScrollView>
    );
  }
  return component;
};

ClaimPatientDetailsScreen.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

const enhance = compose(
  connect(
    ({ user: { userId, membersMap } }) => ({
      initialValues: {
        patientName: membersMap[userId].fullName,
        contactNumber: membersMap[userId].contactNumber,
        selectedPatientId: membersMap[userId].memberId,
      },
    }),
    { fetchClaimTypes },
  ),
  reduxForm({
    form: 'claimDetailsForm',
    destroyOnUnmount: false,
  }),
);

export { ClaimPatientDetailsSkeletonPlaceholder };
export default enhance(ClaimPatientDetailsScreen);
