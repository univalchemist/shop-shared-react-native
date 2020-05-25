import {
  Box,
  Button,
  Container,
  Datepicker,
  ScrollView,
  StepProgressBar,
  Text,
} from '@wrappers/components';
import {
  CheckBoxField,
  InputField,
  SelectField,
} from '@wrappers/components/form';
import { normalizeAmount } from '@wrappers/core/normalizers';
import {
  validateConsultationDate,
  validateClaimType,
  validateClaimReason,
  validateDiagnosisText,
  hasValue,
} from '@wrappers/core/validations';
import {
  CLAIM_TYPE_MODAL,
  CLAIM_REASON_MODAL,
  CLAIM_UPLOAD_DOCUMENTS,
} from '@routes';
import moment from 'moment/min/moment-with-locales';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components/native';
import WalletBalancePanel, {
  WalletBalancePanelError,
  WalletBalanceSkeletonPlaceholder,
} from '@components/WalletBalancePanel';
import { useFetchActions, useTheme } from '@wrappers/core/hooks';
import { fetchWallet } from '@store/wallet/actions';
import { CLAIM_REASON_OTHERS } from './constants';
import { categories, logAction } from '@store/analytics/trackingActions';

const PrefixLeftText = styled(Text)`
  font-size: 16px;
  font-weight: 300;
  ${({ theme }) => `
    color: ${theme.inputField.rightText}
  `};
`;

const styles = {
  infoWrapper: {
    flexDirection: 'row',
  },
  infoText: {
    flex: 1,
  },
  checkboxField: {
    marginLeft: 0,
    padding: 0,
  },
};

const daysAgo = days => {
  const today = new Date();
  const priorDate = new Date().setDate(today.getDate() - days);
  return new Date(priorDate);
};

const ClaimDetailsFormScreen = ({
  claimType,
  fetchWallet,
  handleSubmit,
  change,
  claimTypeId,
  claimReason,
  touch,
  isMultiInsurer,
  intl,
  availableBalance,
  isMaternity = false,
  terminationDate,
  navigation: { navigate },
}) => {
  const theme = useTheme();
  const { types } = claimType;
  const selectedClaimType = types.byId[claimTypeId];
  const selectedClaimReason = claimType?.reasons?.byId[claimReason]?.code;
  const { maxAmountPerClaim: maxReceiptAmount, referralRequired } =
    selectedClaimType || {};

  const isInsuranceClaim = selectedClaimType?.isInsuranceClaim ?? true;
  let showWalletBallance = false;
  if (
    selectedClaimType &&
    claimType.categories.byId[selectedClaimType.claimCategoryId] &&
    claimType.categories.byId[
      selectedClaimType.claimCategoryId
    ].code.toLowerCase() === 'wellness'
  )
    // Only show wallet for WELLNESS
    showWalletBallance = true;
  const [isWalletLoading, isWalletError] = useFetchActions(
    [fetchWallet],
    showWalletBallance,
  );

  const intlMsg = (field, options) =>
    intl.formatMessage({ id: `claim.${field}` }, options);

  const maxReceiptMoney = intl.formatNumber(maxReceiptAmount, {
    format: 'money',
  });

  const receiptAmountHint = maxReceiptAmount
    ? intlMsg('label.hint.receiptAmount', {
        maxReceiptAmount: maxReceiptMoney,
      })
    : undefined;

  const validateMaxAmount = value => {
    if (
      typeof maxReceiptAmount === 'number' &&
      Number(value) &&
      Number(value) > maxReceiptAmount
    ) {
      const formattedAmount = intl.formatNumber(maxReceiptAmount, {
        format: 'money',
      });
      return intl.formatMessage(
        { id: 'exceedsMaximumAmount' },
        { amount: formattedAmount },
      );
    }
    return '';
  };

  const validateMoneyAmount = value => {
    if (!hasValue(value))
      return intl.formatMessage({ id: 'receiptAmountRequired' });
    else if (Number.isNaN(Number(value)))
      return intl.formatMessage({ id: 'moneyAmountInvalid' });
    else if (value > 0) return '';
    else return intl.formatMessage({ id: 'moneyAmountGreaterThanZero' });
  };

  const validateOtherInsurerAmount = (value, allValues) => {
    if (!allValues.isMultiInsurer) return '';
    if (!hasValue(value))
      return intl.formatMessage({ id: 'otherInsurerAmountRequired' });
    return Number(value) < Number(allValues.receiptAmount)
      ? ''
      : intl.formatMessage({ id: 'otherInsurerAmountMustBeLower' });
  };

  const maxDate = () => {
    return terminationDate &&
      new Date(terminationDate).getTime() < new Date().getTime()
      ? moment
          .utc(terminationDate)
          .local()
          .toDate()
      : new Date();
  };
  return (
    <>
      <StepProgressBar currentStep={2} stepCount={4} />
      {showWalletBallance &&
        (isWalletLoading ? (
          <WalletBalanceSkeletonPlaceholder />
        ) : isWalletError ? (
          <WalletBalancePanelError />
        ) : availableBalance === undefined ? (
          <WalletBalancePanelError />
        ) : (
          <WalletBalancePanel balance={availableBalance} />
        ))}

      <ScrollView>
        <Container>
          {showWalletBallance && availableBalance === 0 ? (
            <Box mb={32}>
              <Text color="error.0">
                <FormattedMessage id="claim.wellness.balance.warning" />
              </Text>
            </Box>
          ) : null}
          <Box mt={2}>
            <Box>
              <Datepicker
                defaultDate={maxDate()}
                maximumDate={maxDate()}
                minimumDate={daysAgo(90)}
                onConfirm={date => {
                  change('consultationDate', moment(date).toISOString());
                  logAction({
                    category: categories.CLAIMS_SUBMISSION,
                    action: 'Select consultation date',
                  });
                }}
                onCancel={() => touch('consultationDate')}
                field={({ setIsVisible }) => (
                  <SelectField
                    name="consultationDate"
                    validate={validateConsultationDate}
                    format={date => date && moment(date).format('ll')}
                    label={intlMsg('label.consultationDate')}
                    hint={intlMsg('label.hint.consultationDate')}
                    onPress={() => setIsVisible(true)}
                    onRight={({ color }) => <Icon name="event" color={color} />}
                  />
                )}
              />
            </Box>
            <Box>
              <SelectField
                name="claimType"
                validate={validateClaimType}
                label={intlMsg('label.claimType')}
                onPress={() => navigate(CLAIM_TYPE_MODAL)}
                onRight={({ color }) => (
                  <Icon name="expand-more" color={color} />
                )}
              />
            </Box>
            <Box>
              <SelectField
                name="claimReason"
                format={value =>
                  value && claimType.reasons.byId[value].claimReason
                }
                validate={validateClaimReason}
                disabled={!claimTypeId}
                label={intlMsg('label.claimReason')}
                onPress={() => navigate(CLAIM_REASON_MODAL)}
                onRight={({ color }) => (
                  <Icon name="expand-more" color={color} />
                )}
              />
            </Box>
            {selectedClaimReason === CLAIM_REASON_OTHERS ? (
              <Box>
                <InputField
                  name="diagnosisText"
                  validate={validateDiagnosisText}
                  maxLength={20}
                  returnKeyType="done"
                  label={intlMsg('label.claimOtherReason')}
                  customStyles={theme.customInputStyles}
                />
              </Box>
            ) : null}

            <Box>
              <InputField
                name="receiptAmount"
                validate={[validateMoneyAmount, validateMaxAmount]}
                validationErrorsLocalized
                keyboardType="numeric"
                returnKeyType="done"
                normalize={normalizeAmount}
                leftIcon={<PrefixLeftText>HK$ </PrefixLeftText>}
                label={
                  isInsuranceClaim
                    ? intlMsg('label.receiptAmount')
                    : intlMsg('label.claimAmount')
                }
                hint={receiptAmountHint}
                customStyles={theme.customInputStyles}
              />
            </Box>
            <Box mb={20}>
              <CheckBoxField
                name="isMaternity"
                size={24}
                containerStyle={styles.checkboxField}
                label={intlMsg('label.isMaternity')}
              />
              {isMaternity ? (
                <Box
                  p={10}
                  style={styles.infoWrapper}
                  backgroundColor={theme.colors.info[2]}
                >
                  <Icon name="info" color={theme.colors.blue[3]} />
                  <Text
                    ml={10}
                    style={styles.infoText}
                    color={theme.colors.gray[0]}
                  >
                    {intl.formatMessage({ id: 'claim.maternityNote' })}
                  </Text>
                </Box>
              ) : null}
            </Box>

            {isInsuranceClaim ? (
              <Box paddingBottom={34} paddingRight={10}>
                <CheckBoxField
                  name="isMultiInsurer"
                  size={24}
                  containerStyle={styles.checkboxField}
                  label={intlMsg('withAnotherInsurerText')}
                  onChange={data => {
                    if (!data) {
                      change('otherInsurerAmount', '');
                    } else {
                      logAction({
                        category: categories.CLAIMS_SUBMISSION,
                        action: 'Made a claim with another insurer',
                      });
                    }
                  }}
                />
              </Box>
            ) : null}

            {isInsuranceClaim && isMultiInsurer && (
              <Box>
                <InputField
                  name="otherInsurerAmount"
                  label={intlMsg('label.otherInsurerAmount')}
                  hint={intlMsg('label.hint.otherInsurerAmount')}
                  validationErrorsLocalized
                  validate={[validateMoneyAmount, validateOtherInsurerAmount]}
                  keyboardType="numeric"
                  returnKeyType="done"
                  normalize={normalizeAmount}
                  leftIcon={<PrefixLeftText>HK$ </PrefixLeftText>}
                  customStyles={theme.customInputStyles}
                />
              </Box>
            )}
            <Box>
              <Button
                primary
                onPress={handleSubmit(() => {
                  if (!referralRequired) {
                    change('referrals', []);
                  }
                  if (!isMultiInsurer) {
                    change('otherInsurerAmount', '');
                  }
                  navigate(CLAIM_UPLOAD_DOCUMENTS);
                })}
                title={intlMsg('uploadDocuments')}
                disabled={
                  showWalletBallance
                    ? isWalletLoading || availableBalance <= 0
                    : false
                }
              />
            </Box>
          </Box>
        </Container>
      </ScrollView>
    </>
  );
};

ClaimDetailsFormScreen.propTypes = {
  handleSubmit: PropTypes.func,
  theme: PropTypes.shape({}),
  claimType: PropTypes.shape({ selectedClaimItem: PropTypes.string }),
  claimReason: PropTypes.number,
  change: PropTypes.func.isRequired,
  claimTypeId: PropTypes.number,
  touch: PropTypes.func.isRequired,
  isMultiInsurer: PropTypes.bool,
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
  maxReceiptAmount: PropTypes.number,
  referralRequired: PropTypes.bool,
};

const mapStateToProps = ({
  claimType,
  form: {
    claimDetailsForm: {
      values: {
        claimTypeId,
        isMultiInsurer,
        selectedPatientId = '',
        claimReason,
        isMaternity,
      } = {},
    } = {},
  },
  wallet: { balanceMap },
  user: { membersMap },
}) => ({
  claimType,
  claimTypeId,
  claimReason,
  isMaternity,
  isMultiInsurer,
  availableBalance: balanceMap[selectedPatientId],
  terminationDate: membersMap[selectedPatientId].terminationDate,
});

const enhance = compose(
  connect(mapStateToProps, { fetchWallet }),
  reduxForm({
    form: 'claimDetailsForm',
    destroyOnUnmount: false,
  }),
  injectIntl,
);

export default enhance(ClaimDetailsFormScreen);
