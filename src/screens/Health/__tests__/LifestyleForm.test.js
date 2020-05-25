import {
  Button,
  Loader,
  ScrollViewForStickyButton,
} from '@wrappers/components';
import { HEALTH } from '@routes';
import { renderForTest } from '@testUtils';
import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import LifestyleForm, {
  LifestyleForm as PureLifestyleForm,
} from '../LifestyleForm';
import messages from '@messages/en-HK.json';
import { MyChoices } from '../LifestyleQuestionnaires/MyChoices';
import { MyHealth } from '../LifestyleQuestionnaires/MyHealth';
import english_questions from '../LifestyleQuestionnaires/questions/en_questions';
import * as QuestionGroups from '../LifestyleQuestionnaires/QuestionGroups';
import { getInitialValuesFromQuestions } from '../helpers';
import { submitUserLifestyleResponse } from '@store/health/actions';
import FutureMe from '../LifestyleQuestionnaires/FutureMe';

jest.mock('@utils/nativeImageHelpers', () => ({
  compressImage: jest.fn(x => x),
}));

const ethnicityOptions = {
  option1: 'option1',
  option2: 'option2',
};
jest.useFakeTimers();
jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));

jest.mock('@store/health/actions', () => ({
  submitUserLifestyleResponse: jest.fn(values => {
    if (values.height === 2) {
      const error = {
        response: { data: { message: 'Error' } },
      };
      throw error;
    }
    return {
      type: 'TEST_CALL',
      value: { value: {} },
    };
  }),
  fetchUserLifestyleResponse: jest.fn(() => {
    return {
      type: 'TEST_CALL',
      value: { value: {} },
    };
  }),
  downloadFaceAgingPhoto: jest.fn(() => {
    return {
      type: 'TEST_CALL',
      value: { value: {} },
    };
  }),
  resetLoader: jest.fn(() => {
    return {
      type: 'TEST_CALL',
      value: { value: {} },
    };
  }),
}));

const stateWithError = {
  form: {
    lifestyleForm: {
      values: {
        height: 2, // triggers error
        temptingFoodItems: [],
      },
    },
  },
  health: {
    data: {},
    faceAging: { image: { uri: '' } },
    ethnicityOptions,
    fetchFaceAgingImageCompleted: true,
    fetchHealthResponseCompleted: true,
    fetchUserLifestyleResponseCompleted: true,
    submittingUserLifestyleResponse: false,
  },
  user: {
    profile: { preferredLocale: 'en-HK' },
  },
};

const stateWithoutError = {
  form: {
    lifestyleForm: {
      values: { temptingFoodItems: [] },
    },
  },
  health: {
    data: {
      height: 1,
      weight: 1,
      waistCircumference: 1,
      ethnicity: 'ethnicity1',
    },
    faceAging: { image: { uri: '' } },
    ethnicityOptions,
    fetchFaceAgingImageCompleted: true,
    fetchUserLifestyleResponseCompleted: true,
    submittingUserLifestyleResponse: false,
  },
  user: {
    profile: { preferredLocale: 'en-HK' },
  },
};

const stateWithSubmitResponseLoader = {
  form: {
    lifestyleForm: {
      values: { temptingFoodItems: [] },
    },
  },
  health: {
    data: {},
    faceAging: { image: { uri: '' } },
    ethnicityOptions,
    fetchFaceAgingImageCompleted: true,
    fetchHealthResponseCompleted: true,
    fetchUserLifestyleResponseCompleted: true,
    submittingUserLifestyleResponse: true,
  },
  user: {
    profile: { preferredLocale: 'en-HK' },
  },
};

describe('LifestyleForm', () => {
  const renderLifestyleForm = ({ initialState = stateWithoutError }) => {
    return renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
      />,
      {
        initialState,
      },
    );
  };

  it('should have the correct labels', () => {
    const { getByText } = renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
      />,
      {
        initialState: stateWithoutError,
      },
    );
    [messages.height, messages.weight, messages.waistCircumference].forEach(
      label => {
        const element = getByText(label);
        expect(element).toBeDefined();
      },
    );
  });

  it('should show the lifestyle form page in english', () => {
    const initialStateWithFormRendered = {
      form: {
        lifestyleForm: {
          values: {
            temptingFoodItems: [],
          },
        },
      },
      health: {
        data: {
          height: 1,
          weight: 1,
          waistCircumference: 1,
          ethnicity: 'ethnicity1',
        },
        faceAging: { image: { uri: '' } },
        ethnicityOptions,
        fetchUserLifestyleResponseCompleted: true,
        submittingUserLifestyleResponse: false,
      },
      user: {
        profile: { preferredLocale: 'en-HK' },
      },
    };
    const lifestyleForm = renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
      />,
      {
        initialState: initialStateWithFormRendered,
      },
    ).toJSON();

    expect(lifestyleForm).toMatchSnapshot();
  });

  it('should show the lifestyle form page in chinese', () => {
    const initialStateWithFormRendered = {
      form: {
        lifestyleForm: {
          values: { temptingFoodItems: [] },
        },
      },
      health: {
        data: {
          height: 1,
          weight: 1,
          waistCircumference: 1,
          ethnicity: 'ethnicity1',
        },
        faceAging: { image: { uri: '' } },
        ethnicityOptions,
        fetchUserLifestyleResponseCompleted: true,
        submitUserLifestyleResponse: false,
        submittingUserLifestyleResponse: false,
      },
      user: {
        profile: { preferredLocale: 'zh-HK' },
      },
    };
    const lifestyleForm = renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
      />,
      {
        initialState: initialStateWithFormRendered,
      },
    ).toJSON();

    expect(lifestyleForm).toMatchSnapshot();
  });

  it('should pass choices questions to MyChoices component', () => {
    const lifestyleForm = renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
      />,
      {
        initialState: {
          ...stateWithoutError,
          user: {
            profile: { preferredLocale: 'en-HK' },
          },
        },
      },
    );
    const myChoices = lifestyleForm.queryByType(MyChoices);

    expect(myChoices.props.questions).toEqual(
      english_questions.questionGroups[QuestionGroups.CHOICES],
    );
  });

  it('should navigate to health page when user submits lifestyle data', async () => {
    const navigate = jest.fn();
    const lifestyleForm = renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
        navigation={{ navigate }}
      />,
      {
        initialState: stateWithoutError,
      },
    );

    const button = lifestyleForm.getByType(Button);
    fireEvent.press(button);

    await flushMicrotasksQueue();

    expect(Alert.alert.mock.calls.length).toBe(0);
    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe(HEALTH);
  });

  it('should navigate to lifestyle form when server returns error', async () => {
    const navigate = jest.fn();

    const lifestyleForm = renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
        navigation={{ navigate }}
      />,
      {
        initialState: stateWithError,
      },
    );

    const button = lifestyleForm.getByType(Button);

    fireEvent.press(button);
    await flushMicrotasksQueue();
    jest.runOnlyPendingTimers();

    expect(Alert.alert.mock.calls.length).toBe(1);
  });

  it('should show a loader while submitting the lifestyle response', () => {
    const lifestyleForm = renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
      />,
      {
        initialState: stateWithSubmitResponseLoader,
      },
    );
    const loader = lifestyleForm.getByType(Loader);
    expect(loader).toBeDefined();
  });

  it('should render scroll view for sticky button to avoid scroll issues', () => {
    const lifestyleForm = renderForTest(
      <LifestyleForm
        route={{
          params: { scrollToFutureMe: false },
        }}
      />,
      {
        initialState: stateWithoutError,
      },
    );

    expect(
      lifestyleForm.queryAllByType(ScrollViewForStickyButton),
    ).toHaveLength(1);
  });

  describe('FutureMe', () => {
    let futureMe, initialState;
    beforeEach(() => {
      initialState = {
        ...stateWithoutError,
        health: {
          ...stateWithoutError.health,
          faceAging: {
            image: {
              uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD',
            },
          },
        },
        user: {
          profile: { preferredLocale: 'en-HK' },
        },
      };
      const lifestyleForm = renderLifestyleForm({ initialState });
      futureMe = lifestyleForm.queryAllByType(FutureMe);
    });

    it('should render FutureMe component', () => {
      expect(futureMe).toHaveLength(1);
    });

    it('should pass change as prop to FutureMe', () => {
      expect(futureMe[0].props.change).toEqual(expect.any(Function));
    });

    it('should pass face aging image as prop to FutureMe', () => {
      const result = futureMe[0].props.initialValues;

      expect(result).toEqual({
        image: initialState.health.faceAging.image,
      });
    });
  });

  describe('on mount', () => {
    it('should download face aging photo', () => {
      const downloadFaceAgingPhoto = jest.fn();
      const intl = { formatMessage: jest.fn() };
      renderForTest(
        <PureLifestyleForm
          route={{
            params: { scrollToFutureMe: false },
          }}
          intl={intl}
          submitUserLifestyleResponse={jest.fn()}
          resetLoader={jest.fn()}
          submittingUserLifestyleResponse={false}
          fetchUserLifestyleResponse={jest.fn()}
          fetchUserLifestyleResponseEnd={jest.fn()}
          downloadFaceAgingPhoto={downloadFaceAgingPhoto}
          handleSubmit={jest.fn()}
        />,
      );

      expect(downloadFaceAgingPhoto).toHaveBeenCalledTimes(1);
    });
  });

  describe('on unmount', () => {
    it('should reset loader', () => {
      const resetLoader = jest.fn();
      const intl = { formatMessage: jest.fn() };
      const { unmount } = renderForTest(
        <PureLifestyleForm
          route={{
            params: { scrollToFutureMe: false },
          }}
          intl={intl}
          submitUserLifestyleResponse={jest.fn()}
          resetLoader={resetLoader}
          submittingUserLifestyleResponse={false}
          fetchUserLifestyleResponse={jest.fn()}
          fetchUserLifestyleResponseEnd={jest.fn()}
          downloadFaceAgingPhoto={jest.fn()}
          handleSubmit={jest.fn()}
        />,
      );

      unmount();

      expect(resetLoader).toHaveBeenCalledWith();
    });
  });

  describe('Dependent questions', () => {
    it('should submit inactive dependent values as null when not activated', async () => {
      const lifestyleForm = renderForTest(
        <LifestyleForm
          route={{
            params: { scrollToFutureMe: false },
          }}
        />,
        {
          initialState: {
            ...stateWithoutError,
            form: {
              lifestyleForm: {
                values: {
                  alcoholConsumptionFrequency: 'Never',
                  alcoholConsumptionAmount: 'MonthlyOrLess',
                },
              },
            },
          },
        },
      );

      fireEvent.press(lifestyleForm.queryAllByType(Button)[0]);
      await flushMicrotasksQueue();

      expect(submitUserLifestyleResponse).toHaveBeenCalledWith({
        alcoholConsumptionFrequency: 'Never',
        alcoholConsumptionAmount: null,
        avoidingTemptingFood: null,
        exerciseMinuteFrequency: null,
      });
    });
  });

  describe('MyHealth', () => {
    let lifestyleForm, myHealth;

    beforeEach(() => {
      lifestyleForm = renderForTest(
        <LifestyleForm
          route={{
            params: { scrollToFutureMe: false },
          }}
        />,
        {
          initialState: {
            ...stateWithoutError,
            user: {
              profile: { preferredLocale: 'en-HK' },
            },
          },
        },
      );
      myHealth = lifestyleForm.queryAllByType(MyHealth);
    });

    it('should render MyHealth section', () => {
      expect(myHealth).toHaveLength(1);
    });

    it('should pass health questions to MyHealth section', () => {
      expect(myHealth[0].props.questions).toEqual(
        english_questions.questionGroups[QuestionGroups.HEALTH],
      );
    });
  });

  describe('mapStateToProps', () => {
    const getInitialState = ({ healthData, fetchCompleted }) => ({
      form: {
        lifestyleForm: {
          values: {},
        },
      },
      health: {
        data: healthData,
        faceAging: { image: { uri: '' } },
        fetchFaceAgingImageCompleted: true,
        fetchUserLifestyleResponseCompleted: fetchCompleted,
        submittingUserLifestyleResponse: false,
      },
      user: {
        profile: { preferredLocale: 'en-HK' },
      },
    });

    const defaultValues = getInitialValuesFromQuestions(english_questions);

    it(`should use default value of each question as initialValues
    when fetching previous response is yet to complete`, () => {
      const initialState = getInitialState({
        healthData: {},
        fetchCompleted: false,
      });

      const { queryByType } = renderLifestyleForm({ initialState });
      const lifestyleForm = queryByType(PureLifestyleForm);

      const {
        image,
        ...initialValuesForQuestions
      } = lifestyleForm.props.initialValues;
      expect(initialValuesForQuestions).toEqual(defaultValues);
    });

    it(`should override questions' default values with previous response
    and use the result as initialValues
    when fetching previous response is completed`, () => {
      const previousResponse = {
        alcoholConsumptionFrequency: 'value1',
        highBloodPressure: 'value2',
      };
      const initialState = getInitialState({
        healthData: previousResponse,
        fetchFaceAgingImageCompleted: true,
        fetchCompleted: true,
      });

      const { queryByType } = renderLifestyleForm({ initialState });
      const lifestyleForm = queryByType(PureLifestyleForm);

      Object.keys(previousResponse).forEach(responseKey => {
        expect(lifestyleForm.props.initialValues[responseKey]).toEqual(
          previousResponse[responseKey],
        );
      });
    });

    it(`should use default value of exercise frequency
    if previous response has no value
    when fetching previous response is completed`, () => {
      const initialState = getInitialState({
        healthData: {},
        fetchCompleted: true,
      });

      const { queryByType } = renderLifestyleForm({ initialState });
      const lifestyleForm = queryByType(PureLifestyleForm);

      expect(lifestyleForm.props.initialValues.exerciseFrequency).toEqual('');
    });

    it(`should only override default value of exercise frequency
    if previous response has a value
    when fetching previous response is completed`, () => {
      const previousResponse = {
        exerciseFrequency: '2',
      };
      const initialState = getInitialState({
        healthData: previousResponse,
        fetchFaceAgingImageCompleted: true,
        fetchCompleted: true,
      });

      const { queryByType } = renderLifestyleForm({ initialState });
      const lifestyleForm = queryByType(PureLifestyleForm);

      expect(lifestyleForm.props.initialValues.exerciseFrequency).toEqual('2');
    });

    it('should render a disclaimer message', () => {
      const lifestyleForm = renderForTest(
        <LifestyleForm
          route={{
            params: { scrollToFutureMe: false },
          }}
        />,
        {
          initialState: {
            ...stateWithoutError,
            user: {
              profile: { preferredLocale: 'en-HK' },
            },
          },
        },
      );

      const disclaimerMessage = lifestyleForm.queryAllByText(
        messages['health.lifestyleForm.disclaimerMessage'],
      );

      expect(disclaimerMessage.length).toBe(1);
    });

    it('should render a disclaimer title', () => {
      const lifestyleForm = renderForTest(
        <LifestyleForm
          route={{
            params: { scrollToFutureMe: false },
          }}
        />,
        {
          initialState: {
            ...stateWithoutError,
            user: {
              profile: { preferredLocale: 'en-HK' },
            },
          },
        },
      );

      const disclaimerTitle = lifestyleForm.queryAllByText(
        messages['health.lifestyleForm.disclaimerTitle'],
      );

      expect(disclaimerTitle.length).toBe(1);
    });
  });
});
