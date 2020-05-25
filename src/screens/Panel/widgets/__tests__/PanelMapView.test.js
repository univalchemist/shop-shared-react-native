import React from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { renderForTest } from '@testUtils';
import MapView, { Marker } from 'react-native-maps';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import ConnectedPanelMapView, {
  SelectedMapMarker,
  PanelMapView,
} from '../PanelMapView';
import * as actions from '@store/panel/actions';

jest.useFakeTimers();

describe('Panel Map View', () => {
  const defaultLocation = {
    latitude: 22.266021,
    longitude: 114.186422,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  const clinics = [
    {
      id: 1,
      latitude: 4.335,
      longitude: 2.441,
      displayLatitude: 4.3355,
      displayLongitude: 2.4411,
      name: 'Dr John Tan',
    },
    {
      id: 2,
      latitude: 1.555,
      longitude: 0.321,
      displayLatitude: 1.5555,
      displayLongitude: 0.3211,
      name: 'Surgeon Joseline',
    },
    {
      id: 3,
      latitude: 6,
      longitude: 7,
      displayLatitude: 6.6,
      displayLongitude: 7.7,
      name: 'Dr Ian Lin',
    },
  ];

  let originalPlatformOS;
  let originalNavigator;
  let newLocation;

  beforeAll(() => {
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

  it('match snapshot', () => {
    const panelMapView = renderForTest(<ConnectedPanelMapView />, {
      initialState: {
        panel: {
          filteredClinics: [clinics[0]],
          defaultLocation,
          selectedClinic: clinics[0],
        },
      },
    });

    const mapView = panelMapView.queryAllByType(MapView)[0];
    mapView.props.onMapReady();

    expect(panelMapView.toJSON()).toMatchSnapshot();
  });

  it('renders the MapView with correct props value', () => {
    const panelMapView = renderForTest(<ConnectedPanelMapView />, {
      initialState: {
        panel: {
          filteredClinics: [clinics[0]],
          defaultLocation,
          selectedClinic: clinics[0],
        },
      },
    });

    expect(panelMapView.queryAllByType(MapView).length).toBe(1);
    const mapView = panelMapView.queryAllByType(MapView)[0];
    mapView.props.onMapReady();
    expect(mapView.props.initialRegion).toBe(defaultLocation);
  });

  it('renders the map markers for all clinics using their display coordinates', () => {
    const panelMapView = renderForTest(<ConnectedPanelMapView />, {
      initialState: {
        panel: {
          filteredClinics: clinics,
          defaultLocation,
          selectedClinic: clinics[0],
        },
      },
    });

    const mapView = panelMapView.queryAllByType(MapView)[0];
    mapView.props.onMapReady();

    const markers = panelMapView.queryAllByType(Marker);
    expect(markers.length).toBe(clinics.length);
    expect(markers[0].props.coordinate).toEqual({
      latitude: clinics[0].displayLatitude,
      longitude: clinics[0].displayLongitude,
    });
    expect(markers[1].props.coordinate).toEqual({
      latitude: clinics[1].displayLatitude,
      longitude: clinics[1].displayLongitude,
    });
    expect(markers[2].props.coordinate).toEqual({
      latitude: clinics[2].displayLatitude,
      longitude: clinics[2].displayLongitude,
    });
  });

  it('should show red marker for selected clinic', async () => {
    const initialState = {
      panel: {
        filteredClinics: clinics,
        defaultLocation,
        selectedClinic: clinics[1],
      },
    };
    const panelMapView = renderForTest(<ConnectedPanelMapView />, {
      initialState,
    });

    const mapView = panelMapView.queryAllByType(MapView)[0];
    mapView.props.onMapReady();

    expect(panelMapView.queryAllByType(SelectedMapMarker).length).toBe(1);
    expect(panelMapView.queryAllByType(SelectedMapMarker)[0].props.item).toBe(
      clinics[1],
    );
  });

  it('should update selectedClinic when user select a pin', async () => {
    jest.spyOn(actions, 'updateSelectedClinic');
    const updateSelectedClinic = jest.fn();
    const initialState = {
      panel: {
        defaultLocation,
        selectedClinic: clinics[0],
      },
    };
    const panelMapView = renderForTest(
      <PanelMapView
        clinics={clinics}
        defaultLocation={defaultLocation}
        selectedClinic={clinics[0]}
        updateSelectedClinic={updateSelectedClinic}
      />,
      {
        initialState,
      },
    );

    const mapView = panelMapView.queryAllByType(MapView)[0];
    mapView.props.onMapReady();

    const markers = panelMapView.queryAllByType(Marker);
    expect(markers.length).toBe(clinics.length);
    const selectedIndex = 2;
    fireEvent.press(markers[selectedIndex]);

    await flushMicrotasksQueue();
    expect(updateSelectedClinic).toHaveBeenCalledWith(clinics[selectedIndex]);
  });

  it('should get current user location when location permission is granted', () => {
    Platform.OS = 'android';

    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    const initialState = {
      panel: { clinics, defaultLocation, selectedClinic: clinics[0] },
    };

    const updateSelectedClinic = jest.fn();
    renderForTest(
      <PanelMapView
        clinics={clinics}
        defaultLocation={defaultLocation}
        selectedClinic={clinics[0]}
        updateSelectedClinic={updateSelectedClinic}
      />,
      {
        initialState,
      },
    );

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('should animate to user location when permission is granted and no clinics available ', async () => {
    Platform.OS = 'android';

    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    const initialState = {
      panel: {
        filteredClinics: [],
        defaultLocation,
        selectedClinic: clinics[0],
      },
    };

    const updateSelectedClinic = jest.fn();
    const panelMapView = renderForTest(
      <PanelMapView
        clinics={[]}
        defaultLocation={defaultLocation}
        selectedClinic={clinics[0]}
        updateSelectedClinic={updateSelectedClinic}
      />,
      {
        initialState,
      },
    );

    const mapView = panelMapView.queryAllByType(MapView)[0];
    mapView.props.onMapReady();

    await flushMicrotasksQueue();

    jest.runOnlyPendingTimers();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(MapView.prototype.animateToRegion).toHaveBeenCalledWith(
      expect.objectContaining(newLocation.coords),
    );
  });

  it('should animate to show all markers when permission is granted and clinics are available ', async () => {
    Platform.OS = 'android';

    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    const initialState = {
      panel: {
        filteredClinics: clinics,
        defaultLocation,
        selectedClinic: clinics[0],
      },
    };

    const updateSelectedClinic = jest.fn();
    const panelMapView = renderForTest(
      <PanelMapView
        clinics={clinics}
        defaultLocation={defaultLocation}
        selectedClinic={clinics[0]}
        updateSelectedClinic={updateSelectedClinic}
      />,
      {
        initialState,
      },
    );

    const mapView = panelMapView.queryAllByType(MapView)[0];
    mapView.props.onMapReady();

    await flushMicrotasksQueue();
    expect(MapView.prototype.fitToCoordinates).toHaveBeenCalledWith(
      [
        { latitude: 4.335, longitude: 2.441 },
        { latitude: 1.555, longitude: 0.321 },
        { latitude: 6, longitude: 7 },
      ],
      {
        animated: true,
        edgePadding: { bottom: 20, left: 20, right: 20, top: 20 },
      },
    );
  });

  it('should animate to show one marker using animateToRegion when permission is granted and only one clinic is available ', async () => {
    Platform.OS = 'android';

    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    const initialState = {
      panel: {
        filteredClinics: clinics,
        defaultLocation,
        selectedClinic: clinics[0],
      },
    };

    const updateSelectedClinic = jest.fn();
    const panelMapView = renderForTest(
      <PanelMapView
        clinics={[clinics[0]]}
        defaultLocation={defaultLocation}
        selectedClinic={clinics[0]}
        updateSelectedClinic={updateSelectedClinic}
      />,
      {
        initialState,
      },
    );

    const mapView = panelMapView.queryAllByType(MapView)[0];
    mapView.props.onMapReady();

    await flushMicrotasksQueue();

    jest.runOnlyPendingTimers();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(MapView.prototype.animateToRegion).toHaveBeenCalledWith({
      ...clinics[0],
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  });
});
