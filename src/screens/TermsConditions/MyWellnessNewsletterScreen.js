import React, { useEffect, useState } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import {
  Box,
  Container,
  ErrorPanel,
  ParagraphSkeletonPlaceholder,
  ScrollView,
  Button,
} from '@wrappers/components';
import { connect } from 'react-redux';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import { getMyWellnessNewsletter } from '@store/legal/actions';

import HTML from 'react-native-render-html';

import MESSAGES from './../../../messages';

const ContentView = ({
  getMyWellnessNewsletter,
  locale,
  messages,
  navigation,
  route,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [myWellnessNewsletter, setMyWellnessNewsletter] = useState(null);

  useEffect(() => {
    const fetchMyWellnessNewsletter = async () => {
      setIsLoading(true);
      try {
        const res = await getMyWellnessNewsletter(locale);
        setIsLoading(false);
        setMyWellnessNewsletter(res.value);
      } catch (e) {
        setIsLoading(false);
        setIsError(true);
      }
    };
    fetchMyWellnessNewsletter();
  }, [getMyWellnessNewsletter, locale]);

  const theme = useTheme();
  const style = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.colors.red,
    },
  });

  if (isLoading)
    return (
      <Container flex={1}>
        <ParagraphSkeletonPlaceholder count={3} />
      </Container>
    );
  else if (isError) return <ErrorPanel flex={1} />;
  return (
    <View style={style.wrapper}>
      <ScrollView>
        <Container>
          <HTML
            baseFontStyle={{ fontSize: 16, color: theme.colors.gray[0] }}
            html={myWellnessNewsletter}
            imagesMaxWidth={Dimensions.get('window').width}
          />
        </Container>
        <Box mt={24} mb={60} mr={32} ml={32} pb={32}>
          <Box mt={16}>
            <Button
              primary
              title={messages['wn.goback']}
              onPress={() => {
                const goBackUrl = route?.params?.goBackUrl;

                if (goBackUrl) {
                  navigation.navigate(goBackUrl);
                } else {
                  navigation.goBack();
                }
              }}
            />
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
};

const ContentWrapper = connect(null, {
  getMyWellnessNewsletter,
})(ContentView);

const MyWellnessNewsletterScreen = ({ route, navigation }) => {
  const intl = useIntl();
  const params = route?.params;
  const locale = params?.locale || intl.locale;

  return (
    <Box flex={1}>
      <ContentWrapper
        locale={locale}
        messages={MESSAGES[locale] || intl.messages}
        navigation={navigation}
        route={route}
      />
    </Box>
  );
};

export default connect(state => ({
  user: state.user,
}))(MyWellnessNewsletterScreen);
