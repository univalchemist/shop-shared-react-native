import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Slider } from 'react-native-elements';
import {
  Box,
  Flex,
  Image,
  Loader,
  ScreenHeadingText,
  Text,
} from '@wrappers/components';
import theme from '@theme';
import PropTypes from 'prop-types';
import { useIntl } from '@wrappers/core/hooks';
import { ErrorCard } from '@screens/Health/components/widgets/ErrorCard.js';
import { CardContainer } from '@screens/Health/components/widgets/CardContainer';
import { categories, logAction } from '@store/analytics/trackingActions';

const styles = StyleSheet.create({
  container: { paddingHorizontal: 32, paddingBottom: 32 },
});

export const FaceAgingResults = ({ faceAging }) => {
  const intl = useIntl();
  const [selectedAgeIndex, setSelectedAgeIndex] = useState(0);
  return (
    <View style={styles.container}>
      {faceAging.isError ? (
        renderFaceAgingErrorPanel({ intl })
      ) : faceAging.faceAgingIsDone &&
        faceAging.expectedTotalResults === faceAging.currentTotalResults ? (
        renderFaceAgingResults(
          faceAging,
          selectedAgeIndex,
          setSelectedAgeIndex,
          intl,
        )
      ) : (
        <>
          <ScreenHeadingText mb={2}>
            {intl.formatMessage({ id: 'futureMeTitle' })}
          </ScreenHeadingText>
          <CardContainer
            theme={theme}
            justifyContent="center"
            color={theme.colors.white}
            flexGrow={1}
          >
            <Loader
              primary
              textAlign={'center'}
              loadingText={intl.formatMessage({
                id: 'health.healthScoreHistory.lifestyleImage.processing',
                defaultMessage:
                  'Analysing in progress. This may take a little while. Please do not navigate away.',
              })}
            />
          </CardContainer>
        </>
      )}
    </View>
  );
};

const renderFaceAgingResults = (
  faceAging,
  selectedAgeIndex,
  setSelectedAgeIndex,
  intl,
) => {
  let faceAges = [];
  if (faceAges.length === 0) {
    faceAges = Object.keys(faceAging.results).sort();
  }
  const selectedAge = faceAges[selectedAgeIndex];
  const selectedAgeForDisplay = selectedAge == '67' ? '65' : selectedAge;

  return faceAges.length > 0 ? (
    <>
      <ScreenHeadingText mb={2}>
        {intl.formatMessage({ id: 'futureMeTitle' })}
      </ScreenHeadingText>
      <Box>
        <Text
          accessible={true}
          accessibilityLabel={intl.formatMessage(
            {
              id: 'health.sectionTitle.faceAging',
            },
            { selectedAge: selectedAgeForDisplay },
          )}
          color={theme.colors.gray[0]}
          fontWeight={theme.fontWeights.bold}
          fontSize={16}
          lineHeight={22}
          letterSpacing={0.3}
          mt={8}
          mb={8}
        >
          {intl.formatMessage(
            {
              id: 'health.sectionTitle.faceAging',
            },
            { selectedAge: selectedAgeForDisplay },
          )}
        </Text>
        {renderFaceAgingImages(selectedAge, faceAging, intl)}
        <Box mt={16}>
          <Slider
            style={{ width: '100%', height: 40 }}
            step={1}
            minimumValue={0}
            maximumValue={faceAges.length - 1}
            thumbTintColor={theme.colors.black}
            minimumTrackTintColor={theme.colors.black}
            maximumTrackTintColor={theme.colors.gray[4]}
            onValueChange={faceAgeIndex => {
              setSelectedAgeIndex(faceAgeIndex);
            }}
            onSlidingComplete={() => {
              logAction({
                category: categories.LIFESTYLE_OVERVIEW,
                action: `Slider age ${selectedAgeForDisplay}`,
              });
            }}
          />
          <Flex flex={1} flexDirection="row" />
        </Box>
        <Text
          accessibilityLabel={intl.formatMessage({
            id: 'health.faceAgingDescription',
          })}
          accessible={true}
          fontSize={14}
          mt={8}
          mb={16}
        >
          {intl.formatMessage({ id: 'health.faceAgingDescription' })}
        </Text>
      </Box>
    </>
  ) : (
    <Box />
  );
};

const renderFaceAgingImages = (selectedAge, faceAging, intl) => {
  return (
    <>
      {Object.keys(faceAging.results).map((faceAge, index) => {
        return (
          <Flex
            key={index}
            flexDirection="row"
            style={faceAge === selectedAge ? {} : { display: 'none' }}
          >
            <Box flex={1} marginRight={8}>
              <Box>
                <Image
                  accessibilityLabel={intl.formatMessage({
                    id:
                      'health.accessibilityLabel.LivingHealthyLifestyleFaceAgingImage',
                  })}
                  accessible={true}
                  accessibilityRole={'image'}
                  height={210}
                  source={{ uri: faceAging.results[faceAge].healthy }}
                  borderRadius={5}
                />
                <Text
                  accessibilityLabel={intl.formatMessage({
                    id: 'health.LivingHealthyLifestyle',
                  })}
                  accessible={true}
                  fontSize={14}
                  paddingTop={8}
                >
                  {intl.formatMessage({ id: 'health.LivingHealthyLifestyle' })}
                </Text>
              </Box>
            </Box>
            <Box flex={1}>
              <Box>
                <Image
                  accessibilityLabel={intl.formatMessage({
                    id:
                      'health.accessibilityLabel.LivingCurrentLifestyleFaceAgingImage',
                  })}
                  accessible={true}
                  accessibilityRole={'image'}
                  height={210}
                  source={{ uri: faceAging.results[faceAge].unhealthy }}
                  borderRadius={5}
                />
                <Text
                  accessibilityLabel={intl.formatMessage({
                    id: 'health.LivingCurrentLifestyle',
                  })}
                  accessible={true}
                  fontSize={14}
                  paddingTop={8}
                >
                  {intl.formatMessage({ id: 'health.LivingCurrentLifestyle' })}
                </Text>
              </Box>
            </Box>
          </Flex>
        );
      })}
    </>
  );
};

const renderFaceAgingErrorPanel = ({ intl }) => (
  <Box>
    <ScreenHeadingText mb={2}>
      {intl.formatMessage({ id: 'futureMeTitle' })}
    </ScreenHeadingText>
    <ErrorCard color={theme.colors.white} />
  </Box>
);

const mapStateToProps = ({ health: { faceAging } }) => ({
  faceAging,
});

const enhance = compose(connect(mapStateToProps));

export default enhance(FaceAgingResults);

FaceAgingResults.propTypes = {
  faceAging: PropTypes.shape({
    faceAgingIsDone: PropTypes.bool,
    expectedTotalResults: PropTypes.number,
    currentTotalResults: PropTypes.number,
    results: PropTypes.shape({}),
  }),
};
