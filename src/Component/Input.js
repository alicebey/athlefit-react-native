import {StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import Text from './Text';
import {Fonts} from '../Utils/Fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Global component for input and textinput that is usable for global
const Input = ({
  title = '',
  icon,
  marginBottom = 0,
  isPassword = false,
  onChangeText,
  value,
}) => {
  const [visible, setIsVisible] = useState(false);
  return (
    <View style={[styles.container, {marginBottom: marginBottom}]}>
      <Text type="semibold" size={16}>
        {title}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={isPassword && !visible ? true : false}
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
        />
        {isPassword && (
          <Icon
            name={!visible ? 'visibility' : 'visibility-off'}
            onPress={() => setIsVisible(!visible)}
            size={20}
            color={'#52B788'}
          />
        )}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#52B788',
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  input: {
    paddingVertical: 0,
    paddingHorizontal: 5,
    fontSize: 14,
    fontFamily: Fonts.normal,
    color: '#FFF',
    flex: 1,
  },
});
