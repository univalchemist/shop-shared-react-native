import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Image, StatusPanel } from '@wrappers/components';
import { CLAIM_PATIENT_DETAILS, CLAIMS_LIST } from '@routes';
import { reset } from 'redux-form';
import { connect } from 'react-redux';
import { useIntl, useBackButtonHandler } from '@wrappers/core/hooks';
import { errorPanel } from '@images';
import { StackActions } from '@react-navigation/native';

const ClaimErrorModal = ({ reset, navigation }) => {
  const onBackButtonPressAndroid = useCallback(() => {
    navigation.dispatch(StackActions.pop(2));
    return true;
  }, [navigation]);

  useBackButtonHandler(onBackButtonPressAndroid);

  const intl = useIntl();
  return (
    <StatusPanel
      image={
        <Image
          source={errorPanel}
          maxWidth={215}
          maxHeight={215}
          resizeMode="contain"
        />
      }
      heading={intl.formatMessage({ id: 'somethingWentWrong' })}
      description={intl.formatMessage({
        id: 'claim.submitError',
      })}
      actions={
        <>
          <Box>
            <Button
              primary
              title={intl.formatMessage({
                id: 'claim.backToReviewClaim',
              })}
              onPress={() => {
                navigation.dispatch(StackActions.pop(2));
              }}
            />
          </Box>
          <Box mt={3}>
            <Button
              secondary
              title={intl.formatMessage({ id: 'claim.makeAnotherClaimText' })}
              onPress={async () => {
                const state = navigation.dangerouslyGetState();
                const firstRoute = state?.routes?.[0];

                await navigation.reset({
                  routes: [{ name: firstRoute?.name || CLAIMS_LIST }],
                });

                reset('claimDetailsForm');

                navigation.navigate(CLAIM_PATIENT_DETAILS);
              }}
            />
          </Box>
        </>
      }
    />
  );
};

ClaimErrorModal.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default connect(null, { reset })(ClaimErrorModal);
