import React from 'react';
import { renderForTest } from '@testUtils';
import ClusteredMarker, { ClusterContainer } from '../ClusteredMarker';
import { Marker } from 'react-native-maps';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { act } from 'react-test-renderer';

const INITIAL_CLUSTER_ICON_SIZE = 44;
describe('ClusteredMarker', () => {
  const marker = component => component.queryByType(Marker);
  const markerText = component =>
    marker(component).props.children.props.children.props.children;

  let cluster, component, onMarkerPress, tracksViewChanges;

  beforeEach(() => {
    cluster = {
      pointCount: 4,
      coordinate: {
        longitude: 74.22,
        latitude: 39.12,
      },
      clusterId: 2,
    };
    onMarkerPress = jest.fn();
    tracksViewChanges = true;
    component = renderForTest(
      <ClusteredMarker
        data={cluster}
        onMarkerPress={onMarkerPress}
        tracksViewChanges={tracksViewChanges}
      />,
    );
  });
  it('should render a marker', () => {
    expect(component.queryAllByType(Marker)).toHaveLength(1);
  });

  it('should pass tracksViewChanges to marker', () => {
    expect(marker(component).props.tracksViewChanges).toBe(tracksViewChanges);
  });

  it('should use cluster coordinate as marker coordinate', () => {
    expect(marker(component).props.coordinate).toEqual(cluster.coordinate);
  });

  it('should render a Cluster Number', () => {
    expect(markerText(component)).toBe(cluster.pointCount);
  });

  it('should call the passed onMarkerPress prop when marker is pressed', async () => {
    fireEvent.press(marker(component));
    await flushMicrotasksQueue();
    expect(onMarkerPress).toHaveBeenCalledTimes(1);
  });

  it('should call the passed onMarkerPress prop when marker onLayout update with padding 3 to new dimensions', async () => {
    const event = {
      nativeEvent: {
        layout: {
          width: 32,
          height: 32,
        },
      },
    };
    const clusterStyle = {
      width: INITIAL_CLUSTER_ICON_SIZE,
      height: INITIAL_CLUSTER_ICON_SIZE,
      radius: INITIAL_CLUSTER_ICON_SIZE / 2,
    };
    const clusterContainer = component.queryByType(ClusterContainer);
    act(() => {
      clusterContainer.props.children.props.onLayout(event);
    });
    await flushMicrotasksQueue();
    expect(clusterContainer.props.clusterStyle.width).toEqual(
      clusterStyle.width,
    );
    expect(clusterContainer.props.clusterStyle.height).toEqual(
      clusterStyle.height,
    );
    expect(clusterContainer.props.clusterStyle.radius).toEqual(
      clusterStyle.radius,
    );
  });
});
