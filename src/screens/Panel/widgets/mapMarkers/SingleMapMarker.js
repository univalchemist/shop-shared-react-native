import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NonSelectedMapMarker from './NonSelectedMapMarker';
import SelectedMapMarker from './SelectedMapMarker';
import { updateSelectedClinics } from '@store/panel/actions';
import { categories, logAction } from '@store/analytics/trackingActions';

const SingleMapMarker = ({ data, isSelected, updateSelected }) => {
  if (isSelected) {
    return <SelectedMapMarker data={data} />;
  }
  return (
    <NonSelectedMapMarker
      data={data}
      onPress={() => {
        logAction({
          category: categories.PANEL_CLINICS,
          action: 'Select clinic on map',
        });
        updateSelected([data]);
      }}
    />
  );
};

SingleMapMarker.propTypes = {
  data: PropTypes.shape({
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
    id: PropTypes.number,
  }),
  isSelected: PropTypes.bool.isRequired,
  updateSelected: PropTypes.func.isRequired,
};

const mapStateToProps = ({ panel: { selectedClinics } }, { data }) => ({
  isSelected: !!(
    selectedClinics.length === 1 && selectedClinics[0].id === data.id
  ),
});

const enhance = Component =>
  connect(mapStateToProps, { updateSelected: updateSelectedClinics })(
    Component,
  );

export default enhance(SingleMapMarker);
