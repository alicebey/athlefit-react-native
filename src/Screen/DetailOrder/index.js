import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BookingStatusPill from '../../Component/BookingStatusPill';
import Button from '../../Component/Button';
import Image from '../../Component/Image';
import Input from '../../Component/Input';
import Text from '../../Component/Text';
import {currencyFormatter} from '../../Utils/CurrencyFormatter';
import {
  VENUE_TIME_ZONE_LABEL,
  formatDuration,
  formatVenueTime,
  timeRemaining,
} from '../../Utils/VenueTime';
import {useSessionStore} from '../../Service/sessionStore';
import {
  cancelBooking,
  getBooking,
  isActiveBooking,
  submitPayment,
} from '../../Service/bookingService';
import styles from './styles';
import {venueImageSource} from '../../Utils/VenueImage';

const Notice = ({icon, color = '#ADB5BD', title, children}) => (
  <View accessibilityLiveRegion="polite" style={styles.notice}>
    <Icon name={icon} size={22} color={color} />
    <View style={styles.noticeCopy}>
      {title ? (
        <Text type="semibold" size={14}>
          {title}
        </Text>
      ) : null}
      <Text type="regular" size={12} color="#ADB5BD" style={styles.noticeBody}>
        {children}
      </Text>
    </View>
  </View>
);

const DetailRow = ({label, value, selectable}) => (
  <View style={styles.detailRow}>
    <Text type="regular" size={13} color="#ADB5BD">
      {label}
    </Text>
    <Text
      selectable={selectable}
      type="semibold"
      size={13}
      textAlign="right"
      style={styles.detailValue}>
      {value}
    </Text>
  </View>
);

const DetailOrder = ({route}) => {
  const navigation = useNavigation();
  const {username} = useSessionStore();
  const [booking, setBooking] = useState(route.params?.data);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [payerName, setPayerName] = useState(username || '');
  const [payerBank, setPayerBank] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const bookingId = booking?.id;

  const refresh = useCallback(async () => {
    if (!bookingId) {
      return;
    }
    try {
      setBooking(await getBooking(bookingId));
    } catch (error) {
      console.log(error, 'error refreshing booking');
    }
  }, [bookingId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  // Keeps the payment countdown current and picks up automatic expiry.
  const isPending = booking?.status === 'PENDING_PAYMENT';
  const deadline = booking?.payment_deadline;
  useEffect(() => {
    if (!isPending) {
      return undefined;
    }
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (deadline && !timeRemaining(deadline, current)) {
        refresh();
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [isPending, deadline, refresh]);

  if (!booking) {
    return (
      <SafeAreaView style={styles.fallback}>
        <Icon name="error-outline" size={44} color="#6C757D" />
        <Text type="semibold" size={18} style={styles.fallbackTitle}>
          Booking unavailable
        </Text>
        <Text type="regular" size={13} color="#ADB5BD" textAlign="center">
          This booking could not be opened. Please return and try again.
        </Text>
        <Button
          title="Go back"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.fallbackButton}
        />
      </SafeAreaView>
    );
  }

  const status = booking.status;
  const remaining = timeRemaining(booking.payment_deadline, now);
  const account = booking.payment_account;

  const openUrl = async url => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Could not open link', 'Please try again in a moment.');
    }
  };

  const openMap = () => {
    const latitude = Number(booking.location_map?.latitude);
    const longitude = Number(booking.location_map?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert(
        'Location unavailable',
        'This venue has no map location yet.',
      );
      return;
    }
    const coordinates = `${latitude},${longitude}`;
    const label = encodeURIComponent(booking.location_name);
    openUrl(
      Platform.OS === 'android'
        ? `geo:${coordinates}?q=${coordinates}(${label})`
        : `maps:0,0?q=${label}@${coordinates}`,
    );
  };

  const contactVenue = () => {
    const digits = (booking.phone || '').replace(/\D/g, '');
    if (!digits) {
      return;
    }
    const international = digits.startsWith('0')
      ? `62${digits.slice(1)}`
      : digits;
    openUrl(`https://wa.me/${international}`);
  };

  const onSubmitPayment = async () => {
    if (!payerName.trim() || !payerBank.trim()) {
      Alert.alert(
        'Payment details needed',
        'Enter the account holder name and the bank you transferred from.',
      );
      return;
    }
    setIsPaying(true);
    try {
      setBooking(
        await submitPayment(booking.id, {
          payerName: payerName.trim(),
          payerBank: payerBank.trim(),
          paymentReference: paymentReference.trim() || null,
        }),
      );
    } catch (error) {
      Alert.alert(
        'Could not send payment details',
        error.message || 'Something went wrong. Please try again.',
      );
      refresh();
    } finally {
      setIsPaying(false);
    }
  };

  const submitCancellation = async () => {
    setIsCancelling(true);
    try {
      const cancelled = await cancelBooking(booking.id);
      setBooking(cancelled);
      Alert.alert(
        'Booking cancelled',
        cancelled.refund_required
          ? 'Your court was released. The venue will refund your transfer.'
          : 'Your court was released.',
      );
    } catch (error) {
      Alert.alert(
        'Could not cancel booking',
        error.message || 'Something went wrong. Please try again.',
      );
      refresh();
    } finally {
      setIsCancelling(false);
    }
  };

  const confirmCancellation = () => {
    Alert.alert(
      'Cancel this booking?',
      booking.payment_submitted_at || booking.payment_confirmed_at
        ? 'Your court will be released and the venue will refund your transfer. This cannot be undone.'
        : 'Your court will be released. This cannot be undone.',
      [
        {text: 'Keep booking', style: 'cancel'},
        {
          text: 'Cancel booking',
          style: 'destructive',
          onPress: submitCancellation,
        },
      ],
    );
  };

  const renderStatusNotice = () => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return (
          <Notice
            icon="timer"
            color="#F4C95D"
            title={
              route.params?.justBooked
                ? 'Court reserved — complete your payment'
                : 'Waiting for your payment'
            }>
            {remaining
              ? `Transfer the total within ${remaining} (before ${formatVenueTime(
                  booking.payment_deadline,
                )} ${VENUE_TIME_ZONE_LABEL}). Unpaid bookings are released automatically.`
              : 'The payment window is closing. Refreshing…'}
          </Notice>
        );
      case 'WAITING_CONFIRMATION':
        return (
          <Notice
            icon="hourglass-top"
            color="#74C0FC"
            title="Payment in review">
            The venue is checking your transfer. Your court stays reserved and
            this booking changes to Confirmed once they verify it.
          </Notice>
        );
      case 'CONFIRMED':
        return (
          <Notice icon="check-circle" color="#52B788" title="You're all set">
            Payment received. Show this booking at the venue when you arrive.
          </Notice>
        );
      case 'EXPIRED':
        return (
          <Notice icon="timer-off" title="Payment window closed">
            No payment was received in time, so the court was released. You can
            book again if the time is still free.
          </Notice>
        );
      default:
        if (booking.cancelled_by === 'OWNER') {
          return (
            <Notice icon="report" color="#FF8787" title="Payment rejected">
              {booking.cancellation_reason ||
                'The venue could not verify your transfer.'}{' '}
              Contact the venue if you believe this is a mistake.
            </Notice>
          );
        }
        return (
          <Notice icon="info-outline" title="Booking cancelled">
            {booking.refund_required
              ? 'The venue will refund your transfer. Contact them if you have not heard back within 2 working days.'
              : 'This booking no longer reserves a court.'}
          </Notice>
        );
    }
  };

  const renderPayment = () => {
    if (status === 'PENDING_PAYMENT') {
      return (
        <View style={styles.card}>
          <Text type="semibold" size={18} style={styles.cardTitle}>
            Pay by bank transfer
          </Text>
          {account ? (
            <>
              <DetailRow label="Bank" value={account.bankName} />
              <DetailRow
                label="Account number"
                value={account.accountNumber}
                selectable
              />
              <DetailRow label="Account name" value={account.accountHolder} />
              <DetailRow
                label="Amount"
                value={`IDR ${currencyFormatter(booking.total_price)}`}
                selectable
              />
            </>
          ) : (
            <Text type="regular" size={13} color="#ADB5BD">
              This venue has not added transfer details yet. Contact the venue
              for payment instructions, then confirm below.
            </Text>
          )}

          <Text type="semibold" size={15} style={styles.formTitle}>
            After transferring, tell the venue
          </Text>
          <Input
            title="Account holder name"
            value={payerName}
            onChangeText={setPayerName}
            placeholder="Name on your bank account"
            autoCapitalize="words"
            marginBottom={12}
          />
          <Input
            title="Your bank"
            value={payerBank}
            onChangeText={setPayerBank}
            placeholder="e.g. BCA, Mandiri, GoPay"
            autoCapitalize="words"
            marginBottom={12}
          />
          <Input
            title="Transfer reference (optional)"
            value={paymentReference}
            onChangeText={setPaymentReference}
            placeholder="Reference number from your receipt"
            autoCapitalize="none"
          />
          <Button
            accessibilityHint="Sends your transfer details to the venue for confirmation"
            disabled={isPaying || !remaining}
            onPress={onSubmitPayment}
            title={isPaying ? 'Sending…' : "I've transferred the payment"}
            buttonStyle={styles.payButton}
          />
        </View>
      );
    }
    if (booking.payment_submitted_at) {
      return (
        <View style={styles.card}>
          <Text type="semibold" size={18} style={styles.cardTitle}>
            Payment
          </Text>
          <DetailRow label="Paid from" value={booking.payer_name || '—'} />
          <DetailRow label="Bank" value={booking.payer_bank || '—'} />
          {booking.payment_reference ? (
            <DetailRow label="Reference" value={booking.payment_reference} />
          ) : null}
          <DetailRow
            label="Sent at"
            value={`${formatVenueTime(
              booking.payment_submitted_at,
              'DD MMM, HH:mm',
            )} ${VENUE_TIME_ZONE_LABEL}`}
          />
          {booking.payment_confirmed_at ? (
            <DetailRow
              label="Confirmed at"
              value={`${formatVenueTime(
                booking.payment_confirmed_at,
                'DD MMM, HH:mm',
              )} ${VENUE_TIME_ZONE_LABEL}`}
            />
          ) : null}
        </View>
      );
    }
    return null;
  };

  const cancellationHint = () => {
    if (!isActiveBooking(booking)) {
      return null;
    }
    if (booking.cancellable) {
      return status === 'PENDING_PAYMENT'
        ? 'You can cancel for free until you pay.'
        : `Free cancellation until ${formatVenueTime(
            booking.cancellable_until,
            'DD MMM, HH:mm',
          )} ${VENUE_TIME_ZONE_LABEL}.`;
    }
    return 'Cancellation is closed less than 2 hours before the start time. Contact the venue if you cannot make it.';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Image
              accessibilityLabel={`${booking.location_name} venue`}
              source={venueImageSource(booking)}
              resizeMode="cover"
              style={styles.heroImage}
            />
            <View style={styles.heroShade} />
            <TouchableOpacity
              accessibilityLabel="Go back"
              accessibilityRole="button"
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <BookingStatusPill status={status} />
            <Text
              accessibilityRole="header"
              type="semibold"
              size={28}
              style={styles.heading}>
              {booking.location_name}
            </Text>
            <View style={styles.addressRow}>
              <Icon name="place" size={20} color="#52B788" />
              <Text
                type="regular"
                size={13}
                color="#CED4DA"
                style={styles.addressText}>
                {booking.location_address}
              </Text>
            </View>

            {renderStatusNotice()}

            <View style={styles.card}>
              <Text type="semibold" size={18} style={styles.cardTitle}>
                Booking details
              </Text>
              <DetailRow
                label="Booking for"
                value={booking.customer?.fullName || username || 'You'}
              />
              <DetailRow
                label="Date"
                value={formatVenueTime(booking.start_at, 'ddd, DD MMM YYYY')}
              />
              <DetailRow
                label="Time"
                value={`${formatVenueTime(booking.start_at)}–${formatVenueTime(
                  booking.end_at,
                )} ${VENUE_TIME_ZONE_LABEL}`}
              />
              <DetailRow
                label="Duration"
                value={formatDuration(booking.duration)}
              />
              <DetailRow
                label="Court"
                value={booking.court_name || 'Assigned by venue'}
              />
              <DetailRow
                label={status === 'CONFIRMED' ? 'Total paid' : 'Total'}
                value={`IDR ${currencyFormatter(booking.total_price)}`}
              />
            </View>

            {renderPayment()}

            <View style={styles.actionsRow}>
              <Button
                accessibilityHint="Opens this venue in your maps app"
                backgroundColor="#2B3035"
                buttonStyle={styles.secondaryButton}
                onPress={openMap}
                title="Directions"
                titleColor="#52B788"
              />
              {booking.phone ? (
                <Button
                  accessibilityHint="Opens WhatsApp to message the venue"
                  backgroundColor="#2B3035"
                  buttonStyle={[styles.secondaryButton, styles.actionSpacing]}
                  onPress={contactVenue}
                  title="Contact venue"
                  titleColor="#52B788"
                />
              ) : null}
            </View>

            {booking.cancellable ? (
              <Button
                accessibilityHint="Asks for confirmation before cancelling"
                backgroundColor="#212529"
                buttonStyle={styles.cancelButton}
                disabled={isCancelling}
                onPress={confirmCancellation}
                title={isCancelling ? 'Cancelling…' : 'Cancel booking'}
                titleColor="#FF8787"
              />
            ) : null}
            {cancellationHint() ? (
              <Text
                type="regular"
                size={12}
                color="#868E96"
                textAlign="center"
                style={styles.cancelHint}>
                {cancellationHint()}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DetailOrder;
