import React from 'react';
import { Box } from '@wrappers/components';
import PropTypes from 'prop-types';

const RadioGroup = ({ value, children, onChange }) => {
  const radioButtons = React.Children.map(children, child => {
    return React.cloneElement(child, {
      checked: value === child.props.value,
      onChange: value => onChange(value),
    });
  });

  return <Box>{radioButtons}</Box>;
};

RadioGroup.propTypes = {
  children: PropTypes.any,
};

export default RadioGroup;
