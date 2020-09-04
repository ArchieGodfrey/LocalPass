import * as React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import TouchID from 'react-native-touch-id';
import {getData, storeData} from '../helpers';

export default function PasswordModal({navigation, focused, changePassword}) {
  const [locked, setLocked] = React.useState(true);
  const [setup, setSetup] = React.useState({initial: false, post: false});
  const [password, setPassword] = React.useState('');
  const [errorMessage, setError] = React.useState(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);

  // Close modal
  const onClose = () => {
    navigation.setParams({changePassword: false});
    navigation.navigate('Dashboard');
    setModalVisible(!modalVisible);
  };

  // Finish setup
  const onFinalise = () => {
    setSetup({initial: false, post: false});
    storeData('allowTouchID', isEnabled);
    setLocked(false);
    setModalVisible(!modalVisible);
    setPassword('');
  };

  // Try unlock with password
  const onChange = async (text) => {
    setPassword(text);
    if (text === (await getData('masterPassword')) && !setup.initial) {
      if (changePassword) {
        setSetup({initial: true, post: false});
        navigation.setParams({changePassword: false});
      } else {
        setLocked(false);
        setModalVisible(false);
      }
      setPassword('');
    }
  };

  // Allow face/touch id
  const [isEnabled, setIsEnabled] = React.useState(false);
  React.useEffect(() => {
    if (changePassword) {
      setModalVisible(true);
    } else if (locked && focused) {
      setModalVisible(true);
      // Try get master password
      const getPassword = async () => {
        if (await getData('masterPassword')) {
          if ((await getData('allowTouchID')) === true) {
            // Try unlock with face/touch id
            TouchID.isSupported()
              .then(() => {
                TouchID.authenticate(
                  'Unlocks passwords for viewing and editing',
                )
                  .then(() => {
                    setLocked(false);
                    setModalVisible(false);
                  })
                  .catch((error) => {
                    console.warn(error);
                  });
              })
              .catch((error) => {
                console.warn(error);
              });
          }
        } else {
          setSetup({initial: true, post: false});
        }
      };
      getPassword();
    }
  }, [locked, focused, setSetup, changePassword]);

  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          {!setup.post ? (
            <KeyboardAvoidingView style={styles.modalView} behavior="padding">
              <Text style={styles.header}>
                {setup.initial ? 'Set Master Password' : 'Unlock Passwords'}
              </Text>
              <Text style={styles.body}>
                Your master password is used to unlock your passwords for
                editing and viewing
              </Text>
              {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
              ) : (
                <TextInput
                  placeholder="Master Password"
                  style={styles.input}
                  secureTextEntry
                  value={password}
                  onChangeText={onChange}
                />
              )}
              {setup.initial && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if (password.length > 1) {
                      storeData('masterPassword', password);
                      setSetup({initial: true, post: true});
                    } else {
                      setError('Master Password Required');
                      setTimeout(() => {
                        setError(undefined);
                      }, 2000);
                    }
                  }}>
                  <Text style={styles.textStyle}>Save Password</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.textStyle}>Go Back</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          ) : (
            <View style={styles.modalView}>
              <Text style={styles.header}>Finalise Setup</Text>
              <Text style={styles.body}>
                Your master password has been set. Would you like to enable
                Touch ID for faster unlocking?
              </Text>
              <View style={styles.row}>
                <Text style={styles.body}>Allow Touch ID</Text>
                <Switch
                  thumbColor="F4F9E9"
                  trackColor={{false: '#FF6933', true: '#618B4A'}}
                  ios_backgroundColor="#FF6933"
                  onValueChange={(value) => setIsEnabled(value)}
                  value={isEnabled}
                  style={styles.switch}
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={onFinalise}>
                <Text style={styles.textStyle}>Finished</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#403F4C',
  },
  modalView: {
    margin: 20,
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '80%',
    marginVertical: 10,
    backgroundColor: '#FF6933',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: '600',
    color: '#403F4C',
    marginBottom: 15,
    textAlign: 'center',
  },
  body: {
    fontSize: 20,
    color: '#403F4C',
    marginBottom: 15,
    textAlign: 'center',
  },
  error: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'red',
    marginVertical: 27.5,
    textAlign: 'center',
  },
  input: {
    fontSize: 25,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#403F4C',
    color: '#403F4C',
    marginVertical: 25,
    textAlign: 'center',
  },
  switch: {
    marginLeft: 20,
    marginBottom: 16,
  },
});
