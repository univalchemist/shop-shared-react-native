import React, { useRef } from 'react';
import { renderForTest } from '@testUtils';
import { act, flushMicrotasksQueue } from 'react-native-testing-library';
import PanelClusteredMapView from '../PanelClusteredMapView';
import ClusterMapMarker from '../mapMarkers/ClusterMapMarker';
import SingleMapMarker from '../mapMarkers/SingleMapMarker';
import ClusteredMapView from 'react-native-maps-super-cluster';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Utils from '../../utils/getZoomLevel';
import { Platform } from 'react-native';
import {
  checkLocationPermission as GrantLocationPermission,
  getCurrentPosition,
} from '@heal/src/utils/location';
import PropTypes from 'prop-types';
import { check, PERMISSIONS } from 'react-native-permissions';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(jest.requireActual('react').useRef),
}));
jest.useFakeTimers();

describe('PanelClusteredMapView', () => {
  const MAX_ZOOM_FOR_CLUSTERING = 22;
  const MAX_ZOOM_FOR_CLUSTERED_MARKER = 18;
  const MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES = 4;
  const CLUSTER_MAX_CHILDREN = 100;
  const EDGGE_PADDING_FOR_FIT_TO_COORDINATES = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };

  const defaultRegion = {
    latitude: 22.001232,
    longitude: 114.186422,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };
  const someDimension = {
    width: 500,
    height: 700,
  };

  const renderPanelClusteredMapView = ({
    location = defaultRegion,
    clinics = [
      {
        district: 'some district',
        doctors: [],
        id: 212,
        location: [
          {
            latitude: 22.001232,
            longitude: 114.186422,
            id: 434,
          },
        ],
        name: 'name',
        qrCode: 'somecode',
      },
      {
        district: 'some district',
        doctors: [],
        id: 215,
        location: [
          {
            latitude: 22.001232,
            longitude: 114.186422,
            id: 434,
          },
        ],
        name: 'name',
        qrCode: 'somecode',
      },
    ],
    dimension = someDimension,
  }) =>
    renderForTest(<PanelClusteredMapView dimension={dimension} />, {
      initialState: {
        heal: { clinicData: { clinics }, location },
      },
    });

  const clusteredMapViewComponent = component =>
    component.queryByType(ClusteredMapView);

  const changeRegion = async (component, newRegion) => {
    act(() => {
      clusteredMapViewComponent(component).props.onRegionChangeComplete(
        newRegion,
      );
    });
    await flushMicrotasksQueue();
  };

  const mapIsReady = async component => {
    act(() => {
      clusteredMapViewComponent(component).props.onMapReady();
    });
    await flushMicrotasksQueue();
  };

  const currentUserLocationIs = async location => {
    act(() => {
      const getUserLocationSuccessHandler =
        global.navigator.geolocation.getCurrentPosition.mock.calls[0][0];
      getUserLocationSuccessHandler({
        coords: location,
      });
    });
    await flushMicrotasksQueue();
  };

  const setZoomLevelTo = async (zoomLevel, component) => {
    jest.spyOn(Utils, 'getZoomLevel').mockReturnValue(zoomLevel);
    const newRegion = { ...defaultRegion, latitude: Math.random() };
    await changeRegion(component, newRegion);
  };

  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomZoomLevelAtLeastMaxZoomForClusteredMarker = () =>
    randomNumber(MAX_ZOOM_FOR_CLUSTERED_MARKER, MAX_ZOOM_FOR_CLUSTERING);

  const randomZoomLevelLessThanMaxZoomForClusteredMarker = () =>
    randomNumber(0, MAX_ZOOM_FOR_CLUSTERED_MARKER - 1);

  const randomZoomLevelLessThanMaxZoomForTracksViewChanges = () =>
    randomNumber(0, MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES - 1);

  const randomZoomLevelAtLeastMaxZoomForTracksViewChanges = () =>
    randomNumber(MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES, MAX_ZOOM_FOR_CLUSTERING);

  const randomZoomLevelAtMostMaxZoomForClustering = () =>
    randomNumber(0, MAX_ZOOM_FOR_CLUSTERING);

  let originalPlatformOS;
  let originalNavigator;
  let newLocation;

  beforeAll(() => {
    jest.spyOn(Utils, 'getZoomLevel');
    originalPlatformOS = Platform.OS;
    originalNavigator = global.navigator;
    newLocation = {
      coords: {
        longitude: 1.003,
        latitude: 1.4343,
      },
    };
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(cb => cb(newLocation)),
      },
    };
  });

  afterAll(() => {
    Platform.OS = originalPlatformOS;
    global.navigator = originalNavigator;
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Local state', () => {
    let myRegion, dimension;
    beforeEach(() => {
      myRegion = {
        latitude: 22.001232,
        longitude: 114.186422,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };
      dimension = {
        width: 489,
        height: 670,
      };

      jest.spyOn(Utils, 'getZoomLevel').mockClear();
      useRef.mockClear();

      renderPanelClusteredMapView({
        defaultLocation: myRegion,
        dimension,
      });
    });

    it('should set initial zoom level based on default location and dimension props', () => {
      expect(Utils.getZoomLevel).toHaveBeenCalledTimes(1);
      expect(Utils.getZoomLevel).toHaveBeenCalledWith(myRegion, dimension);
    });

    it('should keep a ref to ClusteredMapView', () => {
      expect(useRef.mock.results).toEqual(
        expect.arrayContaining([
          { type: 'return', value: { current: expect.any(ClusteredMapView) } },
        ]),
      );
    });
  });

  describe('ClusteredMapView', () => {
    const getClusteredMapView = (initialState = {}) => {
      const component = renderPanelClusteredMapView(initialState);
      return clusteredMapViewComponent(component);
    };

    it('should be rendered', () => {
      const component = renderPanelClusteredMapView({});
      const clusteredMapView = component.queryAllByType(ClusteredMapView);

      expect(clusteredMapView).toHaveLength(1);
    });

    it.each`
      propName                     | propValue
      ${'maxZoom'}                 | ${MAX_ZOOM_FOR_CLUSTERING}
      ${'showsUserLocation'}       | ${true}
      ${'loadingEnabled'}          | ${true}
      ${'showsMyLocationButton'}   | ${true}
      ${'edgePadding'}             | ${EDGGE_PADDING_FOR_FIT_TO_COORDINATES}
      ${'clusterPressMaxChildren'} | ${CLUSTER_MAX_CHILDREN}
    `('should have $propName = $propValue', ({ propName, propValue }) => {
      const clusteredMapView = getClusteredMapView();

      expect(clusteredMapView.props[propName]).toEqual(propValue);
    });

    it('should have provide = Google', () => {
      const clusteredMapView = getClusteredMapView();

      expect(clusteredMapView.props.provider).toEqual(PROVIDER_GOOGLE);
    });

    it('should have initialRegion = defaultLocation', () => {
      const initialRegion = {
        latitude: 22.001232,
        longitude: 114.186422,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };

      const clusteredMapView = getClusteredMapView({
        defaultLocation: initialRegion,
      });

      expect(clusteredMapView.props.initialRegion).toEqual(initialRegion);
    });

    it('should have data = filteredClinics', () => {
      const filteredClinics = [
        {
          district: 'some district',
          doctors: [],
          id: 212,
          location: [
            {
              latitude: 22.001232,
              longitude: 114.186422,
              id: 434,
            },
          ],
          name: 'name',
          qrCode: 'somecode',
        },
        {
          district: 'some district',
          doctors: [],
          id: 215,
          location: [
            {
              latitude: 22.001232,
              longitude: 114.186422,
              id: 434,
            },
          ],
          name: 'name',
          qrCode: 'somecode',
        },
      ];

      const clusteredMapView = getClusteredMapView({
        filteredClinics,
      });

      expect(clusteredMapView.props.data).toEqual(filteredClinics);
    });

    it('should have width and height = dimension`s width and height', () => {
      const dimension = { width: 356, height: 520 };

      const clusteredMapView = getClusteredMapView({
        dimension,
      });

      expect(clusteredMapView.props.width).toEqual(dimension.width);
      expect(clusteredMapView.props.height).toEqual(dimension.height);
    });
  });

  describe('Map animation', () => {
    const getMapRef = () => {
      const clusteredMapRef = useRef.mock.results.find(
        result =>
          result.type === 'return' &&
          result.value.current instanceof ClusteredMapView,
      ).value.current;
      return clusteredMapRef.getMapRef();
    };

    let clinics;
    beforeEach(() => {
      clinics = [
        {
          district: 'some district',
          doctors: [],
          id: 212,
          location: [
            {
              latitude: 22.001232,
              longitude: 114.186422,
              id: 434,
            },
          ],
          name: 'name',
          qrCode: 'somecode',
        },
        {
          district: 'some district',
          doctors: [],
          id: 215,
          location: [
            {
              latitude: 22.001232,
              longitude: 114.186422,
              id: 434,
            },
          ],
          name: 'name',
          qrCode: 'somecode',
        },
      ];
    });

    it('should fit all markers in the screen when map is ready and filtered clinics is not empty', async () => {
      const component = renderPanelClusteredMapView({
        filteredClinics: clinics,
      });
      const mapViewRef = getMapRef();
      jest.spyOn(mapViewRef, 'fitToCoordinates');

      await mapIsReady(component);
      jest.runOnlyPendingTimers();

      expect(mapViewRef.fitToCoordinates).toHaveBeenCalledTimes(1);
      expect(mapViewRef.fitToCoordinates).toHaveBeenCalledWith(clinics, {
        animated: true,
        edgePadding: EDGGE_PADDING_FOR_FIT_TO_COORDINATES,
      });
      expect(mapViewRef.animateToRegion).not.toHaveBeenCalled();
    });

    it('should animate to user location when map is ready and filtered clinics is empty', async () => {
      const component = renderPanelClusteredMapView({
        clinics: [],
      });
      const mapViewRef = getMapRef();
      jest.spyOn(mapViewRef, 'animateToRegion');

      const location = {
        latitude: 22.001232,
        latitudeDelta: 0.2,
        longitude: 114.186422,
        longitudeDelta: 0.2,
      };
      await currentUserLocationIs(location);
      await mapIsReady(component);
      jest.runOnlyPendingTimers();
      expect(mapViewRef.animateToRegion).toHaveBeenCalledTimes(1);
      expect(mapViewRef.animateToRegion).toHaveBeenCalledWith(
        expect.objectContaining(location),
      );
      expect(mapViewRef.fitToCoordinates).not.toHaveBeenCalled();
    });
  });

  describe('Render marker', () => {
    let renderedClinic, renderedMarker;

    beforeEach(() => {
      const component = renderPanelClusteredMapView({});
      const clusteredMapView = clusteredMapViewComponent(component);
      renderedClinic = {
        location: {
          latitude: 46.241,
          longitude: 132.56,
        },
      };

      renderedMarker = clusteredMapView.props.renderMarker(renderedClinic);
    });

    it('should render SingleMapMarker', () => {
      expect(renderedMarker.type).toBe(SingleMapMarker);
    });

    it('should pass clinic data to SingleMapMarker', () => {
      expect(renderedMarker.props.data).toBe(renderedClinic);
    });
  });

  describe('Render cluster', () => {
    const getClusteringEngine = () => {
      const clusteredMapRef = useRef.mock.results.find(
        result =>
          result.type === 'return' &&
          result.value.current instanceof ClusteredMapView,
      ).value.current;
      return clusteredMapRef.getClusteringEngine();
    };

    const renderClusterAtZoomLevel = async (
      cluster,
      zoomLevel,
      onPress,
      clusterChildren = [],
    ) => {
      const component = renderPanelClusteredMapView({});
      await setZoomLevelTo(zoomLevel, component);
      const clusteringEngine = getClusteringEngine();
      jest
        .spyOn(clusteringEngine, 'getLeaves')
        .mockReturnValue(clusterChildren);

      return {
        renderedCluster: clusteredMapViewComponent(
          component,
        ).props.renderCluster(cluster, onPress),
        clusteringEngine,
      };
    };

    let cluster, onPress, clusterChildren;
    beforeAll(() => {
      cluster = {
        pointCount: 4,
        coordinate: {
          longitude: 74.22,
          latitude: 39.12,
        },
        clusterId: 1,
      };
      onPress = jest.fn();
      clusterChildren = [
        { properties: { item: { name: 'Clinic A' } } },
        { properties: { item: { name: 'Clinic B' } } },
      ];
    });

    describe(`When current zoom level is between 0 and MAX_ZOOM_FOR_CLUSTERING(${MAX_ZOOM_FOR_CLUSTERING})`, () => {
      const zoomLevel = randomZoomLevelAtMostMaxZoomForClustering();

      let renderedCluster;
      beforeEach(async () => {
        const result = await renderClusterAtZoomLevel(
          cluster,
          zoomLevel,
          onPress,
          clusterChildren,
        );
        renderedCluster = result.renderedCluster;
      });

      it(`current zoom level (${zoomLevel}) must be less than MAX_ZOOM_FOR_CLUSTERING(${MAX_ZOOM_FOR_CLUSTERING})`, () => {
        expect(zoomLevel).toBeLessThanOrEqual(MAX_ZOOM_FOR_CLUSTERING);
      });

      it('should render a ClusterMapMarker', () => {
        expect(renderedCluster.type).toBe(ClusterMapMarker);
      });

      it('should pass the cluster as data to ClusterMapMarker', () => {
        expect(renderedCluster.props.data).toEqual(cluster);
      });

      it('should pass the onPress as zoomIntoCluster function to ClusterMapMarker', () => {
        act(() => {
          renderedCluster.props.zoomIntoCluster();
        });
        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });

    describe(`when current zoom level is less than MAX_ZOOM_FOR_CLUSTERED_MARKER(${MAX_ZOOM_FOR_CLUSTERED_MARKER})`, () => {
      const zoomLevel = randomZoomLevelLessThanMaxZoomForClusteredMarker();

      let renderedCluster, clusteringEngine;
      beforeEach(async () => {
        const result = await renderClusterAtZoomLevel(
          cluster,
          zoomLevel,
          onPress,
          clusterChildren,
        );
        renderedCluster = result.renderedCluster;
        clusteringEngine = result.clusteringEngine;
      });

      it(`current zoom level (${zoomLevel}) must be less than MAX_ZOOM_FOR_CLUSTERED_MARKER(${MAX_ZOOM_FOR_CLUSTERED_MARKER})`, () => {
        expect(zoomLevel).toBeLessThan(MAX_ZOOM_FOR_CLUSTERED_MARKER);
      });

      it('should pass true as showClusteredMarker to ClusterMapMarker', () => {
        expect(renderedCluster.props.showClusteredMarker).toEqual(true);
      });

      it('should not get cluster children from cluster engine', () => {
        expect(clusteringEngine.getLeaves).not.toHaveBeenCalled();
      });

      it('should pass an empty array as cluster children to ClusterMapMarker', () => {
        expect(renderedCluster.props.clusterChildren).toEqual([]);
      });
    });

    describe(`When current zoom level is at least MAX_ZOOM_FOR_CLUSTERED_MARKER(${MAX_ZOOM_FOR_CLUSTERED_MARKER})`, () => {
      const zoomLevel = randomZoomLevelAtLeastMaxZoomForClusteredMarker();

      let renderedCluster, clusteringEngine;
      beforeEach(async () => {
        const result = await renderClusterAtZoomLevel(
          cluster,
          zoomLevel,
          onPress,
          clusterChildren,
        );
        renderedCluster = result.renderedCluster;
        clusteringEngine = result.clusteringEngine;
      });

      it(`current zoom level (${zoomLevel}) must be at least MAX_ZOOM_FOR_CLUSTERED_MARKER(${MAX_ZOOM_FOR_CLUSTERED_MARKER})`, () => {
        expect(zoomLevel).toBeGreaterThanOrEqual(MAX_ZOOM_FOR_CLUSTERED_MARKER);
      });

      it('should pass false as showClusteredMarker to ClusterMapMarker', () => {
        expect(renderedCluster.props.showClusteredMarker).toEqual(false);
      });

      it('should get cluster children from cluster engine', () => {
        expect(clusteringEngine.getLeaves).toHaveBeenCalledWith(
          cluster.clusterId,
          CLUSTER_MAX_CHILDREN,
        );
      });

      it('should pass the cluster children to ClusterMapMarker', () => {
        expect(renderedCluster.props.clusterChildren).toBe(clusterChildren);
      });
    });

    describe(`When current zoom level is less than MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES(${MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES})`, () => {
      const zoomLevel = randomZoomLevelLessThanMaxZoomForTracksViewChanges();

      let renderedCluster;
      beforeEach(async () => {
        const result = await renderClusterAtZoomLevel(
          cluster,
          zoomLevel,
          onPress,
          clusterChildren,
        );
        renderedCluster = result.renderedCluster;
      });

      it(`current zoom level (${zoomLevel}) must be less than MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES(${MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES})`, () => {
        expect(zoomLevel).toBeLessThan(MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES);
      });

      it('should pass true as tracksViewChanges to ClusterMapMarker', () => {
        expect(renderedCluster.props.tracksViewChanges).toEqual(true);
      });
    });

    describe(`When current zoom level is at least MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES(${MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES})`, () => {
      const zoomLevel = randomZoomLevelAtLeastMaxZoomForTracksViewChanges();

      let renderedCluster;
      beforeEach(async () => {
        const result = await renderClusterAtZoomLevel(
          cluster,
          zoomLevel,
          onPress,
          clusterChildren,
        );
        renderedCluster = result.renderedCluster;
      });

      it(`current zoom level (${zoomLevel}) must be at least MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES(${MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES})`, () => {
        expect(zoomLevel).toBeGreaterThanOrEqual(
          MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES,
        );
      });

      it('should pass false as tracksViewChanges to ClusterMapMarker', () => {
        expect(renderedCluster.props.tracksViewChanges).toEqual(false);
      });
    });
  });

  describe('On region change', () => {
    let component, newRegion, dimension;
    beforeEach(async () => {
      Utils.getZoomLevel.mockClear();
      newRegion = {
        latitude: 31.34,
        longitude: 11.186422,
        latitudeDelta: 10.2,
        longitudeDelta: 9.88,
      };
      dimension = {
        width: 450,
        height: 600,
      };
      component = renderPanelClusteredMapView({ dimension });
      await changeRegion(component, newRegion);
    });

    it('should update zoom level with new region', async () => {
      expect(Utils.getZoomLevel).toHaveBeenLastCalledWith(
        newRegion,
        expect.anything(),
      );
    });

    it('should always update zoom level using its dimension prop value', async () => {
      expect(Utils.getZoomLevel.mock.calls.map(args => args[1])).toEqual(
        Array(Utils.getZoomLevel.mock.calls.length).fill(dimension),
      );
    });
  });

  describe('When re-rendered', () => {
    const forceRerender = async component => {
      await changeRegion(component, {
        latitude: 20 * Math.random() + 1,
        longitude: 50 * Math.random() + 1,
        latitudeDelta: Math.random(),
        longitudeDelta: Math.random(),
      });
    };

    it.each([
      'renderMarker',
      'renderCluster',
      'onRegionChangeComplete',
      'onMapReady',
    ])(
      'should not pass a new function to %s of ClusteredMapView',
      async functionName => {
        let component = renderPanelClusteredMapView({});
        const beforeRerender = clusteredMapViewComponent(component).props[
          functionName
        ];

        await forceRerender(component);

        const afterRerender = clusteredMapViewComponent(component).props[
          functionName
        ];
        expect(afterRerender).toBe(beforeRerender);
      },
    );

    it(`should pass a new function to renderCluster of ClusteredMapView
        when zoom level change from below ${MAX_ZOOM_FOR_CLUSTERED_MARKER} to above it`, async () => {
      jest
        .spyOn(Utils, 'getZoomLevel')
        .mockReturnValue(randomZoomLevelLessThanMaxZoomForClusteredMarker());
      let component = renderPanelClusteredMapView({});
      const beforeRerender = clusteredMapViewComponent(component).props
        .renderCluster;

      jest
        .spyOn(Utils, 'getZoomLevel')
        .mockReturnValue(randomZoomLevelAtLeastMaxZoomForClusteredMarker());
      await forceRerender(component);

      const afterRerender = clusteredMapViewComponent(component).props
        .renderCluster;
      expect(afterRerender).not.toBe(beforeRerender);
    });
  });

  describe('User Location', () => {
    it('should get current user location when location permission is granted', async () => {
      Platform.OS = 'android';
      global.navigator = {
        geolocation: {
          getCurrentPosition: jest.fn(cb => cb(newLocation)),
        },
      };
      await GrantLocationPermission();
      expect(check).toHaveBeenCalledWith(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      getCurrentPosition();
      await flushMicrotasksQueue();
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });
  });
});
