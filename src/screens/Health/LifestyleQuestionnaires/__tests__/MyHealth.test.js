import React from 'react';
import englishQuestions from '../questions/en_questions_nodefaults';
import { HEALTH } from '../QuestionGroups';
import { renderForTest } from '@testUtils';
import { FormattedMessage } from 'react-intl';
import { Image, Text } from '@wrappers/components';
import { myHealthImage } from '@images';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import MyHealth from '../MyHealth';
import QuestionWithRadioButtons from '../QuestionWithRadioButtons';
import { act, fireEvent } from 'react-native-testing-library';
import * as trackingUtils from '@store/analytics/trackingActions';

describe('MyHealth', () => {
  const healthQuestions = englishQuestions.questionGroups[HEALTH];
  //Must render MyHealth component with redux form
  //as it is using RadioButtonGroup, which in turn use Field from redux-form
  const MyHealthWithReduxForm = compose(
    reduxForm({
      form: 'healthForm',
    }),
  )(MyHealth);

  const renderMyHealthWithReduxForm = ({ questions = healthQuestions }) =>
    renderForTest(<MyHealthWithReduxForm questions={questions} />);

  describe('Section header', () => {
    let myHealth;
    beforeEach(() => {
      myHealth = renderMyHealthWithReduxForm({});
    });
    it('should render an Image with my health image as source', () => {
      const healthImage = myHealth.queryAllByType(Image);
      expect(healthImage).toHaveLength(1);
      expect(healthImage[0].props.source).toEqual(myHealthImage);
    });
    it('should render My Health as section title', () => {
      const titleContainer = myHealth.queryAllByType(Text);
      expect(titleContainer).toHaveLength(1);

      const title = titleContainer[0].children[0].props.children;
      expect(title.type).toEqual(FormattedMessage);
      expect(title.props.id).toEqual('myHealthTitle');
    });
  });

  describe('Health questions', () => {
    let myHealth, questionComponents;

    beforeEach(() => {
      myHealth = renderMyHealthWithReduxForm({});
      questionComponents = myHealth.queryAllByType(QuestionWithRadioButtons);
    });

    it('should render all health questions as QuestionWithRadioButtons', () => {
      expect(healthQuestions.length).toBeGreaterThan(0);
      expect(questionComponents).toHaveLength(healthQuestions.length);
    });

    it('should pass each question as prop to QuestionWithRadioButtons', () => {
      expect(
        questionComponents.map(component => component.props.question),
      ).toEqual(healthQuestions);
    });
    it('should tracking question when user change queston', () => {
      jest
        .spyOn(trackingUtils, 'logAction')
        .mockImplementation(() => jest.fn());
      act(() => {
        fireEvent(questionComponents[0], 'onChange');
      });

      expect(trackingUtils.logAction).toHaveBeenCalled();
    });
  });
});
