import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP} from '../Utils/Sizing';

const logoWidth = widthPercentageToDP(48);
const taglineWidth = widthPercentageToDP(32);

// Global component header for logo header
const Header = ({style}) => {
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel="Athlefit. Built Different."
      style={[styles.container, style]}>
      <Image
        source={require('../Assets/ALTHEFIT.png')}
        resizeMode="contain"
        style={styles.logo}
        accessible={false}
      />
      <Image
        source={require('../Assets/SubSplash.png')}
        resizeMode="contain"
        style={styles.tagline}
        accessible={false}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: logoWidth,
    height: logoWidth * (102 / 680),
    alignSelf: 'center',
  },
  tagline: {
    width: taglineWidth,
    height: taglineWidth * (53 / 465),
    alignSelf: 'center',
    marginTop: 6,
  },
});
