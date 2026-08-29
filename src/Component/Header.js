import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Image from './Image';
import {widthPercentageToDP} from '../Utils/Sizing';


// Global component header for logo header
const Header = ({style}) => {
  return (
    <View style={[styles.titleContainer, style]}>
      <View style={styles.title}>
        <Image source={require('../Assets/ALTHEFIT.png')} />
      </View>
      <View style={styles.subTitle}>
        <Image source={require('../Assets/SubSplash.png')} />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  title: {
    width: widthPercentageToDP(20),
    height: undefined,
    aspectRatio: 21 / 9,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  subTitle: {
    width: widthPercentageToDP(10),
    height: undefined,
    aspectRatio: 21 / 9,
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 150,
  },
});
