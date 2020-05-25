import React from 'react';
import { Marker } from 'react-native-maps';
import { ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { selectedStackedMarkerIcon } from '@images';
import { Text, Box, Flex } from '@wrappers/components';
import { useTheme } from '@wrappers/core/hooks';

const MarkerIcon = styled(ImageBackground)`
  width: 33;
  height: 40;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
`;

const SelectedStackedMapMarker = ({
  data: { coordinate, pointCount, clusterId },
}) => {
  const theme = useTheme();
  return (
    <Marker
      coordinate={coordinate}
      key={`nonselected-group-${clusterId}`}
      tracksViewChanges={true}
    >
      <MarkerIcon source={selectedStackedMarkerIcon} style={{}}>
        <Box flex={1} />
        <Flex flex={3} justifyContent="center">
          <Text fontSize={16} color={theme.colors.white}>
            {pointCount}
          </Text>
        </Flex>
        <Box flex={2} />
      </MarkerIcon>
    </Marker>
  );
};

SelectedStackedMapMarker.propTypes = {
  data: PropTypes.shape({
    coordinate: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    pointCount: PropTypes.number,
    clusterId: PropTypes.number,
  }),
};

export default SelectedStackedMapMarker;
