import {StyleSheet, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import Text from './Text';
import Button from './Button';

//Global component Modal for alert pop up warning, body can be dynamicly with props

// Usage: 
// <AlertModal visible={true} body={'content body'} onClose={() => function for close modal} />

const AlertModal = ({visible, onClose, body}) => {
  return (
    <Modal
      isVisible={visible}
      style={{padding: 0, margin: 0}}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text
            type="bold"
            style={{marginBottom: 10}}
            size={24}
            color={'#000'}
            textAlign={'center'}>
            Alert!
          </Text>
          <Text type="semibold" size={20} color={'#000'} textAlign={'center'}>
            {body}
          </Text>
          <Button title="Oke" buttonStyle={styles.button} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  button: {
    marginHorizontal: 20,
    marginTop: 15,
  },
});
