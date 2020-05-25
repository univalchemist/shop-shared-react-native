import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Text, Image, Box } from '@wrappers/components';
import theme from '@theme';
import LifestyleNavigationButtons from './LifestyleNavigationButtons';
import { landingPageHeroImage } from '@images';
import { Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { useIntl } from '@wrappers/core/hooks';

const LifestyleLandingPage = ({ navigation }) => {
  const viewportWidth = Dimensions.get('window').width;
  const intl = useIntl();
  return (
    <Box as={SafeAreaView} flexGrow={1}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          backgroundColor: theme.colors.backgroundColor,
          flexDirection: 'column',
        }}
      >
        <Container>
          <Text
            accessible={true}
            accessibilityLabel={intl.formatMessage({
              id: 'health.landingTitle',
            })}
            lineHeight={37}
            fontSize={32}
            fontWeight={300}
            letterSpacing={-1.5}
            color={theme.colors.black}
            paddingBottom={24}
            paddingTop={34}
            textAlign="left"
          >
            {<FormattedMessage id="health.landingTitle" />}
          </Text>
          <Text
            accessible={true}
            accessibilityLabel={intl.formatMessage({
              id: 'health.landingRecommendation',
            })}
            lineHeight={22}
            fontSize={16}
            fontWeight={300}
            color={theme.colors.black}
            letterSpacing={0.3}
            paddingBottom={14}
            textAlign="left"
          >
            {<FormattedMessage id="health.landingRecommendation" />}
          </Text>
          <Text
            accessible={true}
            accessibilityLabel={intl.formatMessage({
              id: 'health.privacyInfo',
            })}
            lineHeight={22}
            fontSize={12}
            fontWeight={300}
            color={theme.colors.black}
            letterSpacing={0.4}
            paddingBottom={24}
            textAlign="left"
          >
            {<FormattedMessage id="health.privacyInfo" />}
          </Text>
          <LifestyleNavigationButtons navigation={navigation} />
        </Container>
        <Image
          source={landingPageHeroImage}
          width={viewportWidth}
          marginTop={30}
        />
      </ScrollView>
    </Box>
  );
};

export default LifestyleLandingPage;
