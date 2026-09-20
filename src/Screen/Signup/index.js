import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../Component/Text';
import styles from './styles';
import Header from '../../Component/Header';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useSessionStore} from '../../Service/sessionStore';
import LoadingHelper from '../../Utils/LoadingHelper';
import AlertModal from '../../Component/AlertModal';
import {emailRegex} from '../../Utils/Regex';
import {updateCurrentUser} from '../../Service/userService';

// Screen for register
const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({
    show: false,
    body: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {login} = useSessionStore();

  // Function submit register
  const onSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();
    const normalizedName = name.trim();
    const normalizedPhone = phone.trim();

    if (!normalizedName) {
      setAlert({show: true, body: 'Enter your full name.'});
      return;
    }

    if (normalizedPhone.replace(/\D/g, '').length < 8) {
      setAlert({show: true, body: 'Enter a valid phone number.'});
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      setAlert({show: true, body: 'Enter a valid email address.'});
      return;
    }

    if (password !== confirmPassword) {
      setAlert({show: true, body: 'Passwords do not match.'});
      return;
    }

    if (password.length < 8) {
      setAlert({show: true, body: 'Password must be at least 8 characters.'});
      return;
    }

    setIsSubmitting(true);
    LoadingHelper.show();
    try {
      const res = await auth().createUserWithEmailAndPassword(
        normalizedEmail,
        password,
      );
      if (res) {
        await res.user.updateProfile({displayName: normalizedName});
        const user = await updateCurrentUser({
          fullName: normalizedName,
          phone: normalizedPhone,
          favoriteSport: '',
        });
        login(user);
        navigation.reset({routes: [{name: 'Starter'}], index: 0});
      }
    } catch (error) {
      console.log(error, 'error signup');
      setAlert({
        show: true,
        body:
          error.code === 'auth/email-already-in-use'
            ? 'An account already exists for this email.'
            : error.code === 'auth/network-request-failed'
            ? 'You appear to be offline. Check your connection and retry.'
            : 'Unable to create your account right now. Please retry.',
      });
    } finally {
      setIsSubmitting(false);
      LoadingHelper.hide();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Header style={styles.header} />
          <View style={styles.body}>
            <View style={styles.title}>
              <Text accessibilityRole="header" type="bold" size={28}>
                Create your account
              </Text>
              <Text type="regular" size={14} style={styles.subtitle}>
                Find a venue, book your court, and get in the game.
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Input
                value={name}
                onChangeText={setName}
                title="Full name"
                placeholder="Your name"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                marginBottom={18}
              />
              <Input
                value={phone}
                title="Phone number"
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                returnKeyType="next"
                placeholder="08xx xxxx xxxx"
                marginBottom={18}
              />
              <Input
                value={email}
                title="Email"
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                placeholder="you@example.com"
                marginBottom={18}
              />
              <Input
                value={password}
                title="Password"
                onChangeText={setPassword}
                isPassword
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
                title="Confirm password"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
            </View>

            <Button
              title={isSubmitting ? 'Creating Account…' : 'Create Account'}
              onPress={onSubmit}
              buttonStyle={styles.submitButton}
              disabled={
                isSubmitting ||
                !name.trim() ||
                !phone.trim() ||
                !email.trim() ||
                !password ||
                !confirmPassword
              }
            />
            <View style={styles.signup}>
              <Text type="regular" size={13} color="#ADB5BD">
                Already have an account?
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Log in to your account"
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
                style={styles.linkButton}>
                <Text type="semibold" size={13} color="#95D5B2">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={alert.show}
        title="Unable to create account"
        body={alert.body}
        onClose={() => setAlert({show: false, body: ''})}
      />
    </SafeAreaView>
  );
};

export default SignupScreen;
