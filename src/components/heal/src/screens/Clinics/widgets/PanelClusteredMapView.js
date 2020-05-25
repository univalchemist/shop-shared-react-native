import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClusteredMapView from 'react-native-maps-super-cluster';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import ClusterMapMarker from './mapMarkers/ClusterMapMarker';
import SingleMapMarker from './mapMarkers/SingleMapMarker';
import { getZoomLevel } from '../utils/getZoomLevel';
import { fetchLocation } from '@heal/src/store/actions';
const MAX_ZOOM_FOR_CLUSTERING = 22;
const MAX_ZOOM_FOR_CLUSTERED_MARKER = 18;
const MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES = 4;
const CLUSTER_MAX_CHILDREN = 100;
const EDGGE_PADDING_FOR_FIT_TO_COORDINATES = {
  top: 20,
  bottom: 20,
  right: 20,
  left: 20,
};
const delayToAvoidAppCrash = animation => setTimeout(animation);

export const PanelClusteredMapView = props => {
  const { defaultLocation, clinics, items, dimension, fetchLocation } = props;
  const [currentRegion, setCurrentRegion] = useState(defaultLocation);
  const [mapIsReady, setMapIsReady] = useState(false);
  const [location, setLocation] = useState(defaultLocation);
  const [showClusteredMarker, setShowClusteredMarker] = useState(true);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const clusteredMapRef = useRef(null);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    const currentZoomLevel = getZoomLevel(currentRegion, dimension);
    setTracksViewChanges(currentZoomLevel < MAX_ZOOM_FOR_TRACKS_VIEW_CHANGES);
    setShowClusteredMarker(currentZoomLevel < MAX_ZOOM_FOR_CLUSTERED_MARKER);
  }, [dimension, currentRegion]);

  useEffect(() => {
    if (clusteredMapRef.current && mapIsReady) {
      if (clinics.length > 0) {
        delayToAvoidAppCrash(() => {
          clusteredMapRef.current.getMapRef().fitToCoordinates(
            clinics.filter(
              clinic =>
                clinic.location &&
                (clinic.location.length > 0 ||
                  (clinic.location.longitude && clinic.location.latitude)),
            ),
            {
              edgePadding: EDGGE_PADDING_FOR_FIT_TO_COORDINATES,
              animated: true,
            },
          );
        });
      } else {
        delayToAvoidAppCrash(() => {
          clusteredMapRef.current.getMapRef().animateToRegion(location);
        });
      }
    }
  }, [mapIsReady, clusteredMapRef, clinics, location]);

  const clusterdMapViewProps = {
    width: dimension.width,
    height: dimension.height,
    ref: clusteredMapRef,
    initialRegion: defaultLocation,
    provider: PROVIDER_GOOGLE,
    maxZoom: MAX_ZOOM_FOR_CLUSTERING,
    loadingEnabled: true,
    showsUserLocation: true,
    showsMyLocationButton: true,
    edgePadding: EDGGE_PADDING_FOR_FIT_TO_COORDINATES,
    clusterPressMaxChildren: CLUSTER_MAX_CHILDREN,
    data: clinics,
    style: { flex: 1, width: '100%', height: '100%' },
    onMapReady: useMemo(
      () => () => {
        setMapIsReady(true);
      },
      [],
    ),
    onRegionChangeComplete: useMemo(
      () => region => setCurrentRegion(region),
      [],
    ),
    renderMarker: useMemo(
      () => data => (
        <SingleMapMarker key={`mapMarker-${data.id}`} data={data} />
      ),
      [],
    ),
    renderCluster: useMemo(
      () => (cluster, onPress) => {
        const clusterChildren = showClusteredMarker
          ? []
          : clusteredMapRef.current
              ?.getClusteringEngine()
              .getLeaves(cluster.clusterId, CLUSTER_MAX_CHILDREN);

        return (
          <ClusterMapMarker
            data={cluster}
            clusterChildren={clusterChildren}
            zoomIntoCluster={onPress}
            showClusteredMarker={showClusteredMarker}
            tracksViewChanges={tracksViewChanges}
          />
        );
      },
      [showClusteredMarker, tracksViewChanges, clusteredMapRef],
    ),
  };

  return <ClusteredMapView {...clusterdMapViewProps} />;
};

PanelClusteredMapView.propTypes = {
  defaultLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    latitudeDelta: PropTypes.number,
    longitudeDelta: PropTypes.number,
  }),
  clinics: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string,
      doctors: PropTypes.array,
      id: PropTypes.number,
      location: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        id: PropTypes.number,
      }).isRequired,
      name: PropTypes.string,
      qrCode: PropTypes.string,
    }),
  ),
  dimension: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = ({
  heal: {
    clinicData: { clinics },
    location,
  },
}) => {
  return {
    clinics,
    defaultLocation: location,
  };
};

export default connect(mapStateToProps, { fetchLocation })(
  PanelClusteredMapView,
);
