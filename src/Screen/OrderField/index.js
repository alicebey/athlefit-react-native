import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Button from '../../Component/Button';
import Image from '../../Component/Image';
import Text from '../../Component/Text';
import {currencyFormatter} from '../../Utils/CurrencyFormatter';
import {
  VENUE_TIME_ZONE_LABEL,
  formatDuration,
  upcomingVenueDates,
} from '../../Utils/VenueTime';
import {useSessionStore} from '../../Service/sessionStore';
import {createBooking} from '../../Service/bookingService';
import {getVenueAvailability} from '../../Service/venueService';
import styles from './styles';

const DURATIONS = [1, 2, 3];
const BOOKABLE_DAYS = 14;
const PAYMENT_WINDOW_MINUTES = 30;

const dateLabel = (value, index) => {
  if (index === 0) {
    return 'Today';
  }
  if (index === 1) {
    return 'Tomorrow';
  }
  return moment(value, 'YYYY-MM-DD').format('ddd');
};

const OrderField = ({route}) => {
  const location = route.params?.location;
  const navigation = useNavigation();
  const {username} = useSessionStore();
  const sports = useMemo(() => {
    if (location?.sports?.length) {
      return location.sports;
    }
    return location
      ? [
          {
            slug: location.category,
            name: location.category,
            hourly_rate: location.hourly_rate,
          },
        ]
      : [];
  }, [location]);
  const dates = useMemo(() => upcomingVenueDates(BOOKABLE_DAYS), []);
  const [sportSlug, setSportSlug] = useState(
    route.params?.sport || location?.category || sports[0]?.slug,
  );
  const [date, setDate] = useState(dates[0]);
  const [durationHours, setDurationHours] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAvailability = useCallback(async () => {
    if (!location?.id || !sportSlug) {
      return;
    }
    setLoadingSlots(true);
    setSlotError(null);
    setSelectedSlot(null);
    try {
      setAvailability(
        await getVenueAvailability({
          venueId: location.id,
          sport: sportSlug,
          date,
          durationHours,
        }),
      );
    } catch (error) {
      setAvailability(null);
      setSlotError(error.message || 'Could not load available times.');
    } finally {
      setLoadingSlots(false);
    }
  }, [location, sportSlug, date, durationHours]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const onSubmit = async () => {
    if (!selectedSlot) {
      return;
    }
    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        venueId: location.id,
        sportSlug,
        startAt: selectedSlot.startAt,
        durationHours,
      });
      navigation.replace('Detail Order', {data: booking, justBooked: true});
    } catch (error) {
      Alert.alert(
        'Could not reserve this time',
        error.message || 'Something went wrong. Please try again.',
      );
      if (error.status === 409) {
        loadAvailability();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!location) {
    return (
      <SafeAreaView style={styles.fallback}>
        <Icon name="error-outline" size={44} color="#6C757D" />
        <Text type="semibold" size={18} style={styles.fallbackTitle}>
          Venue unavailable
        </Text>
        <Text type="regular" size={13} color="#ADB5BD" textAlign="center">
          Booking details could not be loaded. Please return and try again.
        </Text>
        <Button
          title="Go back"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.fallbackButton}
        />
      </SafeAreaView>
    );
  }

  const selectedSport = sports.find(sport => sport.slug === sportSlug);
  const hourlyRate = Number(
    availability?.hourlyRate ?? selectedSport?.hourly_rate ?? 0,
  );
  const total = hourlyRate * durationHours;
  const slots = availability?.slots || [];
  const hasFreeSlot = slots.some(slot => slot.status === 'AVAILABLE');

  const renderSlots = () => {
    if (loadingSlots) {
      return (
        <View style={styles.slotState}>
          <ActivityIndicator color="#52B788" />
        </View>
      );
    }
    if (slotError) {
      return (
        <View style={styles.slotState}>
          <Icon name="cloud-off" size={28} color="#6C757D" />
          <Text
            type="regular"
            size={13}
            color="#ADB5BD"
            textAlign="center"
            style={styles.slotStateText}>
            {slotError}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={loadAvailability}
            style={styles.retry}>
            <Text type="semibold" size={14} color="#52B788">
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (availability && !availability.open) {
      return (
        <View style={styles.slotState}>
          <Icon name="event-busy" size={28} color="#6C757D" />
          <Text
            type="regular"
            size={13}
            color="#ADB5BD"
            textAlign="center"
            style={styles.slotStateText}>
            The venue is closed on this day. Pick another date.
          </Text>
        </View>
      );
    }
    if (!slots.length || !hasFreeSlot) {
      return (
        <View style={styles.slotState}>
          <Icon name="hourglass-empty" size={28} color="#6C757D" />
          <Text
            type="regular"
            size={13}
            color="#ADB5BD"
            textAlign="center"
            style={styles.slotStateText}>
            No free {formatDuration(durationHours)} slots left on this day. Try
            a shorter duration or another date.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.slotGrid}>
        {slots.map(slot => {
          const available = slot.status === 'AVAILABLE';
          const selected = selectedSlot?.startAt === slot.startAt;
          const caption =
            slot.status === 'PAST'
              ? 'Passed'
              : slot.status === 'FULL'
              ? 'Full'
              : `${slot.availableCourts} ${
                  slot.availableCourts === 1 ? 'court' : 'courts'
                } left`;
          return (
            <TouchableOpacity
              key={slot.startAt}
              accessibilityLabel={`${slot.startTime} to ${slot.endTime}, ${caption}`}
              accessibilityRole="button"
              accessibilityState={{selected, disabled: !available}}
              activeOpacity={0.8}
              disabled={!available}
              onPress={() => setSelectedSlot(slot)}
              style={[
                styles.slot,
                !available && styles.slotDisabled,
                selected && styles.slotSelected,
              ]}>
              <Text
                type="semibold"
                size={14}
                color={
                  selected ? '#FFFFFF' : available ? '#F8F9FA' : '#6C757D'
                }>
                {slot.startTime}–{slot.endTime}
              </Text>
              <Text
                type="regular"
                size={11}
                color={
                  selected ? '#D8F3DC' : available ? '#74C69D' : '#6C757D'
                }>
                {caption}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            accessibilityLabel={`${location.location_name} venue`}
            source={
              location.image_url
                ? {uri: location.image_url}
                : require('../../Assets/field.png')
            }
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
          <Text accessibilityRole="header" type="semibold" size={28}>
            Book your court
          </Text>
          <Text type="regular" size={14} color="#ADB5BD" style={styles.intro}>
            {location.location_name} · for {username || 'you'}
          </Text>

          {sports.length > 1 ? (
            <View style={styles.section}>
              <Text type="semibold" size={18}>
                Sport
              </Text>
              <View style={styles.chipRow}>
                {sports.map(sport => {
                  const selected = sport.slug === sportSlug;
                  return (
                    <TouchableOpacity
                      key={sport.slug}
                      accessibilityRole="radio"
                      accessibilityState={{selected}}
                      activeOpacity={0.8}
                      onPress={() => setSportSlug(sport.slug)}
                      style={[styles.chip, selected && styles.chipSelected]}>
                      <Text
                        type="semibold"
                        size={13}
                        color={selected ? '#FFFFFF' : '#CED4DA'}>
                        {sport.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text type="semibold" size={18}>
              Date
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateRow}>
              {dates.map((value, index) => {
                const selected = value === date;
                return (
                  <TouchableOpacity
                    key={value}
                    accessibilityLabel={moment(value, 'YYYY-MM-DD').format(
                      'dddd D MMMM',
                    )}
                    accessibilityRole="radio"
                    accessibilityState={{selected}}
                    activeOpacity={0.8}
                    onPress={() => setDate(value)}
                    style={[styles.dateChip, selected && styles.chipSelected]}>
                    <Text
                      type="regular"
                      size={11}
                      color={selected ? '#D8F3DC' : '#ADB5BD'}>
                      {dateLabel(value, index)}
                    </Text>
                    <Text
                      type="semibold"
                      size={18}
                      color={selected ? '#FFFFFF' : '#F8F9FA'}>
                      {moment(value, 'YYYY-MM-DD').format('D')}
                    </Text>
                    <Text
                      type="regular"
                      size={11}
                      color={selected ? '#D8F3DC' : '#ADB5BD'}>
                      {moment(value, 'YYYY-MM-DD').format('MMM')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text type="semibold" size={18}>
              Duration
            </Text>
            <View style={styles.durationOptions}>
              {DURATIONS.map(hours => {
                const selected = hours === durationHours;
                return (
                  <TouchableOpacity
                    key={hours}
                    accessibilityLabel={formatDuration(hours)}
                    accessibilityRole="radio"
                    accessibilityState={{selected}}
                    activeOpacity={0.8}
                    onPress={() => setDurationHours(hours)}
                    style={[
                      styles.duration,
                      selected && styles.selectedDuration,
                    ]}>
                    <Text
                      type="semibold"
                      size={14}
                      color={selected ? '#FFFFFF' : '#CED4DA'}>
                      {formatDuration(hours)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text type="semibold" size={18}>
                Start time
              </Text>
              <Text type="regular" size={12} color="#868E96">
                {availability?.openTime && availability?.closeTime
                  ? `Open ${availability.openTime}–${availability.closeTime} ${VENUE_TIME_ZONE_LABEL}`
                  : `Times in ${VENUE_TIME_ZONE_LABEL}`}
              </Text>
            </View>
            {renderSlots()}
          </View>

          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <View style={styles.priceCopy}>
                <Text type="regular" size={12} color="#ADB5BD">
                  {selectedSlot
                    ? `${moment(date, 'YYYY-MM-DD').format('ddd, D MMM')} · ${
                        selectedSlot.startTime
                      }–${selectedSlot.endTime} ${VENUE_TIME_ZONE_LABEL}`
                    : 'Select a start time'}
                </Text>
                <Text type="semibold" size={22} color="#52B788">
                  IDR {currencyFormatter(total)}
                </Text>
              </View>
              <Text type="regular" size={12} color="#ADB5BD">
                IDR {currencyFormatter(hourlyRate)} × {durationHours}h
              </Text>
            </View>
            <View style={styles.noticeRow}>
              <Icon name="info-outline" size={16} color="#868E96" />
              <Text
                type="regular"
                size={11}
                color="#868E96"
                style={styles.noticeText}>
                Your court is held for {PAYMENT_WINDOW_MINUTES} minutes while
                you transfer the payment. Paid bookings can be cancelled up to 2
                hours before the start time.
              </Text>
            </View>
          </View>

          <Button
            accessibilityHint="Reserves the selected time and shows payment instructions"
            disabled={!selectedSlot || isSubmitting}
            onPress={onSubmit}
            title={isSubmitting ? 'Reserving…' : 'Reserve & pay'}
            buttonStyle={styles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderField;
