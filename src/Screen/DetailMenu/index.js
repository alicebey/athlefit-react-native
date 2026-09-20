import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Text from '../../Component/Text';
import FieldCard from '../../Component/FieldCard';
import SearchBar from '../../Component/SearchBar';
import {useSessionStore} from '../../Service/sessionStore';
import {getVenues} from '../../Service/venueService';
import {haversineDistance} from '../../Utils/Haversine';
import styles from './styles';

const DetailMenu = ({route}) => {
  const sportName = route.params?.data?.name || 'Sport';
  const sportSlug = route.params?.data?.slug || sportName.toLowerCase();
  const navigation = useNavigation();
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {location} = useSessionStore();

  const loadVenues = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setVenues(await getVenues(sportSlug));
    } catch (requestError) {
      console.log(requestError, 'error get data detail menu');
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [sportSlug]);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  const filteredVenues = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...venues]
      .sort((a, b) => {
        const distanceA = haversineDistance(location, a.location_map);
        const distanceB = haversineDistance(location, b.location_map);
        return distanceA - distanceB;
      })
      .filter(item => {
        if (!query) {
          return true;
        }
        return (
          item.location_name.toLowerCase().includes(query) ||
          item.location_address.toLowerCase().includes(query)
        );
      });
  }, [venues, search, location]);

  const closeSearch = () => {
    setIsSearch(false);
    setSearch('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={{top: 8, right: 8, bottom: 8, left: 8}}
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="arrow-left" size={24} color="#52B788" />
        </TouchableOpacity>

        {isSearch ? (
          <SearchBar
            alwaysShowClose
            autoFocus
            onClose={closeSearch}
            value={search}
            onChange={setSearch}
          />
        ) : (
          <>
            <View style={styles.headerTitle}>
              <Text type="semibold" size={26} numberOfLines={1}>
                {sportName}
              </Text>
              <Text type="regular" size={12} color="#ADB5BD">
                Nearest venues first
              </Text>
            </View>
            <TouchableOpacity
              accessibilityLabel={`Search ${sportName} venues`}
              accessibilityRole="button"
              onPress={() => setIsSearch(true)}
              style={styles.iconButton}>
              <Icon name="search" size={23} color="#F8F9FA" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={filteredVenues}
        renderItem={({item}) => (
          <FieldCard
            data={item}
            onPress={() => navigation.navigate('DetailField', {data: item})}
          />
        )}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={loadVenues}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          filteredVenues.length ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              style={styles.footer}>
              <Text size={14} type="semibold" color="#52B788">
                Explore another sport
              </Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator color="#52B788" />
            ) : (
              <>
                <Icon
                  name={
                    error ? 'wifi-off' : search.trim() ? 'search' : 'map-pin'
                  }
                  size={40}
                  color="#6C757D"
                />
                <Text type="semibold" size={18} style={styles.emptyTitle}>
                  {error
                    ? 'Could not load venues'
                    : search.trim()
                    ? 'No matching venues'
                    : `No ${sportName} venues yet`}
                </Text>
                <Text
                  type="regular"
                  size={13}
                  color="#ADB5BD"
                  textAlign="center">
                  {error
                    ? 'Check your connection and try again.'
                    : search.trim()
                    ? 'Try a venue name, area, or another keyword.'
                    : 'We are still adding venues for this sport.'}
                </Text>
                {error ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={loadVenues}
                    style={styles.retryButton}>
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

export default DetailMenu;
