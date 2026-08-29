import {StyleSheet, Text, View, Image as NativeImage} from 'react-native';
import React from 'react';


// Global component Image for usage globally with default style and can be dynamicly change with props style
const Image = ({source, style}) => {
  return <NativeImage source={source} style={[style, styles.image]} />;
};

export default Image;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
});
