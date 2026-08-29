import {View, ImageBackground} from 'react-native';
import React from 'react';
import styles from './styles';
import Text from '../../Component/Text';
import Image from '../../Component/Image';
import Button from '../../Component/Button';
import Header from '../../Component/Header';
import {useNavigation} from '@react-navigation/native';

const LandingPage = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../Assets/background-splash.png')}
        resizeMode="cover"
        style={styles.image}>
        <Header />

        <View style={styles.bottom}>
          <Text type="semibold" style={{marginBottom: 10}} size={40}>
            Find place to{'\n'}build you{' '}
            <Text type="semibold" size={40} color="#95D5B2">
              different
            </Text>
          </Text>
          <Text type="thin" size={14} color={'#fff'}>
            Althefit picks your next best placement exercise and competition
            based on your history, goals, and experience to build your game that
            make you will better.
          </Text>
          <Button
            title="Log In"
            onPress={() => navigation.navigate('Login')}
            backgroundColor="#3A4147"
            buttonStyle={{marginVertical: 10}}
          />
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Signup')}
            buttonStyle={{marginBottom: 10}}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default LandingPage;
