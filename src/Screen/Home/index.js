import {FlatList, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Image from '../../Component/Image';
import FieldCard from '../../Component/FieldCard';
import {useNavigation} from '@react-navigation/native';
import SearchBar from '../../Component/SearchBar';
import firestore from '@react-native-firebase/firestore';
import LoadingHelper from '../../Utils/LoadingHelper';
import { haversineDistance } from '../../Utils/Haversine';
import { useSessionStore } from '../../Service/sessionStore';

const Menu = [
  {
    name: 'Badminton',
    icon: require('../../Assets/Icon-Badminton.png'),
  },
  {
    name: 'Futsal',
    icon: require('../../Assets/Icon-Futsal.png'),
  },
  {
    name: 'Basketball',
    icon: require('../../Assets/Icon-Basketball.png'),
  },
  {
    name: 'Soccer',
    icon: require('../../Assets/Icon-Soccer.png'),
  },
  {
    name: 'Tennis',
    icon: require('../../Assets/Icon-Tennis.png'),
  },
  {
    name: 'Golf',
    icon: require('../../Assets/Icon-Golf.png'),
  },
  {
    name: 'Billiard',
    icon: require('../../Assets/Icon-Billiard.png'),
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isSearch, setIsSearch] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const {location, category} = useSessionStore();

  // Function for get data from firebase;
  const getData = async () => {
    try {
      const store = await firestore().collection('location').get();
      const res = store.docs.map(item => item.data());
      setData(res);
    } catch (error) {
      console.log(error, 'error get data');
    }
  };

  // Function that run immediatly when screen is rendered
  useEffect(() => {
    getData();
  }, []);

  // Data Manipulation 
  const ListData = useMemo(() => {

    // Sorting data by nearest location using haversine algorithm
    const sortedData = data.sort((a, b) => {;
      const distanceA = haversineDistance(location, a.location_map);
      const distanceB = haversineDistance(location, b.location_map);
      return distanceA - distanceB
      // return b.rating - a.rating
    })
    // filter by category
    .filter((item) => {
      return item.category == category.toLowerCase()
    })


    if (search !== '') {

      // Filter by searching word
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
  }, [data, search]);

  const renderMenu = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailMenu', {data: item})}
        activeOpacity={0.8}
        style={styles.menu}>
        <View style={styles.logo}>
          <Image source={item.icon} />
        </View>
        <Text type="semibold" size={14}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.profile}>
          <Icon name={'account-circle'} size={30} color={'#52B788'} />
        </TouchableOpacity>

        {isSearch ? (
          <SearchBar
            value={search}
            onChange={val => setSearch(val)}
            onClose={() => {
              setIsSearch(false);
              setSearch('');
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchField')}
            style={styles.search}>
            <Icon name={'search'} size={30} color={'#FFF'} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.title}>
        <Text type="semibold" size={36}>
          Sports
        </Text>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={Menu}
          renderItem={renderMenu}
          keyExtractor={(_, i) => i.toString()}
          numColumns={4}
        />
      </View>

      <View style={styles.recommendationContainer}>
        <Text type="bold" size={36}>
          Recomendations
        </Text>
        <FlatList
          data={ListData}
          renderItem={({item, index}) => (
            <FieldCard
              data={item}
              onPress={() => navigation.navigate('DetailField', {data: item})}
            />
          )}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              type="regular"
              size={16}
              color={'rgba(255, 255, 255, 0.5)'}
              textAlign={'center'}>
              Data not Found
            </Text>
          }
        />
      </View>
    </View>
  );
};

export default HomeScreen;
