import * as React from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TextInput,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

export function SearchBar({search, onChangeText}) {
  // Set widths for bar
  const minWidth = Dimensions.get('window').width * 0.35;
  const maxWidth = Dimensions.get('window').width * 0.9;

  // Search bar scale animation
  const widthAnimate = new Animated.Value(minWidth);
  const animate = (value) => {
    Animated.timing(widthAnimate, {
      toValue: value,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.elastic(1),
    }).start();
  };
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: widthAnimate,
        },
      ]}>
      <FontAwesomeIcon icon={faSearch} size={20} style={styles.searchIcon} />
      <TextInput
        onFocus={() => animate(maxWidth)}
        onBlur={() => animate(minWidth)}
        placeholder="Search"
        placeholderTextColor="#F4F9E9"
        style={styles.search}
        onChangeText={(text) => onChangeText(text)}
        value={search}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 5,
    borderColor: '#F4F9E9',
    paddingVertical: 5,
  },
  search: {
    fontSize: 32,
    fontWeight: '600',
    color: '#F4F9E9',
    width: '100%',
  },
  searchIcon: {
    color: '#F4F9E9',
    marginRight: 5,
  },
});
