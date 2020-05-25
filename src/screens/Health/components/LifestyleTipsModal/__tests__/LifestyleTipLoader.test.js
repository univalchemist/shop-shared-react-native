import React from 'react';
import { LifestyleTipLoader } from '../LifestyleTipLoader';
import { renderForTest } from '@testUtils';
import { TextSkeletonPlaceholder } from '@wrappers/components';
import { TouchableContainer } from '@screens/Health/components/widgets/TipCard';

describe('LifestyleTipLoader', () => {
  it('should render snapshot correctly', () => {
    const component = renderForTest(<LifestyleTipLoader />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render text skeleton placeholder', () => {
    const component = renderForTest(<LifestyleTipLoader />);
    expect(component.queryAllByType(TextSkeletonPlaceholder).length).toBe(17);
  });

  it('should render 2 cards', () => {
    const component = renderForTest(<LifestyleTipLoader />);
    expect(component.queryAllByType(TouchableContainer).length).toBe(2);
  });
});
