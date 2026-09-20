import {StyleSheet, View} from 'react-native';
import React from 'react';
import Text from './Text';
import {BOOKING_STATUS_LABELS} from '../Service/bookingService';

export const STATUS_COLORS = {
  PENDING_PAYMENT: {text: '#F4C95D', background: 'rgba(244, 201, 93, 0.14)'},
  WAITING_CONFIRMATION: {
    text: '#74C0FC',
    background: 'rgba(116, 192, 252, 0.14)',
  },
  CONFIRMED: {text: '#74C69D', background: 'rgba(82, 183, 136, 0.16)'},
  CANCELLED: {text: '#ADB5BD', background: 'rgba(173, 181, 189, 0.12)'},
  EXPIRED: {text: '#ADB5BD', background: 'rgba(173, 181, 189, 0.12)'},
};

// Small coloured label describing where a booking is in its lifecycle.
const BookingStatusPill = ({status, style}) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.CANCELLED;
  const label = BOOKING_STATUS_LABELS[status] || status;
  return (
    <View
      accessibilityLabel={`Booking status: ${label}`}
      style={[styles.pill, {backgroundColor: colors.background}, style]}>
      <View style={[styles.dot, {backgroundColor: colors.text}]} />
      <Text type="semibold" size={11} color={colors.text}>
        {label}
      </Text>
    </View>
  );
};

export default BookingStatusPill;

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: {
    width: 6,
    height: 6,
    marginRight: 6,
    borderRadius: 3,
  },
});
