import {FlatList, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Text from '../../Component/Text';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import FieldCard from '../../Component/FieldCard';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import SearchBar from '../../Component/SearchBar';
import { useSessionStore } from '../../Service/sessionStore';
import { haversineDistance } from '../../Utils/Haversine';

const SearchField = ({route}) => {
  const navigation = useNavigation();
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState('');
  const {location} = useSessionStore();

  // Function for getting data from database
  const getData = async () => {
    try {
      const store = await firestore()
        .collection('location')
        .get();
      const res = store.docs.map(item => item.data());
      setListData(res);
    } catch (error) {
      console.log(error, 'error get data detail menu');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Data Manipulation Function
  const ListData = useMemo(() => {

    // Sorting data by haversine distance
    const sortedData = listData.sort((a, b) => {;
      const distanceA = haversineDistance(location, a.location_map);
      const distanceB = haversineDistance(location, b.location_map);
      return distanceA - distanceB
    })
    if (search !== '') {

      // filtering by searching word
      return sortedData.filter(item => {
        const includesName = item.location_name
          .toLowerCase()
          .includes(search.toLowerCase());
        const includesPlace = item.location_address
          .toLowerCase()
          .includes(search.toLowerCase());
        return includesName || includesPlace;
      });
    }
    return sortedData;
  }, [listData, search]);

  const Footer = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footer}>
        <Text size={16} type={'regular'}>
          Search another sport?
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name={'arrow-left'}
          onPress={() => navigation.goBack()}
          size={25}
          color={'#52B788'}
        />
          <SearchBar
            onClose={() => {
              setSearch('');
            }}
            value={search}
            onChange={val => setSearch(val)}
          />
      </View>

      <View style={styles.body}>
        <FlatList
          data={ListData}
          renderItem={({item, index}) => (
            <FieldCard
              data={item}
              onPress={() => navigation.replace('DetailField', {data: item})}
            />
          )}
          keyExtractor={(_, i) => i.toString()}
          ListFooterComponent={<Footer />}
          ListEmptyComponent={
            <Text
              type="regular"
              size={16}
              color={'rgba(255, 255, 255, 0.5)'}
              textAlign={'center'}>
              Data not Found
            </Text>
          }
          contentContainerStyle={{paddingBottom: 70}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default SearchField;
