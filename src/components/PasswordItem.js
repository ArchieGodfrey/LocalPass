import * as React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

export default function PasswordItem({
  item: {id, website, username, password, editing},
  onChangeWebsite,
  onChangeUsername,
  onChangePassword,
}) {
  const [hidePassword, setHidePassword] = React.useState(true);
  React.useEffect(() => {
    if (editing !== id && !hidePassword) {
      setHidePassword(true);
    }
  }, [editing, hidePassword, id]);
  return (
    <>
      <View style={styles.container}>
        {id === editing ? (
          <>
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeWebsite(text)}
              value={website}
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeUsername(text)}
              value={username}
            />
            <TextInput
              style={styles.input}
              onFocus={() => setHidePassword(false)}
              onBlur={() => setHidePassword(true)}
              secureTextEntry={hidePassword}
              onChangeText={(text) => onChangePassword(text)}
              value={password}
            />
          </>
        ) : (
          <Text style={styles.cover}>{website}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    fontSize: 32,
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
