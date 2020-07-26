import * as React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {getData, storeData} from '../helpers/AsyncStorage';
import PasswordItem from '../components/PasswordItem';
import NewItem from '../components/NewItem';
import {SearchBar} from '../components/SearchBar';

const useFilter = (passwords, filter) =>
  passwords.filter(
    (x) =>
      x.newEntry ||
      (x.password && x.password.toLowerCase().includes(filter.toLowerCase())) ||
      (x.username && x.username.toLowerCase().includes(filter.toLowerCase())) ||
      (x.website && x.website.toLowerCase().includes(filter.toLowerCase())),
  );

export default function Passwords() {
  const [search, onChangeText] = React.useState('');
  const [passwords, setPasswords] = React.useState([]);
  const [currentEditing, setCurrentEditing] = React.useState(undefined);
  const onChangeValue = (id, text, key) => {
    const tempPasswords = [...passwords];
    const index = passwords.findIndex((item) => item.id === id);
    tempPasswords[index][key] = text;
    checkNew(tempPasswords[index]);
    setPasswords(tempPasswords);
  };

  const onDelete = (id) => {
    const tempPasswords = [...passwords];
    const index = passwords.findIndex((item) => item.id === id);
    tempPasswords.splice(index, 1)[index];
    setPasswords(tempPasswords);
    setCurrentEditing(null);
  };

  const checkNew = (item) => {
    if (!item.website && !item.username && !item.password) {
      item.newEntry = true;
    } else if (item.newEntry) {
      delete item.newEntry;
    }
  };

  const toggleEditing = (id) => {
    if (currentEditing === id) {
      setCurrentEditing(undefined);
      const tempPasswords = [...passwords];
      tempPasswords.sort((a, b) => {
        if (a.newEntry || b.newEntry) {
          return a.newEntry ? 1 : -1;
        } else {
          return a.website > b.website ? 1 : -1;
        }
      });
      setPasswords(tempPasswords);
    } else {
      setCurrentEditing(id);
    }
  };

  const getNewId = () => {
    const rand = Math.floor(Math.random() * 10000);
    if (passwords.find((x) => x.id === rand)) {
      return getNewId();
    } else {
      return rand;
    }
  };

  const renderItem = ({item, index}) => (
    <PasswordItem
      item={{...item, index, editing: currentEditing}}
      onDelete={onDelete}
      toggleEditing={() => toggleEditing(item.id)}
      onChangeWebsite={(text) => onChangeValue(item.id, text, 'website')}
      onChangeUsername={(text) => onChangeValue(item.id, text, 'username')}
      onChangePassword={(text) => onChangeValue(item.id, text, 'password')}
    />
  );

  React.useEffect(() => {
    getData('passwords').then((value) => {
      if (value) {
        setPasswords(value);
      }
    });
  }, []);

  React.useEffect(() => {
    const noNew = [...passwords].filter((password) => !password.newEntry);
    storeData('passwords', noNew);
  }, [passwords, onChangeText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <SearchBar search={search} onChangeText={onChangeText} />
        <FlatList
          style={styles.list}
          data={useFilter(passwords, search)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={currentEditing}
          ListFooterComponent={
            <NewItem
              title="Add"
              onPress={() => {
                if (!passwords.find((x) => x.newEntry)) {
                  const id = getNewId();
                  setPasswords([...passwords, {id, newEntry: true}]);
                  setCurrentEditing(id);
                }
              }}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#403F4C',
  },
  inner: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  list: {
    marginTop: 10,
    height: '90%',
  },
});
