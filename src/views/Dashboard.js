/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {NetworkInfo} from 'react-native-network-info';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import nodejs from 'nodejs-mobile-react-native';

const Dashboard = () => {
  const [value, setValue] = React.useState('https://www.google.com');
  const [address, setAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    NetworkInfo.getIPAddress().then((ipAddress) => {
      // Create server
      nodejs.start('server.js');
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
          // eslint-disable-next-line no-alert
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
      setAddress(ipAddress);
    });
  });

  const webRef = React.useRef(null);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <Button
            title="Start Server"
            onPress={() => {
              nodejs.channel.send({address});
              setValue(`http://${address}:8080/`);
            }}
          />
          <Button
            title="Close Server"
            onPress={() => nodejs.channel.send({status: 'close'})}
          />
          <Button title="Refresh" onPress={() => webRef.current.reload()} />
          <TextInput
            style={{
              backgroundColor: 'grey',
              color: 'white',
              padding: 5,
              margin: 10,
              fontSize: 18,
            }}
            onChangeText={(text) => setValue(text)}
            //onSubmitEditing={(text) => onChangeText(text)}
            value={`${value}`}
          />
          <TextInput
            style={{
              backgroundColor: 'grey',
              color: 'white',
              padding: 5,
              margin: 10,
              fontSize: 18,
            }}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={(text) =>
              nodejs.channel.send({password: text.nativeEvent.text})
            }
            value={password}
          />
          <WebView
            ref={webRef}
            source={{uri: value}}
            style={{height: 500, width: '100%'}}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default Dashboard;
