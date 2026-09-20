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
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Text from '../../Component/Text';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import AlertModal from '../../Component/AlertModal';
import LoadingHelper from '../../Utils/LoadingHelper';
import {emailRegex} from '../../Utils/Regex';
import styles from './styles';

const ForgotPasswordScreen = ({route}) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(route?.params?.email || '');
  const [alert, setAlert] = useState({title: '', body: ''});
  const [resetSent, setResetSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendResetEmail = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();
    if (!emailRegex.test(normalizedEmail)) {
      setAlert({
        title: 'Check your email',
        body: 'Enter a valid email address.',
      });
      return;
    }

    setIsSubmitting(true);
    LoadingHelper.show();
    try {
      await auth().sendPasswordResetEmail(normalizedEmail);
      setResetSent(true);
      setAlert({
        title: 'Check your inbox',
        body: 'We sent a password reset link. Check your inbox and spam folder.',
      });
    } catch (error) {
      console.log(error, 'error forgot password');
      if (error.code === 'auth/user-not-found') {
        setResetSent(true);
        setAlert({
          title: 'Check your inbox',
          body: 'If this email is registered, a password reset link will arrive shortly.',
        });
      } else if (error.code === 'auth/too-many-requests') {
        setAlert({
          title: 'Try again later',
          body: 'Too many reset attempts. Please wait a moment and try again.',
        });
      } else if (error.code === 'auth/network-request-failed') {
        setAlert({
          title: 'You are offline',
          body: 'Check your internet connection and try again.',
        });
      } else {
        setAlert({
          title: 'Reset link not sent',
          body: 'We could not send the reset link. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
      LoadingHelper.hide();
    }
  };

  const closeAlert = () => {
    setAlert({title: '', body: ''});
    if (resetSent) {
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
          Forgot password
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
            <View style={styles.iconBadge}>
              <Icon name="mail" size={26} color="#95D5B2" />
            </View>
            <Text type="bold" size={26}>
              Reset your password
            </Text>
            <Text type="regular" size={14} style={styles.description}>
              Enter your registered email and we will send you a secure reset
              link.
            </Text>
            <Input
              title="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={sendResetEmail}
              autoFocus
              placeholder="you@example.com"
            />
            <Button
              title={isSubmitting ? 'Sending…' : 'Send Reset Link'}
              onPress={sendResetEmail}
              disabled={isSubmitting || !email.trim()}
              buttonStyle={styles.button}
              accessibilityHint="Sends a password reset email"
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

export default ForgotPasswordScreen;
