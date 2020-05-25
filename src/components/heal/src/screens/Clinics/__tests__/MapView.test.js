import React from 'react';
import { renderForTest } from '@testUtils';
import { MapView, MapViewContainer } from '@heal/src/screens/Clinics/MapView';
import { PanelClusteredMapView } from '@heal/src/screens/Clinics/widgets/PanelClusteredMapView';
import { act, flushMicrotasksQueue } from 'react-native-testing-library';
import { ClinicCard } from '@screens/Panel/widgets/clinicCards/ClinicCard';
import mockNavigation from '@testUtils/__mocks__/navigation';

const renderMapView = ({ navigation }) =>
  renderForTest(<MapView navigation={navigation} />);
describe.skip('MapView ', () => {
  describe('Clinic Card at the bottom', () => {
    const clinicCard = component => component.queryByType(ClinicCard);

    let component, navigation;
    beforeEach(() => {
      navigation = { ...mockNavigation };
      component = renderMapView({ navigation });
    });

    it('should render a ClinicCard', () => {
      expect(component.queryAllByType(ClinicCard).length).toBe(1);
    });

    it('should pass navigation to ClinicCard', () => {
      expect(clinicCard(component).props.navigation).toBe(navigation);
    });
  });

  describe('Panel clustered map view', () => {
    const panelClusteredMapView = component =>
      component.queryByType(PanelClusteredMapView);
    const mapViewContainer = component =>
      component.queryByType(MapViewContainer);

    const computeMapViewLayout = async (layout, component) => {
      act(() => {
        const layoutEvent = {
          nativeEvent: { layout },
        };

        mapViewContainer(component).props.onLayout(layoutEvent);
      });
      await flushMicrotasksQueue();
    };

    describe('before figuring out map view dimension', () => {
      let component;
      beforeEach(() => {
        component = renderMapView({});
      });
      it('should not render PanelClusteredMapView', () => {
        expect(component.queryAllByType(PanelClusteredMapView)).toHaveLength(0);
      });
    });
    describe('after computing map view dimension completes', () => {
      let component, mapViewLayout;
      beforeEach(async () => {
        component = renderMapView({});
        mapViewLayout = { width: 200, height: 300 };
        await computeMapViewLayout(mapViewLayout, component);
      });

      it('should render PanelClusteredMapView', async () => {
        expect(component.queryAllByType(PanelClusteredMapView)).toHaveLength(1);
      });

      it('should pass map view layout as dimension to PanelClusteredMapView', async () => {
        expect(panelClusteredMapView(component).props.dimension).toEqual(
          mapViewLayout,
        );
      });
    });
  });
});
