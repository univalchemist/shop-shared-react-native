import React from 'react';
import { Marker } from 'react-native-maps';
import { renderForTest } from '@testUtils';
import { selectedMapMarkerIcon } from '@images';
import SelectedMapMarker from '../SelectedMapMarker';

describe('SelectedMapMarker', () => {
  const markerData = {
    id: 89,
    location: {
      longitude: -26.1,
      latitude: 74.5,
    },
  };

  const renderSelectedMapMarker = ({ data = markerData }) =>
    renderForTest(<SelectedMapMarker data={data} />);
  const marker = component => component.queryByType(Marker);
  const markerIcon = component => marker(component).props.children;

  let component;
  beforeEach(() => {
    component = renderSelectedMapMarker({ data: markerData });
  });

  it('should render a Marker', () => {
    expect(component.queryAllByType(Marker)).toHaveLength(1);
  });

  it('should use data`s location as marker coordinate', () => {
    expect(marker(component).props.coordinate).toEqual(markerData.location);
  });

  it('should render a selected marker icon', () => {
    expect(marker(component).props.icon).toBe(selectedMapMarkerIcon);
  });
});
