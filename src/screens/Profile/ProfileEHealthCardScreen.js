import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Dimensions, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  Box,
  Divider,
  ErrorPanel,
  ImageSkeletonPlaceholder,
  Container,
  Text,
  TrackedCarouselWithScrollBar,
} from '@wrappers/components';
import { connect } from 'react-redux';
import {
  fetchBenefits,
  fetchPolicyDetails,
  fetchHealthCards,
} from '@store/benefit/actions';
import { useTheme, useFetchActions } from '@wrappers/core/hooks';
import getQRCodeXML from './utils/getQRCodeXML';
import EHealthCard from './widgets/EHealthCard.hsbc';
import { getFormattedDate } from '@utils';
import { categories } from '@store/analytics/trackingActions';

const CARD_WIDTH_HEIGHT_RATIO = 1.6;

const ProfileEHealthCardScreen = ({
  unterminatedMembersMap,
  category,
  benefit,
  fetchBenefits,
  fetchPolicyDetails,
  fetchHealthCards,
}) => {
  const theme = useTheme();
  const fetchEhealthCardData = useCallback(async () => {
    await fetchPolicyDetails();
    await Promise.all([fetchBenefits(), fetchHealthCards()]);
  }, [fetchHealthCards, fetchPolicyDetails, fetchBenefits]);

  const [isLoading, isError] = useFetchActions([fetchEhealthCardData]);
  const [activeCard, setActiveCard] = useState(0);

  const horizontalMarginBetweenCards = theme.space[3];
  const viewportWidth = Dimensions.get('window').width;
  const viewportPadding = theme.space[4];
  const cardWidth = viewportWidth - viewportPadding * 2;
  const cardWidthWithSpacing = cardWidth + horizontalMarginBetweenCards;
  const cardHeight = cardWidth / CARD_WIDTH_HEIGHT_RATIO;

  const data = useMemo(() => {
    if (isLoading || isError) {
      return [];
    }
    const { byMemberId, policy, coPayments, healthcards } = benefit;
    const {
      policyNumber,
      insurer: { code: insurerCode, eHealthCardName: insurerName },
    } = policy;

    const formattedExpiryDate = getFormattedDate(new Date());

    return healthcards
      .map(healthcard => {
        const memberBenefit = byMemberId[healthcard.memberId] || {};
        if (!unterminatedMembersMap[healthcard.memberId]) return null;

        const { firstName, lastName, role } = unterminatedMembersMap[
          healthcard.memberId
        ];
        const name = `${lastName} ${firstName}`;
        return {
          ...memberBenefit,
          name,
          role,
          insurerCode,
          insurerName,
          policyNumber,
          cardType: healthcard.type,
          expiryDate: formattedExpiryDate,
          coPayments: coPayments[memberBenefit.planId],
        };
      })
      .filter(item => !!item);
  }, [isLoading, isError, benefit, unterminatedMembersMap]);

  return (
    <Box bg="gray.7" flex={1}>
      {isLoading ? (
        <Container>
          <ImageSkeletonPlaceholder width={cardWidth} height={cardHeight} />
        </Container>
      ) : isError ? (
        <ErrorPanel />
      ) : (
        <ScrollView>
          <Box my={4}>
            <TrackedCarouselWithScrollBar
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              data={data}
              sliderWidth={viewportWidth}
              itemWidth={cardWidthWithSpacing}
              onSnapToItem={setActiveCard}
              renderItem={({ item }) => (
                <Box
                  width={cardWidthWithSpacing}
                  height={cardHeight}
                  px={horizontalMarginBetweenCards / 3}
                >
                  <EHealthCard
                    width={cardWidth}
                    height={cardHeight}
                    category={category}
                    {...item}
                  />
                </Box>
              )}
              actionParams={{
                category: categories.PROFILE_E_HEALTH_CARD,
                action: 'Horizontal scroll of e-health card',
              }}
            />
          </Box>
          <Divider />
          <Box px={4} my={4} alignItems="center">
            <QRCode
              size={160}
              backgroundColor="transparent"
              value={getQRCodeXML(data[activeCard])}
            />
            <Box mt={24}>
              <Text textAlign="center">
                <FormattedMessage id="profile.eHealthCard.instructions" />
              </Text>
            </Box>
          </Box>
        </ScrollView>
      )}
    </Box>
  );
};

ProfileEHealthCardScreen.propTypes = {
  unterminatedMembersMap: PropTypes.object.isRequired,
  benefit: PropTypes.object.isRequired,
  fetchBenefits: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user, benefit }) => ({
  benefit,
  unterminatedMembersMap: user.unterminatedMembersMap,
  category: user.category,
});

const mapDispatchToProps = {
  fetchBenefits,
  fetchPolicyDetails,
  fetchHealthCards,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileEHealthCardScreen);
