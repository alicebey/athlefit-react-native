import {StyleSheet, TouchableOpacity} from 'react-native';
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
  accessibilityHint,
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled}}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        {backgroundColor},
        disabled && styles.disabled,
        buttonStyle,
      ]}>
      <Text type="semibold" size={16} color={titleColor}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});
