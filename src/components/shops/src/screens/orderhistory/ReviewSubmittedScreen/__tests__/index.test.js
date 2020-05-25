import React from 'react';
import { renderForTest } from '@testUtils';
import ReviewSubmittedScreen from '../index';
import { reviewSubmitted } from '@shops/assets/icons';
import { Image, TrackedButton } from '@shops/wrappers/components';
import { fireEvent } from 'react-native-testing-library';

describe('ReviewSubmittedScreen', () => {
  const navigation = {
    pop: jest.fn(),
  };
  it('should render properly', () => {
    const Comp = renderForTest(
      <ReviewSubmittedScreen navigation={navigation} />,
    );
    const imgComp = Comp.queryByType(Image);
    expect(imgComp.props.source).toBe(reviewSubmitted);
    expect(Comp.queryByText('Review Submitted')).toBeTruthy();
    expect(
      Comp.queryByText(
        'Highly appreciate your comments for our continuous improvement in our products/service under this Platform. For privacy protection, all comments would not be displayed and visible  to other users. All the information given by the users who have successfully made the purchase through the Platform may be shared with related vendors for investigation purpose and service improvement whenever think appropriate.',
      ),
    ).toBeTruthy();
    const button = Comp.queryByType(TrackedButton);
    expect(button.props.title).toBe('Back to Order History');
    fireEvent.press(button);
    expect(navigation.pop).toBeCalledWith(3)
  });
});
