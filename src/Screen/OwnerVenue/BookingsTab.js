import {Alert, ScrollView, RefreshControl, TextInput, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import BookingStatusPill from '../../Component/BookingStatusPill';
import Button from '../../Component/Button';
import Text from '../../Component/Text';
import {currencyFormatter} from '../../Utils/CurrencyFormatter';
import {
  VENUE_TIME_ZONE_LABEL,
  formatVenueTime,
  timeRemaining,
} from '../../Utils/VenueTime';
import {confirmPayment, rejectPayment} from '../../Service/ownerService';
import styles from './styles';

const Row = ({label, value}) => (
  <View style={styles.row}>
    <Text type="regular" size={12} color="#ADB5BD">
      {label}
    </Text>
    <Text
      type="semibold"
      size={12}
      textAlign="right"
      selectable
      style={styles.rowValue}>
      {value}
    </Text>
  </View>
);

const BookingCard = ({booking, onUpdated}) => {
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const reviewable =
    booking.status === 'WAITING_CONFIRMATION' ||
    booking.status === 'PENDING_PAYMENT';

  const run = async action => {
    setBusy(true);
    try {
      onUpdated(await action());
      setRejecting(false);
      setReason('');
    } catch (error) {
      Alert.alert(
        'Could not update booking',
        error.message || 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const onConfirm = () =>
    Alert.alert(
      'Confirm payment?',
      `Only confirm after IDR ${currencyFormatter(
        booking.total_price,
      )} has arrived in your account.`,
      [
        {text: 'Not yet', style: 'cancel'},
        {
          text: 'Payment received',
          onPress: () => run(() => confirmPayment(booking.id)),
        },
      ],
    );

  const onReject = () => {
    if (!reason.trim()) {
      Alert.alert(
        'Reason needed',
        'Tell the customer why the payment was rejected.',
      );
      return;
    }
    run(() => rejectPayment(booking.id, reason.trim()));
  };

  const remaining = timeRemaining(booking.payment_deadline);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text type="semibold" size={15} style={styles.flex}>
          {formatVenueTime(booking.start_at, 'ddd, DD MMM')} ·{' '}
          {formatVenueTime(booking.start_at)}–{formatVenueTime(booking.end_at)}{' '}
          {VENUE_TIME_ZONE_LABEL}
        </Text>
        <BookingStatusPill status={booking.status} />
      </View>
      <Row label="Customer" value={booking.customer?.fullName || '—'} />
      {booking.customer?.phone ? (
        <Row label="Phone" value={booking.customer.phone} />
      ) : null}
      <Row
        label="Sport · court"
        value={`${booking.category} · ${booking.court_name}`}
      />
      <Row
        label="Amount"
        value={`IDR ${currencyFormatter(booking.total_price)}`}
      />
      {booking.status === 'PENDING_PAYMENT' ? (
        <Row
          label="Payment due"
          value={remaining ? `in ${remaining}` : 'overdue'}
        />
      ) : null}
      {booking.payment_submitted_at ? (
        <>
          <Row
            label="Paid from"
            value={`${booking.payer_name} (${booking.payer_bank})`}
          />
          {booking.payment_reference ? (
            <Row label="Reference" value={booking.payment_reference} />
          ) : null}
        </>
      ) : null}
      {booking.refund_required ? (
        <Text type="semibold" size={12} color="#FF8787" style={styles.cardNote}>
          Cancelled by the customer after paying — refund the transfer.
        </Text>
      ) : null}
      {booking.cancellation_reason && booking.cancelled_by === 'OWNER' ? (
        <Text type="regular" size={12} color="#ADB5BD" style={styles.cardNote}>
          Rejected: {booking.cancellation_reason}
        </Text>
      ) : null}

      {reviewable ? (
        rejecting ? (
          <View style={styles.rejectBox}>
            <TextInput
              accessibilityLabel="Reason for rejecting the payment"
              value={reason}
              onChangeText={setReason}
              placeholder="e.g. Transfer not found in our account"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={styles.textInput}
              maxLength={500}
            />
            <View style={styles.buttonRow}>
              <Button
                title="Back"
                backgroundColor="#343A40"
                disabled={busy}
                onPress={() => setRejecting(false)}
                buttonStyle={styles.smallButton}
              />
              <Button
                title={busy ? 'Rejecting…' : 'Reject payment'}
                backgroundColor="#3A2527"
                titleColor="#FF8787"
                disabled={busy}
                onPress={onReject}
                buttonStyle={[styles.smallButton, styles.buttonGap]}
              />
            </View>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <Button
              title="Reject"
              backgroundColor="#343A40"
              titleColor="#FF8787"
              disabled={busy}
              onPress={() => setRejecting(true)}
              buttonStyle={styles.smallButton}
            />
            <Button
              title={
                busy
                  ? 'Saving…'
                  : booking.status === 'PENDING_PAYMENT'
                  ? 'Mark as paid'
                  : 'Confirm payment'
              }
              disabled={busy}
              onPress={onConfirm}
              buttonStyle={[styles.smallButton, styles.buttonGap]}
            />
          </View>
        )
      ) : null}
    </View>
  );
};

const Section = ({title, hint, items, onUpdated}) =>
  items.length ? (
    <View style={styles.section}>
      <Text type="semibold" size={18}>
        {title} ({items.length})
      </Text>
      {hint ? (
        <Text
          type="regular"
          size={12}
          color="#868E96"
          style={styles.sectionHint}>
          {hint}
        </Text>
      ) : null}
      {items.map(item => (
        <BookingCard key={item.id} booking={item} onUpdated={onUpdated} />
      ))}
    </View>
  ) : null;

const BookingsTab = ({bookings, loading, onRefresh, onBookingUpdated}) => {
  const groups = useMemo(() => {
    const byStart = (a, b) => a.order_time.seconds - b.order_time.seconds;
    const now = Date.now();
    return {
      review: bookings
        .filter(item => item.status === 'WAITING_CONFIRMATION')
        .sort(byStart),
      unpaid: bookings
        .filter(item => item.status === 'PENDING_PAYMENT')
        .sort(byStart),
      confirmed: bookings
        .filter(
          item =>
            item.status === 'CONFIRMED' && item.end_time.seconds * 1000 > now,
        )
        .sort(byStart),
      refunds: bookings.filter(item => item.refund_required).sort(byStart),
    };
  }, [bookings]);
  const empty =
    !groups.review.length &&
    !groups.unpaid.length &&
    !groups.confirmed.length &&
    !groups.refunds.length;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor="#52B788"
          colors={['#52B788']}
        />
      }>
      <Section
        title="Payments to review"
        hint="Check your bank account, then confirm or reject each transfer."
        items={groups.review}
        onUpdated={onBookingUpdated}
      />
      <Section
        title="Awaiting payment"
        hint="Unpaid bookings are released automatically after 30 minutes."
        items={groups.unpaid}
        onUpdated={onBookingUpdated}
      />
      <Section
        title="Refunds to send"
        items={groups.refunds}
        onUpdated={onBookingUpdated}
      />
      <Section
        title="Upcoming confirmed"
        items={groups.confirmed}
        onUpdated={onBookingUpdated}
      />
      {empty && !loading ? (
        <View style={styles.state}>
          <Text type="semibold" size={16}>
            No upcoming bookings
          </Text>
          <Text
            type="regular"
            size={13}
            color="#ADB5BD"
            textAlign="center"
            style={styles.stateText}>
            New bookings for this venue will appear here.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default BookingsTab;
