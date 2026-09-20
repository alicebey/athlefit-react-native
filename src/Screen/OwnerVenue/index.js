import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../../Component/Text';
import {getAdminStatus} from '../../Service/adminVenueService';
import {getManagedVenue, getVenueBookings} from '../../Service/ownerService';
import BookingsTab from './BookingsTab';
import SettingsTab from './SettingsTab';
import styles from './styles';

const TABS = [
  {key: 'bookings', label: 'Bookings'},
  {key: 'settings', label: 'Settings'},
];

// Owner workspace for one venue: review payments and manage venue settings.
const OwnerVenueScreen = ({route}) => {
  const venueId = route.params?.venueId;
  const navigation = useNavigation();
  const [tab, setTab] = useState('bookings');
  const [venue, setVenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [venueResult, bookingResult, status] = await Promise.all([
        getManagedVenue(venueId),
        getVenueBookings(venueId),
        getAdminStatus().catch(() => ({admin: false})),
      ]);
      setVenue(venueResult);
      setBookings(bookingResult);
      setIsAdmin(Boolean(status.admin));
    } catch (requestError) {
      setError(requestError.message || 'Could not load this venue.');
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const replaceBooking = updated =>
    setBookings(current =>
      current.map(item => (item.id === updated.id ? updated : item)),
    );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#52B788" />
        </TouchableOpacity>
        <Text
          accessibilityRole="header"
          type="semibold"
          size={20}
          numberOfLines={1}
          style={styles.headerTitle}>
          {venue?.name || 'Venue'}
        </Text>
      </View>

      <View accessibilityRole="tablist" style={styles.tabs}>
        {TABS.map(item => {
          const selected = item.key === tab;
          return (
            <TouchableOpacity
              key={item.key}
              accessibilityRole="tab"
              accessibilityState={{selected}}
              activeOpacity={0.8}
              onPress={() => setTab(item.key)}
              style={[styles.tab, selected && styles.tabSelected]}>
              <Text
                type="semibold"
                size={14}
                color={selected ? '#FFFFFF' : '#ADB5BD'}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!venue ? (
        <View style={styles.state}>
          {loading ? (
            <ActivityIndicator color="#52B788" />
          ) : (
            <>
              <Icon name="cloud-off" size={40} color="#6C757D" />
              <Text
                type="regular"
                size={13}
                color="#ADB5BD"
                textAlign="center"
                style={styles.stateText}>
                {error}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={load}
                style={styles.retry}>
                <Text type="semibold" size={14} color="#52B788">
                  Try again
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {tab === 'bookings' ? (
            <BookingsTab
              bookings={bookings}
              loading={loading}
              onRefresh={load}
              onBookingUpdated={replaceBooking}
            />
          ) : (
            <SettingsTab
              venue={venue}
              isAdmin={isAdmin}
              onVenueUpdated={setVenue}
            />
          )}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default OwnerVenueScreen;
