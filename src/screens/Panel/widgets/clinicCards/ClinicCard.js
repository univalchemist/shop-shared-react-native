import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NoClinicCard from './NoClinicCard';
import NoSelectedClinicCard from './NoSelectedClinicCard';
import { ClinicDetailsCard } from './ClinicDetailsCard';
import MultipleClinicsCard from './MultipleClinicsCard';

export const ClinicCard = ({
  filteredClinics,
  selectedClinics,
  navigation,
}) => {
  const componentStates = new Map([
    [() => filteredClinics.length < 1, <NoClinicCard />],
    [
      () => !selectedClinics || selectedClinics.length === 0,
      <NoSelectedClinicCard />,
    ],
    [
      () => selectedClinics.length > 1,
      <MultipleClinicsCard clinics={selectedClinics} navigation={navigation} />,
    ],
  ]);

  for (let [metStateCondition, component] of componentStates) {
    if (metStateCondition()) {
      return component;
    }
  }

  return (
    <ClinicDetailsCard clinic={selectedClinics[0]} navigation={navigation} />
  );
};

ClinicCard.propTypes = {
  filteredClinics: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedClinics: PropTypes.arrayOf(PropTypes.shape({})),
};
const mapStateToProps = ({ panel: { filteredClinics, selectedClinics } }) => ({
  filteredClinics,
  selectedClinics,
});

const enhance = Component => connect(mapStateToProps)(Component);
export default enhance(ClinicCard);
