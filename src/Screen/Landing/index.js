import {ImageBackground, ScrollView, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import Text from '../../Component/Text';
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
        style={styles.image}
        accessibilityIgnoresInvertColors>
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Header style={styles.header} />

            <View style={styles.bottom}>
              <Text
                accessibilityRole="header"
                type="bold"
                style={styles.heading}
                size={40}>
                Your next game{'\n'}starts{' '}
                <Text type="bold" size={40} color="#95D5B2">
                  here.
                </Text>
              </Text>
              <Text
                type="regular"
                size={15}
                color="#DEE2E6"
                style={styles.copy}>
                Discover nearby venues, book a court, and keep every game in one
                place.
              </Text>
              <Button
                title="Get Started"
                onPress={() => navigation.navigate('Signup')}
                buttonStyle={styles.primaryButton}
                accessibilityHint="Opens account creation"
              />
              <Button
                title="Log In"
                onPress={() => navigation.navigate('Login')}
                backgroundColor="#343A40"
                buttonStyle={styles.secondaryButton}
                accessibilityHint="Opens account login"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default LandingPage;
