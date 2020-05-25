import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  Box,
  Button,
  Loader,
  Container,
  ErrorPanel,
  ParagraphSkeletonPlaceholder,
  ScrollView,
  Text,
} from '@wrappers/components';

import { connect } from 'react-redux';
import { TabBar, TabView } from 'react-native-tab-view';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { getTermsAndConditions } from '@store/legal/actions';
import { CheckBox } from 'react-native-elements';
import { debounceAlert } from '@utils';
import { agreeTermsConditions, logout } from '@store/user/actions';
import { localizeServerError } from '@utils';
import { FORM_ERROR } from 'final-form';
import { SUPPORTED_LANGUAGES } from '@config/locale';
import {
  MYWELLNESS_NEWSLETTER_SCREEN,
  ACCEPT_TERMS_CONDITIONS_SCREEN,
} from '@routes';
import HTML from 'react-native-render-html';
import { checkboxActive, checkboxInactive } from '@images';
import MESSAGES from './../../../messages';

const FormattedText = ({ text, replacedKey: { key, node } }) => {
  const theme = useTheme();
  const paras = text.split(/(\{[\d|\w]+\})/);
  const component = paras.map(para => {
    if (
      para.includes(key) &&
      para[0] === '{' &&
      para[para.length - 1] === '}'
    ) {
      return node;
    }

    return para;
  });

  return <Text style={{ color: theme.colors.gray[0] }}>{component}</Text>;
};

const CheckBoxField = ({
  label,
  labelComponent,
  onPress,
  initialValue = false,
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(initialValue);

  const toggleCheck = () => {
    setValue(!value);
    onPress(!value);
  };

  const renderCheckbox = () => {
    const style = StyleSheet.create({
      checkBoxWrapper: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      checkBoxContainer: {
        marginHorizontal: 0,
        marginVertical: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
      },
    });
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={style.checkBoxWrapper}
        accessibilityLabel={label}
      >
        <CheckBox
          containerStyle={style.checkBoxContainer}
          checked={!!value}
          checkedIcon={<Image source={checkboxActive} />}
          uncheckedIcon={<Image source={checkboxInactive} />}
          onPress={toggleCheck}
        />

        <Box flex={1}>
          {labelComponent ? (
            labelComponent
          ) : (
            <Text style={{ color: theme.colors.gray[0] }}>{label}</Text>
          )}
        </Box>
      </TouchableOpacity>
    );
  };

  return <Box mb={20}>{renderCheckbox()}</Box>;
};

const ContentView = ({
  getTermsAndConditions,
  agreeTerm,
  disagreeTerm,
  locale,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState(null);

  const [conditions, setConditions] = useState(0);
  const [term, setTerm] = useState(false);
  const [edmOptedOut, setEdmOptedOut] = useState(false);

  useEffect(() => {
    const fetchTermCondition = async () => {
      setIsLoading(true);
      try {
        const res = await getTermsAndConditions(locale);
        setIsLoading(false);
        setTermsAndConditions(res.value);
      } catch (e) {
        setIsLoading(false);
        setIsError(true);
      }
    };
    fetchTermCondition();
  }, [getTermsAndConditions, locale]);

  const checkConditions = () => {
    return term;
  };

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
            html={termsAndConditions}
            imagesMaxWidth={Dimensions.get('window').width}
          />
        </Container>
        <Box ml={28} mr={20}>
          <Box>
            <CheckBoxField
              initialValue={term}
              name="agreeTermsConditions"
              size={24}
              onPress={value => {
                setTerm(value);
                if (value) setConditions(conditions + 1);
                else setConditions(conditions - 1);
              }}
              label={MESSAGES[locale].agreeTermsConditions}
            />
          </Box>

          <Box>
            <CheckBoxField
              initialValue={edmOptedOut}
              name="edmOptedOut"
              size={24}
              onPress={value => {
                setEdmOptedOut(value);
              }}
              labelComponent={
                <FormattedText
                  text={MESSAGES[locale].edmOptOutOptional}
                  replacedKey={{
                    key: 'promotional',
                    node: (
                      <Text
                        color="fonts.link"
                        onPress={() => {
                          navigation.navigate(MYWELLNESS_NEWSLETTER_SCREEN, {
                            goBackUrl: ACCEPT_TERMS_CONDITIONS_SCREEN,
                            locale,
                            myWellnessNewsletterTitle:
                              MESSAGES[locale]['wn.title'],
                          });
                        }}
                      >
                        {MESSAGES[locale].edmPromotional}
                      </Text>
                    ),
                  }}
                />
              }
            />
          </Box>
        </Box>
        <Box mt={24} mb={60} mr={32} ml={32} pb={32}>
          <Box mt={8} opacity={conditions >= 1 ? 1 : 0.5}>
            <Button
              primary
              title={MESSAGES[locale]['tc.acceptTermsConditions']}
              onPress={() => {
                if (conditions >= 1 && checkConditions())
                  agreeTerm(conditions, edmOptedOut);
              }}
            />
          </Box>
          <Box mt={16}>
            <Button
              secondary
              title={MESSAGES[locale]['tc.disagreeTermAndCondition']}
              onPress={disagreeTerm}
            />
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
};

const ContentWrapper = connect(null, {
  getTermsAndConditions,
})(ContentView);

const AcceptTermsConditionsScreen = ({
  agreeTermsConditions,
  logout,
  navigation,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const [state, setState] = useState({
    index: 0,
    routes: SUPPORTED_LANGUAGES.map(({ label, locale }) => ({
      key: locale,
      title: label,
    })),
  });
  const [submitting, setSubmitting] = useState(false);

  const disagreeTerm = () => {
    logout();
  };

  const agreeTerm = async (numbersOfCondition, isEdmOptedOut) => {
    try {
      setSubmitting(true);
      await agreeTermsConditions(numbersOfCondition === 1, isEdmOptedOut);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      const { subject, message } = localizeServerError(
        error,
        {
          subjectId: 'serverErrors.login.subject',
          prefix: 'serverErrors.login',
        },
        intl,
      );

      debounceAlert({ subject, message });

      return {
        [FORM_ERROR]: message,
      };
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const renderScene = ({ route }) => {
    return (
      <ContentWrapper
        locale={route.key}
        agreeTerm={agreeTerm}
        disagreeTerm={disagreeTerm}
        navigation={navigation}
      />
    );
  };

  return !submitting ? (
    <Box flex={1}>
      <TabView
        navigationState={state}
        renderScene={renderScene}
        onIndexChange={index => setState({ ...state, index })}
        initialLayout={{ width: screenWidth }}
        renderTabBar={props => (
          <TabBar
            {...props}
            renderLabel={({ route, focused, color }) => (
              <Text
                width={screenWidth / 2 - theme.space[2] * 2}
                textAlign="center"
                fontWeight={
                  focused ? theme.fontWeights.bold : theme.fontWeights.normal
                }
                color={focused ? theme.colors.black : theme.colors.gray[8]}
                fontFamily={theme.fonts.default}
              >
                {route.title}
              </Text>
            )}
            inactiveColor={theme.colors.gray[8]}
            indicatorStyle={{ backgroundColor: theme.colors.red }}
            style={{ backgroundColor: theme.colors.white }}
          />
        )}
      />
    </Box>
  ) : (
    <Loader
      loadingText={intl.formatMessage({ id: 'loginSubmitLoadingText' })}
    />
  );
};

export default connect(
  state => ({
    user: state.user,
  }),
  { agreeTermsConditions, logout },
)(AcceptTermsConditionsScreen);
