import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Text from '../../Component/Text';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import AlertModal from '../../Component/AlertModal';
import {
  publishGeoapifyVenue,
  searchGeoapifyPlaces,
  validateVenueDraft,
} from '../../Service/adminVenueService';
import styles from './styles';

const DAYS = [
  ['MONDAY', 'Mon'],
  ['TUESDAY', 'Tue'],
  ['WEDNESDAY', 'Wed'],
  ['THURSDAY', 'Thu'],
  ['FRIDAY', 'Fri'],
  ['SATURDAY', 'Sat'],
  ['SUNDAY', 'Sun'],
];
const SPORTS = [
  'badminton',
  'futsal',
  'basketball',
  'soccer',
  'tennis',
  'golf',
  'billiard',
];
const titleCase = value => value.charAt(0).toUpperCase() + value.slice(1);

const AdminVenuesScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sportConfigs, setSportConfigs] = useState({});
  const [openDays, setOpenDays] = useState(DAYS.map(([value]) => value));
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [searching, setSearching] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [alert, setAlert] = useState({show: false, body: ''});

  const showAlert = body => setAlert({show: true, body});

  const changeQuery = value => {
    setQuery(value);
    setResults([]);
    setHasSearched(false);
    setSearchError('');
  };

  const search = async () => {
    if (searching) {
      return;
    }
    if (!query.trim()) {
      showAlert('Enter a venue name, sport, or city first.');
      return;
    }

    Keyboard.dismiss();
    setSearching(true);
    setHasSearched(true);
    setSearchError('');
    try {
      setResults(await searchGeoapifyPlaces(query.trim()));
    } catch (error) {
      setResults([]);
      setSearchError(error.message || 'Could not search for venues.');
    } finally {
      setSearching(false);
    }
  };

  const selectPlace = place => {
    const suggestedSports = (place.suggestedSports || []).filter(sport =>
      SPORTS.includes(sport),
    );
    setSportConfigs(
      suggestedSports.reduce(
        (configs, sport) => ({
          ...configs,
          [sport]: {hourlyRate: '', courtCount: '1'},
        }),
        {},
      ),
    );
    const schedule = place.suggestedSchedule;
    setOpenDays(
      schedule?.openDays?.length
        ? schedule.openDays
        : DAYS.map(([value]) => value),
    );
    setOpenTime(schedule?.openTime?.slice(0, 5) || '08:00');
    setCloseTime(schedule?.closeTime?.slice(0, 5) || '22:00');
    setSelectedPlace(place);
  };

  const toggleSport = sport => {
    setSportConfigs(current => {
      const next = {...current};
      if (next[sport]) {
        delete next[sport];
      } else {
        next[sport] = {hourlyRate: '', courtCount: '1'};
      }
      return next;
    });
  };

  const updateSport = (sport, field, value) => {
    setSportConfigs(current => ({
      ...current,
      [sport]: {...current[sport], [field]: value},
    }));
  };

  const toggleDay = day => {
    setOpenDays(current =>
      current.includes(day)
        ? current.filter(value => value !== day)
        : [...current, day],
    );
  };

  const publish = async () => {
    if (publishing) {
      return;
    }
    const sports = Object.entries(sportConfigs).map(([sportSlug, config]) => ({
      sportSlug,
      hourlyRate: Number(config.hourlyRate),
      courtCount: Number(config.courtCount),
    }));
    const validationError = validateVenueDraft({
      sports,
      openDays,
      openTime,
      closeTime,
    });
    if (validationError) {
      showAlert(validationError);
      return;
    }

    setPublishing(true);
    Keyboard.dismiss();
    try {
      await publishGeoapifyVenue({
        geoapifyPlaceId: selectedPlace.geoapifyPlaceId,
        scheduleOverride: {openDays, openTime, closeTime},
        sports,
      });
      setSelectedPlace(null);
      setResults([]);
      setQuery('');
      setHasSearched(false);
      showAlert('Venue published. It is now visible in the customer app.');
    } catch (error) {
      showAlert(error.message || 'Could not publish this venue.');
    } finally {
      setPublishing(false);
    }
  };

  const confirmPublish = () => {
    Alert.alert(
      'Publish venue?',
      `${selectedPlace.name || 'This venue'} will become bookable immediately.`,
      [
        {text: 'Not yet', style: 'cancel'},
        {text: 'Publish', onPress: publish},
      ],
    );
  };

  const goBack = () => {
    if (publishing) {
      return;
    }
    if (selectedPlace) {
      setSelectedPlace(null);
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          accessibilityRole="button"
          disabled={publishing}
          onPress={goBack}
          style={styles.iconButton}>
          <Icon name="arrow-left" size={24} color="#52B788" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text
            accessibilityRole="header"
            type="semibold"
            size={24}
            numberOfLines={1}>
            {selectedPlace ? 'Review venue' : 'Manage venues'}
          </Text>
          <Text type="regular" size={12} color="#ADB5BD">
            {selectedPlace
              ? 'Confirm details before publishing'
              : 'Admin tools'}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {!selectedPlace ? (
            <>
              <Text
                type="regular"
                size={14}
                color="#ADB5BD"
                style={styles.intro}>
                Search Geoapify, then review pricing, capacity, and hours before
                publishing.
              </Text>
              <View style={styles.searchRow}>
                <TextInput
                  accessibilityLabel="Venue search"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={query}
                  onChangeText={changeQuery}
                  onSubmitEditing={search}
                  placeholder="Venue, sport, or city"
                  placeholderTextColor="#868E96"
                  style={styles.searchInput}
                  returnKeyType="search"
                />
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Search venues"
                  activeOpacity={0.8}
                  disabled={searching}
                  onPress={search}
                  style={[styles.searchButton, searching && styles.disabled]}>
                  {searching ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Icon name="search" size={22} color="#FFF" />
                  )}
                </TouchableOpacity>
              </View>

              {results.map(place => (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Review ${place.name || 'unnamed venue'}`}
                  activeOpacity={0.8}
                  key={place.geoapifyPlaceId}
                  onPress={() => selectPlace(place)}
                  style={styles.resultCard}>
                  <View style={styles.resultDetails}>
                    <Text type="semibold" size={16} numberOfLines={1}>
                      {place.name || 'Unnamed venue'}
                    </Text>
                    <Text
                      type="regular"
                      size={13}
                      color="#ADB5BD"
                      numberOfLines={2}
                      style={styles.resultMeta}>
                      {place.address}
                    </Text>
                    <Text type="regular" size={12} color="#52B788">
                      Suggested:{' '}
                      {(place.suggestedSports || [])
                        .map(titleCase)
                        .join(', ') || 'Manual review needed'}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={22} color="#6C757D" />
                </TouchableOpacity>
              ))}

              {hasSearched && !searching && results.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon
                    name={searchError ? 'wifi-off' : 'search'}
                    size={34}
                    color="#6C757D"
                  />
                  <Text type="semibold" size={17} style={styles.emptyTitle}>
                    {searchError
                      ? 'Search failed'
                      : 'No venue candidates found'}
                  </Text>
                  <Text
                    type="regular"
                    size={13}
                    color="#ADB5BD"
                    textAlign="center">
                    {searchError
                      ? searchError
                      : 'Try a more specific venue name or city.'}
                  </Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={search}
                    style={styles.retryButton}>
                    <Text type="semibold" size={13} color="#52B788">
                      Try again
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          ) : (
            <>
              <View style={styles.reviewCard}>
                <Text type="regular" size={12} color="#52B788">
                  SELECTED VENUE
                </Text>
                <Text type="semibold" size={20} style={styles.reviewName}>
                  {selectedPlace.name || 'Unnamed venue'}
                </Text>
                <Text type="regular" size={14} color="#ADB5BD">
                  {selectedPlace.address}
                </Text>
                <Text
                  type="regular"
                  size={12}
                  color="#868E96"
                  style={styles.providerHours}>
                  Provider hours:{' '}
                  {selectedPlace.openingHours || 'Not available'}
                </Text>
              </View>

              <Text type="semibold" size={17} style={styles.sectionTitle}>
                Sports offered
              </Text>
              <Text
                type="regular"
                size={13}
                color="#ADB5BD"
                style={styles.helpText}>
                Choose sports, then set a price and court count for each one.
              </Text>
              <View style={styles.chipContainer}>
                {SPORTS.map(sport => (
                  <TouchableOpacity
                    accessibilityLabel={`${titleCase(sport)}, ${
                      sportConfigs[sport] ? 'selected' : 'not selected'
                    }`}
                    accessibilityRole="checkbox"
                    accessibilityState={{checked: Boolean(sportConfigs[sport])}}
                    activeOpacity={0.8}
                    key={sport}
                    onPress={() => toggleSport(sport)}
                    style={[
                      styles.chip,
                      sportConfigs[sport] && styles.selectedChip,
                    ]}>
                    <Text type="regular" size={13}>
                      {titleCase(sport)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {Object.entries(sportConfigs).map(([sport, config]) => (
                <View key={sport} style={styles.sportCard}>
                  <Text type="semibold" size={16} style={styles.sportTitle}>
                    {titleCase(sport)}
                  </Text>
                  <Input
                    title="Hourly price (IDR)"
                    value={config.hourlyRate}
                    onChangeText={value =>
                      updateSport(sport, 'hourlyRate', value.replace(/\D/g, ''))
                    }
                    keyboardType="number-pad"
                    placeholder="100000"
                    marginBottom={12}
                  />
                  <Input
                    title="Number of courts"
                    value={config.courtCount}
                    onChangeText={value =>
                      updateSport(sport, 'courtCount', value.replace(/\D/g, ''))
                    }
                    keyboardType="number-pad"
                    placeholder="1"
                  />
                </View>
              ))}

              <Text type="semibold" size={17} style={styles.sectionTitle}>
                Opening days
              </Text>
              <Text
                type="regular"
                size={13}
                color="#ADB5BD"
                style={styles.helpText}>
                Select every day customers can book this venue.
              </Text>
              <View style={styles.chipContainer}>
                {DAYS.map(([day, label]) => (
                  <TouchableOpacity
                    accessibilityLabel={`${label}, ${
                      openDays.includes(day) ? 'open' : 'closed'
                    }`}
                    accessibilityRole="checkbox"
                    accessibilityState={{checked: openDays.includes(day)}}
                    activeOpacity={0.8}
                    key={day}
                    onPress={() => toggleDay(day)}
                    style={[
                      styles.dayChip,
                      openDays.includes(day) && styles.selectedChip,
                    ]}>
                    <Text type="regular" size={12}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.timeRow}>
                <View style={styles.timeInput}>
                  <Input
                    title="Open (HH:mm)"
                    value={openTime}
                    onChangeText={setOpenTime}
                    placeholder="08:00"
                  />
                </View>
                <View style={styles.timeInput}>
                  <Input
                    title="Close (HH:mm)"
                    value={closeTime}
                    onChangeText={setCloseTime}
                    placeholder="22:00"
                  />
                </View>
              </View>

              <Button
                disabled={publishing}
                title={publishing ? 'Publishing…' : 'Publish venue'}
                onPress={confirmPublish}
                buttonStyle={styles.publishButton}
              />
              <Text
                type="regular"
                size={12}
                color="#868E96"
                textAlign="center"
                style={styles.publishHint}>
                Published venues become visible to customers immediately.
              </Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={alert.show}
        body={alert.body}
        onClose={() => setAlert({show: false, body: ''})}
      />
    </SafeAreaView>
  );
};

export default AdminVenuesScreen;
