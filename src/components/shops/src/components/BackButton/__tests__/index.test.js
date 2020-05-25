import React from 'react';
import { TouchableOpacity } from 'react-native';
import { BackButton } from '@shops/components';
import { renderForTest } from '@testUtils';
import { fireEvent } from 'react-native-testing-library';
// import { NavigationService } from '@utils';

jest.mock('@utils', () => {
  return {
    ...require.requireActual('@utils'),
  };
});

describe('BackButton', () => {
  it('should render correctly', () => {
    const backButton = renderForTest(<BackButton />);
    const buttonText = backButton.getByText('Back');
    const button = backButton.getByType(TouchableOpacity);

    fireEvent(button, 'press');

    expect(buttonText).toBeDefined();
    // expect(NavigationService.goBack).toHaveBeenCalledTimes(1);
  });
});
