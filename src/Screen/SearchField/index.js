import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../Component/Text';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import FieldCard from '../../Component/FieldCard';
import {useNavigation} from '@react-navigation/native';
import SearchBar from '../../Component/SearchBar';
import {useSessionStore} from '../../Service/sessionStore';
import {haversineDistance} from '../../Utils/Haversine';
import {getVenues} from '../../Service/venueService';

const SearchField = () => {
  const navigation = useNavigation();
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {location} = useSessionStore();

  // Function for getting data from database
  const getData = async () => {
    setLoading(true);
    setError(false);
    try {
      setListData(await getVenues());
    } catch (requestError) {
      console.log(requestError, 'error get data detail menu');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Data Manipulation Function
  const ListData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return [];
    }

    // Sorting data by haversine distance
    const sortedData = [...listData].sort((a, b) => {
      const distanceA = haversineDistance(location, a.location_map);
      const distanceB = haversineDistance(location, b.location_map);
      return distanceA - distanceB;
    });
    return sortedData.filter(item => {
      const includesName = item.location_name.toLowerCase().includes(query);
      const includesPlace = item.location_address.toLowerCase().includes(query);
      return includesName || includesPlace;
    });
  }, [listData, search, location]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#52B788" />
        </TouchableOpacity>
        <SearchBar
          autoFocus
          onClose={() => {
            setSearch('');
          }}
          value={search}
          onChange={val => setSearch(val)}
        />
      </View>

      <View style={styles.body}>
        <FlatList
          data={ListData}
          renderItem={({item, index}) => (
            <FieldCard
              data={item}
              onPress={() => navigation.navigate('DetailField', {data: item})}
            />
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              {loading ? (
                <ActivityIndicator color="#52B788" />
              ) : (
                <>
                  <Icon
                    name={error ? 'wifi-off' : 'search'}
                    size={40}
                    color="#6C757D"
                  />
                  <Text type="semibold" size={18} style={styles.emptyTitle}>
                    {error
                      ? 'Could not load venues'
                      : search.trim()
                      ? 'No matching venues'
                      : 'Find your next game'}
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
                      : 'Search by venue name or location.'}
                  </Text>
                  {error ? (
                    <TouchableOpacity
                      onPress={getData}
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
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchField;
