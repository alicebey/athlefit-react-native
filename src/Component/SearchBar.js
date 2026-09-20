import {Animated, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {Fonts} from '../Utils/Fonts';

const clearHitSlop = {top: 10, right: 10, bottom: 10, left: 10};

// Global component for search bar on header
const SearchBar = ({
  onClose,
  value,
  onChange,
  autoFocus = false,
  alwaysShowClose = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Icon name="search" size={21} color="#ADB5BD" />
      <TextInput
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChange}
        placeholder="Search venues or locations"
        placeholderTextColor="#868E96"
        returnKeyType="search"
        accessibilityLabel="Search venues or locations"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      {value || alwaysShowClose ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={value ? 'Clear search' : 'Close search'}
          onPress={onClose}
          hitSlop={clearHitSlop}>
          <Icon name="x" size={20} color="#ADB5BD" />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#343A40',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#495057',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginLeft: 14,
    minHeight: 48,
    flex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#F8F9FA',
    fontFamily: Fonts.normal,
    fontSize: 14,
  },
});
