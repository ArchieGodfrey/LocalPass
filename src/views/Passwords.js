import * as React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PasswordItem from '../components/PasswordItem';
import NewItem from '../components/NewItem';

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
  const [passwords, setPasswords] = React.useState([]);
  const [currentEditing, setCurrentEditing] = React.useState(null);
  const onChangeValue = (id, text, key) => {
    const tempPasswords = [...passwords];
    const index = passwords.findIndex((item) => item.id === id);
    tempPasswords[index][key] = text;
    setPasswords(tempPasswords);
  };

  const onDelete = (id) => {
    const tempPasswords = [...passwords];
    const index = passwords.findIndex((item) => item.id === id);
    tempPasswords.splice(index, 1)[index];
    setPasswords(tempPasswords);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => setCurrentEditing(item.id)}>
      <PasswordItem
        item={{...item, editing: currentEditing}}
        onDelete={onDelete}
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
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          activeOpacity={0}
          style={styles.background}
          onPress={() => {
            setCurrentEditing(null);
            const noNew = [...passwords].filter(
              (password) => password.website !== 'New Password',
            );
            storeData(noNew);
          }}>
          <View style={styles.inner}>
            <Text style={styles.header}>Passwords</Text>
            <FlatList
              style={styles.list}
              data={passwords}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              extraData={currentEditing}
              ListFooterComponent={
                <>
                  <NewItem
                    title="Add"
                    onPress={() =>
                      setPasswords([
                        ...passwords,
                        {id: passwords.length, website: 'New Password'},
                      ])
                    }
                  />
                  <NewItem
                    title="Import"
                    onPress={() =>
                      setPasswords([
                        ...passwords,
                        {id: passwords.length, website: 'New Password'},
                      ])
                    }
                  />
                </>
              }
            />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#403F4C',
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
    fontSize: 52,
    fontWeight: '500',
    marginBottom: 20,
    color: '#F4F9E9',
  },
  list: {
    margin: 20,
    marginBottom: 60,
  },
});
