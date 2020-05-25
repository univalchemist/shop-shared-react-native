import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { localizeServerError } from '@utils';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { nonSelectedMapMarkerIcon, selectedMapMarkerIcon } from '@images';
import { Image } from '@wrappers/components';
import { updateSelectedClinic } from '@store/panel/actions';
import { requestPermission } from '../utils/GrantLocationPermission';
import { categories, logAction } from '@store/analytics/trackingActions';

const MapMarker = ({ item, markerImage, onPress }) => {
  return (
    <Marker
      coordinate={{
        latitude: item.displayLatitude,
        longitude: item.displayLongitude,
      }}
      onPress={() => {
        logAction({
          category: categories.PANEL_CLINICS,
          action: 'Select clinic on map',
        });
        onPress(item);
      }}
    >
      <Image source={markerImage} style={{ height: 24, width: 24 }} />
    </Marker>
  );
};

export const SelectedMapMarker = props => (
  <MapMarker markerImage={selectedMapMarkerIcon} {...props} />
);

export const NonSelectedMapMarker = props => (
  <MapMarker markerImage={nonSelectedMapMarkerIcon} {...props} />
);

export const PanelMapView = ({
  buttonPressCount,
  defaultLocation,
  clinics,
  intl,
  updateSelectedClinic,
  selectedClinic,
}) => {
  const [location, setLocation] = useState(defaultLocation);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  const mapRef = useRef(null);

  const grantPermission = async () => {
    const isLocationAllowed = await requestPermission();
    if (isLocationAllowed === true) {
      setIsPermissionGranted(true);
    } else if (typeof isLocationAllowed === Object) {
      const { subject, message } = localizeServerError(
        isLocationAllowed,
        {
          subjectId: 'somethingWentWrong',
          prefix: 'serverErrors.getUserHealthResults',
        },
        intl,
      );

      Alert.alert(subject, message);
    }
  };

  useEffect(() => {
    grantPermission();
  });

  const renderMapMarkers = () => {
    return clinics.map((item, index) => {
      return item.id === selectedClinic.id ? (
        <SelectedMapMarker
          key={`panel_marker_${index}`}
          item={item}
          onPress={updateSelectedClinic}
        />
      ) : (
        <NonSelectedMapMarker
          key={`panel_marker_${index}`}
          item={item}
          onPress={updateSelectedClinic}
        />
      );
    });
  };

  const fitAllMarkersInMap = allClinics => {
    if (allClinics.length === 1) {
      setTimeout(
        () =>
          mapRef.current.animateToRegion({
            ...allClinics[0],
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }),
        1000,
      );
    } else {
      setTimeout(
        () =>
          mapRef.current.fitToCoordinates(
            allClinics.map(item => {
              return {
                longitude: item.longitude,
                latitude: item.latitude,
              };
            }),
            {
              edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
              animated: true,
            },
          ),
        1000,
      );
    }
  };

  useEffect(() => {
    if (mapRef.current && isMapReady && clinics.length > 0) {
      fitAllMarkersInMap(clinics);
    } else if (mapRef.current && isMapReady && clinics.length === 0) {
      setTimeout(() => mapRef.current.animateToRegion(location), 1000);
    }
  }, [location, clinics, isMapReady, buttonPressCount]);

  useEffect(() => {
    if (isPermissionGranted) {
      navigator.geolocation.getCurrentPosition(
        deviceLocation => {
          setLocation({
            latitude: deviceLocation.coords.latitude,
            longitude: deviceLocation.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        },
        () => {},
      );
    }
  }, [isPermissionGranted]);

  return (
    <View style={{ position: 'relative', height: '100%' }}>
      <MapView
        ref={mapRef}
        onMapReady={() => setIsMapReady(true)}
        onLayout={this.onMapReady}
        provider={PROVIDER_GOOGLE}
        style={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          position: 'absolute',
          margin:
            Platform.OS === 'ios' || (isMapReady && isPermissionGranted)
              ? 0
              : 1, //Rerender map for android to show my location button
        }}
        initialRegion={defaultLocation}
        loadingEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {isMapReady && renderMapMarkers()}
      </MapView>
    </View>
  );
};

PanelMapView.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  defaultLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    latitudeDelta: PropTypes.number,
    longitudeDelta: PropTypes.number,
  }),
  clinics: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      displayLatitude: PropTypes.number,
      displayLongitude: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  selectedClinic: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    name: PropTypes.string,
  }),
};

const mapStateToProps = ({
  panel: { defaultLocation, filteredClinics, selectedClinic },
}) => ({
  defaultLocation,
  clinics: filteredClinics,
  selectedClinic,
});
const mapDispatchToProps = { updateSelectedClinic };

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
);

export default enhance(PanelMapView);
