import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Dashboard from '../views/Dashboard';
import Passwords from '../views/Passwords';
import Header from '../components/Header';

// Create the drawer
const Drawer = createDrawerNavigator();

// Define the pages
const DrawerComponent = () => (
  <Drawer.Navigator initialRouteName="Status">
    <Drawer.Screen name="Status" component={StackDasboard} />
    <Drawer.Screen name="Passwords" component={StackPasswords} />
  </Drawer.Navigator>
);

// Each screen is a stack for the header
const Stack = createStackNavigator();
const StackDasboard = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{
        header: ({navigation}) => (
          <Header onPress={() => navigation.toggleDrawer()} />
        ),
      }}
      name="Dashboard"
      component={Dashboard}
    />
  </Stack.Navigator>
);
const StackPasswords = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{
        header: ({navigation}) => (
          <Header onPress={() => navigation.toggleDrawer()} />
        ),
      }}
      name="Passwords"
      component={Passwords}
    />
  </Stack.Navigator>
);

const Router = () => (
  <NavigationContainer>
    <DrawerComponent />
  </NavigationContainer>
);

export default Router;
