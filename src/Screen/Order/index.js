import {FlatList, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Image from '../../Component/Image';
import OrderCard from '../../Component/OrderCard';
import firestore from '@react-native-firebase/firestore';
import {useSessionStore} from '../../Service/sessionStore';
import {useIsFocused, useNavigation} from '@react-navigation/native';

// Screen for list order
const OrderScreen = () => {
  const [data, setData] = useState([]);
  const {user_id} = useSessionStore();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // Get data order from firebase
  const getData = async () => {
    try {
      const store = await firestore()
        .collection('order')
        .where('user_id', '==', user_id)
        .get();
      const res = store.docs.map(item => item.data());
      setData(res);
    } catch (error) {
      console.log(error, 'error get data order');
    }
  };

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getNowDate = val => {
    const date = val.getDate();
    const month = val.getMonth();
    const year = val.getFullYear();

    return date + month + year;
  };

  // Filter data by date
  const ListData = useMemo(() => {
    return data.filter(item => {
      const condition =
        getNowDate(new Date()) <=
        getNowDate(new Date(item.order_time.seconds * 1000));
      return condition;
    });
  }, [data]);

  // Component when the list is Empty
  const ListEmptyOrder = () => {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyImage}>
          <Image source={require('../../Assets/EmptyOrder.png')} />
        </View>
        <View style={styles.emptyText}>
          <Text type="regular" size={16}>
            You didnt have any order here
            <Text type="regular" size={16} color={'#52B788'}>
              . Lets Order!
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={ListData}
        renderItem={({item, index}) => <OrderCard onPress={() => navigation.navigate('Detail Order', {data: item})} data={item} />}
        ListEmptyComponent={<ListEmptyOrder />}
        keyExtractor={(_, i) => i.toString()}
      />
    </View>
  );
};

export default OrderScreen;
