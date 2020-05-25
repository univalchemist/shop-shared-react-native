import React from 'react';
import { Box, Text } from '@wrappers/components';
import { SelectField, QuestionText } from '@wrappers/components/form';
import { SINGLE_SELECT_MODAL } from '@routes';
import { Icon } from 'react-native-elements';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { validateSingleSelectCheckBox } from '@wrappers/core/validations';

const RightText = styled(Text)`
  font-size: 16px;
  font-weight: 300;
  ${({ theme }) => `
    color: ${theme.inputField.rightText}
  `};
`;

export const QuestionWithSingleSelectField = ({
  question,
  formValues,
  submitCount,
  navigation,
}) => {
  const getLabelFromValue = value =>
    value && question.options.find(option => option.value === value).label;

  return (
    <Box>
      <Box mt={10} mb={16}>
        <QuestionText accessibilityLabel={question.text}>
          {question.text}
        </QuestionText>
      </Box>
      <SelectField
        name={question.name}
        submitCount={submitCount}
        label={question.selectFieldLabel}
        format={value => getLabelFromValue(value)}
        validate={validateSingleSelectCheckBox}
        onPress={() =>
          navigation.navigate(SINGLE_SELECT_MODAL, {
            form: 'lifestyleForm',
            data: question.options,
            fieldKey: question.name,
            initialSelected: formValues[question.name],
            title: question.titleLabel,
          })
        }
        rightIcon={
          <RightText>
            <FormattedMessage id="days" />
          </RightText>
        }
        onRight={({ color }) => <Icon name="expand-more" color={color} />}
      />
    </Box>
  );
};

QuestionWithSingleSelectField.propTypes = {
  question: PropTypes.shape({
    options: PropTypes.array,
    name: PropTypes.string,
    titleLabel: PropTypes.string,
    selectFieldLabel: PropTypes.string,
    text: PropTypes.string,
    questionId: PropTypes.string,
  }),
  formValues: PropTypes.object.isRequired,
  submitCount: PropTypes.number.isRequired,
};
