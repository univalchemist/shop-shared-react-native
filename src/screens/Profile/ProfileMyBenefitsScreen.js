import {
  Box,
  ErrorPanel,
  FieldSkeletonPlaceholder,
  SectionListSkeletonPlaceholder,
  SectionHeadingText,
  Text,
  ListItem,
  TrackedListItem,
  LabelValueText,
  Image,
  Icon,
} from '@wrappers/components';
import { SelectField } from '@wrappers/components/form';
import { useIntl, useFetchActions } from '@wrappers/core/hooks';
import React, { useEffect, useCallback } from 'react';
import { SectionList } from 'react-native';
import { fetchBenefits, fetchPolicyDetails } from '@store/benefit/actions';
import { fetchWallet } from '@store/wallet/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { PROFILE_MEMBER_MODAL, PROFILE_BENEFIT_DETAILS } from '@routes';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { chevronRightArrow } from '@images';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  categories,
  benefitProductType,
} from '@store/analytics/trackingActions';

const ProfileMyBenefitsSkeletonPlaceholder = () => (
  <Box>
    <Box pt={4} pl={4} pr={4} mb={2}>
      <FieldSkeletonPlaceholder />
    </Box>
    <SectionListSkeletonPlaceholder count={4} />
  </Box>
);

const ProfileMyBenefitsScreen = ({
  loginMemberId,
  loginMemberName,
  membersMap,
  benefit,
  wallet,
  change,
  fetchBenefits,
  fetchWallet,
  fetchPolicyDetails,
  selectedMemberId,
  memberName,
  momentLocale,
  navigation,
}) => {
  const { byMemberId: benefitsByMemberId, policy } = benefit;
  const { plans } = policy;
  const intl = useIntl();

  const fetchBenefitsData = useCallback(async () => {
    await Promise.all([fetchPolicyDetails(), fetchBenefits()]);
  }, [fetchPolicyDetails, fetchBenefits]);

  const [isLoading, isError] = useFetchActions([fetchBenefitsData]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  if (selectedMemberId === undefined) {
    change('memberName', loginMemberName);
    change('selectedMemberId', loginMemberId);
  }

  const selectedMemberBenefit =
    selectedMemberId && benefitsByMemberId
      ? benefitsByMemberId[selectedMemberId]
      : null;

  const selectedProducts =
    selectedMemberBenefit && plans
      ? plans[selectedMemberBenefit.planId].products
      : null;

  const selectedExternalWalletBalanceText = selectedMemberId
    ? wallet.balanceTextMap[selectedMemberId]
    : null;

  const selectedRelationshipCategory =
    selectedMemberId && membersMap
      ? membersMap[selectedMemberId].relationshipCategory !== 'Self'
        ? membersMap[selectedMemberId].relationshipCategory
        : 'Employee'
      : null;

  const policyDetailList = policy
    ? [
        {
          label: intl.formatMessage({
            id: 'profile.myBenefits.policyNumber',
          }),
          value: policy.policyNumber,
        },
        {
          label: intl.formatMessage({
            id: 'profile.myBenefits.insurer',
          }),
          value: policy.insurer?.myBenefitsName,
        },
        {
          label: intl.formatMessage({
            id: 'profile.myBenefits.effectivePeriod',
          }),
          value: `${moment(policy.initialDate)
            .locale(momentLocale)
            .format('ll')} - ${moment(policy.expiryDate)
            .locale(momentLocale)
            .format('ll')}`,
        },
      ]
    : [];

  return (
    <Box bg="gray.7" flex={1}>
      {isLoading ? (
        <ProfileMyBenefitsSkeletonPlaceholder />
      ) : isError ? (
        <ErrorPanel />
      ) : (
        <>
          {selectedProducts && selectedMemberBenefit ? (
            <Box>
              <SectionList
                ListHeaderComponent={
                  <Box px={4} pt={4}>
                    <SelectField
                      name="memberName"
                      label={intl.formatMessage({
                        id: 'profile.myBenefits.select.member',
                      })}
                      onPress={() => navigation.navigate(PROFILE_MEMBER_MODAL)}
                      onRight={({ color }) => (
                        <Icon name="expand-more" color={color} />
                      )}
                    />
                  </Box>
                }
                initialNumToRender={100}
                onEndReachedThreshold={0.5}
                stickySectionHeadersEnabled
                sections={[
                  {
                    title: plans[selectedMemberBenefit.planId].name,
                    data: selectedProducts,
                  },
                  {
                    title: null,
                    data: policyDetailList,
                    renderItem: ({ item }) => (
                      <ListItem>
                        <LabelValueText label={item.label}>
                          {item.value}
                        </LabelValueText>
                      </ListItem>
                    ),
                    keyExtractor: item => item.label,
                  },
                ]}
                keyExtractor={(item, index) => item.name + index}
                renderItem={({ item }) => (
                  <TrackedListItem
                    rightIcon={<Image source={chevronRightArrow} />}
                    onPress={() =>
                      navigation.navigate(PROFILE_BENEFIT_DETAILS, {
                        product: item,
                        memberBenefit: selectedMemberBenefit,
                        memberName,
                        externalWalletBalanceText: selectedExternalWalletBalanceText,
                        relationshipCategory: selectedRelationshipCategory,
                      })
                    }
                    actionParams={{
                      category: categories.PROFILE_BENEFITS_SUMMARY,
                      action: `${benefitProductType[item.productType]} for ${
                        membersMap[selectedMemberId].role
                      }`,
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TrackedListItem>
                )}
                renderSectionHeader={({ section: { title } }) =>
                  title && (
                    <Box backgroundColor="gray.7" px={4} pt={2} pb={2}>
                      <SectionHeadingText>
                        <FormattedMessage
                          id={`profile.myBenefits.tier.section`}
                          values={{ number: title }}
                        />
                      </SectionHeadingText>
                    </Box>
                  )
                }
                ListFooterComponent={<Box pb={80} />}
              />
            </Box>
          ) : (
            <>
              <ErrorPanel />
            </>
          )}
        </>
      )}
    </Box>
  );
};

ProfileMyBenefitsScreen.propTypes = {
  member: PropTypes.shape({
    selectedName: PropTypes.string,
    employee: PropTypes.shape({}),
  }),
  benefit: PropTypes.shape({
    byMemberId: PropTypes.shape({}),
    plansById: PropTypes.shape({}),
    package: PropTypes.shape({}),
  }),
  wallet: PropTypes.shape({
    balanceMap: PropTypes.shape({}),
  }),
  change: PropTypes.func,
  fetchBenefits: PropTypes.func,
  selectedMemberId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const mapStateToProps = ({
  user: { membersMap, userId },
  benefit,
  wallet,
  form: { memberForm },
  intl: { momentLocale },
}) => ({
  loginMemberId: userId,
  loginMemberName: membersMap[userId]?.fullName,
  membersMap,
  benefit,
  wallet,
  memberName: memberForm?.values?.memberName,
  selectedMemberId: memberForm?.values?.selectedMemberId,
  momentLocale,
});

const mapDispatchToProps = {
  fetchBenefits,
  fetchWallet,
  fetchPolicyDetails,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'memberForm',
    destroyOnUnmount: false,
  }),
);

export { ProfileMyBenefitsSkeletonPlaceholder };
export default enhance(ProfileMyBenefitsScreen);
