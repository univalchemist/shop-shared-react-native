import React, { useCallback } from 'react';
import { Image, Text, Box, Container, Flex } from '@wrappers/components';
import { FormattedMessage } from 'react-intl';
import { myHealthImage } from '@images';
import { useTheme } from '@wrappers/core/hooks';
import { categories, logAction } from '@store/analytics/trackingActions';
import QuestionWithRadioButtons from './QuestionWithRadioButtons';

const questionTrackingActions = {
  hereditaryDiabetes: 'Parents/siblings diabetes question',
  uninterestFrequency: 'Depressed question',
};

export const MyHealth = ({ questions, submitCount }) => {
  const theme = useTheme();
  const trackingQuestion = useCallback(questionName => {
    questionTrackingActions[questionName] &&
      logAction({
        category: categories.HEALTH_QUESTION,
        action: questionTrackingActions[questionName],
      });
  }, []);

  return (
    <Container>
      <Flex justifyContent="center" flexDirection="row">
        <Image
          source={myHealthImage}
          width={148}
          height={161}
          resizeMode="contain"
        />
      </Flex>

      <Box mt={24}>
        <Text
          lineHeight={37}
          fontSize={32}
          fontWeight={300}
          color={theme.colors.gray[0]}
          paddingBottom={24}
          textAlign="center"
        >
          <FormattedMessage id="myHealthTitle" />
        </Text>
      </Box>

      {questions.map(question => (
        <Box key={question.questionId} mb={48}>
          <QuestionWithRadioButtons
            submitCount={submitCount}
            question={question}
            onChange={() => {
              trackingQuestion(question.name);
            }}
          />
        </Box>
      ))}
    </Container>
  );
};

export default MyHealth;
