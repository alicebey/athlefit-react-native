import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Text from '../../Component/Text';
import styles from './styles';
import Image from '../../Component/Image';
import OrderCard from '../../Component/OrderCard';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getMyBookings, isActiveBooking} from '../../Service/bookingService';

// Screen for list order
const OrderScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState('upcoming');
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // Get signed-in user's bookings from backend
  const getData = async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await getMyBookings());
    } catch (requestError) {
      console.log(requestError, 'error get data order');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  // Upcoming = still active and not finished; everything else is history.
  const {upcoming, history} = useMemo(() => {
    const now = Date.now();
    const isUpcoming = item =>
      isActiveBooking(item) && item.end_time.seconds * 1000 > now;
    return {
      upcoming: data
        .filter(isUpcoming)
        .sort((a, b) => a.order_time.seconds - b.order_time.seconds),
      history: data
        .filter(item => !isUpcoming(item))
        .sort((a, b) => b.order_time.seconds - a.order_time.seconds),
    };
  }, [data]);
  const ListData = tab === 'upcoming' ? upcoming : history;
  const awaitingPayment = upcoming.filter(
    item => item.status === 'PENDING_PAYMENT',
  ).length;
  const tabs = [
    {key: 'upcoming', label: 'Upcoming', count: upcoming.length},
    {key: 'history', label: 'History', count: history.length},
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" type="semibold" size={28}>
          My bookings
        </Text>
        <Text type="regular" size={13} color="#ADB5BD">
          {awaitingPayment
            ? `${awaitingPayment} ${
                awaitingPayment === 1 ? 'booking needs' : 'bookings need'
              } payment`
            : 'Your games, all in one place'}
        </Text>
        <View accessibilityRole="tablist" style={styles.tabs}>
          {tabs.map(item => {
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
                  {item.count ? ` (${item.count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={ListData}
        renderItem={({item, index}) => (
          <OrderCard
            onPress={() => navigation.navigate('Detail Order', {data: item})}
            data={item}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator color="#52B788" />
            ) : (
              <>
                {error ? (
                  <Icon name="wifi-off" size={42} color="#6C757D" />
                ) : (
                  <View style={styles.emptyImage}>
                    <Image source={require('../../Assets/EmptyOrder.png')} />
                  </View>
                )}
                <Text type="semibold" size={18} style={styles.emptyTitle}>
                  {error
                    ? 'Could not load bookings'
                    : tab === 'upcoming'
                    ? 'No upcoming games'
                    : 'No past bookings yet'}
                </Text>
                <Text
                  type="regular"
                  size={13}
                  color="#ADB5BD"
                  textAlign="center">
                  {error
                    ? 'Check your connection and try again.'
                    : 'Book a venue and your next game will appear here.'}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={error ? getData : () => navigation.navigate('Home')}
                  style={styles.emptyAction}>
                  <Text type="semibold" size={14} color="#52B788">
                    {error ? 'Try again' : 'Explore venues'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={getData}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default OrderScreen;
