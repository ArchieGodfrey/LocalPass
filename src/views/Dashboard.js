import React from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {NetworkInfo} from 'react-native-network-info';
import nodejs from 'nodejs-mobile-react-native';

const ServerStatusEnum = {
  open: 'Server Opened',
  closing: 'Server Closing',
  closed: 'Server Closed',
};

const Dashboard = () => {
  const [address, setAddress] = React.useState(
    'Please connect to a Wifi connection',
  );
  const [serverStatus, setServerStatus] = React.useState(
    ServerStatusEnum.closed,
  );

  const colorAnimate = React.useRef(new Animated.Value(0)).current;
  let backgroundColor = colorAnimate.interpolate({
    inputRange: [0, 255],
    outputRange: ['rgba(255, 105, 51, 1)', 'rgba(97, 139, 74, 1)'],
  });

  const getAddress = () => {
    NetworkInfo.getIPAddress().then((ipAddress) => {
      // Create server
      nodejs.start('server.js');
      setAddress(ipAddress);
    });
  };

  React.useEffect(() => {
    getAddress();
    nodejs.channel.addListener(
      'startedServer',
      () => {
        setServerStatus('Server Opened');
      },
      this,
    );
    nodejs.channel.addListener(
      'closedServer',
      () => {
        setServerStatus('Server Closed');
      },
      this,
    );
  });
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.banner, {backgroundColor}]}>
          <Text style={styles.subheading}>Server Address</Text>
          <Text style={styles.heading}>{address}</Text>
          {address === 'Please connect to a Wifi connection' && (
            <Text style={styles.tryAgain}>Press here to try again</Text>
          )}
          <Text style={styles.subheading}>Server Status</Text>
          <Text style={styles.heading}>{serverStatus}</Text>
        </Animated.View>
        {serverStatus === ServerStatusEnum.closed && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              nodejs.channel.post('startServer', {address});
              Animated.timing(colorAnimate, {
                toValue: 255,
                duration: 1500,
                useNativeDriver: false,
              }).start();
            }}>
            <Text style={styles.buttonText}>Start Server</Text>
          </TouchableOpacity>
        )}
        {serverStatus === ServerStatusEnum.closing && (
          <TouchableOpacity style={styles.closingButton}>
            <Text style={styles.buttonText}>Waiting...</Text>
          </TouchableOpacity>
        )}
        {serverStatus === ServerStatusEnum.open && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setServerStatus(ServerStatusEnum.closing);
              nodejs.channel.post('closeServer');
              Animated.timing(colorAnimate, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: false,
              }).start();
            }}>
            <Text style={styles.buttonText}>Close Server</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#403F4C',
  },
  banner: {
    width: '100%',
    borderBottomWidth: 3,
    borderColor: '#F4F9E9',
    marginBottom: 20,
  },
  openBanner: {
    backgroundColor: '#618B4A',
  },
  closedBanner: {
    backgroundColor: '#FF6933',
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
    fontWeight: '500',
    marginBottom: 20,
    color: '#FF6933',
    textAlign: 'center',
  },
  startButton: {
    borderRadius: 5,
    backgroundColor: '#618B4A',
  },
  closingButton: {
    borderRadius: 5,
    backgroundColor: '#ff8356',
  },
  closeButton: {
    borderRadius: 5,
    backgroundColor: '#FF6933',
  },
  buttonText: {
    width: 250,
    padding: 15,
    fontSize: 40,
    fontWeight: '500',
    color: '#F4F9E9',
    textAlign: 'center',
  },
});

export default Dashboard;
