import React from 'react';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { RadioButtonGroup } from '@wrappers/components/form';
import QuestionWithRadioButtons from '../QuestionWithRadioButtons';
import { renderForTest } from '@testUtils';
import { validateRequired } from '@wrappers/core/validations';

describe('QuestionWithRadioButtons', () => {
  const wrapInReduxForm = component =>
    compose(reduxForm({ form: 'someForm' }))(component);
  const QuestionWithRadioButtonsInReduxForm = wrapInReduxForm(
    QuestionWithRadioButtons,
  );

  const renderComponent = ({ question = {} }) =>
    renderForTest(<QuestionWithRadioButtonsInReduxForm question={question} />);

  let radioButtonGroups, question;
  beforeEach(() => {
    question = {
      name: 'Question Name',
      text: 'Question Text',
      options: [
        {
          label: 'option 1',
          value: 'option1',
        },
        {
          label: 'option 2',
          value: 'option2',
        },
      ],
    };
    const component = renderComponent({ question });
    radioButtonGroups = component.queryAllByType(RadioButtonGroup);
  });

  it('should render a radio button group', () => {
    expect(radioButtonGroups.length).toBe(1);
  });

  it('should render question with validation', () => {
    expect(radioButtonGroups[0].props.validate[0]).toBe(validateRequired);
  });

  test.each([
    ['name', 'name'],
    ['text', 'label'],
    ['options', 'options'],
  ])(
    'should use each question`s %s as radio button group`s %s',
    (propertyName, propName) => {
      const radioButtonGroup = radioButtonGroups[0];
      expect(radioButtonGroup.props[propName]).toEqual(question[propertyName]);
    },
  );
});
