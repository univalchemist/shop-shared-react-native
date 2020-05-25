import React from 'react';
import { CustomMultiselectCheckBox as MultiselectCheckBox } from '@cxa-rn/components';
import { TrackedButton } from '../Tracking';

export {
  formFocusField as focusField,
  InputFieldWithoutScroll as InputField,
  SelectFieldWithoutScroll as SelectField,
  RadioButtonGroupWithoutScroll as RadioButtonGroup,
  QuestionText,
  CheckBoxField,
} from '@cxa-rn/components';
export { default as SingleSelectModal } from './SingleSelectModal';
export { default as MultiSelectModal } from './MultiSelectModal';

export const CustomMultiselectCheckBox = props => {
  return <MultiselectCheckBox {...props} TrackedButton={TrackedButton} />;
};

// import FeatureToggle from '@config/FeatureToggle';
// import MultiselectCheckBox, {
//   CustomMultiselectCheckBox,
// } from './MultiselectCheckBox';

// let RadioButtonGroup = FeatureToggle.NO_DEFAULT_ANSWERS.on
//   ? RadioButtonGroupWithScroll
//   : RadioButtonGroupWithoutScroll;

// let SelectField = FeatureToggle.NO_DEFAULT_ANSWERS.on
//   ? SelectFieldWithScroll
//   : SelectFieldWithoutScroll;

// let InputField = FeatureToggle.NO_DEFAULT_ANSWERS.on
//   ? InputFieldWithScroll
//   : InputFieldWithoutScroll;
