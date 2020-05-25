import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {
  ScrollView,
  Container,
  Box,
  TrackedButton,
  Loader,
  PlainText,
  Footer,
} from '@wrappers/components';
import { submitClaim, uploadDocumentsForReference } from '@store/claim/actions';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { CLAIMS_LIST, CLAIM_SUCCESS_MODAL, CLAIM_ERROR_MODAL } from '@routes';
import { injectIntl } from 'react-intl';
import { categories } from '@store/analytics/trackingActions';

const TcContainer = styled(Container)`
  ${({ theme }) => `
   background-color: ${theme.backgroundColor.default}
   padding-bottom: 0
   flex: 1
  `}
`;

const ClaimTermsConditionsModal = ({
  handleSubmit,
  submitClaim,
  uploadDocumentsForReference,
  submitting,
  intl,
  navigation,
}) => {
  const handleClaimSubmit = async (values, _, { reset }) => {
    let response;
    let receiptFilesIds;
    let referralFilesIds;
    let settlementAdviceIds;
    let prescriptionIds;

    try {
      const { documents } = values;
      response = await uploadDocumentsForReference('Receipt', documents);
      receiptFilesIds = response.action.payload;
    } catch (error) {
      return navigation.navigate(CLAIM_ERROR_MODAL);
    }

    try {
      const { referrals } = values;
      if (referrals && referrals.length > 0) {
        response = await uploadDocumentsForReference('Referral', referrals);
        referralFilesIds = response.action.payload;
      }
    } catch (error) {
      return navigation.navigate(CLAIM_ERROR_MODAL);
    }

    try {
      const { settlementAdvices } = values;
      if (settlementAdvices && settlementAdvices.length > 0) {
        response = await uploadDocumentsForReference(
          'SettlementAdvices',
          settlementAdvices,
        );
        settlementAdviceIds = response.action.payload;
      }
    } catch (error) {
      return navigation.navigate(CLAIM_ERROR_MODAL);
    }

    try {
      const { prescriptions } = values;
      if (prescriptions && prescriptions.length > 0) {
        response = await uploadDocumentsForReference(
          'Prescriptions',
          prescriptions,
        );
        prescriptionIds = response.action.payload;
      }
    } catch (error) {
      return navigation.navigate(CLAIM_ERROR_MODAL);
    }

    try {
      const result = await submitClaim({
        ...values,
        receiptFilesIds,
        referralFilesIds,
        settlementAdviceIds,
        prescriptionIds,
      });
      const { claimId } = result.action.payload;
      const state = navigation.dangerouslyGetState();
      const firstRoute = state?.routes?.[0];

      await navigation.reset({
        routes: [
          { name: firstRoute?.name || CLAIMS_LIST },
          { name: CLAIM_SUCCESS_MODAL, params: { claimId } },
        ],
      });

      reset();
    } catch (error) {
      return navigation.navigate(CLAIM_ERROR_MODAL);
    }
  };

  if (submitting) {
    return (
      <Loader
        loadingText={intl.formatMessage({ id: 'claim.claimSubmitLoadingText' })}
      />
    );
  }

  return (
    <Box flex={1}>
      <ScrollView>
        <TcContainer>
          <Box marginBottom={32}>
            <PlainText>
              {intl.formatMessage({ id: 'claim.termsConditionsText' })}
            </PlainText>
          </Box>
        </TcContainer>
      </ScrollView>
      <Footer>
        <TrackedButton
          primary
          title={intl.formatMessage({ id: 'claim.acceptClaimTermsConditions' })}
          onPress={handleSubmit(handleClaimSubmit)}
          actionParams={{
            category: categories.CLAIMS,
            action: 'Accept claims t&cs',
          }}
        />
      </Footer>
    </Box>
  );
};

ClaimTermsConditionsModal.propTypes = {
  values: PropTypes.shape({}),
  submitClaim: PropTypes.func,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
  uploadDocumentsForReference: PropTypes.func,
};

const enhance = compose(
  connect(null, { submitClaim, uploadDocumentsForReference }),
  reduxForm({
    form: 'claimDetailsForm',
    destroyOnUnmount: false,
  }),
  injectIntl,
);

export default enhance(ClaimTermsConditionsModal);
