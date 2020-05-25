import React from 'react';
import { ImageBackground } from 'react-native';
import { renderForTest } from '@testUtils';
import { Marker } from 'react-native-maps';
import { nonSelectedStackedMarkerIcon } from '@images';
import NonSelectedStackedMapMarker from '../NonSelectedStackedMapMarker';
import theme from '@theme';

describe('NonSelectedStackedMapMarker', () => {
  const someCluster = {
    pointCount: 23,
    coordinate: {
      longitude: 5.21,
      latitude: -4.12,
    },
    clusterId: 6,
  };

  const renderNonSelectedStackedMapMarker = ({
    data = someCluster,
    onMarkerPress = jest.fn(),
  }) =>
    renderForTest(
      <NonSelectedStackedMapMarker data={data} onMarkerPress={onMarkerPress} />,
    );

  const marker = component => component.queryByType(Marker);
  const markerIcon = component => marker(component).props.children;
  const markerText = marker =>
    markerIcon(marker).props.children[1].props.children;
  const markerTextContent = marker => markerText(marker).props.children;

  let component, onMarkerPress, data;

  beforeEach(() => {
    data = someCluster;
    onMarkerPress = jest.fn();
    component = renderNonSelectedStackedMapMarker({ data, onMarkerPress });
  });

  it('should render a marker', () => {
    expect(component.queryAllByType(Marker)).toHaveLength(1);
  });

  it('should use cluster`s coordinate as marker coordinate', () => {
    expect(marker(component).props.coordinate).toEqual(data.coordinate);
  });

  it('should track view changes or else icon will not display though this may degrade performance', () => {
    expect(marker(component).props.tracksViewChanges).toBe(true);
  });

  it('should pass onMarkerPress to marker`s onPress', () => {
    marker(component).props.onPress();
    expect(onMarkerPress).toHaveBeenCalledTimes(1);
  });

  it('should render cluster`s pointCount', () => {
    expect(markerTextContent(component)).toEqual(data.pointCount);
  });

  it('should render cluster`s pointCount in gray', () => {
    expect(markerText(component).props.color).toEqual(theme.colors.gray[0]);
  });

  it('should render a selected stacked icon', () => {
    expect(markerIcon(component).type.target).toBe(ImageBackground);
    expect(markerIcon(component).props.source).toBe(
      nonSelectedStackedMarkerIcon,
    );
  });

  it('must pass some object to prop style of ImageBackground or else all tests fail', () => {
    expect(markerIcon(component).props.style).toBeDefined();
  });
});
