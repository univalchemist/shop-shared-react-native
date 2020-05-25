import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClusteredMarker from './ClusteredMarker';
import SelectedStackedMapMarker from './SelectedStackedMapMarker';
import NonSelectedStackedMapMarker from './NonSelectedStackedMapMarker';
import { updateSelectedClinics } from '@store/panel/actions';
import { categories, logAction } from '@store/analytics/trackingActions';

const ClusterMapMarker = ({
  data,
  zoomIntoCluster,
  showClusteredMarker,
  clusterChildren,
  selectedClinics,
  updateSelected,
  tracksViewChanges,
}) => {
  if (showClusteredMarker) {
    return (
      <ClusteredMarker
        data={data}
        onMarkerPress={() => {
          updateSelected([]);
          zoomIntoCluster(data);
        }}
        tracksViewChanges={tracksViewChanges}
      />
    );
  }
  const clinics = extractClinicsAndSortByName(clusterChildren);

  return !elementsAreTheSame(clinics, selectedClinics) ? (
    <NonSelectedStackedMapMarker
      data={data}
      onMarkerPress={() => {
        logAction({
          category: categories.PANEL_CLINICS,
          action: 'Select clinic on map',
        });
        updateSelected(clinics);
      }}
    />
  ) : (
    <SelectedStackedMapMarker data={data} />
  );
};

const extractClinicsAndSortByName = clusterChildren =>
  clusterChildren
    .map(({ properties: { item } }) => item)
    .sort((clinic1, clinic2) => clinic1.name.localeCompare(clinic2.name));

const elementsAreTheSame = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

ClusterMapMarker.propTypes = {
  data: PropTypes.shape({}),
  zoomIntoCluster: PropTypes.func,
  tracksViewChanges: PropTypes.bool,
  showClusteredMarker: PropTypes.bool,
  clusterChildren: PropTypes.arrayOf(PropTypes.shape({})),
  selectedClinics: PropTypes.arrayOf(PropTypes.shape({})),
  updateSelected: PropTypes.func,
};

const enhance = Component =>
  connect(({ panel: { selectedClinics } }) => ({ selectedClinics }), {
    updateSelected: updateSelectedClinics,
  })(Component);

export default enhance(ClusterMapMarker);
