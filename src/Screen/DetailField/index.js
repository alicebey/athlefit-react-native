import {FlatList, Linking, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Image from '../../Component/Image';
import {AirbnbRating} from 'react-native-ratings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../Component/Button';
import {useNavigation} from '@react-navigation/native';

const Day = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Screen for detail field
const DetailField = ({route}) => {
  const navigation = useNavigation();
  const data = route.params.data;

  if (data === undefined) {
    return null;
  }
  const renderSchedule = ({item, index}) => {
    return (
      <View style={styles.operational}>
        <Text type="regular" size={16}>
          {item}
        </Text>
        <Text type="regular" size={16}>
          {data.open_time} - {data.close_time}
        </Text>
      </View>
    );
  };

  // Function for opening Google Maps
  const openGps = () => {
    const scheme = Platform.OS === 'android' ? 'geo:' : 'maps:';
    const url =
      scheme +
      `${data.location_map.latitude},${data.location_map.longitude}?q=${data.location_name}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.image,
          data.image_url === undefined && {alignItems: 'center'},
        ]}>
        <Icon
          onPress={() => navigation.goBack()}
          name={'arrow-back'}
          style={styles.back}
          size={25}
          color={'#FFF'}
        />
        <Image
          source={
            data.image_url
              ? {uri: data.image_url}
              : require('../../Assets/field.png')
          }
        />
      </View>
      <View style={styles.body}>
        <View style={styles.title}>
          <Text type="bold" size={36}>
            {data.location_name}
          </Text>
        </View>
        <View style={styles.rating}>
          <AirbnbRating
            starContainerStyle={{alignSelf: 'flex-start', marginVertical: 0}}
            count={5}
            isDisabled={true}
            showRating={false}
            size={20}
            defaultRating={data.rating}
          />
        </View>
        <View style={styles.address}>
          <Icon
            name={'place'}
            style={{marginRight: 5}}
            size={25}
            color={'#E63946'}
          />
          <Text type="regular" maxWidth={'90%'} size={16}>
            {data.location_address}
          </Text>
        </View>

        <View style={styles.operationalContainer}>
          <View style={styles.operationalTitle}>
            <Text type="regular" size={16} textAlign={'center'}>
              Operational Time
            </Text>
          </View>

          <FlatList
            data={data.open_day}
            renderItem={renderSchedule}
            keyExtractor={(_, i) => i.toString()}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.button}
            title="Maps"
            titleColor="#52B788"
            backgroundColor="#FFF"
            onPress={openGps}
          />
          <Button
            onPress={() => navigation.navigate('OrderField', {location: data})}
            buttonStyle={styles.button}
            title="Order"
          />
        </View>
      </View>
    </View>
  );
};

export default DetailField;
