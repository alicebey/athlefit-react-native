import React, {PureComponent} from 'react';
import Modal from 'react-native-modal';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import LoadingHelper from '../Utils/LoadingHelper';
import Text from './Text';

// a loading component that can be showing with bind method for globally
class LoadingOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {
    LoadingHelper.setInstance(this);
  }

  show() {
    this.setState({visible: true});
  }

  hide() {
    this.setState({visible: false});
  }

  render() {
    const {visible} = this.state;
    return (
      <Modal
        isVisible={visible}
        accessibilityViewIsModal
        backdropOpacity={0.65}
        style={styles.modal}
        animationIn="fadeIn"
        animationOut="fadeOut">
        <View style={styles.container}>
          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
            style={styles.wrapper}>
            <ActivityIndicator size="large" color="#52B788" />
            <Text type="semibold" size={14} style={styles.label}>
              Loading…
            </Text>
          </View>
        </View>
      </Modal>
    );
  }
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B3035',
    borderColor: '#495057',
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
  },
  label: {
    marginTop: 12,
  },
});
