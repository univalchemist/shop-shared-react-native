import React from 'react';
import { connect } from 'react-redux';
import { ListPicker } from '@wrappers/components';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import { injectIntl } from 'react-intl';

const LifestyleEthnicityModal = ({
  change,
  ethnicity,
  ethnicityOptions,
  intl,
  navigation,
}) => {
  const onPressItem = ethnicity => {
    change('lifestyleForm', 'ethnicity', ethnicity);
    navigation.goBack();
  };

  const data = Object.keys(ethnicityOptions).map(key => {
    return {
      key,
      value: intl.formatMessage({ id: ethnicityOptions[key] }),
    };
  });

  return (
    <ListPicker data={data} onPressItem={onPressItem} selectedKey={ethnicity} />
  );
};

LifestyleEthnicityModal.propTypes = {
  change: PropTypes.func,
  ethnicity: PropTypes.string,
  ethnicityOptions: PropTypes.shape({}),
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
};

const mapStateToProps = ({
  health: { ethnicityOptions },
  form: {
    lifestyleForm: {
      values: { ethnicity },
    },
  },
}) => ({
  ethnicityOptions,
  ethnicity,
});

export default injectIntl(
  connect(mapStateToProps, { change })(LifestyleEthnicityModal),
);
