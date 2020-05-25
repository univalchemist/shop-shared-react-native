import React from 'react';
import { LifestyleNavigationButtons } from '../LifestyleNavigationButtons';
import messages from '@messages/en-HK.json';
import { renderForTest } from '@testUtils';
import LifestyleLandingPage from '../LifestyleLandingPage';

describe('LifestyleLandingPage', () => {
  describe('Lifestyle navigation buttons', () => {
    describe('when there is no lifestyle result', () => {
      let buttonRow, mockNavigation;
      beforeEach(() => {
        mockNavigation = { navigate: jest.fn() };
        const lifestyleLandingPage = renderForTest(
          <LifestyleLandingPage navigation={mockNavigation} />,
          {
            initialState: {
              health: {
                data: {},
                results: {
                  bmi: undefined,
                  bmiClass: '',
                  bmiPoint: undefined,
                  totalPoint: 0,
                  totalRisk: 'Low',
                },
                hasLifestyleResults: false,
                fetchUserLifestyleResultsCompleted: true,
                faceAging: {
                  faceAgingIsDone: false,
                },
              },
            },
          },
        );
        buttonRow = lifestyleLandingPage.queryAllByType(
          LifestyleNavigationButtons,
        );
      });

      it('should render a row of navigation buttons', () => {
        expect(buttonRow).toHaveLength(1);
      });

      it('should pass navigation to navigation buttons', () => {
        expect(buttonRow[0].props.navigation).toEqual(mockNavigation);
      });
    });
  });

  it('renders landing title and buttons should show with no health results', () => {
    const { getByText } = renderForTest(<LifestyleLandingPage />, {
      initialState: {
        health: {
          data: {},
          results: {
            bmi: undefined,
            bmiClass: '',
            bmiPoint: undefined,
            totalPoint: 0,
            totalRisk: 'Low',
          },
          hasLifestyleResults: false,
          fetchUserLifestyleResultsCompleted: true,
          faceAging: {
            faceAgingIsDone: false,
          },
        },
      },
    });

    const landingTitleText = getByText(messages['health.landingTitle']);
    expect(landingTitleText).toBeDefined();

    const addHealthButton = getByText(messages['health.addLifestyleData']);
    expect(addHealthButton).toBeDefined();

    const searchPanelButton = getByText(
      messages['panelSearch.searchForClinics'],
    );
    expect(searchPanelButton).toBeDefined();
  });
});
