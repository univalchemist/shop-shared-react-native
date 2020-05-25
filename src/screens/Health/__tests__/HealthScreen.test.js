import React from 'react';
import { renderForTest } from '@testUtils';
import HealthScreen, {
  HealthScreen as PureHealthScreen,
} from '../HealthScreen';
import { PromiseStatus } from '@middlewares';
import LifestyleLandingPage from '../LifestyleLandingPage';

jest.mock('@navigations', () => ({
  useFirebase: () => ({
    remoteConfig: {
      health_screen: '',
    },
  }),
}));

describe('HealthScreen', () => {
  const renderHealthScreen = ({ hasLifestyleResults = true }) =>
    renderForTest(<HealthScreen />, {
      initialState: {
        health: {
          results: {
            bmi: 180,
            bmiClass: 'Obese',
            bmiPoint: 2,
            totalPoint: 2,
            totalRisk: 'Obese',
            smokeRisk: 'Low',
            alcoholRisk: 'Low',
            exerciseRisk: 'Low',
            sleepRisk: 'Low',
            mentalHealthRisk: 'Low',
            nutritionRisk: 'Low',
          },
          hasLifestyleResults: hasLifestyleResults,
          fetchUserLifestyleResultsCompleted: true,
          faceAging: {
            faceAgingIsDone: true,
            expectedTotalResults: 2,
            currentTotalResults: 2,
            results: {
              67: {
                healthy: 'healthybase64Image',
                unhealthy: 'unhealthybase64Image',
              },
              75: {
                healthy: 'healthybase64Image',
                unhealthy: 'unhealthybase64Image',
              },
            },
          },
          lifestyleResults: {
            bmiScore: 40,
            bmiClass: 'Obese',
            diabetesRisk: 'Low',
          },
          lifestyleTips: {
            tips: { general: [] },
            status: PromiseStatus.SUCCESS,
          },
        },
      },
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('on mount', () => {
    it('should fetch lifestyle result in order to render result page if there is result', () => {
      const fetchUserLifestyleResults = jest.fn();
      renderForTest(
        <PureHealthScreen
          getUserFaceAgingResults={jest.fn()}
          fetchUserLifestyleResults={fetchUserLifestyleResults}
          setLocaleCompleted={true}
        />,
      );

      expect(fetchUserLifestyleResults).toHaveBeenCalledTimes(1);
    });

    it('should fetch lifestyle tips', () => {
      const fetchLifestyleTips = jest.fn();
      renderForTest(
        <PureHealthScreen
          fetchLifestyleTips={fetchLifestyleTips}
          getUserFaceAgingResults={jest.fn()}
          fetchUserLifestyleResults={jest.fn()}
          setLocaleCompleted={true}
        />,
      );

      expect(fetchLifestyleTips).toHaveBeenCalledTimes(1);
    });
  });

  it('should render LifestyleLandingPage when hasLifestyleResults is false', () => {
    const healthScreen = renderHealthScreen({
      navigation: { navigate: jest.fn() },
      hasLifestyleResults: false,
    });
    expect(healthScreen.queryAllByType(LifestyleLandingPage).length).toBe(1);
  });
});
