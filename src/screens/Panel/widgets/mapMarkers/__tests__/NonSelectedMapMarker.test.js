import React from 'react';
import { renderForTest } from '@testUtils';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { Marker } from 'react-native-maps';
import { nonSelectedMapMarkerIcon } from '@images';
import NonSelectedMapMarker from '../NonSelectedMapMarker';

describe('NonSelectedMapMarker', () => {
  const markerData = {
    id: 45,
    location: {
      longitude: 15.1,
      latitude: -212.23,
    },
  };
  const renderNonSelectedMapMarker = ({
    data = markerData,
    onPress = jest.fn(),
  }) => renderForTest(<NonSelectedMapMarker data={data} onPress={onPress} />);

  const marker = component => component.queryByType(Marker);

  let component, onPress;
  beforeEach(() => {
    onPress = jest.fn();
    component = renderNonSelectedMapMarker({ onPress });
  });

  it('should render a marker', () => {
    expect(component.queryAllByType(Marker)).toHaveLength(1);
  });

  it('should use data`s location as marker coordinate', () => {
    expect(marker(component).props.coordinate).toEqual(markerData.location);
  });

  it('should render a non selected map marker icon', () => {
    expect(marker(component).props.icon).toBe(nonSelectedMapMarkerIcon);
  });

  it('should call the passed onPress prop when marker is pressed', async () => {
    fireEvent.press(marker(component));
    await flushMicrotasksQueue();

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
