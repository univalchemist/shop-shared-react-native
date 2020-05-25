import React from 'react';
import { render } from '@testUtils';
import { act, flushMicrotasksQueue } from 'react-native-testing-library';
import ClusterMapMarker from '../ClusterMapMarker';
import NonSelectedStackedMapMarker from '../NonSelectedStackedMapMarker';

describe('ClusterMapMarker integration test', () => {
  describe('When showClusteredMarker is false and selected clinics do not belong to current cluster', () => {
    const clusterMapMapker = ({
      data,
      onMarkerPress = jest.fn(),
      showClusteredMarker = false,
      tracksViewChanges = false,
      clusterChildren = [],
    }) => (
      <ClusterMapMarker
        data={data}
        onMarkerPress={onMarkerPress}
        showClusteredMarker={showClusteredMarker}
        clusterChildren={clusterChildren}
        tracksViewChanges={tracksViewChanges}
      />
    );

    const nonSelectedStackedMapMarker = component =>
      component.queryByType(NonSelectedStackedMapMarker);
    const renderClusterMapMarker = ({
      selectedClinics = [],
      ...clusterMapMarkerProps
    }) =>
      render(clusterMapMapker(clusterMapMarkerProps), {
        initialState: { panel: { selectedClinics } },
      });
    const getSelectedClinicsFromState = reduxState =>
      reduxState.panel.selectedClinics;

    let component, store;
    beforeEach(() => {
      const selectedClinics = [];
      const data = {
        pointCount: 65,
        coordinate: {
          longitude: -0.17,
          latitude: 25.07,
        },
        clusterId: 4,
      };
      const clusterChildren = [
        { properties: { item: { id: 1, name: 'UMP General Hospital' } } },
        { properties: { item: { id: 2, name: 'Spring Medical Clinic' } } },
      ];

      const renderResult = renderClusterMapMarker({
        data,
        selectedClinics,
        clusterChildren,
        showClusteredMarker: false,
      });
      component = renderResult[0];
      store = renderResult[1];
    });

    it('should render NonSelectedStackedMapMarker', () => {
      expect(
        component.queryAllByType(NonSelectedStackedMapMarker),
      ).toHaveLength(1);
    });

    it(`should extract clinics from cluster children, 
        sort by name and must save that AS-IS to selectedClinics state 
        upon pressing NonSelectedStackedMapMarker. Otherwise,
        the check if current stacked map marker is selected will fail`, async () => {
      act(() => nonSelectedStackedMapMarker(component).props.onMarkerPress());
      await flushMicrotasksQueue();

      const selectedClinics = getSelectedClinicsFromState(store.getState());
      expect(selectedClinics).toEqual([
        { id: 2, name: 'Spring Medical Clinic' },
        { id: 1, name: 'UMP General Hospital' },
      ]);
    });
  });
});
