import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../Component/Text';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Image from '../../Component/Image';
import FieldCard from '../../Component/FieldCard';
import {useNavigation} from '@react-navigation/native';
import {haversineDistance} from '../../Utils/Haversine';
import {useSessionStore} from '../../Service/sessionStore';
import {
  getVenues,
  offersSport,
  withPrimarySport,
} from '../../Service/venueService';
import {toSportSlug, useSports} from '../../Utils/Sports';

const HomeScreen = () => {
  const navigation = useNavigation();
  const sports = useSports();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {location, category} = useSessionStore();
  const hasLocation =
    location && (location.latitude !== 0 || location.longitude !== 0);

  // Function for get venue data from backend
  const getData = async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await getVenues());
    } catch (requestError) {
      console.log(requestError, 'error get data');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Function that run immediatly when screen is rendered
  useEffect(() => {
    getData();
  }, []);

  // Data Manipulation
  const ListData = useMemo(() => {
    // Sorting data by nearest location using haversine algorithm
    const sortedData = hasLocation
      ? [...data].sort((a, b) => {
          const distanceA = haversineDistance(location, a.location_map);
          const distanceB = haversineDistance(location, b.location_map);
          return distanceA - distanceB;
        })
      : data;

    const favouriteSlug = toSportSlug(category);
    return sortedData
      .filter(item => offersSport(item, favouriteSlug))
      .map(item => withPrimarySport(item, favouriteSlug));
  }, [data, location, category, hasLocation]);

  // Pad the grid with empty cells so a partly filled last row keeps tile widths.
  const gridSports = useMemo(() => {
    const columns = 4;
    const padding = (columns - (sports.length % columns)) % columns;
    return [
      ...sports,
      ...Array.from({length: padding}, (_, index) => ({
        slug: `placeholder-${index}`,
        placeholder: true,
      })),
    ];
  }, [sports]);

  const renderMenu = ({item}) => {
    if (item.placeholder) {
      return (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.menu, styles.menuPlaceholder]}
        />
      );
    }
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Browse ${item.name} venues`}
        onPress={() => navigation.navigate('DetailMenu', {data: item})}
        activeOpacity={0.8}
        style={styles.menu}>
        <View style={styles.logo}>
          <Image source={item.icon} />
        </View>
        <Text type="semibold" size={14} numberOfLines={1} textAlign="center">
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Search sports venues"
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SearchField')}
          style={styles.searchBar}>
          <Icon name="search" size={24} color="#ADB5BD" />
          <Text
            type="regular"
            size={14}
            color="#ADB5BD"
            style={styles.searchPlaceholder}>
            Search venues or locations
          </Text>
          <Text type="bold" size={16} color="#52B788">
            Search
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.title}>
        <Text accessibilityRole="header" type="semibold" size={28}>
          Sports
        </Text>
        <Text type="regular" size={13} color="#ADB5BD">
          Choose how you want to play
        </Text>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={gridSports}
          renderItem={renderMenu}
          keyExtractor={item => item.slug}
          numColumns={4}
          columnWrapperStyle={styles.menuRow}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.recommendationContainer}>
        <Text accessibilityRole="header" type="semibold" size={28}>
          Recommendations
        </Text>
        <Text type="regular" size={13} color="#ADB5BD" style={styles.subtitle}>
          {hasLocation
            ? 'Venues for your favourite sport, nearest first'
            : 'Venues selected for your favourite sport'}
        </Text>
        <FlatList
          data={ListData}
          renderItem={({item, index}) => (
            <FieldCard
              data={item}
              onPress={() => navigation.navigate('DetailField', {data: item})}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={getData}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              {loading ? (
                <ActivityIndicator color="#52B788" />
              ) : (
                <>
                  <Icon
                    name={error ? 'cloud-off' : 'sports'}
                    size={36}
                    color="#6C757D"
                  />
                  <Text type="semibold" size={16} style={styles.emptyTitle}>
                    {error ? 'Could not load venues' : 'No venues found yet'}
                  </Text>
                  <Text
                    type="regular"
                    size={13}
                    color="#ADB5BD"
                    textAlign="center">
                    {error
                      ? 'Check your connection, then try again.'
                      : `We are still adding ${category || 'sport'} venues.`}
                  </Text>
                  {error ? (
                    <TouchableOpacity
                      accessibilityRole="button"
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
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
