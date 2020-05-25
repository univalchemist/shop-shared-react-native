import React from 'react';
import { RadioButtonGroup } from '@wrappers/components/form';
import { validateRequired } from '@wrappers/core/validations';

const QuestionWithRadioButtons = ({
  question: { name, text, options },
  submitCount,
  onChange,
}) => {
  const props = {
    name,
    options,
    label: text,
    submitCount,
    onChange,
  };
  return <RadioButtonGroup {...props} validate={[validateRequired]} />;
};
export default QuestionWithRadioButtons;
