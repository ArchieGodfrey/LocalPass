import 'react-native-gesture-handler';
import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import Dashboard from './src/views/Dashboard';
import Passwords from './src/views/Passwords';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Status">
        <Drawer.Screen name="Satus" component={Dashboard} />
        <Drawer.Screen name="Passwords" component={Passwords} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
