import * as React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {getData, storeData} from '../helpers/AsyncStorage';
import PasswordItem from '../components/PasswordItem';
import NewItem from '../components/NewItem';

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
    setCurrentEditing(null);
  };

  const toggleEditing = (id) =>
    currentEditing === id
      ? setCurrentEditing(undefined)
      : setCurrentEditing(id);

  const renderItem = ({item}) => (
    <PasswordItem
      item={{...item, editing: currentEditing}}
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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        activeOpacity={0}
        style={styles.background}
        onPress={() => {
          setCurrentEditing(null);
          const noNew = [...passwords].filter(
            (password) => password.website !== 'New Password',
          );
          storeData('passwords', noNew);
        }}>
        <View style={styles.inner}>
          <FlatList
            style={styles.list}
            data={passwords}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
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
    paddingTop: 20,
  },
  save: {
    position: 'absolute',
  },
  list: {
    marginHorizontal: 20,
  },
});
