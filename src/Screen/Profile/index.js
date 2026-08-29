import {FlatList, TextInput, TouchableOpacity, View} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Icon from 'react-native-vector-icons/Feather';
import Image from '../../Component/Image';
import Button from '../../Component/Button';
import {useSessionStore} from '../../Service/sessionStore';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AlertModal from '../../Component/AlertModal';
import { DummyCategory } from '../Starter';

// Screen for Profile
const ProfileScreen = () => {
  const {username, category, setUsername, user_id, clearSession} = useSessionStore();
  const [name, setName] = useState(username);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState({show: false, body: ''});
  const input = useRef(null);
  const navigation = useNavigation();

  // Searching selected category by login user
  const Category = useMemo(() => {
    return DummyCategory.find((item) => item.name == category);
  }, [category])

  const AddCategory = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Starter')}
        style={styles.add}>
        <Icon name={'plus-square'} size={50} color={'#FFF'} />
        <Text style={{marginTop: 5}} color={'#FFF'} type="regular">
          Change
        </Text>
      </TouchableOpacity>
    );
  };

  // function for edit
  const onEdit = async () => {

    // Validate name is empty
    if (name === '') {
      setAlert({show: true,  body: 'Name cannot be Empty'});
      return;
    }

    try {
      await auth().currentUser.updateProfile({displayName: name})
      await firestore().collection('users').doc(`${user_id}`).update({username: name})
      setUsername(name);
      setIsEdit(false);
    } catch (error) {
      console.log(error, 'error on edit');
    }
  }

  // function for logout
  const onLogout = async () => {
    await auth().signOut();
    clearSession();
    navigation.reset({
      routes: [{name: 'Landing'}],
      index: 0
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name={'user'} size={40} color={'#FFF'} />
        </View>
        <View style={styles.name}>
          {!isEdit ? <Text type="bold" size={24} color={'#FFF'}>
            {username}
          </Text> : <TextInput ref={input} style={styles.input} value={name} onChangeText={(val) => setName(val)} />}
          
        </View>
        <View style={styles.edit}>
          <Icon onPress={() => {
            if (isEdit) {
              onEdit()
            } else {
              setIsEdit(true)
              setTimeout(() => {
                if (input) {
                  input.current.focus();
                }
              }, 1000)
            }
          }} name={isEdit ? 'check' : 'edit'} size={30} color={'#FFF'} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.title}>
          <Text type="regular" size={24} textAlign={'center'}>
            Your favourite game
          </Text>
        </View>

        <View style={styles.categoryContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.category]}>
              <Image source={Category?.image} />
              <Text style={styles.categoryTitle} type="regular">
                {Category?.name}
              </Text>
            </View>

            <AddCategory />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate('Change Password')}
          title="Update Password"
        />
        <Button title={'Log out'} onPress={onLogout} backgroundColor={'#EA2518'} buttonStyle={{marginTop: 20}} />
      </View>

      <AlertModal visible={alert.show} body={alert.body} onClose={() => setAlert({show: false, body: ''})} />
    </View>
  );
};

export default ProfileScreen;
