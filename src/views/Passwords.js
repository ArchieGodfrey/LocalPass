import * as React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PasswordItem from '../components/PasswordItem';
import {TouchableOpacity} from 'react-native-gesture-handler';

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', jsonValue);
  } catch (e) {
    // saving error
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export default function Passwords() {
  const [passwords, setPasswords] = React.useState([
    {
      id: 0,
      website: 'https://login.live.com/',
      username: 'username',
      password: 'password',
    },
    {
      id: 1,
      website: 'https://login.live.com/',
      username: 'username',
      password: 'password',
    },
    {
      id: 2,
      website: 'https://login.live.com/',
      username: 'username',
      password: 'password',
    },
  ]);
  const [currentEditing, setCurrentEditing] = React.useState(null);
  const onChangeValue = (id, text, key) => {
    const tempPasswords = [...passwords];
    const index = passwords.findIndex((item) => item.id === id);
    tempPasswords[index][key] = text;
    setPasswords(tempPasswords);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => setCurrentEditing(item.id)}>
      <PasswordItem
        item={{...item, editing: currentEditing}}
        onChangeWebsite={(text) => onChangeValue(item.id, text, 'website')}
        onChangeUsername={(text) => onChangeValue(item.id, text, 'username')}
        onChangePassword={(text) => onChangeValue(item.id, text, 'password')}
      />
    </TouchableOpacity>
  );

  React.useEffect(() => {
    getData().then((value) => {
      if (value) {
        setPasswords(value);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} onResponderStart>
      <TouchableOpacity
        style={styles.background}
        onPress={() => {
          setCurrentEditing(null);
          storeData(passwords);
        }}>
        <View style={styles.inner}>
          <Text style={styles.header}>Passwords</Text>
          <FlatList
            style={styles.list}
            data={passwords}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={currentEditing}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  background: {
    height: '100%',
    width: '100%',
  },
  inner: {
    padding: 20,
  },
  save: {
    position: 'absolute',
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
  },
  list: {
    margin: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
