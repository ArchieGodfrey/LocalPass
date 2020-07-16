import * as React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

export default function PasswordItem({
  item: {id, website, username, password, editing},
  onChangeWebsite,
  onChangeUsername,
  onChangePassword,
  onDelete,
  toggleEditing,
}) {
  const [hidePassword, setHidePassword] = React.useState(true);
  React.useEffect(() => {
    if (editing !== id && !hidePassword) {
      setHidePassword(true);
    }
  }, [editing, hidePassword, id]);

  const deleteAlert = () => {
    Alert.alert(
      'Are you sure you want to delete this password?',
      'This action cannot be undone',
      [
        {
          text: 'Delete',
          onPress: onDelete,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };
  const cleanWebsite = (text) => {
    // Remove protocol and everything after domain
    const cleanText = text.split('//').pop().split('/')[0];
    if (cleanText.length > 20) {
      return cleanText.substring(0, 16) + '...';
    }
    return cleanText;
  };
  return (
    <TouchableOpacity style={styles.container} onPress={toggleEditing}>
      <Text style={[styles.cover, id === editing && styles.selected]}>
        {cleanWebsite(website)}
      </Text>
      {id === editing && (
        <View>
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
          <Text style={styles.delete} onPress={deleteAlert}>
            DELETE
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    fontSize: 32,
    fontWeight: '600',
    borderWidth: 5,
    borderColor: '#F4F9E9',
    borderRadius: 5,
    backgroundColor: '#403F4C',
    color: '#F4F9E9',
    padding: 20,
    marginVertical: 8,
  },
  selected: {
    backgroundColor: '#FF6933',
  },
  input: {
    fontSize: 20,
    backgroundColor: '#F4F9E9',
    color: '#403F4C',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  delete: {
    fontSize: 32,
    backgroundColor: '#CC2E28',
    color: '#F4F9E9',
    fontWeight: '800',
    textAlign: 'center',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
