import React, { useCallback } from 'react';
import { Box, Button, Image, StatusPanel } from '@wrappers/components';
import { CLAIM_PATIENT_DETAILS, CLAIMS_LIST } from '@routes';
import { useIntl, useBackButtonHandler } from '@wrappers/core/hooks';
import { StackActions } from '@react-navigation/native';
import { claimSuccessImage } from '@images/claim';
import { getClaims, updateClaimFilters } from '@store/claim/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';

const ClaimSuccessModal = ({ updateClaimFilters, getClaims, navigation }) => {
  const intl = useIntl();

  const handleViewSubmittedClaims = async () => {
    await updateClaimFilters([]);
    getClaims();
    navigation.dispatch(StackActions.popToTop());
  };

  const handleMakeAnotherClaimPress = async () => {
    await navigation.reset({
      routes: [{ name: CLAIMS_LIST }],
    });

    navigation.navigate(CLAIM_PATIENT_DETAILS);
  };

  const onBackButtonPressAndroid = useCallback(() => {
    navigation.dispatch(StackActions.popToTop());
    return true;
  });

  useBackButtonHandler(onBackButtonPressAndroid);

  return (
    <StatusPanel
      image={
        <Image
          source={claimSuccessImage}
          maxWidth={215}
          maxHeight={215}
          resizeMode="contain"
        />
      }
      heading={intl.formatMessage({ id: 'claim.claimSuccessModalTitle' })}
      description={intl.formatMessage({ id: 'claim.claimSuccessModalText' })}
      disclaimer={intl.formatMessage({
        id: 'claim.claimSuccessDisclaimerText',
      })}
      actions={
        <>
          <Box>
            <Button
              primary
              title={intl.formatMessage({
                id: 'claim.viewSubmittedClaimsText',
              })}
              onPress={handleViewSubmittedClaims}
            />
          </Box>
          <Box mt={3}>
            <Button
              secondary
              title={intl.formatMessage({ id: 'claim.makeAnotherClaimText' })}
              onPress={handleMakeAnotherClaimPress}
            />
          </Box>
        </>
      }
    />
  );
};

const enhance = compose(connect(null, { getClaims, updateClaimFilters }));

export default enhance(ClaimSuccessModal);
