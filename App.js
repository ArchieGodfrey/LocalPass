import 'react-native-gesture-handler';
import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import nodejs from 'nodejs-mobile-react-native';
import Dashboard from './src/views/Dashboard';
import Passwords from './src/views/Passwords';

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const Drawer = createDrawerNavigator();

export default function App() {
  React.useEffect(() => {
    // Add listeners for messages
    nodejs.channel.addListener(
      'message',
      (msg) => {
        // eslint-disable-next-line no-alert
        alert(msg);
      },
      this,
    );
    nodejs.channel.addListener(
      'getData',
      (website) => {
        getData().then((response) => {
          const index = response.findIndex((item) => item.website === website);
          if (index > -1) {
            nodejs.channel.post('retrievedData', {
              status: 'OK',
              data: response[index],
            });
          }
          nodejs.channel.post('retrievedData', {status: 'FAIL'});
        });
      },
      this,
    );
  });
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Status">
        <Drawer.Screen name="Satus" component={Dashboard} />
        <Drawer.Screen name="Passwords" component={Passwords} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
