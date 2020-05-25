import React from 'react';
import { renderForTest } from '@testUtils';
import { ImageBackground } from 'react-native';
import { Marker } from 'react-native-maps';
import { selectedStackedMarkerIcon } from '@images';
import SelectedStackedMapMarker from '../SelectedStackedMapMarker';
import theme from '@theme';

describe('SelectedStackedMapMarker', () => {
  const someCluster = {
    clusterId: 7,
    pointCount: 57,
    coordinate: {
      longitude: -31.2,
      latitude: 48.1,
    },
  };
  const marker = component => component.queryByType(Marker);
  const markerIcon = component => marker(component).props.children;
  const markerText = marker =>
    markerIcon(marker).props.children[1].props.children;
  const markerTextContent = marker => markerText(marker).props.children;

  const renderSelectedStackedMapMarker = ({ data = someCluster }) =>
    renderForTest(<SelectedStackedMapMarker data={data} />);

  let component, data;
  beforeEach(() => {
    data = someCluster;
    component = renderSelectedStackedMapMarker({ data });
  });

  it('should render a marker', () => {
    expect(component.queryAllByType(Marker)).toHaveLength(1);
  });

  it('should use cluster`s coordinate to marker', () => {
    expect(marker(component).props.coordinate).toBe(data.coordinate);
  });

  it('should track view changes or else the icon does not show though this degrades performance', () => {
    expect(marker(component).props.tracksViewChanges).toBe(true);
  });

  it('should render cluster`s point count', () => {
    expect(markerTextContent(component)).toBe(data.pointCount);
  });

  it('should render cluster`s point count in white', () => {
    expect(markerText(component).props.color).toBe(theme.colors.white);
  });

  it('should render selected stacked map marker icon', () => {
    expect(markerIcon(component).type.target).toBe(ImageBackground);
    expect(markerIcon(component).props.source).toBe(selectedStackedMarkerIcon);
  });

  it('must pass an object to style prop of ImageBackground or else all tests fail', () => {
    expect(markerIcon(component).props.style).toBeDefined();
  });
});
