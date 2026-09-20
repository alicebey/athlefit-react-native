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
import Button from '../../Component/Button';
import Input from '../../Component/Input';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useSessionStore} from '../../Service/sessionStore';
import LoadingHelper from '../../Utils/LoadingHelper';
import AlertModal from '../../Component/AlertModal';
import {getCurrentUser} from '../../Service/userService';
import {emailRegex} from '../../Utils/Regex';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, setCategory} = useSessionStore();
  const [alert, setAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function Login on Submit
  const onSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();
    if (!emailRegex.test(normalizedEmail)) {
      setAlert('Enter a valid email address.');
      return;
    }
    if (!password) {
      setAlert('Enter your password.');
      return;
    }

    setIsSubmitting(true);
    LoadingHelper.show();
    try {
      await auth().signInWithEmailAndPassword(normalizedEmail, password);
      const data = await getCurrentUser();
      login({
        username: data.username,
        phone: data.phone,
        email: data.email,
        id: data.id,
      });
      setCategory(data.category);
      if (data.category !== '') {
        navigation.reset({
          routes: [{name: 'Main'}],
          index: 0,
        });
      } else {
        navigation.reset({routes: [{name: 'Starter'}], index: 0});
      }
    } catch (error) {
      console.log(error, 'error login');
      if (error.code === 'auth/network-request-failed') {
        setAlert('You appear to be offline. Check your connection and retry.');
      } else if (error.code?.startsWith('auth/')) {
        setAlert('Incorrect email or password.');
      } else {
        setAlert('Unable to log in right now. Please try again.');
      }
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
            <View>
              <View style={styles.title}>
                <Text accessibilityRole="header" type="bold" size={28}>
                  Welcome back
                </Text>
                <Text type="regular" size={14} style={styles.subtitle}>
                  Log in to find venues and manage your bookings.
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  title="Email"
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
                  onChangeText={setPassword}
                  isPassword
                  title="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                />
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Forgot password"
                  onPress={() =>
                    navigation.navigate('Forgot Password', {
                      email: email.trim(),
                    })
                  }
                  activeOpacity={0.8}
                  style={styles.forgotButton}>
                  <Text type="semibold" size={13} color="#95D5B2">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title={isSubmitting ? 'Logging In…' : 'Log In'}
                onPress={onSubmit}
                disabled={isSubmitting || !email.trim() || !password}
                accessibilityHint="Logs in to your Athlefit account"
              />
              <View style={styles.signup}>
                <Text type="regular" size={13} color="#ADB5BD">
                  New to Athlefit?
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Create an account"
                  onPress={() => navigation.navigate('Signup')}
                  activeOpacity={0.8}
                  style={styles.linkButton}>
                  <Text type="semibold" size={13} color="#95D5B2">
                    Create account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={alert !== ''}
        title="Unable to log in"
        body={alert}
        onClose={() => setAlert('')}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;
