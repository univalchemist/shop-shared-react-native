import React from 'react';
import LifestyleTipLayout from './LifestyleTipLayout';
import { LifestyleTipLoader } from './LifestyleTipLoader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { PromiseStatus } from '@middlewares';
import { ErrorPanel } from '@wrappers/components';

const LifestyleTipsModal = ({ lifestyleTips, route, navigation }) => {
  switch (lifestyleTips.status) {
    case PromiseStatus.SUCCESS: {
      return (
        <LifestyleTipLayout
          lifestyleTipsParameters={route.params?.tips}
          navigation={navigation}
        />
      );
    }
    case PromiseStatus.ERROR: {
      return <ErrorPanel />;
    }
    default: {
      return <LifestyleTipLoader />;
    }
  }
};

const mapStateToProps = ({ health: { lifestyleTips } }) => ({
  lifestyleTips,
});

const enhance = compose(connect(mapStateToProps));

LifestyleTipsModal.propTypes = {
  lifestyleTips: PropTypes.shape({
    tips: PropTypes.object,
    status: PropTypes.string,
  }),
};

export default enhance(LifestyleTipsModal);
