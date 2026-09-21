import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from './Text';
import Image from './Image';
import {AirbnbRating} from 'react-native-ratings';
import {venueImageSource} from '../Utils/VenueImage';

// Global field card component for global usage with dynamic data
const FieldCard = ({onPress, data}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${data?.location_name || 'Venue'}, ${
        data?.location_address || 'address unavailable'
      }, rating ${Number(data?.rating || 0).toFixed(1)} out of 5`}
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.image}>
        <Image
          accessible={false}
          resizeMode="cover"
          source={venueImageSource(data)}
          style={styles.photo}
        />
      </View>
      <View style={styles.textContainer}>
        <Text type="semibold" size={16} numberOfLines={1}>
          {data?.location_name}
        </Text>
        <Text type="regular" numberOfLines={2} color="#ADB5BD" size={13}>
          {data?.location_address}
        </Text>
        <AirbnbRating
          starContainerStyle={styles.rating}
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
    marginBottom: 12,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#343A40',
    backgroundColor: '#2B3035',
  },
  image: {
    width: '38%',
    height: undefined,
    aspectRatio: 4 / 3,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  rating: {
    alignSelf: 'flex-start',
  },
});
