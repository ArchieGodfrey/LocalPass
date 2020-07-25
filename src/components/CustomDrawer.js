import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

export default function CustomDrawer(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.border}>
        <Text style={styles.header}>Features</Text>
      </View>
      <DrawerItemList
        {...props}
        labelStyle={styles.item}
        itemStyle={styles.margin}
        activeBackgroundColor="#61AB4A"
        inactiveBackgroundColor="#FF6933AA"
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#403F4C',
    borderLeftWidth: 5,
    borderColor: '#FF6933',
  },
  item: {
    fontSize: 25,
    fontWeight: '500',
    color: '#F4F9E9',
    padding: 5,
  },
  margin: {
    marginBottom: 10,
  },
  border: {
    width: '80%',
    marginBottom: 20,
    borderBottomWidth: 5,
    borderColor: '#F4F9E9',
  },
  header: {
    fontSize: 52,
    fontWeight: '500',
    color: '#F4F9E9',
    paddingBottom: 6,
    marginLeft: 10,
  },
});
