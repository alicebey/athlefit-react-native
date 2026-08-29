import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from './Text';
import Image from './Image';
import {AirbnbRating} from 'react-native-ratings';
import {widthPercentageToDP} from '../Utils/Sizing';

// Global field card component for global usage with dynamic data
const FieldCard = ({onPress, data}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.image}>
        <Image source={{uri: data?.image_url}} />
      </View>
      <View style={styles.textContainer}>
        <Text type="bold" size={16}>
          {data?.location_name}
        </Text>
        <Text type="regular" numberOfLines={2} maxWidth={'75%'} size={14}>
          {data?.location_address}
        </Text>
        <AirbnbRating
          starContainerStyle={{alignSelf: 'flex-start'}}
          count={5}
          isDisabled={true}
          showRating={false}
          size={15}
          defaultRating={data?.rating}
        />
      </View>
    </TouchableOpacity>
  );
};

export default FieldCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  image: {
    width: widthPercentageToDP(35),
    height: undefined,
    aspectRatio: 16 / 9,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'space-between',
  },
});
