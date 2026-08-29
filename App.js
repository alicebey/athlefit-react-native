import {PermissionsAndroid, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import MainNavigator from './src/Router';
import Geolocation from '@react-native-community/geolocation';
import { useSessionStore } from './src/Service/sessionStore';

const App = () => {
  const {setLocation} = useSessionStore();
  useEffect(() => {
    Geolocation.requestAuthorization(
      () => {
        getCurrentLocation();
      },
      error => console.log(error, 'error permission'),
    );
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log(error, 'error get location');
        getCurrentLocation();
      },
      {
        timeout: 10000,
        maximumAge: 10000,
        enableHighAccuracy: true,
      },
    );
  };

  return <MainNavigator />;
};

export default App;

const styles = StyleSheet.create({});
