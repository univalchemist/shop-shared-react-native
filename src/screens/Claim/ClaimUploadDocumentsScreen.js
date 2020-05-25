import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import {
  ScrollView,
  StepProgressBar,
  DocumentUploaderWithScrollBar,
  Box,
  Text,
  Button,
} from '@wrappers/components';
import { getImageFromImagePicker } from '@utils/nativeImageHelpers';
import { CLAIM_REVIEW, CLAIM_DOCUMENT_VIEWER_MODAL } from '@routes';
import { injectIntl } from 'react-intl';
import { categories, logAction } from '@store/analytics/trackingActions';

const ClaimUploadDocumentsScreen = ({
  array,
  change,
  submitting,
  documents = [],
  settlementAdvices = [],
  prescriptions = [],
  referrals = [],
  intl,
  referralRequired,
  isMultiInsurer,
  displayPrescriptionUpload,
  navigation,
}) => {
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const hasNoDocuments = documents.length === 0;
  const needsReferrals = referralRequired && referrals.length === 0;
  const needSettlementAdvice = isMultiInsurer && settlementAdvices.length === 0;
  const needsPrescription =
    displayPrescriptionUpload && prescriptions.length === 0;
  const disableButton =
    hasNoDocuments ||
    needsReferrals ||
    needSettlementAdvice ||
    needsPrescription;
  const withDocuments = true;

  useEffect(() => {
    if (!isMultiInsurer && settlementAdvices.length > 0)
      change('settlementAdvices', []);
    if (!displayPrescriptionUpload && prescriptions.length > 0)
      change('prescriptions', []);
  }, [
    prescriptions,
    settlementAdvices,
    isMultiInsurer,
    displayPrescriptionUpload,
  ]);

  const openGallery = uploadType => {
    return index => {
      setIsOpenGallery(true);
      getImageFromImagePicker({
        intl,
        withDocuments,
        onSuccess: image => {
          change(`${uploadType}.${index}`, image);
          setIsOpenGallery(false);
          logAction({
            category: categories.CLAIMS_SUBMISSION,
            action: `Add document by ${uploadType}`,
            file_type: image.type,
          });
        },
        onCancel: () => {
          setIsOpenGallery(false);
        },
        onError: () => {
          setIsOpenGallery(false);
        },
      });
    };
  };

  const viewDocument = uploadType => index => {
    let file;
    switch (uploadType) {
      case 'documents':
        file = documents[index];
        break;
      case 'referrals':
        file = referrals[index];
        break;
      case 'settlementAdvices':
        file = settlementAdvices[index];
        break;
      case 'prescriptions':
        file = prescriptions[index];
        break;
    }
    const { uri, type } = file;

    navigation.navigate(CLAIM_DOCUMENT_VIEWER_MODAL, {
      uri,
      contentType: type,
      onRemove: () => {
        array.remove(uploadType, index);
      },
    });
  };

  return (
    <ScrollView>
      <StepProgressBar currentStep={3} stepCount={4} />
      <Box mt={4}>
        <DocumentUploaderWithScrollBar
          disabled={isOpenGallery}
          title={intl.formatMessage({ id: 'claim.section.receipts' })}
          size={5}
          data={documents.map(file => ({
            uri: file.uri,
            type: file.type,
          }))}
          onAdd={openGallery('documents')}
          onView={viewDocument('documents')}
          accessibilityDocumentType={intl.formatMessage({
            id: 'uploadBox.accessibilityLabel.type.document',
          })}
          accessibilityField={intl.formatMessage({
            id: 'claim.section.receipts',
          })}
        />
      </Box>
      {isMultiInsurer && (
        <Box mt={4}>
          <Box mt={4}>
            <DocumentUploaderWithScrollBar
              disabled={isOpenGallery}
              title={intl.formatMessage({
                id: 'claim.section.settlementAdvices',
              })}
              size={5}
              data={settlementAdvices.map(file => ({
                uri: file.uri,
                type: file.type,
              }))}
              onAdd={openGallery('settlementAdvices')}
              onView={viewDocument('settlementAdvices')}
              accessibilityDocumentType={intl.formatMessage({
                id: 'uploadBox.accessibilityLabel.type.document',
              })}
              accessibilityField={intl.formatMessage({
                id: 'claim.section.settlementAdvices',
              })}
            />
          </Box>
        </Box>
      )}
      {displayPrescriptionUpload && (
        <Box mt={4}>
          <Box mt={4}>
            <DocumentUploaderWithScrollBar
              disabled={isOpenGallery}
              title={intl.formatMessage({
                id: 'claim.section.prescriptions',
              })}
              size={5}
              data={prescriptions.map(file => ({
                uri: file.uri,
                type: file.type,
              }))}
              onAdd={openGallery('prescriptions')}
              onView={viewDocument('prescriptions')}
              accessibilityDocumentType={intl.formatMessage({
                id: 'uploadBox.accessibilityLabel.type.document',
              })}
              accessibilityField={intl.formatMessage({
                id: 'claim.section.prescriptions',
              })}
            />
          </Box>
        </Box>
      )}
      {referralRequired && (
        <Box mt={4}>
          <DocumentUploaderWithScrollBar
            disabled={isOpenGallery}
            title={intl.formatMessage({ id: 'claim.section.referrals' })}
            size={1}
            data={referrals.map(file => ({ uri: file.uri, type: file.type }))}
            onAdd={openGallery('referrals')}
            onView={viewDocument('referrals')}
            accessibilityDocumentType={intl.formatMessage({
              id: 'uploadBox.accessibilityLabel.type.document',
            })}
            accessibilityField={intl.formatMessage({
              id: 'claim.section.referrals',
            })}
          />
        </Box>
      )}
      <Box mt={24} pl={4} mb={4} pr={4}>
        {referralRequired && (
          <Text color="gray.2" fontSize={2} pb={3}>
            {intl.formatMessage({ id: 'claim.referralLettersInfo' })}
          </Text>
        )}
        <Text color="gray.2" fontSize={2} pb={3}>
          {intl.formatMessage({ id: 'claim.uploadDocumentsInfo' })}
        </Text>
      </Box>
      <Box pl={4} pr={4} mb={5}>
        <Button
          primary
          disabled={disableButton}
          onPress={() => {
            navigation.navigate(CLAIM_REVIEW);
          }}
          title={
            submitting
              ? intl.formatMessage({ id: 'isSubmitting' })
              : intl.formatMessage({ id: 'claim.reviewClaimButtonText' })
          }
        />
      </Box>
    </ScrollView>
  );
};

ClaimUploadDocumentsScreen.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.shape({})),
  referrals: PropTypes.arrayOf(PropTypes.shape({})),
  array: PropTypes.shape({
    remove: PropTypes.func.isRequired,
  }),
  change: PropTypes.func,
  submitting: PropTypes.bool,
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
  referralRequired: PropTypes.bool,
};

const selector = formValueSelector('claimDetailsForm');
const enhance = compose(
  connect(state => {
    const claimTypeId = selector(state, 'claimTypeId');
    const selectedClaimType = state.claimType.types.byId[claimTypeId];
    return {
      displayPrescriptionUpload: selectedClaimType.code === 'NF-CHNHERBA',
      documents: selector(state, 'documents'),
      settlementAdvices: selector(state, 'settlementAdvices'),
      prescriptions: selector(state, 'prescriptions'),
      referrals: selector(state, 'referrals'),
      isMultiInsurer: selector(state, 'isMultiInsurer'),
      referralRequired: selectedClaimType?.referralRequired,
    };
  }),
  reduxForm({
    form: 'claimDetailsForm',
    destroyOnUnmount: false,
  }),
  injectIntl,
);

export default enhance(ClaimUploadDocumentsScreen);
