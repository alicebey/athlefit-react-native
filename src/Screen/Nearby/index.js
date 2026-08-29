import {Linking, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';

const NearbyScreen = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  const getData = async () => {
    try {
      const store = await firestore().collection('location').get();
      const res = store.docs.map(item => item.data());
      setData(res.filter(item => item.location_map !== undefined));
    } catch (error) {
      console.log(error, 'error get location');
    }
  };

  useEffect(() => {
    getData();
  }, [isFocused]);

  // function for Get user phone location
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

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const openGps = (latitude, longitude, name) => {
    const scheme = Platform.OS === 'android' ? 'geo:' : 'maps:';
    const url =
      scheme +
      `${latitude},${longitude}?q=${name}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {data.map((item, index) => {
          return (
            <Marker
              key={index}
              title={item.location_name}
              description={item.location_address}
              onCalloutPress={() => openGps(item.location_map.latitude, item.location_map.longitude, item.location_name)}
              coordinate={{latitude: item.location_map.latitude, longitude: item.location_map.longitude}}/>
          );
        })}
      </MapView>
    </View>
  );
};

export default NearbyScreen;
