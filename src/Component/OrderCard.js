import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from './Text';
import Image from './Image';
import BookingStatusPill from './BookingStatusPill';
import {BOOKING_STATUS_LABELS} from '../Service/bookingService';
import {VENUE_TIME_ZONE_LABEL, formatVenueTime} from '../Utils/VenueTime';
import {venueImageSource} from '../Utils/VenueImage';

// Booking summary card. Times are shown in venue time (WIB), not device time.
const OrderCard = ({onPress, data}) => {
  const when = `${formatVenueTime(
    data.start_at,
    'ddd, DD MMM',
  )} · ${formatVenueTime(data.start_at)}–${formatVenueTime(
    data.end_at,
  )} ${VENUE_TIME_ZONE_LABEL}`;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${data.location_name}, ${when}, ${
        BOOKING_STATUS_LABELS[data.status] || data.status
      }`}
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
          {data.location_name}
        </Text>
        <Text size={13} type="semibold" color="#52B788" numberOfLines={1}>
          {when}
        </Text>
        <BookingStatusPill status={data.status} style={styles.pill} />
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

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
    width: '34%',
    height: undefined,
    aspectRatio: 1,
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
  pill: {
    marginTop: 6,
  },
});
