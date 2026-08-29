import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from './Text';
import Image from './Image';
import {AirbnbRating} from 'react-native-ratings';
import {widthPercentageToDP} from '../Utils/Sizing';
import moment from 'moment';

// Global component for order card with dynamic data
const OrderCard = ({onPress, data}) => {
  const dateTime = new Date(data.order_time.seconds * 1000);
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.image}>
        <Image source={{uri: data.image_url}} />
      </View>
      <View style={styles.textContainer}>
        <Text type="bold" size={16}>
          {data.location_name}
        </Text>
        <Text type="regular" numberOfLines={2} maxWidth={'80%'} size={14}>
          {data.location_address}
        </Text>
        <Text size={16} type="regular">
          {moment(dateTime).format('DD MMM YYYY')} (
          {moment(dateTime).format('HH:mm')})
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

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
