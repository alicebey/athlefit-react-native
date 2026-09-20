import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../../Component/Text';
import {getManagedVenues} from '../../Service/ownerService';
import styles from './styles';

// Venues the signed-in owner manages (admins see every venue).
const OwnerVenuesScreen = () => {
  const navigation = useNavigation();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVenues(await getManagedVenues());
    } catch (requestError) {
      setError(requestError.message || 'Could not load your venues.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const renderVenue = ({item}) => (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${item.name}${
        item.bookingsAwaitingConfirmation
          ? `, ${item.bookingsAwaitingConfirmation} payments to review`
          : ''
      }`}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Owner Venue', {venueId: item.id})}
      style={styles.card}>
      <View style={styles.cardHeader}>
        <Text type="semibold" size={16} numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>
        <View
          style={[
            styles.visibility,
            item.active ? styles.visible : styles.hidden,
          ]}>
          <Text
            type="semibold"
            size={11}
            color={item.active ? '#74C69D' : '#ADB5BD'}>
            {item.active ? 'Live' : 'Hidden'}
          </Text>
        </View>
      </View>
      <Text type="regular" size={13} color="#ADB5BD" numberOfLines={2}>
        {item.address}
      </Text>
      <Text type="regular" size={12} color="#868E96" style={styles.meta}>
        {item.sports.map(sport => sport.name).join(' · ') || 'No sports yet'}
        {item.ownerEmail ? `  ·  Owner: ${item.ownerEmail}` : ''}
      </Text>
      {item.bookingsAwaitingConfirmation ? (
        <View style={styles.alert}>
          <Icon name="payments" size={16} color="#74C0FC" />
          <Text
            type="semibold"
            size={12}
            color="#74C0FC"
            style={styles.alertText}>
            {item.bookingsAwaitingConfirmation}{' '}
            {item.bookingsAwaitingConfirmation === 1 ? 'payment' : 'payments'}{' '}
            to review
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
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
          style={styles.headerTitle}>
          My venues
        </Text>
      </View>
      <FlatList
        data={venues}
        keyExtractor={item => item.id}
        renderItem={renderVenue}
        contentContainerStyle={styles.list}
        refreshing={loading && venues.length > 0}
        onRefresh={load}
        ListEmptyComponent={
          <View style={styles.empty}>
            {loading ? (
              <ActivityIndicator color="#52B788" />
            ) : (
              <>
                <Icon
                  name={error ? 'cloud-off' : 'storefront'}
                  size={40}
                  color="#6C757D"
                />
                <Text type="semibold" size={16} style={styles.emptyTitle}>
                  {error ? 'Could not load venues' : 'No venues yet'}
                </Text>
                <Text
                  type="regular"
                  size={13}
                  color="#ADB5BD"
                  textAlign="center">
                  {error ||
                    'Ask an Athlefit admin to link your venue to this account.'}
                </Text>
                {error ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={load}
                    style={styles.retry}>
                    <Text type="semibold" size={14} color="#52B788">
                      Try again
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default OwnerVenuesScreen;
