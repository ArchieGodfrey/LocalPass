import * as React from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

export default function LogList({show}) {
  const logRef = React.useRef(null);
  const [serverLog, setServerLog] = React.useState([
    {log: 'Server Response: Waiting', id: 0},
  ]);
  React.useEffect(() => {
    nodejs.channel.addListener(
      'log',
      (log) => {
        const temp = [...serverLog];
        temp.push({log, id: temp.length});
        setServerLog(temp);
      },
      this,
    );
  }, [serverLog]);
  return (
    <FlatList
      ref={logRef}
      style={styles.logList}
      data={show ? serverLog : []}
      extraData={serverLog}
      renderItem={({item}) => <Text style={styles.logText}>{item.log}</Text>}
      keyExtractor={(item) => `${item.id}`}
      onContentSizeChange={() => logRef.current.scrollToEnd()}
    />
  );
}

const styles = StyleSheet.create({
  logList: {
    width: '100%',
    height: '100%',
    marginTop: 20,
    borderTopWidth: 3,
    borderColor: '#F4F9E9',
  },
  logText: {
    margin: 5,
    fontSize: 30,
    fontWeight: '500',
    color: '#F4F9E9',
  },
});
