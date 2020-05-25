import React from 'react';
import { PromiseStatus } from '@middlewares';
import { renderForTest } from '@testUtils';
import FaceAgingResults from '../index';
import { Text } from '@wrappers/components';
import { Slider } from 'react-native-elements';
import { act, flushMicrotasksQueue } from 'react-native-testing-library';
import { ErrorCard } from '@screens/Health/components/widgets/ErrorCard';

const faceAgingResults = {
  '35': {
    unhealthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzgCSob8ABQQ/eNGPwAEa9NvjXrgPAAQ6VWTgoAC8uf5PZMcQAphUvBHyAAR+ogAZiPJZ4AACDF5ABEAYAC4ceS9cIAFpePaSLFwAEOmF5ZZHgAEvKwAAFv//Z',
    healthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFx0X4/AATr6beNeuA8ABDqV5OCgALy5vL9kxxACnPUvBHyAAD9RAAGI8lngAAIMXkAAgDAAXDjyXrhAAtL8f2kia4ADN1QvLLI8AALysAAEt/9k=',
  },
  '45': {
    unhealthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdAS+AAjXpt8a9cB4ACXQrycGcAKyw+T2THEAKYVLwR8gAEfqIAGYjyWeAAAgxeQARAGAAuHHkvXCABaXj2mia4ACHTC8stjwAAvKYAAlP/Z',
    healthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdAS+PBTk3lsEFQGo7AluTAFHk0RRmi6ZqjuKt8elkVsMEhshvFGRFC2NOXgzl5c3yeyk0H0YmNIbKpJMGwE7bAglYmtySsVgAluTIx5JeACICAAJIIumPkjwwNswyvyWPmzJjlTNHfaJ1HT8euzgXNlsSq9yxMlrFliu2Qb8Eo8CUnH2AceABSVilwABCquRTPgAGy0qZCQAW56i/JCPIANnVngsXAABxGYueQAPwBH8wSS7gAAMiXYiAAAEuBQ4AAJJeCuQAEASVDfgAAIfvGjH4ABa9NsL1wHgAIbq8nBnAC8sPk9kwiADY1PwR8gAEfqIAAxHks8AABBi8gAEAYANcOPJoXCACdLx7SRNcABDoheWWx4AAVlYAAJb/9k=',
  },
  '55': {
    unhealthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAH0AXcDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAAECAwQFBgf/aL8fgAJ19NvGvXAeAAh1K8nBQAF5c3l+yY4gBTnqXgj5AAB+ogADEeSzwAAEGLyAAQBgALhx5L1wgAWl+P7SRNcABm6oXllkeAAF5WAACW/9k=',
  },
  '67': {
    healthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/xAA7EAACAgEDAwIDBQcEAQQDAAAAAQIRAwQhMQUSQVFhEyJxBhQjMoEkQmKRobHBFTM0UtE+AAnXpt8a9cB4ACHSrycGcALy5/k9kxxACmFS8EfIABH6iABmI8lngAAIMXkAEQBgALhx5L1wgAWl49pIsXAAQ6YXllkeAAF5WAACW/9k=',
    unhealthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/UhHkAGirPQsXAABxGYueQAPgCP4gkl3AAAZEuxEAAAcuCMOAACSXoVyAAgCSob9AAYQ/aNGN8ABN6a4NC4D0ACHQqycGcALxYeTsmEQApjU/Qj6gAiP3EADMR5LPQAAIMXqACIAwAa4ceTQuEACqsO0kWLgAM3RC9WWx4AAVEwAAW//2Q==',
  },
  '75': {
    healthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/L1wHgAIdCvLwZwAvLn+T2TCIANjU/BHyAAR+ogADEeSzwAAEGLyAAQBgALhx5NC4QALS8e0kTXAAQ6IXllseAAF5TAAEp//2Q==',
    unhealthy:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCiCSXcAAGRLsRAAAJcChwABEl4K5AAgElQ34ACiP8RfjfAAZvx14aFwHgAMu6rLwZwA1HDv6TCIAacan4I+QAB+ogAKI8lngAAgxeQAIBsADcEeTRHhABK1x9TRNcABh3heWWx4AA1FgABGn//Z',
  },
};

describe('FaceAgingResults', () => {
  let component;

  const ageSlider = component => component.queryByType(Slider);
  const sectionTitle = component => component.queryAllByType(Text)[1];
  const sectionTitleText = component => sectionTitle(component).props.children;

  const updateSelectedAge = async age => {
    act(() => {
      ageSlider(component).props.onValueChange(ageIndexOf(age));
    });
    await flushMicrotasksQueue();
  };

  const ages = Object.keys(faceAgingResults);
  const ageIndexOf = ageValue => ages.indexOf(ageValue);

  beforeEach(() => {
    component = renderForTest(<FaceAgingResults />, {
      initialState: {
        health: {
          results: {
            bmi: 180,
            bmiClass: 'Obese',
            bmiPoint: 2,
            totalPoint: 2,
            totalRisk: 'Obese',
          },
          hasLifestyleResults: true,
          fetchUserLifestyleResultsCompleted: true,
          faceAging: {
            faceAgingIsDone: true,
            results: faceAgingResults,
            expectedTotalResults: 10,
            currentTotalResults: 10,
          },
          lifestyleResults: {
            bmiScore: 40,
            bmiClass: 'Obese',
          },
          lifestyleTips: {
            tips: { general: [] },
            status: PromiseStatus.SUCCESS,
          },
        },
      },
    });
  });

  describe('when faceaging is done', () => {
    it('should render snapshot of faceaging component', () => {
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('should render faceaging section title when faceaging component is activated', () => {
      const sectionText = component.queryAllByType(Text)[1];

      expect(sectionText.props.children).toBe(
        `Me at age ${Object.keys(faceAgingResults)[0]}`,
      );
    });

    it('should render 65 instead of 67 when selected age is 67', async () => {
      await updateSelectedAge('67');

      expect(sectionTitleText(component)).toBe(`Me at age 65`);
    });
  });

  it('should show loader when fetching of faceaging image is not done', async () => {
    const { getByProps } = renderForTest(<FaceAgingResults />, {
      initialState: {
        health: {
          results: {
            bmi: 180,
            bmiClass: 'Obese',
            bmiPoint: 2,
            totalPoint: 2,
            totalRisk: 'Obese',
          },
          hasLifestyleResults: true,
          fetchUserLifestyleResultsCompleted: true,
          faceAging: {
            faceAgingIsDone: false,
            isError: false,
            results: {},
          },
          lifestyleResults: {
            bmiScore: 40,
            bmiClass: 'Obese',
          },
          lifestyleTips: {
            tips: { general: [] },
            status: PromiseStatus.SUCCESS,
          },
        },
      },
    });

    const loaderComponent = getByProps({
      animationDelay: 200,
    });
    expect(loaderComponent).toBeDefined();
  });

  it('should show loader when fetching of first faceaging image is done but current and expected number of images are different', async () => {
    const { getByProps } = renderForTest(<FaceAgingResults />, {
      initialState: {
        health: {
          results: {
            bmi: 180,
            bmiClass: 'Obese',
            bmiPoint: 2,
            totalPoint: 2,
            totalRisk: 'Obese',
          },
          hasLifestyleResults: true,
          fetchUserLifestyleResultsCompleted: true,
          faceAging: {
            faceAgingIsDone: false,
            isError: false,
            expectedTotalResults: 3,
            currentTotalResults: 5,
            results: {},
          },
          lifestyleResults: {
            bmiScore: 40,
            bmiClass: 'Obese',
          },
          lifestyleTips: {
            tips: { general: [] },
            status: PromiseStatus.SUCCESS,
          },
        },
      },
    });

    const loaderComponent = getByProps({
      animationDelay: 200,
    });
    expect(loaderComponent).toBeDefined();
  });

  it('should show error card when isError is true', async () => {
    const { getAllByType } = renderForTest(<FaceAgingResults />, {
      initialState: {
        health: {
          results: {
            bmi: 180,
            bmiClass: 'Obese',
            bmiPoint: 2,
            totalPoint: 2,
            totalRisk: 'Obese',
          },
          hasLifestyleResults: true,
          fetchUserLifestyleResultsCompleted: true,
          faceAging: {
            faceAgingIsDone: false,
            isError: true,
            results: {},
          },
          lifestyleResults: {
            bmiScore: 40,
            bmiClass: 'Obese',
          },
          lifestyleTips: {
            tips: { general: [] },
            status: PromiseStatus.SUCCESS,
          },
        },
      },
    });

    await flushMicrotasksQueue();

    const errorComponent = getAllByType(ErrorCard);
    expect(errorComponent.length).toBe(1);
  });
});
