import * as React from 'react';
import {View, Alert} from 'react-native';
import {getLogin, saveLogin} from '../helpers';
import nodejs from 'nodejs-mobile-react-native';

export default function Listeners() {
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
      'requestAccess',
      (msg) => {
        Alert.alert('Access Requested', msg, [
          {
            text: 'Accept',
            onPress: () =>
              nodejs.channel.post('accessStatus', {status: 'ACCEPTED'}),
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () =>
              nodejs.channel.post('accessStatus', {status: 'DENIED'}),
          },
        ]);
      },
      this,
    );
    nodejs.channel.addListener(
      'getData',
      (website) =>
        getLogin(website).then((login) => {
          if (login) {
            nodejs.channel.post('retrievedData', login);
          } else {
            nodejs.channel.post('retrievedData', {status: 'FAIL'});
          }
        }),
      this,
    );
    nodejs.channel.addListener(
      'saveData',
      (response) =>
        saveLogin(response)
          .then(() => {
            nodejs.channel.post('savedData', {status: 'OK'});
          })
          .catch((e) => {
            nodejs.channel.post('savedData', {status: 'FAIL'});
          }),
      this,
    );
  }, []);
  return <View />;
}
