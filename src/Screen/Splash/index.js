import {View} from 'react-native';
import React, {useEffect} from 'react';
import styles from './styles';
import Text from '../../Component/Text';
import Image from '../../Component/Image';
import {useNavigation} from '@react-navigation/native';
import {useSessionStore} from '../../Service/sessionStore';

const SplashScreen = () => {
  const navigation = useNavigation();
  const {isLogin, category} = useSessionStore();

  useEffect(() => {
    let timeout = setTimeout(() => {
      
      // Check if the user already login
      if (isLogin === true) {

        // check if the user already pick the category
        if (category !== '') {

          // to Screen Home
          navigation.navigate('Main');
        } else {
          
          // to Screen Select Category
          navigation.navigate('Starter');
        }
      } else {

        // to Landing page
        navigation.navigate('Landing');
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Image source={require('../../Assets/ALTHEFIT.png')} />
      </View>
      <View style={styles.subTitle}>
        <Image source={require('../../Assets/SubSplash.png')} />
      </View>
    </View>
  );
};

export default SplashScreen;
