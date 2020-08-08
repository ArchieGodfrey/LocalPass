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

export default function SearchBar({search, onChangeText}) {
  // Set widths for bar
  const minWidth = Dimensions.get('window').width * 0.35;
  const maxWidth = Dimensions.get('window').width * 0.9;

  // Search bar scale animation
  const width = React.useRef(new Animated.Value(minWidth)).current;

  // Search bar colour animation
  const colorAnimate = React.useRef(new Animated.Value(0)).current;
  const borderColor = colorAnimate.interpolate({
    inputRange: [0, 255],
    outputRange: ['rgba(244, 249, 233, 1)', 'rgba(255, 105, 51, 1)'],
  });

  const animate = (value, animateValue) => {
    Animated.timing(animateValue, {
      toValue: value,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.elastic(1),
    }).start();
  };

  const onChange = (text) => {
    if (text.length > 0) {
      animate(maxWidth, width);
    } else {
      animate(minWidth, width);
    }
    onChangeText(text);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          borderColor,
        },
      ]}>
      <FontAwesomeIcon icon={faSearch} size={20} style={styles.searchIcon} />
      <TextInput
        onFocus={() => animate(255, colorAnimate)}
        onBlur={() => animate(0, colorAnimate)}
        placeholder="Search"
        placeholderTextColor="#F4F9E9"
        style={styles.search}
        onChangeText={(text) => onChange(text)}
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
