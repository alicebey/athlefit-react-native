import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AirbnbRating} from 'react-native-ratings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Button from '../../Component/Button';
import Text from '../../Component/Text';
import {currencyFormatter} from '../../Utils/CurrencyFormatter';
import styles from './styles';

const DetailField = ({route}) => {
  const navigation = useNavigation();
  const data = route.params?.data;

  if (!data) {
    return (
      <SafeAreaView style={styles.fallback}>
        <Icon name="error-outline" size={44} color="#6C757D" />
        <Text type="semibold" size={18} style={styles.fallbackTitle}>
          Venue unavailable
        </Text>
        <Text type="regular" size={13} color="#ADB5BD" textAlign="center">
          This venue could not be opened. Please return and try again.
        </Text>
        <Button
          title="Go back"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.fallbackButton}
        />
      </SafeAreaView>
    );
  }

  const sports = data.sports?.length
    ? data.sports
    : [
        {
          slug: data.category,
          name: data.category,
          hourly_rate: data.hourly_rate,
          court_count: data.court_count,
        },
      ];
  const lowestRate = Math.min(
    ...sports.map(sport => Number(sport.hourly_rate || 0)),
  );
  const totalCourts = sports.reduce(
    (sum, sport) => sum + Number(sport.court_count || 0),
    0,
  );

  const openUrl = async url => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Could not open link', 'Please try again in a moment.');
    }
  };

  const openMap = () => {
    const latitude = Number(data.location_map?.latitude);
    const longitude = Number(data.location_map?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert(
        'Location unavailable',
        'This venue has no map location yet.',
      );
      return;
    }
    const coordinates = `${latitude},${longitude}`;
    const label = encodeURIComponent(data.location_name);
    const url =
      Platform.OS === 'android'
        ? `geo:${coordinates}?q=${coordinates}(${label})`
        : `maps:0,0?q=${label}@${coordinates}`;
    openUrl(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            accessibilityLabel={`${data.location_name} venue`}
            source={
              data.image_url
                ? {uri: data.image_url}
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
            {data.location_name}
          </Text>

          <View style={styles.ratingRow}>
            {Number(data.rating) > 0 ? (
              <>
                <AirbnbRating
                  starContainerStyle={styles.ratingStars}
                  count={5}
                  isDisabled
                  showRating={false}
                  size={17}
                  defaultRating={Number(data.rating)}
                />
                <Text type="semibold" size={13} color="#F4C95D">
                  {Number(data.rating).toFixed(1)}
                </Text>
              </>
            ) : (
              <Text type="regular" size={13} color="#ADB5BD">
                Not rated yet
              </Text>
            )}
          </View>

          <View style={styles.addressRow}>
            <Icon name="place" size={20} color="#52B788" />
            <Text
              type="regular"
              size={14}
              color="#CED4DA"
              style={styles.addressText}>
              {data.location_address}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text type="regular" size={12} color="#ADB5BD">
                Starting from
              </Text>
              <Text type="semibold" size={16} color="#52B788">
                IDR {currencyFormatter(lowestRate)}/hr
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text type="regular" size={12} color="#ADB5BD">
                Courts
              </Text>
              <Text type="semibold" size={16}>
                {totalCourts || '—'} in total
              </Text>
            </View>
          </View>

          {sports.length > 1 ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Icon name="sports" size={20} color="#52B788" />
                <Text type="semibold" size={18} style={styles.sectionTitle}>
                  Sports at this venue
                </Text>
              </View>
              {sports.map(sport => (
                <View key={sport.slug} style={styles.scheduleRow}>
                  <Text type="regular" size={14} color="#CED4DA">
                    {sport.name} · {sport.court_count}{' '}
                    {Number(sport.court_count) === 1 ? 'court' : 'courts'}
                  </Text>
                  <Text type="semibold" size={14}>
                    IDR {currencyFormatter(Number(sport.hourly_rate || 0))}/hr
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="schedule" size={20} color="#52B788" />
              <Text type="semibold" size={18} style={styles.sectionTitle}>
                Opening hours
              </Text>
            </View>
            {data.open_day?.length ? (
              data.open_day.map(day => (
                <View key={day} style={styles.scheduleRow}>
                  <Text type="regular" size={14} color="#CED4DA">
                    {day}
                  </Text>
                  <Text type="semibold" size={14}>
                    {data.open_time}–{data.close_time} WIB
                  </Text>
                </View>
              ))
            ) : (
              <Text type="regular" size={14} color="#ADB5BD">
                Opening hours are not available.
              </Text>
            )}
          </View>

          {data.provider_attribution || data.data_attribution ? (
            <View style={styles.attribution}>
              {data.provider_attribution ? (
                <TouchableOpacity
                  accessibilityRole={
                    data.provider_attribution_url ? 'link' : 'text'
                  }
                  disabled={!data.provider_attribution_url}
                  onPress={() => openUrl(data.provider_attribution_url)}>
                  <Text type="regular" size={11} color="#868E96">
                    {data.provider_attribution}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {data.data_attribution ? (
                <TouchableOpacity
                  accessibilityRole={
                    data.data_attribution_url ? 'link' : 'text'
                  }
                  disabled={!data.data_attribution_url}
                  onPress={() => openUrl(data.data_attribution_url)}>
                  <Text type="regular" size={11} color="#868E96">
                    {data.data_attribution}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          <View style={styles.actions}>
            <Button
              title="Open in Maps"
              onPress={openMap}
              buttonStyle={styles.secondaryButton}
              backgroundColor="#2B3035"
              titleColor="#52B788"
            />
            <Button
              title="Book a court"
              onPress={() =>
                navigation.navigate('OrderField', {
                  location: data,
                  sport: data.category,
                })
              }
              buttonStyle={styles.primaryButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailField;
