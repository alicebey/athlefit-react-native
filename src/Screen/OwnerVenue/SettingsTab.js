import {Alert, ScrollView, Switch, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Button from '../../Component/Button';
import Input from '../../Component/Input';
import Text from '../../Component/Text';
import {useSports} from '../../Utils/Sports';
import {
  assignVenueOwner,
  updateVenueSettings,
  upsertVenueSport,
} from '../../Service/ownerService';
import styles from './styles';

const DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const toDayKey = name => (name || '').toUpperCase();
const dayLabel = day => day.charAt(0) + day.slice(1, 3).toLowerCase();

const SportEditor = ({venueId, sport, isNew, onSaved, onCancel}) => {
  const [rate, setRate] = useState(
    sport.hourlyRate ? String(Number(sport.hourlyRate)) : '',
  );
  const [courts, setCourts] = useState(
    sport.courtCount ? String(sport.courtCount) : '1',
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const hourlyRate = Number(rate);
    const courtCount = Number(courts);
    if (!Number.isFinite(hourlyRate) || hourlyRate < 1) {
      Alert.alert('Check the price', 'Enter an hourly price in rupiah.');
      return;
    }
    if (!Number.isInteger(courtCount) || courtCount < 1 || courtCount > 50) {
      Alert.alert('Check the courts', 'Use between 1 and 50 courts.');
      return;
    }
    setSaving(true);
    try {
      onSaved(
        await upsertVenueSport(venueId, sport.slug, {hourlyRate, courtCount}),
      );
    } catch (error) {
      Alert.alert('Could not save sport', error.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text type="semibold" size={15}>
        {sport.name}
      </Text>
      <View style={styles.inputRow}>
        <View style={styles.flex}>
          <Input
            title="Price / hour (IDR)"
            value={rate}
            onChangeText={setRate}
            keyboardType="number-pad"
          />
        </View>
        <View style={[styles.courtInput, styles.buttonGap]}>
          <Input
            title="Courts"
            value={courts}
            onChangeText={setCourts}
            keyboardType="number-pad"
          />
        </View>
      </View>
      <View style={styles.buttonRow}>
        {isNew ? (
          <Button
            title="Cancel"
            backgroundColor="#343A40"
            onPress={onCancel}
            buttonStyle={styles.smallButton}
          />
        ) : null}
        <Button
          title={saving ? 'Saving…' : isNew ? `Add ${sport.name}` : 'Save'}
          disabled={saving}
          onPress={save}
          buttonStyle={[styles.smallButton, isNew && styles.buttonGap]}
        />
      </View>
    </View>
  );
};

const SettingsTab = ({venue, isAdmin, onVenueUpdated}) => {
  const allSports = useSports();
  const [active, setActive] = useState(venue.active);
  const [phone, setPhone] = useState(venue.phone || '');
  const [openDays, setOpenDays] = useState(venue.openDays.map(toDayKey));
  const [openTime, setOpenTime] = useState(venue.openTime || '');
  const [closeTime, setCloseTime] = useState(venue.closeTime || '');
  const [bankName, setBankName] = useState(venue.bankName || '');
  const [accountNumber, setAccountNumber] = useState(
    venue.bankAccountNumber || '',
  );
  const [accountHolder, setAccountHolder] = useState(
    venue.bankAccountHolder || '',
  );
  const [ownerEmail, setOwnerEmail] = useState(venue.ownerEmail || '');
  const [newSport, setNewSport] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setActive(venue.active);
  }, [venue.active]);

  const toggleDay = day =>
    setOpenDays(current =>
      current.includes(day)
        ? current.filter(value => value !== day)
        : [...current, day],
    );

  const saveSettings = async () => {
    if (!openDays.length) {
      Alert.alert('Opening days', 'Select at least one opening day.');
      return;
    }
    if (
      !TIME_PATTERN.test(openTime) ||
      !TIME_PATTERN.test(closeTime) ||
      closeTime <= openTime
    ) {
      Alert.alert(
        'Opening hours',
        'Use HH:mm times, with closing after opening (e.g. 08:00–22:00).',
      );
      return;
    }
    const bank = [bankName, accountNumber, accountHolder].map(value =>
      value.trim(),
    );
    if (bank.some(Boolean) && !bank.every(Boolean)) {
      Alert.alert(
        'Transfer details',
        'Fill in bank, account number and account name — or leave all three empty.',
      );
      return;
    }
    setSaving(true);
    try {
      onVenueUpdated(
        await updateVenueSettings(venue.id, {
          phone: phone.trim(),
          openDays,
          openTime,
          closeTime,
          active,
          bankName: bank[0],
          bankAccountNumber: bank[1],
          bankAccountHolder: bank[2],
        }),
      );
      Alert.alert('Saved', 'Venue settings were updated.');
    } catch (error) {
      Alert.alert('Could not save', error.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveOwner = async () => {
    setSaving(true);
    try {
      onVenueUpdated(await assignVenueOwner(venue.id, ownerEmail.trim()));
      Alert.alert(
        'Owner updated',
        ownerEmail.trim()
          ? `${ownerEmail.trim()} can now manage this venue.`
          : 'This venue no longer has an owner.',
      );
    } catch (error) {
      Alert.alert(
        'Could not update owner',
        error.message || 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const offered = venue.sports.map(sport => sport.slug);
  const addable = allSports.filter(sport => !offered.includes(sport.slug));

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={[styles.card, styles.switchRow]}>
        <View style={styles.flex}>
          <Text type="semibold" size={15}>
            Accept bookings
          </Text>
          <Text type="regular" size={12} color="#ADB5BD">
            {active
              ? 'Customers can find and book this venue.'
              : 'Hidden from customers. Existing bookings stay valid.'}
          </Text>
        </View>
        <Switch
          accessibilityLabel="Accept bookings"
          value={active}
          onValueChange={setActive}
          trackColor={{false: '#495057', true: '#3D8F6B'}}
          thumbColor={active ? '#52B788' : '#ADB5BD'}
        />
      </View>

      <View style={styles.section}>
        <Text type="semibold" size={18}>
          Opening hours (WIB)
        </Text>
        <View style={styles.dayRow}>
          {DAYS.map(day => {
            const selected = openDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                accessibilityLabel={day.toLowerCase()}
                accessibilityRole="checkbox"
                accessibilityState={{checked: selected}}
                onPress={() => toggleDay(day)}
                style={[styles.day, selected && styles.daySelected]}>
                <Text
                  type="semibold"
                  size={12}
                  color={selected ? '#FFFFFF' : '#ADB5BD'}>
                  {dayLabel(day)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.inputRow}>
          <View style={styles.flex}>
            <Input
              title="Opens"
              value={openTime}
              onChangeText={setOpenTime}
              placeholder="08:00"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View style={[styles.flex, styles.buttonGap]}>
            <Input
              title="Closes"
              value={closeTime}
              onChangeText={setCloseTime}
              placeholder="22:00"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text type="semibold" size={18}>
          Contact & transfer details
        </Text>
        <Text
          type="regular"
          size={12}
          color="#868E96"
          style={styles.sectionHint}>
          Customers see these details when paying for a booking.
        </Text>
        <Input
          title="Venue phone / WhatsApp"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          marginBottom={12}
        />
        <Input
          title="Bank"
          value={bankName}
          onChangeText={setBankName}
          placeholder="e.g. BCA"
          autoCapitalize="characters"
          marginBottom={12}
        />
        <Input
          title="Account number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="number-pad"
          marginBottom={12}
        />
        <Input
          title="Account name"
          value={accountHolder}
          onChangeText={setAccountHolder}
          autoCapitalize="words"
        />
      </View>

      <Button
        title={saving ? 'Saving…' : 'Save venue settings'}
        disabled={saving}
        onPress={saveSettings}
        buttonStyle={styles.saveButton}
      />

      <View style={styles.section}>
        <Text type="semibold" size={18}>
          Sports, prices & courts
        </Text>
        <Text
          type="regular"
          size={12}
          color="#868E96"
          style={styles.sectionHint}>
          Price changes apply to new bookings. Courts with upcoming bookings
          cannot be removed.
        </Text>
        {venue.sports.map(sport => (
          <SportEditor
            key={`${sport.slug}-${sport.hourlyRate}-${sport.courtCount}`}
            venueId={venue.id}
            sport={sport}
            onSaved={onVenueUpdated}
          />
        ))}
        {newSport ? (
          <SportEditor
            venueId={venue.id}
            sport={newSport}
            isNew
            onCancel={() => setNewSport(null)}
            onSaved={updated => {
              setNewSport(null);
              onVenueUpdated(updated);
            }}
          />
        ) : addable.length ? (
          <View style={styles.dayRow}>
            {addable.map(sport => (
              <TouchableOpacity
                key={sport.slug}
                accessibilityRole="button"
                accessibilityLabel={`Add ${sport.name}`}
                onPress={() =>
                  setNewSport({slug: sport.slug, name: sport.name})
                }
                style={styles.day}>
                <Text type="semibold" size={12} color="#52B788">
                  + {sport.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      {isAdmin ? (
        <View style={styles.section}>
          <Text type="semibold" size={18}>
            Venue owner
          </Text>
          <Text
            type="regular"
            size={12}
            color="#868E96"
            style={styles.sectionHint}>
            The owner must already have an Athlefit account. Leave empty to
            remove the owner.
          </Text>
          <Input
            title="Owner email"
            value={ownerEmail}
            onChangeText={setOwnerEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            title={saving ? 'Saving…' : 'Update owner'}
            backgroundColor="#343A40"
            disabled={saving}
            onPress={saveOwner}
            buttonStyle={styles.saveButton}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

export default SettingsTab;
