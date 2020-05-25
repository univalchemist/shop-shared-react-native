import React from 'react';
import { Box } from '@wrappers/components';
import { SelectField, QuestionText } from '@wrappers/components/form';
import { MULTI_SELECT_MODAL } from '@routes';
import { Icon } from 'react-native-elements';
import { useIntl } from '@wrappers/core/hooks';
import PropTypes from 'prop-types';
import { validateMultiSelectCheckBox } from '@wrappers/core/validations';

export const QuestionWithMultiSelectField = ({
  question,
  formValues,
  formName,
  submitCount,
  navigation,
}) => {
  const intl = useIntl();

  const getLabel = items => {
    if (items && items.length > 0) {
      return intl.formatMessage(
        {
          id: 'selectField.multiselectCheckBox.label',
        },
        { itemNumber: items.length },
      );
    }
    return undefined;
  };

  const getSelectedValue = () => formValues[question.name];

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
        validate={validateMultiSelectCheckBox}
        label={question.selectFieldLabel}
        format={value => getLabel(value)}
        onPress={() =>
          navigation.navigate(MULTI_SELECT_MODAL, {
            data: question.options,
            buttonLabel: question.buttonLabel,
            form: formName,
            fieldKey: question.name,
            initialSelected: getSelectedValue(),
            title: question.titleLabel,
          })
        }
        onRight={({ color }) => <Icon name="expand-more" color={color} />}
      />
    </Box>
  );
};

QuestionWithMultiSelectField.propTypes = {
  question: PropTypes.shape({
    options: PropTypes.array,
    name: PropTypes.string,
    titleLabel: PropTypes.string,
    selectFieldLabel: PropTypes.string,
    text: PropTypes.string,
    questionId: PropTypes.string,
  }),
  formValues: PropTypes.object.isRequired,
  formName: PropTypes.string.isRequired,
  submitCount: PropTypes.number.isRequired,
};
