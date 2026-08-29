import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from './Text';


// Global component for default button with dynamic props for title, background and other style including disable status
const Button = ({
  backgroundColor = '#52B788',
  title = '',
  onPress,
  buttonStyle,
  titleColor = '#FFF',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        {backgroundColor: backgroundColor, opacity: disabled ? 0.5 : 1},
        buttonStyle,
      ]}>
      <Text type="bold" size={24} color={titleColor}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
});
