import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import Header from '../../Component/Header';
import Text from '../../Component/Text';
import Button from '../../Component/Button';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {useSessionStore} from '../../Service/sessionStore';
import auth from '@react-native-firebase/auth';
import {getCurrentUser} from '../../Service/userService';

const SplashScreen = () => {
  const navigation = useNavigation();
  const {login, setCategory, clearSession} = useSessionStore();
  const [restoring, setRestoring] = useState(true);
  const [error, setError] = useState(false);

  const restoreSession = useCallback(async () => {
    setRestoring(true);
    setError(false);

    if (!auth().currentUser) {
      clearSession();
      navigation.reset({routes: [{name: 'Landing'}], index: 0});
      return;
    }

    try {
      const user = await getCurrentUser();
      login(user);
      setCategory(user.category);
      navigation.reset({
        routes: [{name: user.category ? 'Main' : 'Starter'}],
        index: 0,
      });
    } catch (requestError) {
      console.log(requestError, 'error restoring session');
      setError(true);
      setRestoring(false);
    }
  }, [clearSession, login, navigation, setCategory]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const onSignOut = async () => {
    await auth().signOut();
    clearSession();
    navigation.reset({routes: [{name: 'Landing'}], index: 0});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {error ? (
        <View style={styles.feedback}>
          <Icon name="wifi-off" size={36} color="#6C757D" />
          <Text
            accessibilityRole="header"
            type="semibold"
            size={18}
            style={styles.feedbackTitle}>
            Could not restore your session
          </Text>
          <Text type="regular" size={13} color="#ADB5BD" textAlign="center">
            Check your connection, then try again.
          </Text>
          <Button
            title={restoring ? 'Trying again…' : 'Try again'}
            disabled={restoring}
            onPress={restoreSession}
            buttonStyle={styles.retryButton}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Sign out and use another account"
            onPress={onSignOut}
            style={styles.signOutButton}>
            <Text type="semibold" size={14} color="#ADB5BD">
              Use another account
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#52B788" />
          <Text type="regular" size={13} color="#ADB5BD" style={styles.status}>
            Getting everything ready…
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SplashScreen;
