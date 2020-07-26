import * as React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

export default function PasswordItem({
  item: {index, id, website, username, password, editing, newEntry},
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
      <View
        style={[
          styles.cover,
          id === editing && styles.selected,
          newEntry && styles.new,
        ]}>
        <Text style={styles.coverText}>
          {newEntry ? 'New Password' : cleanWebsite(website)}
        </Text>
      </View>
      {id === editing && (
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={100 * (index + 1)}
          contentContainerStyle={styles.container}>
          <TextInput
            placeholder="Website"
            autoFocus={website ? website.length === 0 : true}
            style={styles.input}
            onChangeText={(text) => onChangeWebsite(text)}
            value={website}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Username"
            style={styles.input}
            onChangeText={(text) => onChangeUsername(text)}
            value={username}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            onFocus={() => setHidePassword(false)}
            onBlur={() => setHidePassword(true)}
            secureTextEntry={hidePassword}
            onChangeText={(text) => onChangePassword(text)}
            value={password}
            autoCapitalize="none"
          />
          <Text style={styles.delete} onPress={deleteAlert}>
            DELETE
          </Text>
        </KeyboardAvoidingView>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#403F4C',
  },
  cover: {
    borderWidth: 5,
    borderColor: '#F4F9E9',
    borderRadius: 5,
    padding: 20,
    marginVertical: 8,
  },
  coverText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#F4F9E9',
  },
  selected: {
    backgroundColor: '#FF6933',
  },
  new: {
    backgroundColor: '#61CB4A',
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
