import React from 'react';
import {
  Alert,
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
        <Text style={styles.heading}>{address}</Text>
        {address === 'Please connect to a Wifi connection' && (
          <Text style={styles.tryAgain}>Press here to try again</Text>
        )}
        <Text
          style={[
            styles.heading,
            serverStatus === ServerStatusEnum.open
              ? styles.serverOpen
              : styles.serverClosed,
          ]}>
          {serverStatus}
        </Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            nodejs.channel.post('startServer', {address});
          }}>
          <Text style={styles.buttonText}>Start Server</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setServerStatus(ServerStatusEnum.closing);
            nodejs.channel.post('closeServer');
          }}>
          <Text style={styles.buttonText}>Close Server</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#403F4C',
  },
  heading: {
    fontSize: 40,
    fontWeight: '500',
    marginBottom: 20,
    color: '#F4F9E9',
    textAlign: 'center',
  },
  tryAgain: {
    fontSize: 30,
    fontWeight: '500',
    marginBottom: 20,
    color: '#FF6933',
    textAlign: 'center',
  },
  serverOpen: {
    color: '#618B4A',
  },
  serverClosed: {
    color: '#CC2E28',
  },
  startButton: {
    borderRadius: 5,
    backgroundColor: 'green',
    marginTop: 50,
  },
  closeButton: {
    borderRadius: 5,
    backgroundColor: '#FF6933',
    marginTop: 50,
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
