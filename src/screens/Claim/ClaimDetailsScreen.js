import {
  Box,
  Text,
  SectionHeadingText,
  Image,
  ListItem,
  DocumentUploaderWithScrollBar,
  LabelValueText,
  ScreenHeadingText,
  SecondaryText,
  TextSkeletonPlaceholder,
  ListSkeletonPlaceholder,
  ImageSkeletonPlaceholder,
} from '@wrappers/components';
import { useIntl, useFetchActions, useTheme } from '@wrappers/core/hooks';
import { getClaim } from '@store/claim/actions';
import styled from 'styled-components/native';
import {
  claimPendingClaim,
  claimRejectedClaim,
  claimApprovedClaim,
} from '@images/claim';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { warningIconLarge } from '@images';
import { SectionList, View } from 'react-native';
import { connect } from 'react-redux';
import { CLAIM_DETAILS_DOCUMENT_VIEWER_MODAL } from '@routes';
import { CLAIM_STATUS } from '@store/claim/constants';
import { isEmptyString } from './utils/isEmptyString';

const statusImageMap = {
  [CLAIM_STATUS.PENDING]: claimPendingClaim,
  [CLAIM_STATUS.APPROVED]: claimApprovedClaim,
  [CLAIM_STATUS.REJECTED]: claimRejectedClaim,
  [CLAIM_STATUS.PROCESSING]: claimPendingClaim,
  [CLAIM_STATUS.REQUEST_FOR_INFORMATION]: claimPendingClaim,
};

const getHeaderTitle = ({ intl, statusCode }) => {
  let headerId = statusCode;
  if (statusCode === CLAIM_STATUS.REQUEST_FOR_INFORMATION) {
    headerId = CLAIM_STATUS.PROCESSING;
  }
  return intl.formatMessage({
    id: `claim.claimsListSection.${headerId.toLowerCase()}`,
  });
};

const LOADER_TITLE = 'ThisIsASkeletonLoaderForSectionTitle';
const WELLNESS = 'Wellness';
const zhLocale = ['zh-Hant-HK', 'zh-HK'];

const InformationContainer = props => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.primary[2],
        flexDirection: 'row',
        borderRadius: 4,
        marginHorizontal: 32,
        padding: 16,
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

const RequestInformationImage = styled(Image)`
  margin-top: 2px;
  width: 18px;
  height: 15px;
`;

const RequestInformationText = styled(Text)`
  ${({ theme }) => `
  color: ${theme.colors.black}
  padding: 0px 0px 0px 11px
  font-size: ${theme.fontSizes[2]}
  line-height:${theme.fontSizes[3]}
  `}
`;

const DetailsListSectionHeader = ({ title }) => (
  <Box backgroundColor="gray.7" px={4} pt={2} pb={2}>
    {title === LOADER_TITLE ? (
      <TextSkeletonPlaceholder width={100} />
    ) : (
      <SectionHeadingText>{title}</SectionHeadingText>
    )}
  </Box>
);

const DetailsListItem = React.memo(props => {
  const { label, value } = props;
  const valueText = value && value.length > 0 ? value : '-';
  return (
    <ListItem>
      <LabelValueText label={label}>{valueText}</LabelValueText>
    </ListItem>
  );
});

const ListHeader = ({ statusCode, status, category, singleClaim, claimId }) => {
  const intl = useIntl();
  const imageSrc = statusImageMap[statusCode];
  const headingText = getHeaderTitle({ intl, statusCode });
  const subHeadingText = category;
  const theme = useTheme();
  return (
    <Box pt={4} ph={4} pb={0} alignItems="center">
      <Box mb={4}>
        <Image width={215} source={imageSrc} resizeMode="contain" />
      </Box>
      <ScreenHeadingText>{headingText}</ScreenHeadingText>
      <Box mt={1} mb={3}>
        <SecondaryText>{subHeadingText}</SecondaryText>
      </Box>
      {status === CLAIM_STATUS.REQUEST_FOR_INFORMATION && (
        <View style={{ width: '100%' }}>
          <InformationContainer
            style={{
              backgroundColor: theme.colors.primary[2],
            }}
          >
            <RequestInformationImage source={warningIconLarge} />
            <RequestInformationText>
              {intl.formatMessage({ id: 'claim.details.moreInformation' })}
            </RequestInformationText>
          </InformationContainer>
        </View>
      )}
      {singleClaim && singleClaim.claimId === claimId && !!singleClaim.remark && (
        <View style={{ width: '100%', marginTop: 12 }}>
          <InformationContainer
            style={{
              backgroundColor: theme.colors.gray[6],
            }}
          >
            <RequestInformationText>
              {singleClaim.remark}
            </RequestInformationText>
          </InformationContainer>
        </View>
      )}
    </Box>
  );
};

const renderLabelValueItem = ({ item }) => {
  const { label, value } = item;
  const props = {
    label,
    value,
  };
  return <DetailsListItem {...props} />;
};

const renderDocumentItem = ({ item, navigation, field, documentType }) => (
  <DocumentUploaderWithScrollBar
    size={item.length}
    data={item.map(file => ({ ...file, type: file.contentType, secure: true }))}
    onView={idx => {
      navigation.navigate(CLAIM_DETAILS_DOCUMENT_VIEWER_MODAL, {
        ...item[idx],
        secure: true,
      });
    }}
    accessibilityDocumentType={documentType}
    accessibilityField={field}
  />
);

const ClaimDetailsScreen = ({
  claimId,
  claimantName,
  claim,
  getClaim,
  singleClaim,
  momentLocale,
  navigation,
}) => {
  const intl = useIntl();

  const [isLoading] = useFetchActions([getClaim], true, [claimId], [claimId]);

  const sections = React.useMemo(() => {
    if (!claim) {
      return [];
    }
    const labelMap = {
      section: {
        patientDetails: intl.formatMessage({
          id: 'claim.section.patientDetails',
        }),
        claimDetails: intl.formatMessage({
          id: 'claim.section.claimDetails',
        }),
        receipts: intl.formatMessage({
          id: 'claim.section.receipts',
        }),
        referrals: intl.formatMessage({
          id: 'claim.section.referrals',
        }),
        settlementAdvices: intl.formatMessage({
          id: 'claim.section.settlementAdvices',
        }),
        prescriptions: intl.formatMessage({
          id: 'claim.section.prescriptions',
        }),
      },
      settlementDate: intl.formatMessage({
        id: 'claim.label.settlementDate',
      }),
      totalReimbursedAmount: intl.formatMessage({
        id: 'claim.label.totalReimbursedAmount',
      }),
      claimantName: intl.formatMessage({ id: 'claim.label.patientName' }),
      contactNumber: intl.formatMessage({
        id: 'claim.label.contactNumber',
      }),
      claimType: intl.formatMessage({
        id: 'claim.label.claimType',
      }),
      claimReason: intl.formatMessage({ id: 'claim.label.claimReason' }),
      consultationDate: intl.formatMessage({
        id: 'claim.label.consultationDate',
      }),
      receiptAmount:
        claim.claimItemCategory === WELLNESS
          ? intl.formatMessage({ id: 'claim.label.claimAmount' })
          : intl.formatMessage({ id: 'claim.label.receiptAmount' }),
      otherInsurerAmount: intl.formatMessage({
        id: 'claim.label.otherInsurerAmount',
      }),
      accessibilityDocumentType: intl.formatMessage({
        id: 'uploadBox.accessibilityLabel.type.document',
      }),
    };

    const {
      type,
      reason,
      receiptDate,
      statusCode,
      contactNumber,
      otherInsurerAmount,
      documents: { receipts, referrals, settlementAdvices, prescriptions },
    } = claim;

    const {
      approvedAmount,
      isCashlessClaim,
      lastUpdatedOn: settlementDate,
      amount: singleClaimAmount,
      paymentList = [],
    } = singleClaim;
    const shouldRenderReceipts = receipts.length > 0;
    const shouldRenderReferrals = referrals.length > 0;
    const shouldRenderSettlementAdvices = settlementAdvices.length > 0;
    const shouldRenderPrescriptions = prescriptions.length > 0;
    const reimbursedData =
      (statusCode === CLAIM_STATUS.APPROVED && [
        {
          label: labelMap.totalReimbursedAmount,
          value: !isCashlessClaim
            ? intl.formatNumber(approvedAmount, {
                format: 'money',
              })
            : 0,
        },
      ]) ||
      [];
    const getLabelLocalisation = index =>
      intl.formatMessage(
        {
          id: 'claim.label.reimbursedItemAmount',
        },
        { index: index + 1 },
      );
    const getValueLocalisation = item => {
      let benefitDesc = '';
      if (
        zhLocale.includes(intl.locale) &&
        !isEmptyString(item.benefitDescSch)
      ) {
        benefitDesc = item.benefitDescSch;
      } else {
        benefitDesc = item.benefitDescEng;
      }

      return (
        benefitDesc +
        ' ' +
        (!isCashlessClaim
          ? intl.formatNumber(item.reimbursedAmount, {
              format: 'money',
            })
          : 0)
      );
    };
    if (!isCashlessClaim)
      paymentList.forEach((item, index) => {
        reimbursedData.push({
          label: getLabelLocalisation(index),
          value: getValueLocalisation(item),
        });
      });

    return [
      {
        title: null,
        data: [
          ...reimbursedData,
          (statusCode === CLAIM_STATUS.APPROVED ||
            statusCode === CLAIM_STATUS.REJECTED) && {
            label: labelMap.settlementDate,
            value:
              !isCashlessClaim &&
              moment(settlementDate)
                .locale(momentLocale)
                .format('ll'),
          },
        ].filter(Boolean),
      },
      {
        title: labelMap.section.patientDetails,
        data: [
          {
            label: labelMap.claimantName,
            value: claimantName,
          },
          {
            label: labelMap.contactNumber,
            value: contactNumber,
          },
        ],
      },
      {
        title: labelMap.section.claimDetails,
        data: [
          {
            label: labelMap.claimType,
            value: type,
          },
          {
            label: labelMap.claimReason,
            value: reason,
          },
          {
            label: labelMap.consultationDate,
            value: moment(receiptDate)
              .locale(momentLocale)
              .format('ll'),
          },
          {
            label: labelMap.receiptAmount,
            value:
              !isCashlessClaim &&
              intl.formatNumber(singleClaimAmount, {
                format: 'money',
              }),
          },
          otherInsurerAmount > 0 && {
            label: labelMap.otherInsurerAmount,
            value: intl.formatNumber(otherInsurerAmount, {
              format: 'money',
            }),
          },
        ].filter(Boolean),
      },
      shouldRenderReceipts && {
        title: labelMap.section.receipts,
        data: [receipts],
        renderItem: ({ item }) =>
          renderDocumentItem({
            item,
            navigation,
            field: labelMap.section.receipts,
            documentType: labelMap.accessibilityDocumentType,
          }),
        keyExtractor: () => 'receipts',
      },
      shouldRenderReferrals && {
        title: labelMap.section.referrals,
        data: [referrals],
        renderItem: ({ item }) =>
          renderDocumentItem({
            item,
            navigation,
            field: labelMap.section.receipts,
            documentType: labelMap.accessibilityDocumentType,
          }),
        keyExtractor: () => 'referrals',
      },
      shouldRenderSettlementAdvices && {
        title: labelMap.section.receipts,
        data: [receipts],
        renderItem: ({ item }) =>
          renderDocumentItem({
            item,
            navigation,
            field: labelMap.section.settlementAdvices,
            documentType: labelMap.accessibilityDocumentType,
          }),
        keyExtractor: () => 'receipts',
      },
      shouldRenderPrescriptions && {
        title: labelMap.section.receipts,
        data: [receipts],
        renderItem: ({ item }) =>
          renderDocumentItem({
            item,
            navigation,
            field: labelMap.section.prescriptions,
            documentType: labelMap.accessibilityDocumentType,
          }),
        keyExtractor: () => 'receipts',
      },
    ].filter(Boolean);
  }, [claim, intl, singleClaim, momentLocale, claimantName, navigation]);

  if (isLoading) {
    return (
      <Box backgroundColor="gray.7" flex={1}>
        <Box alignItems="center">
          <Box mb={4} mt={4}>
            <ImageSkeletonPlaceholder />
          </Box>
          <Box mb={4}>
            <TextSkeletonPlaceholder />
          </Box>
        </Box>
        <ListSkeletonPlaceholder count={6} />
      </Box>
    );
  }

  return (
    <Box backgroundColor="gray.7" flex={1}>
      <SectionList
        scrollIndicatorInsets={{ right: 1 }}
        ListHeaderComponent={
          <ListHeader
            status={claim.status}
            statusCode={claim.statusCode}
            category={claim.category}
            singleClaim={singleClaim}
            claimId={claimId}
          />
        }
        renderSectionFooter={() => <Box pb={32} />}
        initialNumToRender={100}
        onEndReachedThreshold={0.5}
        stickySectionHeadersEnabled
        sections={sections}
        keyExtractor={item => item.label}
        renderSectionHeader={({ section: { title } }) =>
          title && <DetailsListSectionHeader title={title} />
        }
        renderItem={renderLabelValueItem}
        ListFooterComponent={<Box pb={80} />}
      />
    </Box>
  );
};

ClaimDetailsScreen.propTypes = {
  claimId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  claim: PropTypes.shape({}),
  singleClaim: PropTypes.shape({}),
};

const mapStateToProps = (state, ownProps) => {
  const { route } = ownProps;
  const claimId = route.params?.claimId;
  const {
    claim: { claimsMap, singleClaim },
    user: { membersMap },
    intl: { momentLocale },
  } = state;
  const theClaim = claimsMap[claimId];
  const claimantName = membersMap[theClaim.claimantId].fullName;
  return {
    claimId,
    claimantName,
    claim: theClaim,
    singleClaim,
    momentLocale,
  };
};

export default connect(mapStateToProps, { getClaim })(ClaimDetailsScreen);
