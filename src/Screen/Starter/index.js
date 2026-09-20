import {FlatList, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../Component/Text';
import styles from './styles';
import Header from '../../Component/Header';
import Image from '../../Component/Image';
import Button from '../../Component/Button';
import AlertModal from '../../Component/AlertModal';
import {useNavigation} from '@react-navigation/native';
import {useSessionStore} from '../../Service/sessionStore';
import LoadingHelper from '../../Utils/LoadingHelper';
import {updateCurrentUser} from '../../Service/userService';

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
];

// Screen Select Category
const StarterScreen = ({route}) => {
  const navigation = useNavigation();
  const {category, setCategory} = useSessionStore();
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedIndex = DummyCategory.findIndex(item => item.name === category);
    return savedIndex < 0 ? 0 : savedIndex;
  });
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({show: false, body: ''});

  const renderCategory = ({item, index}) => {
    return (
      <TouchableOpacity
        accessibilityLabel={`Choose ${item.name}`}
        accessibilityRole="radio"
        accessibilityState={{selected: index === selectedCategory}}
        activeOpacity={0.8}
        onPress={() => setSelectedCategory(index)}
        style={[
          styles.category,
          index === selectedCategory && styles.selected,
        ]}>
        <View style={styles.categoryImage}>
          <Image source={item.image} />
        </View>
        <Text style={styles.categoryTitle} type="regular">
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Submit select category
  const onSubmit = async () => {
    if (saving) {
      return;
    }
    setSaving(true);
    LoadingHelper.show();
    try {
      const selectedSport = DummyCategory[selectedCategory].name;
      await updateCurrentUser({
        favoriteSport: selectedSport,
      });
      setCategory(selectedSport);
      if (route?.params?.returnToProfile) {
        navigation.goBack();
      } else {
        navigation.reset({routes: [{name: 'Main'}], index: 0});
      }
    } catch (error) {
      console.log(error, 'error select category');
      setAlert({
        show: true,
        body: error.message || 'Could not save your favourite sport.',
      });
    } finally {
      LoadingHelper.hide();
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <View style={styles.body}>
        <View style={styles.title}>
          <Text type="bold" textAlign="center" size={28}>
            Choose your favourite sport
          </Text>
          <Text
            type="regular"
            size={14}
            color="#ADB5BD"
            textAlign="center"
            style={styles.subtitle}>
            We’ll personalise venue recommendations for you.
          </Text>
        </View>

        <View style={styles.categoryContainer}>
          <FlatList
            data={DummyCategory}
            renderItem={renderCategory}
            keyExtractor={item => item.name}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            contentContainerStyle={styles.categoryList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            disabled={saving}
            onPress={onSubmit}
            title={saving ? 'Saving…' : category ? 'Save sport' : 'Continue'}
          />
        </View>
      </View>

      <AlertModal
        visible={alert.show}
        body={alert.body}
        onClose={() => setAlert({show: false, body: ''})}
      />
    </SafeAreaView>
  );
};

export default StarterScreen;
