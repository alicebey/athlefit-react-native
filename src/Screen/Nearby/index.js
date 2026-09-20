import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Feather';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Text from '../../Component/Text';
import {useSessionStore} from '../../Service/sessionStore';
import {getVenues} from '../../Service/venueService';
import {currencyFormatter} from '../../Utils/CurrencyFormatter';
import {
  NEARBY_RADIUS_KM,
  formatDistance,
  hasCoordinates,
  toLatLng,
  withDistances,
} from '../../Utils/Distance';
import styles, {CARD_GAP} from './styles';

const JAKARTA = {latitude: -6.2, longitude: 106.816666};
const DARK_MAP_STYLE = [
  {elementType: 'geometry', stylers: [{color: '#212529'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#ADB5BD'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#1B1F22'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#343A40'}]},
  {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#2B3035'}]},
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#172A35'}],
  },
];
const FIT_PADDING = {top: 180, right: 60, bottom: 260, left: 60};

const lowestRate = venue =>
  Math.min(
    ...(venue.sports?.length
      ? venue.sports.map(sport => Number(sport.hourly_rate || 0))
      : [Number(venue.hourly_rate || 0)]),
  );

const NearbyScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {width} = useWindowDimensions();
  const cardWidth = Math.min(300, width - 64);
  const mapRef = useRef(null);
  const listRef = useRef(null);
  const fittedRef = useRef(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [locating, setLocating] = useState(false);
  const [permission, setPermission] = useState('unknown');
  const [selectedId, setSelectedId] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const location = useSessionStore(state => state.location);
  const setLocation = useSessionStore(state => state.setLocation);
  const hasUserLocation = permission === 'granted' && hasCoordinates(location);

  const sorted = useMemo(
    () => withDistances(venues, hasUserLocation ? location : null),
    [venues, location, hasUserLocation],
  );
  const nearbyCount = sorted.filter(
    venue =>
      venue.distance_km !== null && venue.distance_km <= NEARBY_RADIUS_KM,
  ).length;
  const nearest = sorted[0];
  const allFar = hasUserLocation && sorted.length > 0 && nearbyCount === 0;

  const loadVenues = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setVenues(await getVenues());
    } catch (requestError) {
      console.log(requestError, 'error get venues');
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Always read a fresh position so a stale saved location is never reused.
  const readLocation = useCallback(() => {
    setLocating(true);
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocating(false);
      },
      locationError => {
        console.log(locationError, 'error get location');
        setLocating(false);
      },
      {timeout: 15000, maximumAge: 30000, enableHighAccuracy: true},
    );
  }, [setLocation]);

  const requestLocation = useCallback(
    async ({prompt}) => {
      try {
        if (Platform.OS !== 'android') {
          Geolocation.requestAuthorization(
            () => {
              setPermission('granted');
              readLocation();
            },
            () => setPermission('denied'),
          );
          return;
        }
        const androidPermission =
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
        if (await PermissionsAndroid.check(androidPermission)) {
          setPermission('granted');
          readLocation();
          return;
        }
        if (!prompt) {
          setPermission('denied');
          return;
        }
        const result = await PermissionsAndroid.request(androidPermission, {
          title: 'Find venues near you',
          message:
            'Athlefit uses your location to show the sports venues closest to you.',
          buttonPositive: 'Allow',
          buttonNegative: 'Not now',
        });
        const granted = result === PermissionsAndroid.RESULTS.GRANTED;
        setPermission(granted ? 'granted' : 'denied');
        if (granted) {
          readLocation();
        }
      } catch (permissionError) {
        console.log(permissionError, 'error location permission');
        setPermission('denied');
      }
    },
    [readLocation],
  );

  useEffect(() => {
    if (isFocused) {
      fittedRef.current = false;
      loadVenues();
      requestLocation({prompt: permission === 'unknown'});
    }
    // Only re-run when the tab gains focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const fitMap = useCallback(() => {
    if (!mapRef.current || !sorted.length) {
      return;
    }
    let points;
    if (hasUserLocation && !allFar) {
      // You plus the venues within the radius (at least the nearest three).
      const close = sorted.filter(
        (venue, index) => venue.distance_km <= NEARBY_RADIUS_KM || index < 3,
      );
      points = [
        toLatLng(location),
        ...close.map(v => toLatLng(v.location_map)),
      ];
    } else {
      // Nothing close by: show where the venues actually are.
      points = sorted.map(venue => toLatLng(venue.location_map));
    }
    if (points.length === 1) {
      mapRef.current.animateToRegion(
        {...points[0], latitudeDelta: 0.04, longitudeDelta: 0.04},
        400,
      );
    } else {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: FIT_PADDING,
        animated: true,
      });
    }
  }, [sorted, hasUserLocation, allFar, location]);

  // Fit once per visit, after venues and (if allowed) the location arrive.
  useEffect(() => {
    if (
      !mapReady ||
      !isFocused ||
      loading ||
      !sorted.length ||
      fittedRef.current
    ) {
      return;
    }
    if (permission === 'unknown' || locating) {
      return;
    }
    fittedRef.current = true;
    fitMap();
  }, [mapReady, isFocused, loading, sorted, permission, locating, fitMap]);

  const focusVenue = useCallback((venue, index) => {
    setSelectedId(venue.id);
    mapRef.current?.animateToRegion(
      {
        ...toLatLng(venue.location_map),
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      400,
    );
    if (index !== undefined) {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, []);

  const recenter = () => {
    if (permission !== 'granted') {
      if (permission === 'denied') {
        Alert.alert(
          'Location is off',
          'Allow location access for Athlefit in your phone settings to see venues near you.',
          [
            {text: 'Not now', style: 'cancel'},
            {text: 'Open settings', onPress: () => Linking.openSettings()},
          ],
        );
      }
      requestLocation({prompt: true});
      return;
    }
    fittedRef.current = false;
    readLocation();
  };

  const subtitle = () => {
    if (loading) {
      return 'Finding sports venues…';
    }
    if (!hasUserLocation) {
      return locating
        ? 'Finding your location…'
        : `${sorted.length} venues · turn on location to sort by distance`;
    }
    if (allFar) {
      return `No venues within ${NEARBY_RADIUS_KM} km · nearest is ${formatDistance(
        nearest.distance_km,
      )} away`;
    }
    return `${nearbyCount} ${
      nearbyCount === 1 ? 'venue' : 'venues'
    } within ${NEARBY_RADIUS_KM} km`;
  };

  const renderCard = ({item, index}) => {
    const selected = item.id === selectedId;
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${item.location_name}${
          item.distance_km !== null
            ? `, ${formatDistance(item.distance_km)} away`
            : ''
        }`}
        activeOpacity={0.85}
        onPress={() => focusVenue(item, index)}
        style={[
          styles.card,
          {width: cardWidth},
          selected && styles.cardSelected,
        ]}>
        <View style={styles.cardHeader}>
          <Text
            type="semibold"
            size={15}
            numberOfLines={1}
            style={styles.cardTitle}>
            {item.location_name}
          </Text>
          {item.distance_km !== null ? (
            <Text type="semibold" size={12} color="#52B788">
              {formatDistance(item.distance_km)}
            </Text>
          ) : null}
        </View>
        <Text type="regular" size={12} color="#ADB5BD" numberOfLines={1}>
          {item.location_address}
        </Text>
        <Text
          type="regular"
          size={12}
          color="#CED4DA"
          numberOfLines={1}
          style={styles.cardMeta}>
          {(item.sports || []).map(sport => sport.name).join(' · ')} · from IDR{' '}
          {currencyFormatter(lowestRate(item))}/hr
        </Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Directions to ${item.location_name}`}
            onPress={() => {
              const {latitude, longitude} = toLatLng(item.location_map);
              const label = encodeURIComponent(item.location_name);
              Linking.openURL(
                Platform.OS === 'android'
                  ? `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`
                  : `maps:0,0?q=${label}@${latitude},${longitude}`,
              ).catch(() =>
                Alert.alert('Could not open maps', 'Please try again.'),
              );
            }}
            style={styles.secondaryAction}>
            <Icon name="navigation" size={14} color="#52B788" />
            <Text
              type="semibold"
              size={12}
              color="#52B788"
              style={styles.actionText}>
              Directions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`View ${item.location_name}`}
            onPress={() => navigation.navigate('DetailField', {data: item})}
            style={styles.primaryAction}>
            <Text type="semibold" size={12} color="#FFFFFF">
              View & book
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        onMapReady={() => setMapReady(true)}
        accessibilityLabel="Map of nearby sports venues"
        customMapStyle={DARK_MAP_STYLE}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={permission === 'granted'}
        showsMyLocationButton={false}
        style={styles.map}
        initialRegion={{
          ...(hasCoordinates(location) ? toLatLng(location) : JAKARTA),
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        }}>
        {sorted.map((item, index) => (
          <Marker
            key={item.id}
            accessibilityLabel={item.location_name}
            coordinate={toLatLng(item.location_map)}
            pinColor={item.id === selectedId ? '#52B788' : '#2D6A4F'}
            title={item.location_name}
            description={
              item.distance_km !== null
                ? `${formatDistance(item.distance_km)} · ${
                    item.location_address
                  }`
                : item.location_address
            }
            onPress={() => focusVenue(item, index)}
          />
        ))}
      </MapView>

      <SafeAreaView
        edges={['top']}
        pointerEvents="box-none"
        style={styles.overlay}>
        <View style={styles.headerCard}>
          <View style={styles.headerCopy}>
            <Text accessibilityRole="header" type="semibold" size={24}>
              Nearby venues
            </Text>
            <Text type="regular" size={12} color="#ADB5BD">
              {subtitle()}
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Show my location"
            onPress={recenter}
            style={styles.headerIcon}>
            {locating ? (
              <ActivityIndicator size="small" color="#52B788" />
            ) : (
              <Icon
                name={permission === 'granted' ? 'crosshair' : 'navigation'}
                size={20}
                color="#52B788"
              />
            )}
          </TouchableOpacity>
        </View>

        {loading || error || sorted.length === 0 ? (
          <View style={styles.stateCard}>
            {loading ? (
              <ActivityIndicator color="#52B788" />
            ) : (
              <>
                <Icon
                  name={error ? 'wifi-off' : 'map'}
                  size={28}
                  color="#6C757D"
                />
                <Text type="semibold" size={15} style={styles.stateTitle}>
                  {error ? 'Could not load venues' : 'No venues to show yet'}
                </Text>
                <Text
                  type="regular"
                  size={12}
                  color="#ADB5BD"
                  textAlign="center">
                  {error
                    ? 'Check your connection and try again.'
                    : 'Published venues will appear here.'}
                </Text>
                {error ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={loadVenues}
                    style={styles.retryButton}>
                    <Text type="semibold" size={13} color="#52B788">
                      Try again
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
          </View>
        ) : null}
      </SafeAreaView>

      {!loading && sorted.length ? (
        <FlatList
          ref={listRef}
          horizontal
          data={sorted}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + CARD_GAP}
          decelerationRate="fast"
          contentContainerStyle={styles.cardList}
          style={styles.cardStrip}
          getItemLayout={(_, index) => ({
            length: cardWidth + CARD_GAP,
            offset: (cardWidth + CARD_GAP) * index,
            index,
          })}
          onScrollToIndexFailed={() => {}}
        />
      ) : null}
    </View>
  );
};

export default NearbyScreen;
