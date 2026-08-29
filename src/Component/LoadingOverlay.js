import React, {PureComponent} from 'react';
import Modal from 'react-native-modal';
import {View, ActivityIndicator} from 'react-native';
import LoadingHelper from '../Utils/LoadingHelper';


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
        style={{padding: 0, margin: 0}}
        animationIn="fadeIn"
        animationOut="fadeOut">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
          <View
            style={{
              backgroundColor: '#FFF',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              paddingVertical: 20,
              marginHorizontal: 20,
            }}>
            <ActivityIndicator size="large" color={'#000'} />
          </View>
        </View>
      </Modal>
    );
  }
}

export default LoadingOverlay;
