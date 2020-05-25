import React from 'react';
import DoctorLandingHeader from '../DoctorLandingHeader';
import { renderForTest } from '@testUtils';
import { Image } from '@wrappers/components';

describe('DoctorLandingHeader', () => {
  it('should render correctly', () => {
    const doctorLandingScreen = renderForTest(<DoctorLandingHeader />);

    const image = doctorLandingScreen.getByType(Image);
    expect(image).toBeDefined();
  });
});
