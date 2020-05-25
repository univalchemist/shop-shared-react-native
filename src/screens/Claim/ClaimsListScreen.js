import React, { useMemo, useEffect, useState } from 'react';
import {
  Box,
  TrackedFloatingActionButton,
  FormattedMoney,
  Icon,
  Image,
  TrackedListItem,
  SectionHeadingText,
  Text,
  ErrorPanel,
  LabelValueText,
  SectionListSkeletonPlaceholder,
  IconSkeletonPlaceholder,
  TextSkeletonPlaceholder,
  withTracking,
} from '@wrappers/components';
import { claimNoHistory } from '@images/claim';
import { warningMoreInfoIcon } from '@images';
import { CLAIM_DETAILS, CLAIM_PATIENT_DETAILS } from '@routes';
import { getClaims } from '@store/claim/actions';
import moment from 'moment/min/moment-with-locales';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { FormattedMessage } from 'react-intl';
import { SectionList, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { CLAIM_STATUS } from '@store/claim/constants';
import { PromiseStatus } from '@middlewares';
import { categories } from '@store/analytics/trackingActions';

const RequestInformationText = styled(Text)`
  ${({ theme }) => `
  color: ${theme.colors.gray[0]}
  padding: 2px 0px 0px 4px
  font-size:${theme.fontSizes[0]}
  line-height:${theme.fontSizes[1]}
  `}
`;

export const ClaimListSkeletonPlaceholder = () => (
  <SectionListSkeletonPlaceholder
    leftIcon={<IconSkeletonPlaceholder borderRadius={12} />}
    count={3}
  >
    <TextSkeletonPlaceholder width={108} />
    <Box mt={1}>
      <TextSkeletonPlaceholder width={240} />
    </Box>
    <Box mt={1}>
      <TextSkeletonPlaceholder width={90} />
    </Box>
  </SectionListSkeletonPlaceholder>
);

const getIconForStatus = status => {
  switch (status) {
    case CLAIM_STATUS.APPROVED:
      return (
        <Icon
          variant="success"
          name="check-circle-outline"
          type="material-community"
        />
      );
    case CLAIM_STATUS.REJECTED:
      return <Icon variant="error" name="highlight-off" />;

    case CLAIM_STATUS.PENDING:
    default:
      return <Icon variant="default" name="access-time" />;
  }
};

const NoClaims = ({ dependentText: DependentText }) => {
  return (
    <Box height="100%" flex={1} justifyContent="center" alignItems="center">
      <Box>
        <Image
          maxWidth={215}
          maxHeight={215}
          source={claimNoHistory}
          resizeMode="contain"
        />
      </Box>
      <Box mt={4}>
        {DependentText ? (
          <DependentText />
        ) : (
          <Text
            fontWeight={300}
            fontSize={32}
            lineHeight={37}
            letterSpacing={-1.5}
          >
            <FormattedMessage id="claim.noClaimsText" />
          </Text>
        )}
      </Box>
    </Box>
  );
};

const ClaimsListItem = withTracking(
  React.memo(props => {
    const {
      claimId,
      status,
      statusCode,
      receiptDate,
      categoryCode,
      memberId,
      claimantId,
      claimantName,
      amount,
      approvedAmount,
      onPress,
      isCashlessClaim,
    } = props;

    const intl = useIntl();

    return (
      <TrackedListItem
        withFullDivider
        leftIcon={getIconForStatus(statusCode)}
        rightIcon={<Icon name="chevron-right" variant="default" />}
        onPress={() => onPress(claimId)}
        leftIconAccessibilityLabel={status}
        event="view_submitted_claim"
        eventParams={{
          category: 'Claims',
          action: `View ${status} ${claimId}`,
        }}
      >
        {statusCode === CLAIM_STATUS.REQUEST_FOR_INFORMATION && (
          <Box flex={1} mb={1}>
            <Box flexDirection={'row'}>
              <Image
                source={warningMoreInfoIcon}
                style={{ width: 14, height: 14 }}
              />
              <RequestInformationText>
                {intl.formatMessage({ id: 'claim.moreInformation' })}
              </RequestInformationText>
            </Box>
          </Box>
        )}
        <LabelValueText label={moment(receiptDate).format('ll')}>
          <Text numberOfLines={2}>
            {intl.formatMessage({
              id: `claim.claimFilters.${categoryCode.toLowerCase()}`,
              defaultMessage: categoryCode,
            })}
          </Text>
          {claimantId !== memberId && (
            <Text numberOfLines={2}>{`(${claimantName})`}</Text>
          )}
          {!isCashlessClaim && (
            <Text>
              {statusCode === CLAIM_STATUS.APPROVED ? (
                <>
                  <FormattedMoney value={approvedAmount} />
                  {' ('}
                  <FormattedMessage id="claim.reimbursed" />
                  {')'}
                </>
              ) : (
                <FormattedMoney value={amount} />
              )}
            </Text>
          )}
        </LabelValueText>
      </TrackedListItem>
    );
  }),
);

ClaimsListItem.propTypes = {
  claimId: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  memberId: PropTypes.string.isRequired,
  claimantId: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  statusCode: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const ClaimsListSectionHeader = ({ title }) => (
  <Box backgroundColor="gray.7" px={4} pt={24} pb={2}>
    <SectionHeadingText>
      <FormattedMessage id={`claim.claimsListSection.${title}`} />
    </SectionHeadingText>
  </Box>
);

ClaimsListSectionHeader.propTypes = {
  title: PropTypes.node.isRequired,
};

function sortClaimsByDateDesc(lhs, rhs) {
  return moment(rhs.createdOn).valueOf() - moment(lhs.createdOn).valueOf();
}

const ClaimsListScreen = ({
  getClaims,
  processingClaims,
  completedClaims,
  claimsMap,
  membersMap,
  userId,
  dependentText: DependentText,
  noFab,
  getClaimCompleted,
  navigation,
}) => {
  const intl = useIntl();
  useTheme();

  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchClaims = async () => {
      await getClaims();
    };
    fetchClaims();
  }, [getClaims, intl]);

  const onPressClaimListItem = claimId =>
    navigation.navigate(CLAIM_DETAILS, {
      claimId,
      title: claimId,
    });

  const processingClaimsList = useMemo(
    () =>
      processingClaims.orderAll
        .map(id => {
          let claim = claimsMap[id];
          claim.claimantName = membersMap[claim.claimantId].fullName;
          claim.memberId = membersMap[userId].memberId;
          return claim;
        })
        .sort(sortClaimsByDateDesc),
    [processingClaims.orderAll, claimsMap, membersMap, userId],
  );

  const historyClaims = [...completedClaims.orderAll];
  const historyClaimList = useMemo(() => {
    return historyClaims
      .map(id => {
        let claim = claimsMap[id];
        claim.claimantName = membersMap[claim.claimantId].fullName;
        claim.memberId = membersMap[userId].memberId;
        return claim;
      })
      .sort(sortClaimsByDateDesc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedClaims.orderAll, claimsMap, membersMap, userId]);
  const hasProcessingClaims = processingClaimsList.length > 0;
  const hasHistoryClaims = historyClaimList?.length > 0;
  const hasClaims = hasProcessingClaims || hasHistoryClaims;
  const noFilteredClaims = Object.keys(claimsMap).length !== 0;

  const sections = [
    hasProcessingClaims && {
      title: CLAIM_STATUS.PROCESSING.toLowerCase(),
      data: processingClaimsList,
    },
    hasHistoryClaims && {
      title: CLAIM_STATUS.HISTORY.toLowerCase(),
      data: historyClaimList,
    },
  ].filter(Boolean);

  let component;
  if (getClaimCompleted === PromiseStatus.START) {
    component = <ClaimListSkeletonPlaceholder />;
  } else if (getClaimCompleted === PromiseStatus.ERROR) {
    component = <ErrorPanel />;
  } else if (hasClaims) {
    component = (
      <Box>
        <SectionList
          ListHeaderComponent={
            DependentText && <DependentText textAlign="left" top />
          }
          ListFooterComponent={<Box pb={24} />}
          renderSectionFooter={() => <Box pb={2} />}
          initialNumToRender={100}
          onEndReachedThreshold={0.5}
          stickySectionHeadersEnabled
          sections={sections}
          keyExtractor={item => item.claimId}
          renderItem={({ item }) => {
            return (
              <ClaimsListItem
                {...item}
                onPress={() => onPressClaimListItem(item.claimId)}
                actionParams={{
                  category: categories.CLAIMS,
                  action: 'View claim',
                }}
              />
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <ClaimsListSectionHeader title={title} />
          )}
          onRefresh={async () => {
            setRefreshing(true);
            await getClaims();
            setRefreshing(false);
          }}
          refreshing={isRefreshing}
        />
      </Box>
    );
  } else if (!hasClaims && noFilteredClaims) {
    component = (
      <ErrorPanel
        heading={intl.formatMessage({
          id: 'claim.noResultsAvailable',
        })}
        description={intl.formatMessage({
          id: 'claim.noFilteredClaimResults',
        })}
      />
    );
  } else {
    component = <NoClaims dependentText={DependentText} />;
  }

  return (
    <Box backgroundColor="gray.7" flex={1} as={SafeAreaView}>
      {noFab ? null : (
        <TrackedFloatingActionButton
          accessibilityLabel={intl.formatMessage({
            id: 'claim.button.makeANewClaim',
          })}
          onPress={() => navigation.navigate(CLAIM_PATIENT_DETAILS)}
          event="make_a_new_claim"
          eventParams={{
            category: 'Claims',
            action: 'Make a new claim',
            label: 'user',
          }}
          actionParams={{
            category: categories.CLAIMS,
            action: 'Make a claim',
          }}
        />
      )}
      {component}
    </Box>
  );
};

ClaimsListScreen.propTypes = {
  getClaims: PropTypes.func.isRequired,
  pendingClaims: PropTypes.shape({
    orderAll: PropTypes.array.isRequired,
  }),
  completedClaims: PropTypes.shape({
    orderAll: PropTypes.array.isRequired,
  }),
  claimsMap: PropTypes.shape({}).isRequired,
  selectedClaimFilters: PropTypes.array,
};

const mapStateToProps = ({
  user: { membersMap, userId },
  claim: { processing, completed, claimsMap, getClaimCompleted },
}) => ({
  processingClaims: processing,
  completedClaims: completed,
  claimsMap: claimsMap,
  membersMap,
  userId,
  getClaimCompleted,
});

export default connect(mapStateToProps, { getClaims })(ClaimsListScreen);
