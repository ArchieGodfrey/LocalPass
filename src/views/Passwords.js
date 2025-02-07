import * as React from 'react';
import {SafeAreaView, View, FlatList, StyleSheet} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {getData, saveLogin, getNewId, deleteLogin} from '../helpers';
import PasswordItem from '../components/PasswordItem';
import NewItem from '../components/NewItem';
import SearchBar from '../components/SearchBar';
import PasswordModal from '../components/PasswordModal';

const useFilter = (passwords, filter) =>
  passwords.filter(
    (x) =>
      x.newEntry ||
      (x.password && x.password.toLowerCase().includes(filter.toLowerCase())) ||
      (x.username && x.username.toLowerCase().includes(filter.toLowerCase())) ||
      (x.website && x.website.toLowerCase().includes(filter.toLowerCase())),
  );

export default function Passwords({navigation}) {
  const [changePassword, setChangePassword] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
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
    deleteLogin(tempPasswords[index]);
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

  const renderItem = ({item, index}) => (
    <PasswordItem
      item={{...item, index, editing: currentEditing}}
      onDelete={() => onDelete(item.id)}
      toggleEditing={() => toggleEditing(item.id)}
      onChangeWebsite={(text) => onChangeValue(item.id, text, 'website')}
      onChangeUsername={(text) => onChangeValue(item.id, text, 'username')}
      onChangePassword={(text) => onChangeValue(item.id, text, 'password')}
    />
  );

  React.useEffect(() => {
    getData('passwords').then((saved) => {
      if (saved) {
        const toArray = [];
        const websites = Object.keys(saved);
        websites.forEach((logins, index) => {
          saved[logins].forEach((login) =>
            toArray.push({
              newEntry: false,
              ...login,
            }),
          );
          if (index === websites.length - 1) {
            setPasswords(toArray);
          }
        });
      }
    });
  }, []);

  React.useEffect(() => {
    const noNew = [...passwords].filter((password) => !password.newEntry);
    noNew.forEach((login) => {
      saveLogin(login);
    });
  }, [passwords, onChangeText]);

  // Get route and check if focused
  const route = useRoute();
  useFocusEffect(
    React.useCallback(() => {
      setFocused(true);
      if (route.params?.changePassword) {
        setChangePassword(true);
      }
      return () => {
        setFocused(false);
        setChangePassword(false);
      };
    }, [setFocused, setChangePassword, route.params?.changePassword]),
  );

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
                  const id = getNewId(passwords);
                  setPasswords([...passwords, {id, newEntry: true}]);
                  setCurrentEditing(id);
                }
              }}
            />
          }
        />
      </View>
      <PasswordModal
        navigation={navigation}
        focused={focused}
        changePassword={changePassword}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#403F4C',
  },
  inner: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#403F4C',
  },
  list: {
    marginTop: 10,
    height: '90%',
  },
});
