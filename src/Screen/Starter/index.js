import {FlatList, View} from 'react-native';
import React, {useState} from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Header from '../../Component/Header';
import {TouchableOpacity} from 'react-native';
import Image from '../../Component/Image';
import Button from '../../Component/Button';
import {useNavigation} from '@react-navigation/native';
import {useSessionStore} from '../../Service/sessionStore';
import firestore from '@react-native-firebase/firestore';
import LoadingHelper from '../../Utils/LoadingHelper';

export const DummyCategory = [
  {
    name: 'Badminton',
    image: require('../../Assets/Badminton.png'),
  },
  {
    name: 'Futsal',
    image: require('../../Assets/Futsal.png'),
  },
  {
    name: 'Basketball',
    image: require('../../Assets/Basketball.png'),
  },
  {
    name: 'Soccer',
    image: require('../../Assets/Soccer.png'),
  },
  {
    name: 'Tennis',
    image: require('../../Assets/Tennis.png'),
  },
  {
    name: 'Golf',
    image: require('../../Assets/Golf.png'),
  },
  {
    name: 'Billiard',
    image: require('../../Assets/Billiard.png'),
  },
]

// Screen Select Category
const StarterScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const {setCategory, user_id} = useSessionStore();

  const renderCategory = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(index)}
        style={[
          styles.category,
          index === selectedCategory && styles.selected,
        ]}>
        <Image source={item.image} />
        <Text style={styles.categoryTitle} type="regular">
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Submit select category
  const onSubmit = async () => {
    LoadingHelper.show();
    try {
      setCategory(DummyCategory[selectedCategory].name);
      await firestore().collection('users').doc(`${user_id}`).update({
        category: DummyCategory[selectedCategory].name,
      });
      console.log(user_id, 'id');
      navigation.reset({
        routes: [{name: 'Main'}],
        index: 0,
      });
    } catch (error) {
      console.log(error, 'error select category');
    }
    LoadingHelper.hide();
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <View style={styles.title}>
          <Text
            type="bold"
            textAlign="center"
            style={{marginBottom: -5}}
            size={24}>
            What’s sport wanna choose?
          </Text>
          <Text type="thin" size={16} textAlign={'center'}>
            max choose 1
          </Text>
        </View>

        <View style={styles.categoryContainer}>
          <FlatList
            data={DummyCategory}
            renderItem={renderCategory}
            keyExtractor={(_, i) => i.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={onSubmit} title="Choose" />
        </View>
      </View>
    </View>
  );
};

export default StarterScreen;
