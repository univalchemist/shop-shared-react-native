import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { HEALTH } from '@routes';
import {
  Box,
  TrackedButton,
  ScrollViewForStickyButton,
  Loader,
  Footer,
  Text,
  Container,
} from '@wrappers/components';
import { reduxForm } from 'redux-form';
import { withTheme } from 'styled-components/native';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  submitUserLifestyleResponse,
  fetchUserLifestyleResponse,
  downloadFaceAgingPhoto,
  resetLoader,
  setSubmitLifestyleFormCount,
} from '@store/health/actions';
import { injectIntl } from 'react-intl';
import { localizeServerError } from '@utils';
import AboutMe from './LifestyleQuestionnaires/AboutMe';
import MyChoices from './LifestyleQuestionnaires/MyChoices';
import MyHealth from './LifestyleQuestionnaires/MyHealth';
import * as QuestionGroups from './LifestyleQuestionnaires/QuestionGroups';
import english_questions_with_default from './LifestyleQuestionnaires/questions/en_questions';
import english_questions_without_default from './LifestyleQuestionnaires/questions/en_questions_nodefaults';
import chinese_questions_with_default from './LifestyleQuestionnaires/questions/ch_questions';
import chinese_questions_without_default from './LifestyleQuestionnaires/questions/ch_questions_nodefaults';
import indonesian_questions_with_default from './LifestyleQuestionnaires/questions/id_questions';
import indonesian_questions_without_default from './LifestyleQuestionnaires/questions/id_questions_nodefaults';
import { Divider } from '@wrappers/components';
import { getInitialValuesFromQuestions, filterFormValues } from './helpers';
import FutureMe from './LifestyleQuestionnaires/FutureMe';
import { Header } from '@react-navigation/stack';
import styled from 'styled-components/native';
import theme from '@theme';
import FeatureToggle from '@config/FeatureToggle';
import { DEFAULT_LOCALE } from '@config/locale';
import { categories } from '@store/analytics/trackingActions';

let english_questions = FeatureToggle.NO_DEFAULT_ANSWERS.on
  ? english_questions_without_default
  : english_questions_with_default;

let chinese_questions = FeatureToggle.NO_DEFAULT_ANSWERS.on
  ? chinese_questions_without_default
  : chinese_questions_with_default;

let indonesian_question = FeatureToggle.NO_DEFAULT_ANSWERS.on
  ? indonesian_questions_without_default
  : indonesian_questions_with_default;

const DisclaimerTitle = styled(Text)`
  font-size: ${theme.fontSizes[1]};
  color: ${theme.colors.gray[0]};
  line-height: ${theme.lineHeights[4]};
`;

const DisclaimerMessage = styled(Text)`
  font-size: ${theme.fontSizes[1]};
  color: ${theme.colors.gray[8]};
  line-height: ${theme.lineHeights[4]};
`;

export const LifestyleForm = ({
  change,
  handleSubmit,
  fetchUserLifestyleResponseCompleted,
  fetchUserLifestyleResponse,
  fetchFaceAgingImageCompleted,
  submitUserLifestyleResponse,
  initialValues,
  intl,
  submittingUserLifestyleResponse,
  resetLoader,
  preferredLocale,
  downloadFaceAgingPhoto,
  lifestyleFormSubmitCount,
  navigation,
  route,
}) => {
  const shouldScrollDueToParam = useRef(route.params?.scrollToFutureMe);
  const scrollRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploadImageError, setUploadImageError] = useState(null);
  const [uploadBoxPosY, setUploadBoxPosY] = useState(0);
  useEffect(() => {
    fetchUserLifestyleResponse();
    downloadFaceAgingPhoto();
  }, [downloadFaceAgingPhoto, fetchUserLifestyleResponse, resetLoader]);

  useEffect(() => {
    return () => {
      resetLoader();
    };
  }, [resetLoader]);

  useLayoutEffect(() => {
    if (submittingUserLifestyleResponse) setIsLoaded(false);
    if (
      (uploadImageError || shouldScrollDueToParam.current) &&
      isLoaded &&
      uploadBoxPosY > 0
    ) {
      shouldScrollDueToParam.current = false;
      setTimeout(() => {
        if (uploadImageError)
          Alert.alert(
            intl.formatMessage({
              id:
                uploadImageError === 'upload_failed'
                  ? 'uploadImage.failed'
                  : 'deleteImage.failed',
            }),
            intl.formatMessage({
              id: 'pleaseTryAgain',
            }),
          );

        scrollRef.current.scrollTo({
          x: 0,
          y: uploadBoxPosY,
          animated: true,
        });

        setUploadImageError(null);
      }, 500);
    }
  }, [
    uploadImageError,
    isLoaded,
    submittingUserLifestyleResponse,
    uploadBoxPosY,
  ]);

  if (submittingUserLifestyleResponse) {
    return (
      <Loader
        loadingText={intl.formatMessage({ id: 'health.submittingHealthData' })}
      />
    );
  }

  const questions = getQuestionsByLocale(preferredLocale);

  const handleLifestyleFormSubmit = async (values, _, { reset }) => {
    try {
      const res = await submitUserLifestyleResponse(
        filterFormValues(values, questions),
      );
      if (res.value.error) {
        setUploadImageError(res.value.type);
      } else {
        navigation.navigate(HEALTH);
        reset();
      }
    } catch (error) {
      const { subject, message } = localizeServerError(
        error,
        {
          subjectId: 'somethingWentWrong',
          prefix: 'serverErrors.postUserHealthResponse',
        },
        intl,
      );

      await setTimeout(() => {
        Alert.alert(subject, message);
      }, 500);
    }
  };

  return (
    <>
      {fetchUserLifestyleResponseCompleted && fetchFaceAgingImageCompleted ? (
        <>
          <ScrollViewForStickyButton
            ref={r => (scrollRef.current = r)}
            onLayout={() => setIsLoaded(true)}
          >
            <Box>
              <AboutMe
                submitCount={lifestyleFormSubmitCount}
                navigation={navigation}
              />
              <Divider />
              <MyChoices
                questions={questions.questionGroups[QuestionGroups.CHOICES]}
                submitCount={lifestyleFormSubmitCount}
                navigation={navigation}
              />
              <Divider />
              <MyHealth
                questions={questions.questionGroups[QuestionGroups.HEALTH]}
                submitCount={lifestyleFormSubmitCount}
                navigation={navigation}
              />
              <Divider />
              <FutureMe
                uploadBoxLayout={y => {
                  setUploadBoxPosY(y);
                }}
                change={change}
                initialValues={{ image: initialValues.image }}
                navigation={navigation}
              />
              <Divider />
              <Container>
                <DisclaimerTitle>
                  {intl.formatMessage({
                    id: 'health.lifestyleForm.disclaimerTitle',
                  })}
                </DisclaimerTitle>
                <DisclaimerMessage>
                  {intl.formatMessage({
                    id: 'health.lifestyleForm.disclaimerMessage',
                  })}
                </DisclaimerMessage>
              </Container>
              <Box mb={96} />
            </Box>
          </ScrollViewForStickyButton>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.select({
              ios: Header.HEIGHT,
              android: 0,
            })}
          >
            <Footer>
              <TrackedButton
                primary
                onPress={handleSubmit(handleLifestyleFormSubmit)}
                actionParams={{
                  category: categories.HEALTH_QUESTION,
                  action: 'Submit health questionaire',
                }}
                title={intl.formatMessage({ id: 'showResults' })}
              />
            </Footer>
          </KeyboardAvoidingView>
        </>
      ) : (
        <Loader primary />
      )}
    </>
  );
};

LifestyleForm.propTypes = {
  change: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  fetchUserLifestyleResponseCompleted: PropTypes.bool,
  fetchUserLifestyleResponse: PropTypes.func.isRequired,
  fetchFaceAgingImageCompleted: PropTypes.bool,
  submitUserLifestyleResponse: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({}),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  submittingUserLifestyleResponse: PropTypes.bool.isRequired,
  resetLoader: PropTypes.func.isRequired,
  preferredLocale: PropTypes.string,
  downloadFaceAgingPhoto: PropTypes.func.isRequired,
  lifestyleFormSubmitCount: PropTypes.number.isRequired,
};

const getQuestionsByLocale = preferredLocale =>
  preferredLocale === 'zh-HK'
    ? chinese_questions
    : preferredLocale === 'id-ID'
    ? indonesian_question
    : english_questions;

const convertToString = value =>
  value !== null && value !== undefined ? value.toString() : '';

const mapStateToProps = ({
  user: { preferredLocale },
  health: {
    data: {
      height,
      weight,
      waistCircumference,
      exerciseFrequency,
      ...restData
    },
    faceAging: { image },
    fetchUserLifestyleResponseCompleted,
    fetchFaceAgingImageCompleted,
    submittingUserLifestyleResponse,
    lifestyleFormSubmitCount,
  },
}) => ({
  initialValues:
    fetchUserLifestyleResponseCompleted && fetchFaceAgingImageCompleted
      ? {
          ...getInitialValuesFromQuestions(
            getQuestionsByLocale(preferredLocale),
          ),
          height: convertToString(height),
          weight: convertToString(weight),
          waistCircumference: convertToString(waistCircumference),
          exerciseFrequency: convertToString(exerciseFrequency),
          ...restData,
          image: image,
        }
      : {
          ...getInitialValuesFromQuestions(
            getQuestionsByLocale(preferredLocale),
          ),
          image: image,
        },
  fetchFaceAgingImageCompleted,
  fetchUserLifestyleResponseCompleted,
  submittingUserLifestyleResponse,
  preferredLocale: preferredLocale ? preferredLocale : DEFAULT_LOCALE,
  lifestyleFormSubmitCount,
});

const enhance = compose(
  withTheme,
  connect(mapStateToProps, {
    fetchUserLifestyleResponse,
    submitUserLifestyleResponse,
    downloadFaceAgingPhoto,
    resetLoader,
    setSubmitLifestyleFormCount,
  }),
  reduxForm({
    form: 'lifestyleForm',
    enableReinitialize: true,
    onSubmitFail: (props, dispatch) => {
      dispatch(setSubmitLifestyleFormCount());
    },
  }),
  injectIntl,
);

export default enhance(LifestyleForm);
