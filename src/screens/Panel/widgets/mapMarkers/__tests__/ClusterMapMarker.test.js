import React from 'react';
import { renderForTest } from '@testUtils';
import ClusterMapMarker from '../ClusterMapMarker';
import ClusteredMarker from '../ClusteredMarker';
import NonSelectedStackedMapMarker from '../NonSelectedStackedMapMarker';
import SelectedStackedMapMarker from '../SelectedStackedMapMarker';
import { updateSelectedClinics } from '@store/panel/actions';

jest.mock('@store/panel/actions', () => ({
  updateSelectedClinics: jest.fn(
    jest.requireActual('../../../../../store/panel/actions')
      .updateSelectedClinics,
  ),
}));

describe('ClusterMapMarker', () => {
  const clusterMapMapker = ({
    data,
    zoomIntoCluster = jest.fn(),
    showClusteredMarker = false,
    clusterChildren = [],
    tracksViewChanges = false,
  }) => (
    <ClusterMapMarker
      data={data}
      zoomIntoCluster={zoomIntoCluster}
      showClusteredMarker={showClusteredMarker}
      clusterChildren={clusterChildren}
      tracksViewChanges={tracksViewChanges}
    />
  );

  const renderClusterMapMarker = ({
    selectedClinics = [],
    ...clusterMapMarkerProps
  }) =>
    renderForTest(clusterMapMapker(clusterMapMarkerProps), {
      initialState: { panel: { selectedClinics } },
    });

  const clusteredMarker = component => component.queryByType(ClusteredMarker);
  const nonSelectedStackedMapMarker = component =>
    component.queryByType(NonSelectedStackedMapMarker);
  const selectedStackedMapMarker = component =>
    component.queryByType(SelectedStackedMapMarker);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When showClusteredMarker is true', () => {
    let data, zoomIntoCluster, component, props;
    beforeEach(() => {
      data = {
        pointCount: 365,
        coordinate: {
          longitude: 12.1,
          latitude: 40.5,
        },
        clusterId: 6,
      };
      zoomIntoCluster = jest.fn();
      props = {
        data,
        zoomIntoCluster,
        showClusteredMarker: true,
        tracksViewChanges: true,
      };
      component = renderClusterMapMarker(props);
    });

    it('should render ClusteredMarker', () => {
      expect(component.queryAllByType(ClusteredMarker)).toHaveLength(1);
    });

    it('should pass data to ClusteredMarker', () => {
      expect(clusteredMarker(component).props.data).toBe(data);
    });

    it('should pass tracksViewChanges to ClusteredMarker', () => {
      expect(clusteredMarker(component).props.tracksViewChanges).toBe(
        props.tracksViewChanges,
      );
    });

    it('should zoom into cluster on ClusteredMarker press', () => {
      clusteredMarker(component).props.onMarkerPress();

      expect(zoomIntoCluster).toHaveBeenCalledTimes(1);
      expect(zoomIntoCluster).toHaveBeenCalledWith(data);
    });

    it('should clear selected clinics on ClusteredMarker press', () => {
      clusteredMarker(component).props.onMarkerPress();

      expect(updateSelectedClinics).toHaveBeenCalledTimes(1);
      expect(updateSelectedClinics).toHaveBeenCalledWith([]);
    });
  });

  describe('When showClusteredMarker is false and selected clinics do not belong to cluster', () => {
    let data, component, clusterChildren;
    beforeEach(() => {
      data = {
        pointCount: 76,
        coordinate: {
          longitude: 133.7,
          latitude: -80.3,
        },
        clusterId: 10,
      };
      clusterChildren = [
        { properties: { item: { name: 'Surgeon Ben' } } },
        { properties: { item: { name: 'Dr Liu' } } },
      ];
      const selectedClinics = [{ name: 'Dr Lee' }, { name: 'Dr Ng' }];
      component = renderClusterMapMarker({
        data,
        onMarkerPress: jest.fn(),
        showClusteredMarker: false,
        clusterChildren,
        selectedClinics,
      });
    });

    it('should render NonSelectedStackedMapMarker', () => {
      expect(
        component.queryAllByType(NonSelectedStackedMapMarker),
      ).toHaveLength(1);
    });

    it('should pass data to NonSelectedStackedMapMarker', () => {
      expect(nonSelectedStackedMapMarker(component).props.data).toBe(data);
    });

    it('should pass function to update selected clinics as press handler to NonSelectedStackedMapMarker', () => {
      nonSelectedStackedMapMarker(component).props.onMarkerPress();

      expect(updateSelectedClinics).toHaveBeenCalledTimes(1);
    });

    it('should order clinics by name alphabetically to press handler of NonSelectedStackedMapMarker', () => {
      const clinicsOrderedByName = [
        { name: 'Dr Liu' },
        { name: 'Surgeon Ben' },
      ];

      nonSelectedStackedMapMarker(component).props.onMarkerPress();

      expect(updateSelectedClinics).toHaveBeenCalledWith(clinicsOrderedByName);
    });
  });

  describe('When showClusteredMarker is false and selected clinics belong to the current cluster', () => {
    let data, component, clusterChildren, selectedClinics;
    beforeEach(() => {
      data = {
        pointCount: 43,
        coordinate: {
          longitude: 11.3,
          latitude: -9.4,
        },
        clusterId: 16,
      };
      clusterChildren = [
        { properties: { item: { name: 'Dr Liu' } } },
        { properties: { item: { name: 'Surgeon Ben' } } },
      ];
      selectedClinics = clusterChildren.map(({ properties: { item } }) => item);
      component = renderClusterMapMarker({
        data,
        onMarkerPress: jest.fn(),
        showClusteredMarker: false,
        clusterChildren,
        selectedClinics,
      });
    });

    it('should render a SelectedStackedMapMarker', () => {
      expect(component.queryAllByType(SelectedStackedMapMarker)).toHaveLength(
        1,
      );
    });

    it('should pass data to SelectedStackedMapMarker', () => {
      expect(selectedStackedMapMarker(component).props.data).toBe(data);
    });
  });
});
