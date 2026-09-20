import {StyleSheet, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import Text from './Text';
import Button from './Button';

//Global component Modal for alert pop up warning, body can be dynamicly with props

// Usage:
// <AlertModal visible={true} body={'content body'} onClose={() => function for close modal} />

const AlertModal = ({visible, onClose, body, title = 'Notice'}) => {
  return (
    <Modal
      isVisible={visible}
      accessibilityViewIsModal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.65}
      style={styles.modal}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text
            accessibilityRole="header"
            type="semibold"
            style={styles.title}
            size={20}
            textAlign={'center'}>
            {title}
          </Text>
          <Text type="regular" size={14} color="#CED4DA" textAlign={'center'}>
            {body}
          </Text>
          <Button title="OK" buttonStyle={styles.button} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: '#2B3035',
    borderColor: '#495057',
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
  },
});
