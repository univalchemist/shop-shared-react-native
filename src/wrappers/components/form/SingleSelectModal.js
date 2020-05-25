import React from 'react';
import { ListPicker } from '@wrappers/components';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import { connect } from 'react-redux';

const SingleSelectModal = ({ change, navigation, route }) => {
  const { form, fieldKey, initialSelected, data, onChange } = route?.params;

  const onPressItem = data => {
    change(form, fieldKey, data);
    onChange && onChange(fieldKey, data);
    navigation.goBack();
  };

  const convertedData = data.map(item => {
    return {
      key: item.value,
      value: item.label,
    };
  });

  return (
    <ListPicker
      data={convertedData}
      onPressItem={onPressItem}
      selectedKey={initialSelected}
    />
  );
};

SingleSelectModal.propTypes = {
  change: PropTypes.func,
};

export default connect(null, { change })(SingleSelectModal);
