import * as React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

export default function NewItem({title, onPress}) {
  return (
    <TouchableOpacity style={styles.dottedContainer} onPress={onPress}>
      <View style={styles.inner}>
        <FontAwesomeIcon icon={faPlus} color="#F4F9E9" />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dottedContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F4F9E9',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 32,
    fontWeight: '600',
    color: '#F4F9E9',
    padding: 10,
  },
});
