import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Feather';
import Text from '../../Component/Text';
import Image from '../../Component/Image';
import Button from '../../Component/Button';
import AlertModal from '../../Component/AlertModal';
import styles from './styles';
import {useSessionStore} from '../../Service/sessionStore';
import {DummyCategory} from '../Starter';
import {updateCurrentUser} from '../../Service/userService';
import {getAdminStatus} from '../../Service/adminVenueService';

const ProfileScreen = () => {
  const {username, category, email, phone, setUsername, clearSession} =
    useSessionStore();
  const [name, setName] = useState(username);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [alert, setAlert] = useState({show: false, body: ''});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const input = useRef(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getAdminStatus()
        .then(status => {
          if (isActive) {
            setIsAdmin(Boolean(status.admin));
            setIsOwner(Boolean(status.owner));
          }
        })
        .catch(requestError =>
          console.log(requestError, 'error get admin status'),
        );

      return () => {
        isActive = false;
      };
    }, []),
  );

  const selectedCategory = useMemo(
    () => DummyCategory.find(item => item.name === category),
    [category],
  );

  const startEditing = () => {
    setName(username);
    setIsEdit(true);
    requestAnimationFrame(() => input.current?.focus());
  };

  const cancelEditing = () => {
    setName(username);
    setIsEdit(false);
  };

  const saveName = async () => {
    const nextName = name.trim();
    if (!nextName) {
      setAlert({show: true, body: 'Enter your name before saving.'});
      return;
    }
    if (nextName === username) {
      setIsEdit(false);
      return;
    }

    setSaving(true);
    try {
      await auth().currentUser.updateProfile({displayName: nextName});
      await updateCurrentUser({fullName: nextName});
      setUsername(nextName);
      setIsEdit(false);
    } catch (requestError) {
      console.log(requestError, 'error on edit');
      setAlert({
        show: true,
        body: requestError.message || 'We could not update your name.',
      });
    } finally {
      setSaving(false);
    }
  };

  const logOut = async () => {
    setLoggingOut(true);
    try {
      await auth().signOut();
      clearSession();
      navigation.reset({routes: [{name: 'Landing'}], index: 0});
    } catch (requestError) {
      setAlert({
        show: true,
        body: requestError.message || 'We could not log you out.',
      });
      setLoggingOut(false);
    }
  };

  const confirmLogOut = () => {
    Alert.alert('Log out?', 'You will need to sign in again to book a venue.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Log out', style: 'destructive', onPress: logOut},
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text accessibilityRole="header" type="semibold" size={28}>
          Profile
        </Text>
        <Text type="regular" size={13} color="#ADB5BD" style={styles.subtitle}>
          Keep your account and sport preference up to date
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Icon name="user" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.identity}>
            {isEdit ? (
              <TextInput
                ref={input}
                accessibilityLabel="Full name"
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={saveName}
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            ) : (
              <>
                <Text type="semibold" size={20} numberOfLines={1}>
                  {username || 'Athlefit member'}
                </Text>
                <Text
                  type="regular"
                  size={12}
                  color="#ADB5BD"
                  numberOfLines={1}>
                  {email || 'Signed-in account'}
                </Text>
              </>
            )}
          </View>
          <View style={styles.editActions}>
            {isEdit ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Cancel editing name"
                disabled={saving}
                onPress={cancelEditing}
                style={styles.iconButton}>
                <Icon name="x" size={20} color="#ADB5BD" />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={isEdit ? 'Save name' : 'Edit name'}
              accessibilityState={{disabled: saving}}
              disabled={saving}
              onPress={isEdit ? saveName : startEditing}
              style={styles.iconButton}>
              <Icon
                name={isEdit ? 'check' : 'edit-2'}
                size={20}
                color="#52B788"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text type="semibold" size={16} style={styles.sectionTitle}>
          Favourite sport
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Favourite sport: ${
            category || 'not selected'
          }. Change sport`}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Starter', {returnToProfile: true})
          }
          style={styles.sportCard}>
          <View style={styles.sportImage}>
            {selectedCategory ? (
              <Image
                accessible={false}
                resizeMode="cover"
                source={selectedCategory.image}
              />
            ) : (
              <Icon name="activity" size={28} color="#52B788" />
            )}
          </View>
          <View style={styles.sportText}>
            <Text type="semibold" size={17}>
              {category || 'Choose a sport'}
            </Text>
            <Text type="regular" size={12} color="#ADB5BD">
              Used to personalise venue recommendations
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color="#52B788" />
        </TouchableOpacity>

        <Text type="semibold" size={16} style={styles.sectionTitle}>
          Account details
        </Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Icon name="mail" size={19} color="#52B788" />
            <View style={styles.detailText}>
              <Text type="regular" size={12} color="#ADB5BD">
                Email
              </Text>
              <Text type="semibold" size={14} numberOfLines={1}>
                {email || 'Not available'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Icon name="phone" size={19} color="#52B788" />
            <View style={styles.detailText}>
              <Text type="regular" size={12} color="#ADB5BD">
                Phone
              </Text>
              <Text type="semibold" size={14} numberOfLines={1}>
                {phone || 'Not provided'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          {isOwner || isAdmin ? (
            <Button
              onPress={() => navigation.navigate('Owner Venues')}
              title={isAdmin ? 'Manage venues & bookings' : 'My venues'}
              accessibilityHint="Opens venue bookings, payments and settings"
              buttonStyle={styles.actionSpacing}
            />
          ) : null}
          {isAdmin ? (
            <Button
              onPress={() => navigation.navigate('Admin Venues')}
              title="Add a venue"
              backgroundColor="#343A40"
              accessibilityHint="Opens the admin venue onboarding screen"
              buttonStyle={styles.actionSpacing}
            />
          ) : null}
          <Button
            onPress={() => navigation.navigate('Change Password')}
            title="Change password"
            backgroundColor="#343A40"
            accessibilityHint="Opens password settings"
          />
          <Button
            title={loggingOut ? 'Logging out…' : 'Log out'}
            disabled={loggingOut}
            onPress={confirmLogOut}
            backgroundColor="#3A2527"
            titleColor="#FF8787"
            buttonStyle={styles.logoutButton}
          />
        </View>
      </ScrollView>

      <AlertModal
        visible={alert.show}
        title="Profile update"
        body={alert.body}
        onClose={() => setAlert({show: false, body: ''})}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
