import {ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Input from '../../Component/Input';
import Button from '../../Component/Button';
import auth from '@react-native-firebase/auth';
import AlertModal from '../../Component/AlertModal';
import LoadingHelper from '../../Utils/LoadingHelper';
import {useSessionStore} from '../../Service/sessionStore';
import {useNavigation} from '@react-navigation/native';

// Change Password Screen
const ChangePasswordScreen = () => {
  // Create State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({show: false, body: ''});

  const {email} = useSessionStore();
  const navigation = useNavigation();

  // Submit function screen for change password
  const onSubmit = async () => {

    // Validate if new password is not same with confirm password return alert and stop procces
    if (newPassword !== confirmPassword) {
      setAlert({
        show: true,
        body: 'New Password and Confirm Password Not Match',
      });
      return;
    }

    // Validate if new and old password same, return alert and stop proccess
    if (newPassword == oldPassword) {
      setAlert({
        show: true,
        body: 'New Password cannot be same with old password',
      });
      return;
    }

    // Validate if new password length is below minimum character, return alert and stop process
    if (newPassword.length < 8) {
      setAlert({show: true, body: 'Minimum password length is 8 character'});
      return;
    }

    // Show Loading with Helper
    LoadingHelper.show();


    try {

      // Validate if old password is correct, return alert and stop proccess if no
      if (await validate()) {
        await auth().currentUser.updatePassword(newPassword);
        navigation.goBack();
      } else {
        setAlert({show: true, body: 'Wrong Old Password'});
      }
    } catch (error) {
      console.log(error, 'error update password');
      if (error.message.includes('weak')) {
        setAlert({show: true, body: 'New Password to weak'});
      } else {
        setAlert({show: true, body: 'Failed to change password'});
      }
    } finally {
      LoadingHelper.hide();
    }
  };

  // Function for validate correction of old password
  const validate = async () => {
    try {
      const validate = await auth().signInWithEmailAndPassword(
        email,
        oldPassword,
      );
      return true;
    } catch (error) {
      console.log(error, 'error login');
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          value={oldPassword}
          onChangeText={val => setOldPassword(val)}
          isPassword
          marginBottom={10}
          title="Old Password"
        />
        <Input
          value={newPassword}
          onChangeText={val => setNewPassword(val)}
          isPassword
          marginBottom={10}
          title="New Password"
        />
        <Input
          value={confirmPassword}
          onChangeText={val => setConfirmPassword(val)}
          isPassword
          marginBottom={10}
          title="Confirm Password"
        />
        <Text type="regular" size={12} color={'#FFF'}>
          *Password minimum 8 characters
        </Text>
      </View>
      <Button
        title="Submit"
        disabled={
          oldPassword == '' || newPassword == '' || confirmPassword == ''
        }
        onPress={onSubmit}
      />

      {/* Pop up warning */}
      <AlertModal
        visible={alert.show}
        body={alert.body}
        onClose={() => setAlert({show: false, body: ''})}
      />
    </View>
  );
};

export default ChangePasswordScreen;
