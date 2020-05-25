import { renderForTest } from '@testUtils';
import React from 'react';
import MyChoices from '../MyChoices';
import questions from '../questions/en_questions_nodefaults';
import { SelectField } from '@wrappers/components/form';
import QuestionWithRadioButtons from '../QuestionWithRadioButtons';
import { fireEvent } from 'react-native-testing-library';
import { SINGLE_SELECT_MODAL, MULTI_SELECT_MODAL } from '../../../../routes';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { CHOICES } from '../QuestionGroups';

const navigation = {
  navigate: jest.fn(),
};

describe('MyChoicesWithReduxForm', () => {
  const MyChoicesWithReduxForm = compose(
    reduxForm({
      form: 'healthForm',
    }),
  )(MyChoices);

  const initialState = {
    form: {
      lifestyleForm: {
        values: { temptingFoodItems: [], exerciseFrequency: '' },
      },
    },
  };

  const choiceQuestions = questions.questionGroups[CHOICES];

  it('should render snapshot correctly', () => {
    const healthForm = renderForTest(
      <MyChoicesWithReduxForm
        questions={choiceQuestions}
        navigation={navigation}
      />,
      {
        initialState,
      },
    );

    expect(healthForm.toJSON()).toMatchSnapshot();
  });

  it('should render QuestionWithRadioButtons for english_questions', () => {
    const healthForm = renderForTest(
      <MyChoicesWithReduxForm
        questions={choiceQuestions}
        navigation={navigation}
      />,
      {
        initialState,
      },
    );

    const radioButtons = healthForm.getAllByType(QuestionWithRadioButtons);

    expect(radioButtons).toBeDefined();
    expect(radioButtons.length).toBe(8);
  });

  describe('SingleSelect fields', () => {
    it('should render the single select box for english_questions', () => {
      const questionWithOnlySingleSelectField = [
        {
          questionOrder: '4',
          questionId: 'choices_2.3',
          dependentQuestion: false,
          name: 'exerciseFrequency',
          type: 'singleSelect',
          text: 'test question?',
          defaultValue: '',
          options: [],
        },
      ];
      const healthForm = renderForTest(
        <MyChoicesWithReduxForm
          questions={questionWithOnlySingleSelectField}
          navigation={navigation}
        />,
        {
          initialState,
        },
      );

      const selectFields = healthForm.getAllByType(SelectField);

      expect(selectFields).toBeDefined();
      expect(selectFields.length).toBe(1);
    });

    it('should navigate to singleSelect modal with correct parameter when pressed', () => {
      const questionWithOnlySingleSelectField = [
        {
          questionOrder: '4',
          questionId: 'choices_2.3',
          dependentQuestion: false,
          name: 'exerciseFrequency',
          type: 'singleSelect',
          text: 'test question?',
          defaultValue: '',
          options: [],
          titleLabel: 'test title',
        },
      ];
      const healthForm = renderForTest(
        <MyChoicesWithReduxForm
          questions={questionWithOnlySingleSelectField}
          navigation={navigation}
        />,
        {
          initialState,
        },
      );

      const selectFields = healthForm.getAllByType(SelectField);
      fireEvent.press(selectFields[0]);

      expect(navigation.navigate).toBeCalledWith(SINGLE_SELECT_MODAL, {
        fieldKey: questionWithOnlySingleSelectField[0].name,
        form: 'lifestyleForm',
        initialSelected: questionWithOnlySingleSelectField[0].defaultValue,
        data: questionWithOnlySingleSelectField[0].options,
        title: questionWithOnlySingleSelectField[0].titleLabel,
      });
    });
  });

  describe('MultiSelect field for english_questions', () => {
    const questionWithOnlyMultiSelectField = [
      {
        questionOrder: '6',
        questionId: 'choices_2.4',
        dependentQuestion: false,
        name: 'temptingFoodItems',
        text:
          'Do you find any of these foods tempting (that is, do you want to eat more of them than you think you should)?',
        type: 'multiselect',
        hasDefaultValue: true,
        defaultValue: 'Select food',
        buttonLabel: 'Select food',
        options: [
          {
            value: 'Chocolate',
            label: 'Chocolate',
          },
          {
            value: 'PotatoChips',
            label: 'Potato chips',
          },
          {
            value: 'NoneTempting',
            label: "I don't find any food tempting",
            hasInversion: true,
          },
        ],
      },
    ];
    it('should render the selectfield', () => {
      const healthForm = renderForTest(
        <MyChoicesWithReduxForm
          questions={questionWithOnlyMultiSelectField}
          navigation={navigation}
        />,
        {
          initialState,
        },
      );

      const selectFields = healthForm.getAllByType(SelectField);

      expect(selectFields).toBeDefined();
      expect(selectFields.length).toBe(1);
    });

    it('should navigate to a modal when selectfield is pressed', () => {
      const healthForm = renderForTest(
        <MyChoicesWithReduxForm
          questions={choiceQuestions}
          navigation={navigation}
        />,
        { initialState },
      );
      const selectFields = healthForm.getAllByType(SelectField);
      fireEvent.press(selectFields[1]);

      expect(navigation.navigate).toBeCalledWith(MULTI_SELECT_MODAL, {
        data: choiceQuestions[5].options,
        buttonLabel: choiceQuestions[5].buttonLabel,
        form: 'lifestyleForm',
        fieldKey: choiceQuestions[5].name,
        initialSelected: [],
        title: choiceQuestions[5].titleLabel,
      });
    });

    it('should render field label as undefined when no food is selected', () => {
      const healthForm = renderForTest(
        <MyChoicesWithReduxForm
          questions={choiceQuestions}
          navigation={navigation}
        />,
        {
          initialState,
        },
      );
      const selectFields = healthForm.getAllByType(SelectField);
      expect(selectFields[1].props.value).toBe(undefined);
    });

    describe('Linked question for english question', () => {
      describe('radio button linked question', () => {
        it('should not render linked question if option selected does not trigger linked question', () => {
          const initialStateFilled = {
            form: {
              lifestyleForm: {
                values: {
                  alcoholConsumptionFrequency: 'Never',
                  temptingFoodItems: [],
                },
              },
            },
          };

          const healthForm = renderForTest(
            <MyChoicesWithReduxForm
              questions={choiceQuestions}
              navigation={navigation}
            />,
            {
              initialState: initialStateFilled,
            },
          );

          const dependentQuestion = healthForm.queryAllByText(
            choiceQuestions[2].text,
          );
          expect(dependentQuestion.length).toBe(0);
        });

        it('should render linked question if option selected triggers linked question', () => {
          const initialStateFilled = {
            form: {
              lifestyleForm: {
                values: {
                  alcoholConsumptionFrequency: 'MonthlyOrLess',
                  temptingFoodItems: [],
                },
              },
            },
          };

          const healthForm = renderForTest(
            <MyChoicesWithReduxForm
              questions={choiceQuestions}
              navigation={navigation}
            />,
            {
              initialState: initialStateFilled,
            },
          );

          const dependentQuestion = healthForm.queryAllByText(
            choiceQuestions[2].text,
          );
          expect(dependentQuestion.length).toBe(1);
        });
      });
      describe('Single select linked question', () => {
        it('should not render linked question if option selected does not trigger linked question', () => {
          const initialStateFilled = {
            form: {
              lifestyleForm: {
                values: {
                  exerciseFrequency: '0',
                },
              },
            },
          };

          const healthForm = renderForTest(
            <MyChoicesWithReduxForm
              questions={choiceQuestions}
              navigation={navigation}
            />,
            {
              initialState: initialStateFilled,
            },
          );

          const dependentQuestion = healthForm.queryAllByText(
            choiceQuestions[4].text,
          );
          expect(dependentQuestion.length).toBe(0);
        });

        it('should render linked question if option selected triggers linked question', () => {
          const initialStateFilled = {
            form: {
              lifestyleForm: {
                values: {
                  exerciseFrequency: '2',
                  temptingFoodItems: [],
                },
              },
            },
          };

          const healthForm = renderForTest(
            <MyChoicesWithReduxForm
              questions={choiceQuestions}
              navigation={navigation}
            />,
            {
              initialState: initialStateFilled,
            },
          );

          const dependentQuestion = healthForm.queryAllByText(
            choiceQuestions[4].text,
          );
          expect(dependentQuestion.length).toBe(1);
        });
      });
    });
  });
});
