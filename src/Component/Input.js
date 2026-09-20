import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Text from './Text';
import {Fonts} from '../Utils/Fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Global component for input and textinput that is usable for global
const Input = ({
  title = '',
  marginBottom = 0,
  isPassword = false,
  onChangeText,
  value,
  keyboardType = 'default',
  placeholder,
  autoCapitalize = 'sentences',
  accessibilityLabel,
  ...inputProps
}) => {
  const [visible, setIsVisible] = useState(false);
  return (
    <View style={[styles.container, {marginBottom: marginBottom}]}>
      <Text type="semibold" size={16}>
        {title}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          {...inputProps}
          accessibilityLabel={accessibilityLabel || title}
          secureTextEntry={isPassword && !visible}
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          autoCapitalize={autoCapitalize}
        />
        {isPassword && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            onPress={() => setIsVisible(!visible)}
            style={styles.visibilityButton}>
            <Icon
              name={!visible ? 'visibility' : 'visibility-off'}
              size={20}
              color={'#52B788'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#495057',
    backgroundColor: '#2B3035',
    borderRadius: 12,
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    fontSize: 14,
    fontFamily: Fonts.normal,
    color: '#FFF',
    flex: 1,
  },
  visibilityButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
    marginRight: -12,
  },
});
