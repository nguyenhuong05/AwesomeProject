import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TemperatureScreen from './src/components/TempuratureScreen/index';
import FanScreen from './src/components/FanScreen/index';
import {Chart} from './src/components/chart';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Temperature">
        <Stack.Screen name="Temperature" component={TemperatureScreen} />
        <Stack.Screen name="FanScreen" component={FanScreen} />
        <Stack.Screen name="Chart" component={Chart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
