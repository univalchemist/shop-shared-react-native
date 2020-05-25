import React from 'react';
import { QuestionWithMultiSelectField } from '../QuestionWithMultiSelectField';
import { renderForTest } from '@testUtils';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { SelectField } from '@wrappers/components/form';
import { fireEvent } from 'react-native-testing-library';
import { MULTI_SELECT_MODAL } from '../../../../routes';

describe('QuestionWithMultiSelectField', () => {
  const wrapInReduxForm = component =>
    compose(reduxForm({ form: 'someForm' }))(component);
  const QuestionWithMultiSelectInReduxForm = wrapInReduxForm(
    QuestionWithMultiSelectField,
  );

  let selectFields, question, component, formValues, navigation, formName;

  const renderComponent = ({
    question = {},
    navigation = {},
    formValues = {},
    formName = 'lifestyleForm',
  }) =>
    renderForTest(
      <QuestionWithMultiSelectInReduxForm
        question={question}
        navigation={navigation}
        formValues={formValues}
        formName={formName}
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
    formName = 'lifestyleForm';
    component = renderComponent({ question, formValues, navigation, formName });
    selectFields = component.queryAllByType(SelectField);
  });

  it('should render snapshot', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should pass down the correct props', () => {
    expect(selectFields[0].props.name).toBe(question.name);
    expect(selectFields[0].props.label).toBe(question.selectFieldLabel);
  });

  it('should navigate to singleSelect modal with correct parameter when pressed', () => {
    fireEvent.press(selectFields[0]);

    expect(navigation.navigate).toBeCalledWith(MULTI_SELECT_MODAL, {
      fieldKey: question.name,
      form: formName,
      initialSelected: formValues[question.name],
      data: question.options,
      title: question.titleLabel,
    });
  });
});
