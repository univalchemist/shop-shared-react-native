import React, { useState } from 'react';
import { Box } from '@cxa-rn/components';
import styled from 'styled-components/native';
import { PanelClusteredMapView } from '@heal/src/screens/Clinics/widgets';
import ClinicCard from '@heal/src/screens/Clinics/widgets/clinicCards/ClinicCard';
export const MapViewContainer = styled.View`
  height: 70%;
  width: 100%;
`;

export const MapView = ({ navigation, Index }) => {
  const [mapViewLayout, setMapViewLayout] = useState(undefined);
  return (
    <Box flex={1}>
      {Index === 0 && (
        <MapViewContainer
          onLayout={event => setMapViewLayout(event.nativeEvent.layout)}
        >
          {mapViewLayout && <PanelClusteredMapView dimension={mapViewLayout} />}
        </MapViewContainer>
      )}

      <Box height={'30%'}>
        <ClinicCard navigation={navigation} />
      </Box>
    </Box>
  );
};
