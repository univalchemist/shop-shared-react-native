import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-native-maps';
import { selectedMapMarkerIcon } from '@images';

const SelectedMapMarker = ({ data: { location, id } }) => {
  return (
    <Marker
      id={`marker-${id}`}
      coordinate={location}
      icon={selectedMapMarkerIcon}
    />
  );
};

SelectedMapMarker.propTypes = {
  data: PropTypes.shape({
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
    id: PropTypes.number,
  }),
};

export default SelectedMapMarker;
