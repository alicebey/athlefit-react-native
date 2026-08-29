import {TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Header from '../../Component/Header';
import Button from '../../Component/Button';
import Input from '../../Component/Input';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {emailRegex} from '../../Utils/Regex';
import {useSessionStore} from '../../Service/sessionStore';
import LoadingHelper from '../../Utils/LoadingHelper';
import AlertModal from '../../Component/AlertModal';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, category, setCategory} = useSessionStore();
  const [alert, setAlert] = useState(false);

  // Function Login on Submit
  const onSubmit = async () => {
    LoadingHelper.show();
    try {
      let res;
      if (email.match(emailRegex)) {
        res = await auth().signInWithEmailAndPassword(email, password);
      } else {
        const store = await firestore()
          .collection('users')
          .where('phone', '==', email)
          .get();
        const userEmail = store.docs[0].data().email;
        res = await auth().signInWithEmailAndPassword(userEmail, password);
      }
      await authMe(res.user.email);
    } catch (error) {
      console.log(error, 'error login');
      LoadingHelper.hide();
      setAlert(true);
    }
  };

  // Function get user data after login
  const authMe = async mail => {
    try {
      const res = await firestore()
        .collection('users')
        .where('email', '==', mail)
        .get();
      const data = res.docs[0].data();
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
        navigation.navigate('Starter');
      }
    } catch (error) {
      console.log(error, 'error auth me');
    } finally {
      LoadingHelper.hide();
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <View style={styles.form}>
          <View style={styles.title}>
            <Text type="bold" size={24}>
              Log in to get your favorite place back
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              value={email}
              onChangeText={val => setEmail(val)}
              title="Email or Handphone"
              marginBottom={20}
            />
            <Input
              value={password}
              onChangeText={val => setPassword(val)}
              isPassword
              title="Password"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.signup}>
            <Text type="regular" size={12}>
              Didn`t have any account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              activeOpacity={0.8}
              style={styles.button}>
              <Text type="bold" size={12} color={'#52B788'}>
                {' '}
                Sign Up{' '}
                <Text type="regular" size={12}>
                  now!
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            title="Log In"
            onPress={onSubmit}
            buttonStyle={{marginBottom: 15}}
            disabled={email == '' || password == ''}
          />
          <Button title="Forget Password" backgroundColor="#3A4147" />
        </View>
      </View>

      <AlertModal
        visible={alert}
        body={'Email atau Password salah'}
        onClose={() => setAlert(false)}
      />
    </View>
  );
};

export default LoginScreen;
