import React from 'react';
import { Text, ScrollView } from '@wrappers/components';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled from 'styled-components/native';
import { TipCard } from '@screens/Health/components/widgets/TipCard';
import theme from '@theme';
import { ErrorPanel } from '@wrappers/components';
import { ProductRecommendation } from '@screens/Health/components/ProductRecommendation';
import FeatureToggle from '@config/FeatureToggle';
import { useIntl } from '@wrappers/core/hooks';
import { fetchProductRecommendationsForTips } from '@store/health/actions';

const NormalText = styled(Text)`
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.3px;
`;

const TipsHeader = styled(NormalText)`
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[0]};
  margin-top: 40;
  margin-bottom: 4;
`;

const TipsResultText = styled(Text)`
  font-weight: ${theme.fontWeights.light};
  font-size: 32px;
  line-height: 37px;
  letter-spacing: -1.5px;
  color: ${theme.colors.black};
  margin-bottom: 16;
`;

const TipsResultDescription = styled(NormalText)`
  color: ${theme.colors.black};
  margin-bottom: 36;
  color: ${theme.colors.gray[8]};
`;

export const LayoutContainer = styled(View)`
  flex-direction: column;
  padding-left: 32;
  padding-right: 32;
  padding-bottom: 40;
`;

const renderLifestyleTips = (lifestyleTips, tipCategory) =>
  lifestyleTips.tips[
    tipCategory
  ].map(({ topic, source, text, link }, index) => (
    <TipCard
      key={topic + index}
      topic={topic}
      source={source}
      text={text}
      link={link}
    />
  ));

export const LifestyleTipLayout = ({
  lifestyleTips,
  lifestyleTipsParameters,
  productRecommendationsForTips,
  fetchProductRecommendationsForTips,
  navigation,
}) => {
  const lifestyleResultText = lifestyleTipsParameters.result;
  const tipCategory = lifestyleTipsParameters.category;
  const tipDescription = lifestyleTipsParameters.tipDescription;
  const intl = useIntl();

  return (
    <>
      {lifestyleTips.tips[tipCategory] ? (
        <ScrollView>
          <LayoutContainer>
            <TipsHeader>
              <FormattedMessage
                id={`health.LifestyleTips.ResultText.${tipCategory}`}
              />
            </TipsHeader>
            <TipsResultText>{lifestyleResultText}</TipsResultText>
            <TipsResultDescription>{tipDescription}</TipsResultDescription>
            {renderLifestyleTips(lifestyleTips, tipCategory)}
          </LayoutContainer>
          {FeatureToggle.TIPS_PRODUCT_RECOMMENDATION.on && (
            <ProductRecommendation
              title={intl.formatMessage({
                id: `health.LifestyleTips.ProductRecommendation.${tipCategory}`,
              })}
              productRecommendations={productRecommendationsForTips}
              fetchProductRecommendations={fetchProductRecommendationsForTips}
              tipCategory={tipCategory}
              navigation={navigation}
            />
          )}
        </ScrollView>
      ) : (
        <ErrorPanel />
      )}
    </>
  );
};

const mapStateToProps = ({
  health: { lifestyleTips, productRecommendationsForTips },
}) => ({ lifestyleTips, productRecommendationsForTips });

const enhance = compose(
  connect(mapStateToProps, { fetchProductRecommendationsForTips }),
  injectIntl,
);

export default enhance(LifestyleTipLayout);

LifestyleTipLayout.propTypes = {
  lifestyleTipsParameters: PropTypes.shape({
    result: PropTypes.string,
    category: PropTypes.string,
    tipDescription: PropTypes.string,
  }),
};
