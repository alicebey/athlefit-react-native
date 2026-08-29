import {
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  Easing,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/Feather';

// Global component for search bar on header
const SearchBar = ({onClose, value, onChange}) => {
  const fadeAnim = new Animated.Value(0);

  // Animation handler function
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // using use effect so when rendering animation begin
  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Icon onPress={onClose} name={'x'} size={25} color={'#1B4332'} />
      <TextInput value={value} onChangeText={onChange} style={styles.input} />
      <Icon name={'search'} size={25} color={'#1B4332'} />
    </Animated.View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    color: '#000'
  },
});
