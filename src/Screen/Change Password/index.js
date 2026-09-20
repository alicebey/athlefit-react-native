import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Text from '../../Component/Text';
import styles from './styles';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import auth from '@react-native-firebase/auth';
import AlertModal from '../../Component/AlertModal';
import LoadingHelper from '../../Utils/LoadingHelper';
import {useSessionStore} from '../../Service/sessionStore';
import {useNavigation} from '@react-navigation/native';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({title: '', body: ''});
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {email} = useSessionStore();
  const navigation = useNavigation();

  const onSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({
        title: 'Passwords do not match',
        body: 'Make sure both new password fields are the same.',
      });
      return;
    }

    if (newPassword === oldPassword) {
      setAlert({
        title: 'Choose a new password',
        body: 'Your new password must be different from your current one.',
      });
      return;
    }

    if (newPassword.length < 8) {
      setAlert({
        title: 'Password is too short',
        body: 'Use at least 8 characters for your new password.',
      });
      return;
    }

    if (!email) {
      setAlert({
        title: 'Session expired',
        body: 'Log out and log in again before changing your password.',
      });
      return;
    }

    setIsSubmitting(true);
    LoadingHelper.show();
    try {
      await auth().signInWithEmailAndPassword(email, oldPassword);
      await auth().currentUser.updatePassword(newPassword);
      setPasswordChanged(true);
      setAlert({
        title: 'Password updated',
        body: 'Your new password is ready to use.',
      });
    } catch (error) {
      console.log(error, 'error update password');
      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-login-credentials'
      ) {
        setAlert({
          title: 'Current password is incorrect',
          body: 'Check your current password and try again.',
        });
      } else if (error.code === 'auth/weak-password') {
        setAlert({
          title: 'Choose a stronger password',
          body: 'Use a less predictable password and try again.',
        });
      } else if (error.code === 'auth/network-request-failed') {
        setAlert({
          title: 'You are offline',
          body: 'Check your internet connection and try again.',
        });
      } else {
        setAlert({
          title: 'Password not changed',
          body: 'We could not update your password. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
      LoadingHelper.hide();
    }
  };

  const closeAlert = () => {
    setAlert({title: '', body: ''});
    if (passwordChanged) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#F8F9FA" />
        </TouchableOpacity>
        <Text accessibilityRole="header" type="semibold" size={18}>
          Change password
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.title}>
              <Text type="bold" size={26}>
                Keep your account secure
              </Text>
              <Text type="regular" size={14} style={styles.description}>
                Confirm your current password, then choose a new one.
              </Text>
            </View>
            <Input
              value={oldPassword}
              onChangeText={setOldPassword}
              isPassword
              marginBottom={18}
              title="Current password"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="next"
            />
            <Input
              value={newPassword}
              onChangeText={setNewPassword}
              isPassword
              title="New password"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
            />
            <Text type="regular" size={12} style={styles.hint}>
              Use at least 8 characters.
            </Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              title="Confirm new password"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
            <Button
              title={isSubmitting ? 'Updating…' : 'Update Password'}
              disabled={
                isSubmitting || !oldPassword || !newPassword || !confirmPassword
              }
              onPress={onSubmit}
              buttonStyle={styles.button}
              accessibilityHint="Updates your Athlefit password"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={alert.body !== ''}
        title={alert.title}
        body={alert.body}
        onClose={closeAlert}
      />
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
