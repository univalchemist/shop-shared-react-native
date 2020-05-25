import React from 'react';
import { logEvent, logAction } from '@store/analytics/trackingActions';

const withTracking = WrappedComponent => props => {
  const { onPress, event, actionParams, eventParams, ...otherProps } = props;
  return (
    <WrappedComponent
      {...otherProps}
      onPress={() => {
        if (event) {
          logEvent({ event, eventParams });
        }
        if (actionParams) {
          logAction(actionParams);
        }
        props.onPress();
      }}
    />
  );
};

export default withTracking;
