import React from 'react';
import { CustomMultiselectCheckBox } from '@wrappers/components/form';
import { connect } from 'react-redux';
import { change } from 'redux-form';

const MultiSelectModal = ({ change, route, navigation }) => {
  const { form, fieldKey, initialSelected, data, buttonLabel } = route?.params;

  const submitHandler = () => value => {
    change(form, fieldKey, value);
    navigation.goBack();
  };

  return (
    <CustomMultiselectCheckBox
      data={data}
      buttonLabel={buttonLabel}
      onSubmit={submitHandler()}
      onChange={() => {}}
      selectedValues={initialSelected}
    />
  );
};

export default connect(null, { change })(MultiSelectModal);
