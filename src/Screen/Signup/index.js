import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Header from '../../Component/Header';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';
import {useSessionStore} from '../../Service/sessionStore';
import LoadingHelper from '../../Utils/LoadingHelper';
import AlertModal from '../../Component/AlertModal';
import {emailRegex} from '../../Utils/Regex';

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
  const {login} = useSessionStore();

  // Function submit register
  const onSubmit = async () => {
    
    // Validate email with regex
    if (email.match(emailRegex) == null) {
      setAlert({show: true, body: 'Email tidak valid'});
      return;
    }

    // Validate password is same
    if (password !== confirmPassword) {
      setAlert({show: true, body: 'Password tidak cocok'});
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setAlert({show: true, body: 'Minimum password length is 8 character'});
      return;
    }


    LoadingHelper.show();
    try {
      const res = await auth().createUserWithEmailAndPassword(email, password);
      if (res) {
        // console.log(res, 'register');
        // const snapshot = await auth().verifyPhoneNumber(phone).on();
        // const credential = auth.PhoneAuthProvider.credential(snapshot.verificationId, snapshot.code);
        // await res.user.updatePhoneNumber(credential)
        await res.user.updateProfile({displayName: name});
        await setUser();
        navigation.navigate('Starter');
      }
    } catch (error) {
      console.log(error, 'error signup');
      setAlert({show: true, body: 'Email sudah terdaftar'});
    } finally {
      LoadingHelper.hide();
    }
  };

  // Insert user to firebase database
  const setUser = async () => {
    const id = await firestore().collection('users').get();
    await firestore()
      .collection('users')
      .doc(`${id.size + 1}`)
      .set({
        email: email,
        phone: phone,
        username: name,
        category: '',
        id: id.size + 1,
      })
      .then(() => {
        login({
          username: name,
          phone: phone,
          email: email,
          id: id.size + 1,
        });
      });
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.form}>
            <View style={styles.title}>
              <Text type="bold" size={24}>
                Sign up to save your favorite place and stats
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Input
                value={name}
                onChangeText={val => setName(val)}
                title="Full Name"
                marginBottom={20}
              />
              <Input
                value={phone}
                title="Handphone"
                onChangeText={val => setPhone(val)}
                marginBottom={20}
              />
              <Input
                value={email}
                title="Email"
                onChangeText={val => setEmail(val)}
                marginBottom={20}
              />
              <Input
                value={password}
                title="Password"
                onChangeText={val => setPassword(val)}
                isPassword
              />
              <Text
                type="thin"
                size={12}
                style={{marginBottom: 10, marginTop: 5}}>
                *Password minimum 8 characters
              </Text>
              <Input
                value={confirmPassword}
                onChangeText={val => setConfirmPassword(val)}
                isPassword
                title="Re-Password"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.signup}>
              <Text type="regular" size={12}>
                Have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
                style={styles.button}>
                <Text type="bold" size={12} color={'#52B788'}>
                  {' '}
                  Log in{' '}
                  <Text type="regular" size={12}>
                    now!
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
            <Button
              title="Submit"
              onPress={onSubmit}
              buttonStyle={{marginBottom: 15}}
            />
          </View>
        </View>
      </ScrollView>

      <AlertModal
        visible={alert.show}
        body={alert.body}
        onClose={() => setAlert({show: false, body: ''})}
      />
    </View>
  );
};

export default SignupScreen;
