import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-native-maps';
import { nonSelectedMapMarkerIcon } from '@images';

const NonSelectedMapMarker = ({ data: { id, location }, onPress }) => {
  return (
    <Marker
      key={`marker-${id}`}
      coordinate={location}
      onPress={onPress}
      icon={nonSelectedMapMarkerIcon}
    />
  );
};

NonSelectedMapMarker.propTypes = {
  data: PropTypes.shape({
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
    id: PropTypes.number,
  }),
  onPress: PropTypes.func,
};

export default NonSelectedMapMarker;
