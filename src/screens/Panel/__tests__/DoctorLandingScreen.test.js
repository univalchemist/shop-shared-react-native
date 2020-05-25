import React from 'react';
import DoctorLandingScreen from '../DoctorLandingScreen';
import { renderForTest } from '@testUtils';
import { ServiceItem } from '@screens/Panel';
import { NonTouchableSearchBar } from '@heal/src/components';

describe('DoctorLandingScreen', () => {
  it('should render correctly', () => {
    const doctorLandingScreen = renderForTest(<DoctorLandingScreen />);
    const searchBar = doctorLandingScreen.getByType(NonTouchableSearchBar);
    const serviceItems = doctorLandingScreen.getAllByType(ServiceItem);

    expect(searchBar).toBeDefined();
    expect(serviceItems.length).toEqual(2);
  });
});
