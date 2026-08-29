import {
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Image from '../../Component/Image';
import {AirbnbRating} from 'react-native-ratings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../Component/Button';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {currencyFormatter} from '../../Utils/CurrencyFormatter';
import firestore from '@react-native-firebase/firestore';
import {useSessionStore} from '../../Service/sessionStore';
import LoadingHelper from '../../Utils/LoadingHelper';
import AlertModal from '../../Component/AlertModal';

const DummyHours = [
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
];

// Screen create Order
const OrderField = ({route}) => {
  const location = route.params.location;
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [datePicker, setDatePicker] = useState(false);
  const [timePicker, setTimePickker] = useState(false);
  const [selectedHours, setSelectedHours] = useState(1);
  const [alert, setAlert] = useState({
    show: false,
    body: '',
  });
  const {username, user_id} = useSessionStore();

  // Function for change selected date
  const onChangeDate = (event, date) => {
    const selectedDate = date || new Date();
    setDate(selectedDate);
    setDatePicker(false);
  };

  // Function for change selected time
  const onChangeTime = (event, date) => {
    const selectedTime = date || new Date();
    setTime(selectedTime);
    setTimePickker(false);
  };

  // Function validate order time
  const validate = () => {
    const closeTime = new Date(`01-01-1970 ${location.close_time}`).getHours();
    const nowTime = new Date().getHours();
    const selectedDate = date.getDate();
    const nowDate = new Date().getDate();
    return closeTime <= nowTime + 1 && selectedDate <= nowDate;
  };

  // Function submit for create order
  const onSubmit = async () => {

    // Validate closing time
    if (validate()) {
      setAlert({
        show: true,
        body: 'Anda telah melewati jam open booking\nSilahkan pilih di hari lain',
      });
      return;
    }
    LoadingHelper.show();
    try {
      const {size} = await firestore().collection('order').get();
      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());
      const data = {
        duration: selectedHours,
        id: size + 1,
        order_time: date,
        location_name: location.location_name,
        location_address: location.location_address,
        location_map: location.location_map,
        image_url: location.image_url,
        total_price: selectedHours * 60000,
        user_id: user_id,
      };
      await firestore()
        .collection('order')
        .doc(`${size + 1}`)
        .set(data);
      await sendMessage();
      navigation.navigate('Main', {
        screen: 'Order',
      });
    } catch (error) {
      console.log(error, 'error');
    } finally {
      LoadingHelper.hide();
    }
  };

  const renderHours = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedHours(item.value)}
        style={[
          styles.duration,
          item.value === selectedHours && styles.selectedDuration,
        ]}>
        <Text type="regular" size={16} color={'#F8F9FA'}>
          {item.value} Hours
        </Text>
      </TouchableOpacity>
    );
  };

  // Function for sending message to wa
  const sendMessage = async () => {
    const text = `Hai, saya ${username}, ingin membooking tempat ${
      location.location_name
    } selama ${selectedHours} jam, pada tanggal ${moment(date).format(
      'DD MMMM YYYY',
    )} jam ${moment(date).format('HH')}:00`;
    const url = `whatsapp://send?text=${text}&phone=${location.phone}`;
    Linking.openURL(url);
  };

  if (location === undefined) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.image,
          location.image_url === undefined && {alignItems: 'center'},
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
            location.image_url
              ? {uri: location.image_url}
              : require('../../Assets/field.png')
          }
        />
      </View>
      <View style={styles.body}>
        <View style={styles.title}>
          <Text type="bold" size={36}>
            {location.location_name}
          </Text>
        </View>
        <View style={styles.address}>
          <Icon
            name={'place'}
            style={{marginRight: 5}}
            size={25}
            color={'#E63946'}
          />
          <Text type="regular" maxWidth={'90%'} size={16}>
            {location.location_address}
          </Text>
        </View>

        <View style={styles.bookingName}>
          <Text type="bold" size={16}>
            Booking Name
          </Text>
          <View style={styles.name}>
            <Text type="regular" size={14} color={'#52B788'}>
              {username}
            </Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <TouchableOpacity
            onPress={() => setDatePicker(true)}
            activeOpacity={0.8}
            style={styles.bookingDate}>
            <Text type="bold" size={16}>
              Date
            </Text>
            <View style={styles.date}>
              <Text type="regular" size={16} color={'#F8F9FA'}>
                {moment(date).format('DD MMM YYYY')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTimePickker(true)}
            activeOpacity={0.8}
            style={styles.bookingTime}>
            <Text type="bold" size={16}>
              Time
            </Text>
            <View style={styles.date}>
              <Text type="regular" size={16} color={'#F8F9FA'}>
                {moment(time).format('HH:mm')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.durationContainer}>
          <Text type="bold" size={16}>
            Duration
          </Text>
          <View style={styles.bookingDuration}>
            <FlatList
              data={DummyHours}
              renderItem={renderHours}
              keyExtractor={(_, i) => i.toString()}
              horizontal
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text
              type="bold"
              style={{marginBottom: 5}}
              size={16}
              color={'#FFF'}>
              Estimate Price
            </Text>
            <Text type="regular" size={16}>
              IDR {currencyFormatter(60000 * selectedHours)}
            </Text>
          </View>
          <Button
            onPress={onSubmit}
            buttonStyle={styles.button}
            title="Order"
          />
        </View>
      </View>

      {datePicker && (
        <DateTimePicker
          value={date}
          mode={'date'}
          minimumDate={new Date()}
          onChange={onChangeDate}
        />
      )}
      {timePicker && (
        <DateTimePicker
          value={time}
          mode={'time'}
          minimumDate={new Date()}
          onChange={onChangeTime}
          is24Hour={true}
        />
      )}

      <AlertModal
        visible={alert.show}
        body={alert.body}
        onClose={() => setAlert({show: false, body: ''})}
      />
    </View>
  );
};

export default OrderField;
