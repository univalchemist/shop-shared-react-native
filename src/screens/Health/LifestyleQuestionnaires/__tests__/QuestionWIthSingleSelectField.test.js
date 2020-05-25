import React from 'react';
import { QuestionWithSingleSelectField } from '../QuestionWithSingleSelectField';
import { renderForTest } from '@testUtils';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { SelectField } from '@wrappers/components/form';
import { fireEvent } from 'react-native-testing-library';
import { SINGLE_SELECT_MODAL } from '@routes';
import { validateSingleSelectCheckBox } from '@wrappers/core/validations';

describe('QuestionWithSingleSelectField', () => {
  const wrapInReduxForm = component =>
    compose(reduxForm({ form: 'someForm' }))(component);
  const QuestionWithSingleSelectInReduxForm = wrapInReduxForm(
    QuestionWithSingleSelectField,
  );

  let selectFields, question, component, formValues, navigation;

  const renderComponent = ({
    question = {},
    navigation = {},
    formValues = {},
  }) =>
    renderForTest(
      <QuestionWithSingleSelectInReduxForm
        question={question}
        navigation={navigation}
        formValues={formValues}
      />,
    );

  beforeEach(() => {
    question = {
      titleLabel: 'Title Label',
      selectFieldLabel: 'Field Label',
      questionId: 'Question Id',
      name: 'QuestionName',
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
    formValues = {
      QuestionName: 'option1',
    };
    navigation = { navigate: jest.fn() };
    component = renderComponent({ question, formValues, navigation });
    selectFields = component.queryAllByType(SelectField);
  });

  it('should render snapshot', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should pass down the correct props', () => {
    expect(selectFields[0].props.name).toBe(question.name);
    expect(selectFields[0].props.label).toBe(question.selectFieldLabel);
  });

  it('should render the question with validation', () => {
    expect(selectFields[0].props.validate).toBe(validateSingleSelectCheckBox);
  });

  it('should navigate to singleSelect modal with correct parameter when pressed', () => {
    fireEvent.press(selectFields[0]);

    expect(navigation.navigate).toBeCalledWith(SINGLE_SELECT_MODAL, {
      fieldKey: question.name,
      form: 'lifestyleForm',
      initialSelected: formValues[question.name],
      data: question.options,
      title: question.titleLabel,
    });
  });
});
