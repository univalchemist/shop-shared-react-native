import React, { useEffect, useState, useCallback } from 'react';
import { Container, Image, Box, Text } from '@wrappers/components';
import { withTheme } from 'styled-components/native';
import { healthMyChoicesImg } from '@images';
import { compose } from 'redux';
import theme from '@theme';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useIntl } from '@wrappers/core/hooks';
import QuestionWithRadioButtons from './QuestionWithRadioButtons';
import { connect } from 'react-redux';
import { flatten } from 'ramda';
import { QuestionWithSingleSelectField } from './QuestionWithSingleSelectField';
import { QuestionWithMultiSelectField } from './QuestionWithMultiSelectField';
import { categories, logAction } from '@store/analytics/trackingActions';

const questionTrackingActions = {
  smokingBehaviour: 'Smoke frequency question',
  alcoholConsumptionFrequency: 'Drink frequency question',
  exerciseFrequency: 'Exercise frequency question',
  eatingIntentionPerseverance: 'Give up dieting question',
  distractedFromTheWayIWantToEat: 'Distracted question',
};

export const MyChoices = ({
  questions,
  formValues,
  submitCount,
  navigation,
}) => {
  const intl = useIntl();
  const formName = 'lifestyleForm';
  const [initialState, setInitialState] = useState(true);

  const trackingQuestion = useCallback(questionName => {
    questionTrackingActions[questionName] &&
      logAction({
        category: categories.HEALTH_QUESTION,
        action: questionTrackingActions[questionName],
      });
  }, []);

  useEffect(() => {
    setInitialState(false);
  }, []);

  useEffect(() => {
    if (!initialState) {
      trackingQuestion('exerciseFrequency');
    }
  }, [formValues.exerciseFrequency]);

  const radioComponent = question => {
    return (
      <Box key={question.questionId} mb={48}>
        <QuestionWithRadioButtons
          submitCount={submitCount}
          question={question}
          onChange={() => {
            trackingQuestion(question.name);
          }}
        />
      </Box>
    );
  };

  const singleSelectComponent = question => (
    <QuestionWithSingleSelectField
      key={question.questionId}
      submitCount={submitCount}
      question={question}
      formValues={formValues}
      formName={formName}
      navigation={navigation}
    />
  );

  const multiselectComponent = question => (
    <QuestionWithMultiSelectField
      key={question.questionId}
      submitCount={submitCount}
      question={question}
      formValues={formValues}
      formName={formName}
      navigation={navigation}
    />
  );

  const componentMap = {
    radio: radioComponent,
    singleSelect: singleSelectComponent,
    multiselect: multiselectComponent,
  };

  const isDependantQuestionShowing = (questions, dependentQuestion) => {
    const parentQuestion = questions.find(
      q => q.questionId === dependentQuestion.parentQuestionId,
    );

    return flatten([formValues[parentQuestion.name]]).some(v => {
      if (v === 'NoneTempting') {
        return false;
      }
      return dependentQuestion.activationAnswer.includes(v);
    });
  };
  const renderQuestions = questions => {
    return questions.map(question => {
      if (question.type) {
        if (
          question.dependentQuestion === false ||
          isDependantQuestionShowing(questions, question)
        ) {
          return componentMap[question.type](question);
        }
      }
    });
  };

  return (
    <Container>
      <Image
        width={148}
        height={161}
        source={healthMyChoicesImg}
        resizeMode="contain"
        alignSelf="center"
      />

      <Box mt={24}>
        <Text
          lineHeight={37}
          fontSize={32}
          fontWeight={300}
          color={theme.colors.gray[0]}
          paddingBottom={24}
          textAlign="center"
          accessibilityLabel={intl.formatMessage({ id: 'myChoicesTitle' })}
        >
          {<FormattedMessage id="myChoicesTitle" />}
        </Text>
      </Box>
      {renderQuestions(questions)}
    </Container>
  );
};

MyChoices.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object),
  values: PropTypes.object,
};

const mapStateToProps = ({
  form: {
    lifestyleForm: { values },
  },
}) => {
  return {
    formValues: values,
  };
};

const enhance = compose(connect(mapStateToProps), withTheme);

export default enhance(MyChoices);
