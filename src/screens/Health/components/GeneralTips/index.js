import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { GeneralTipsCarousel } from './GeneralTipsCarousel';
import { GeneralTipsLoader } from './GeneralTipsLoader';
import { PromiseStatus } from '@middlewares';
import { Dimensions } from 'react-native';
import { useTheme } from '@wrappers/core/hooks';
import { ErrorCard } from '@screens/Health/components/widgets/ErrorCard';
import { Box, Text } from '@wrappers/components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { fetchLifestyleTips } from '@store/health/actions';

export const GeneralTips = ({ lifestyleTips, fetchLifestyleTips, locale }) => {
  const theme = useTheme();
  const horizontalMarginBetweenCards = theme.space[3];
  const viewportWidth = Dimensions.get('window').width;
  const viewportPadding = theme.space[4];
  const cardWidth = viewportWidth - viewportPadding * 2;
  const cardWidthWithSpacing = cardWidth + horizontalMarginBetweenCards;
  const cardHeight = 252.5;
  const viewportPaddingInsideCard = viewportPadding + 24;
  const loaderWidthInsideCard = viewportWidth - viewportPaddingInsideCard * 2;

  useEffect(() => {
    fetchLifestyleTips();
  }, [locale]);

  const renderGeneralTips = () => {
    switch (lifestyleTips.status) {
      case PromiseStatus.SUCCESS: {
        return lifestyleTips.tips.general ? (
          <GeneralTipsCarousel
            data={lifestyleTips.tips.general}
            cardWidthWithSpacing={cardWidthWithSpacing}
            cardHeight={cardHeight}
            horizontalMarginBetweenCards={horizontalMarginBetweenCards}
            cardWidth={cardWidth}
            viewportWidth={viewportWidth}
          />
        ) : (
          <Box
            width={cardWidthWithSpacing}
            height={cardHeight}
            px={horizontalMarginBetweenCards / 3}
            marginTop={16}
            alignSelf="center"
          >
            <ErrorCard color={'#FFF'} />
          </Box>
        );
      }
      case PromiseStatus.ERROR: {
        return (
          <Box
            width={cardWidthWithSpacing}
            height={cardHeight}
            px={horizontalMarginBetweenCards / 3}
            marginTop={16}
            alignSelf="center"
          >
            <ErrorCard color={'#FFF'} />
          </Box>
        );
      }
      default: {
        return (
          <GeneralTipsLoader
            cardWidthWithSpacing={cardWidthWithSpacing}
            cardHeight={cardHeight}
            horizontalMarginBetweenCards={horizontalMarginBetweenCards}
            cardWidth={cardWidth}
            viewportWidth={viewportWidth}
            loaderWidthInsideCard={loaderWidthInsideCard}
          />
        );
      }
    }
  };

  return (
    <>
      <Box>
        <Text
          color="gray.0"
          fontWeight={theme.fontWeights.bold}
          fontSize={16}
          lineHeight={22}
          letterSpacing={0.3}
          ml={32}
          mt={40}
        >
          <FormattedMessage id="health.sectionTitle.generalTips" />
        </Text>
      </Box>
      {renderGeneralTips()}
    </>
  );
};

const mapStateToProps = ({ health: { lifestyleTips }, intl: { locale } }) => ({
  lifestyleTips,
  locale,
});
const mapDispatchToProps = { fetchLifestyleTips };
const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

GeneralTips.propTypes = {
  lifestyleTips: PropTypes.shape({
    tips: PropTypes.shape({ general: PropTypes.array }),
    status: PropTypes.string,
  }),
};

export default enhance(GeneralTips);
