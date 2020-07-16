import * as React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';

export default function Header({onPress}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.section} />
      <Text style={styles.header}>LocalPass</Text>
      <TouchableOpacity style={styles.section} onPress={onPress}>
        <FontAwesomeIcon icon={faBars} size={30} color="#F4F9E9" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#403F4C',
    borderBottomWidth: 5,
    borderColor: '#F4F9E9',
  },
  header: {
    fontSize: 52,
    fontWeight: '500',
    color: '#F4F9E9',
    textAlign: 'center',
    padding: 5,
  },
  section: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 15,
  },
});
