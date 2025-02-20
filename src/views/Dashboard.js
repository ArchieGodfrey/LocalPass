import React from 'react';
import {
  View,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {NetworkInfo} from 'react-native-network-info';
import nodejs from 'nodejs-mobile-react-native';
import {getData, storeData} from '../helpers';
// import LogList from '../components/LogList';

const ServerStatusEnum = {
  open: 'Open Server',
  closing: 'Closing Server',
  close: 'Close Server',
  noAddress: 'Try Again',
};

export default function Dashboard({nav}) {
  // const [showLog, setShowLog] = React.useState(false);
  const [address, setAddress] = React.useState(undefined);
  const [serverStatus, setServerStatus] = React.useState(
    ServerStatusEnum.noAddress,
  );

  // Auto start server
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () =>
    setIsEnabled((previousState) => {
      storeData('autoStart', !previousState);
      return !previousState;
    });

  // Animations
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const colorAnimate = React.useRef(new Animated.Value(0)).current;
  const backgroundColor = colorAnimate.interpolate({
    inputRange: [0, 255],
    outputRange: ['rgba(255, 105, 51, 1)', 'rgba(97, 139, 74, 1)'],
  });
  const inverseColor = colorAnimate.interpolate({
    inputRange: [0, 128, 255],
    outputRange: [
      'rgba(97, 139, 74, 1)',
      'rgba(255, 131, 86, 1)',
      'rgba(255, 105, 51, 1)',
    ],
  });
  const animate = (value) => {
    Animated.timing(colorAnimate, {
      toValue: value,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  };

  // Change title in drawer
  const updateDrawer = (title) =>
    nav.setOptions({drawerLabel: `Status - ${title}`});

  const setServerTimeout = () =>
    setTimeout(() => {
      if (serverStatus === ServerStatusEnum.noAddress) {
        animate(0);
        getAddress();
      }
    }, 3000);

  // Get IP address
  const getAddress = () => {
    NetworkInfo.getIPAddress().then((ipAddress) => {
      if (ipAddress) {
        setAddress(ipAddress);
        setServerStatus(ServerStatusEnum.open);
        // Check auto start
        getData('autoStart').then((data) => {
          if (data) {
            setIsEnabled(true);
            nodejs.channel.post('startServer', {address: ipAddress});
          }
        });
      } else {
        setServerTimeout();
      }
    });
  };

  React.useEffect(() => {
    // Create server
    nodejs.start('server.js');
    getAddress();
    nodejs.channel.addListener(
      'startedServer',
      () => {
        setServerStatus(ServerStatusEnum.close);
        updateDrawer('Online');
        animate(255);
      },
      this,
    );
    nodejs.channel.addListener(
      'closedServer',
      () => {
        setServerStatus(ServerStatusEnum.open);
        updateDrawer('Offline');
        animate(0);
      },
      this,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.banner, {backgroundColor}]}>
        <Text style={styles.subheading}>Server Address</Text>
        {address && <Text style={styles.heading}>{address}</Text>}
        {serverStatus === ServerStatusEnum.noAddress && (
          <Text style={[styles.heading, styles.tryAgain]}>
            A Wifi Connection is Required
          </Text>
        )}
      </Animated.View>
      <AnimatedTouchable
        style={[styles.button, {backgroundColor: inverseColor}]}
        onPress={() => {
          animate(128);
          switch (serverStatus) {
            case ServerStatusEnum.open:
              nodejs.channel.post('startServer', {address});
              break;
            case ServerStatusEnum.close:
              setServerStatus(ServerStatusEnum.closing);
              updateDrawer('Closing');
              nodejs.channel.post('closeServer');
              break;
            case ServerStatusEnum.noAddress:
              getAddress();
              break;
          }
        }}>
        <Text style={styles.buttonText}>{serverStatus}</Text>
      </AnimatedTouchable>
      {/* {<TouchableOpacity
        style={[styles.button, styles.serverLogButton]}
        onPress={() => setShowLog(!showLog)}>
        <Text style={styles.buttonText}>{showLog ? 'Hide' : 'Show'} Log</Text>
      </TouchableOpacity>
      <LogList show={showLog} />} */}
      <View style={styles.row}>
        <Text style={styles.heading}>Auto-Start</Text>
        <Switch
          thumbColor="F4F9E9"
          trackColor={{false: '#FF6933', true: '#618B4A'}}
          ios_backgroundColor="#FF6933"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.switch}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#403F4C',
  },
  row: {
    flexDirection: 'row',
    marginTop: 20,
  },
  banner: {
    width: '100%',
    borderBottomWidth: 3,
    borderColor: '#F4F9E9',
    marginBottom: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: '500',
    marginBottom: 20,
    color: '#F4F9E9',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 30,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    color: '#F4F9E9',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  tryAgain: {
    fontSize: 30,
  },
  button: {
    borderRadius: 5,
  },
  buttonText: {
    width: 250,
    padding: 15,
    fontSize: 40,
    fontWeight: '500',
    color: '#F4F9E9',
    textAlign: 'center',
  },
  serverLogButton: {
    marginTop: 20,
    backgroundColor: 'grey',
  },
  switch: {
    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
    marginTop: 7,
    marginLeft: 20,
  },
});
