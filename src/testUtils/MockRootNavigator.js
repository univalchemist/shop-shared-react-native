/* istanbul ignore file */
import React from 'react';
import { PUBLIC } from '@routes';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const MockRootNavigator = ({ component }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name={PUBLIC}>{props => component}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MockRootNavigator;
