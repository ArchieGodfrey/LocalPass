import 'react-native-gesture-handler';
import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import nodejs from 'nodejs-mobile-react-native';
import Router from './src/router/router';

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', jsonValue);
  } catch (e) {
    // saving error
  }
};

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
          } else {
            nodejs.channel.post('retrievedData', {status: 'FAIL'});
          }
        });
      },
      this,
    );
    nodejs.channel.addListener(
      'sendData',
      ({website, username, password}) => {
        getData().then((response) => {
          if (response) {
            storeData([
              ...response,
              {id: response.length, website, username, password},
            ]).then(() => {
              nodejs.channel.post('recievedData', {status: 'OK'});
            });
          } else {
            nodejs.channel.post('recievedData', {status: 'FAIL'});
          }
        });
      },
      this,
    );
  }, []);
  return <Router />;
}
