import { getBmiResults } from '../getBmiResults';
import theme from '@theme';
import messages from '@messages/en-HK.json';

describe('getBmiResults', () => {
  const intl = {
    formatMessage: jest.fn(({ id }) => {
      return messages[id];
    }),
  };

  it('should return with valid lifestyle results', () => {
    const lifestyleResults = {
      bmiClass: 'Healthy',
      bmiScore: 30,
    };

    const results = getBmiResults(lifestyleResults, theme, intl);
    const expectedResult = {
      isValid: true,
      score: 30,
      color: '#00847F',
      textColor: '#333333',
      status: messages['health.class.Healthy'],
      description: messages['health.bmiCard.Healthy'],
      title: messages['health.bmi'],
      tips: {
        category: 'bmi',
        result: messages['health.class.Healthy'],
        tipDescription: messages['health.bmiCard.Healthy'],
      },
    };

    expect(results).toEqual(expectedResult);
  });

  it('should return with invalid results ', () => {
    const lifestyleResults = {
      bmiClass: 'Invalid class',
      bmiScore: 30,
    };

    const results = getBmiResults(lifestyleResults, theme, intl);

    expect(results.isValid).toEqual(false);
  });

  it('should pass isValid false when bmiClass cannot be mapped', () => {
    const lifestyleResults = {
      bmiScore: 30,
    };

    const results = getBmiResults(lifestyleResults, theme, intl);
    expect(results.isValid).toEqual(false);
  });

  it('should not call internatialization when bmiClass cannot be mapped', () => {
    const invalidLifestyleResults = { bmiScore: 30 };
    getBmiResults(invalidLifestyleResults, theme, intl);

    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.class.undefined',
    });
    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.bmiCard.undefined',
    });
  });

  it('should return with invalid results with a null bmiScore ', () => {
    const lifestyleResults = {
      bmiClass: 'Healthy',
      bmiScore: null,
    };

    const results = getBmiResults(lifestyleResults, theme, intl);

    expect(results.isValid).toEqual(false);
  });

  it('should return with invalid results with a null bmiScore and bmiClass ', () => {
    const lifestyleResults = {
      bmiClass: null,
      bmiScore: null,
    };

    const results = getBmiResults(lifestyleResults, theme, intl);

    expect(results.isValid).toEqual(false);
  });
});
