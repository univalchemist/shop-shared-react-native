import React from 'react';
import { Card } from 'react-native-elements';

export const CardContainer = ({ children }) => {
  return (
    <Card
      containerStyle={{
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 0,
        margin: 0,
      }}
    >
      {children}
    </Card>
  );
};
