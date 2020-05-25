import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from '@wrappers/components';
import { Marker } from 'react-native-maps';
import styled from 'styled-components/native';
import { useTheme } from '@wrappers/core/hooks';

const ClusterText = styled(Text)`
  font-size: ${props => props.theme.fontSizes[1]};
  color: ${props => props.theme.colors.black};
  font-weight: ${props => props.theme.fontWeights.normal};
  text-align: center;
  min-width: 24px;
  min-height: 24px;
`;

export const ClusterContainer = styled(View)`
  display: flex;
  min-width: ${props => `${props.clusterStyle.width}px`};
  min-height: ${props => `${props.clusterStyle.height}px`};
  background-color: ${props => props.theme.colors.gray[10]};
  border-width: 1.5px;
  border-radius: ${props => `${props.clusterStyle.radius}px`};
  border-color: ${props => props.theme.colors.gray[0]};
  margin: 2px;
  align-items: center;
  justify-content: center;
`;
const INITIAL_CLUSTER_ICON_SIZE = 44;

const ClusteredMarker = ({
  data: { coordinate, pointCount, clusterId },
  onMarkerPress,
  tracksViewChanges,
}) => {
  const theme = useTheme();
  const [clusterStyle, updateClusterStyle] = useState({
    width: INITIAL_CLUSTER_ICON_SIZE,
    height: INITIAL_CLUSTER_ICON_SIZE,
    radius: INITIAL_CLUSTER_ICON_SIZE / 2,
  });

  const onLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    const maxTextSize = Math.max(width, height) + 6;
    if (maxTextSize !== clusterStyle.width) {
      const size = Math.max(maxTextSize, INITIAL_CLUSTER_ICON_SIZE);
      const radius = size / 2;
      updateClusterStyle({
        width: size,
        height: size,
        radius: radius,
      });
    }
  };

  return (
    <Marker
      coordinate={coordinate}
      onPress={onMarkerPress}
      key={`cluster-${clusterId}-${pointCount}-${coordinate.latitude}-${coordinate.longitude}`}
      tracksViewChanges={tracksViewChanges}
    >
      <ClusterContainer clusterStyle={clusterStyle} theme={theme}>
        <ClusterText
          theme={theme}
          clusterStyle={clusterStyle}
          onLayout={onLayout}
        >
          {pointCount}
        </ClusterText>
      </ClusterContainer>
    </Marker>
  );
};

ClusteredMarker.propTypes = {
  data: PropTypes.shape({
    coordinate: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    pointCount: PropTypes.number,
    clusterId: PropTypes.number,
  }),
  onMarkerPress: PropTypes.func,
  tracksViewChanges: PropTypes.bool.isRequired,
};

export default ClusteredMarker;
