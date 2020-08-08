import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Dashboard from '../views/Dashboard';
import Passwords from '../views/Passwords';
import Header from '../components/Header';
import CustomDrawer from '../components/CustomDrawer';

// Create the drawer
const Drawer = createDrawerNavigator();

// Define the pages
const DrawerComponent = () => (
  <Drawer.Navigator
    initialRouteName="Status"
    drawerPosition="right"
    drawerType="slide"
    drawerContent={(props) => <CustomDrawer {...props} />}>
    <Drawer.Screen name="Status" component={StackDashboard} />
    <Drawer.Screen name="Passwords" component={StackPasswords} />
  </Drawer.Navigator>
);

// Each screen is a stack for the header
const Stack = createStackNavigator();
const StackDashboard = (drawerNav) => (
  <Stack.Navigator>
    <Stack.Screen
      options={{
        header: ({navigation}) => (
          <Header onPress={() => navigation.toggleDrawer()} />
        ),
      }}
      name="Dashboard">
      {(props) => <Dashboard {...props} nav={drawerNav.navigation} />}
    </Stack.Screen>
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
      name="Password Manager"
      initialParams={{changePassword: false}}
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
