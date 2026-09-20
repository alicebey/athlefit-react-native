import {StyleSheet, Image as NativeImage} from 'react-native';
import React from 'react';

// Global component Image for usage globally with default style and can be dynamicly change with props style
const Image = ({source, style, resizeMode = 'contain', ...props}) => {
  return (
    <NativeImage
      {...props}
      source={source}
      resizeMode={resizeMode}
      style={[styles.image, style]}
    />
  );
};

export default Image;

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});
