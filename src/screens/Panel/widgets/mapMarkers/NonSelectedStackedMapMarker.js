import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import { Marker } from 'react-native-maps';
import styled from 'styled-components';
import { Text, Box, Flex } from '@wrappers/components';
import { useTheme } from '@wrappers/core/hooks';
import { nonSelectedStackedMarkerIcon } from '@images';

const MarkerIcon = styled(ImageBackground)`
  width: 33;
  height: 40;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
`;

const NonSelectedStackedMapMarker = ({
  data: { coordinate, pointCount, clusterId },
  onMarkerPress,
}) => {
  const theme = useTheme();
  return (
    <Marker
      coordinate={coordinate}
      key={`selected-group-${clusterId}`}
      onPress={onMarkerPress}
      tracksViewChanges={true}
    >
      <MarkerIcon source={nonSelectedStackedMarkerIcon} style={{}}>
        <Box flex={1} />
        <Flex flex={3} justifyContent="center">
          <Text fontSize={16} color={theme.colors.gray[0]}>
            {pointCount}
          </Text>
        </Flex>
        <Box flex={2} />
      </MarkerIcon>
    </Marker>
  );
};

NonSelectedStackedMapMarker.propTypes = {
  data: PropTypes.shape({
    coordinate: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    pointCount: PropTypes.number,
    clusterId: PropTypes.number,
  }),
  onMarkerPress: PropTypes.func.isRequired,
};

export default NonSelectedStackedMapMarker;
