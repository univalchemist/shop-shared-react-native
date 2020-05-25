import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NoClinicCard from './NoClinicCard';
import NoSelectedClinicCard from './NoSelectedClinicCard';
import ClinicDetailsCard from './ClinicDetailsCard';
import MultipleClinicsCard from './MultipleClinicsCard';

const ClinicCard = ({ clinics, selectedClinics, navigation }) => {
  const componentStates = new Map([
    [() => clinics.length < 1, <NoClinicCard />],
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
  clinics: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedClinics: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = ({
  heal: {
    clinicData: { clinics, selectedClinics },
  },
}) => ({
  clinics,
  selectedClinics,
});
export default connect(mapStateToProps, {})(ClinicCard);
