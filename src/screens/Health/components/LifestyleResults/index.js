import { LifestyleResultsCarousel } from './LifestyleResultsCarousel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Dimensions } from 'react-native';
import { Box, Text } from '@wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { LifestyleResultsLoader } from './LifestyleResultsLoader';
import { PromiseStatus } from '@middlewares';
import { getLifestyleResults } from './util';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ErrorCard } from '@screens/Health/components/widgets/ErrorCard';

export const LifestyleResults = ({
  lifestyleResults,
  fetchUserLifestyleResultsStatus,
  navigation,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const horizontalMarginBetweenCards = theme.space[3];
  const viewportWidth = Dimensions.get('window').width;
  const viewportPadding = theme.space[4];
  const cardWidth = viewportWidth - viewportPadding * 2;
  const cardWidthWithSpacing = cardWidth + horizontalMarginBetweenCards;
  const cardHeight = 252.5;

  const renderLifestyleResults = () => {
    switch (fetchUserLifestyleResultsStatus) {
      case PromiseStatus.SUCCESS: {
        const lifestyleResultsArray = getLifestyleResults(
          lifestyleResults,
          theme,
          intl,
        );

        return (
          <LifestyleResultsCarousel
            data={lifestyleResultsArray}
            cardWidthWithSpacing={cardWidthWithSpacing}
            cardHeight={cardHeight}
            horizontalMarginBetweenCards={horizontalMarginBetweenCards}
            cardWidth={cardWidth}
            viewportWidth={viewportWidth}
            navigation={navigation}
          />
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
            <ErrorCard color={theme.colors.error[3]} />
          </Box>
        );
      }
      default: {
        return (
          <LifestyleResultsLoader
            cardWidthWithSpacing={cardWidthWithSpacing}
            cardHeight={cardHeight}
            horizontalMarginBetweenCards={horizontalMarginBetweenCards}
          />
        );
      }
    }
  };

  return (
    <>
      <Box>
        <Text
          accessible={true}
          accessibilityLabel={intl.formatMessage({
            id: 'health.sectionTitle.lifestyleResults',
          })}
          color={theme.colors.gray[0]}
          fontWeight={theme.fontWeights.bold}
          fontSize={16}
          lineHeight={22}
          letterSpacing={0.3}
          ml={32}
          mt={40}
        >
          <FormattedMessage id="health.sectionTitle.lifestyleResults" />
        </Text>
      </Box>
      {renderLifestyleResults()}
    </>
  );
};

const mapStateToProps = ({
  health: { lifestyleResults, fetchUserLifestyleResultsStatus },
}) => ({
  lifestyleResults,
  fetchUserLifestyleResultsStatus,
});

const enhance = compose(connect(mapStateToProps, {}), injectIntl);

LifestyleResults.propTypes = {
  fetchUserLifestyleResultsStatus: PropTypes.string,
  lifestyleResults: PropTypes.shape({
    bmiScore: PropTypes.number,
    bmiClass: PropTypes.string,
  }),
};

export default enhance(LifestyleResults);
