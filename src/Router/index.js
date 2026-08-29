import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LandingPage from '../Screen/Landing';
import LoginScreen from '../Screen/Login';
import SignupScreen from '../Screen/Signup';
import SplashScreen from '../Screen/Splash';
import StarterScreen from '../Screen/Starter';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screen/Home';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {heightPercentageToDP} from '../Utils/Sizing';
import DetailMenu from '../Screen/DetailMenu';
import DetailField from '../Screen/DetailField';
import OrderScreen from '../Screen/Order';
import OrderField from '../Screen/OrderField';
import ProfileScreen from '../Screen/Profile';
import NearbyScreen from '../Screen/Nearby';
import LoadingOverlay from '../Component/LoadingOverlay';
import ChangePasswordScreen from '../Screen/Change Password';
import DetailOrder from '../Screen/DetailOrder';
import SearchField from '../Screen/SearchField';

// Building Stack Navigation
const Stack = createStackNavigator();

// Building Bottom tab navigation
const Tab = createBottomTabNavigator();

// Component Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: '#212529'},
        tabBarActiveTintColor: '#52B788',
        tabBarInactiveTintColor: '#FFF',
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Game On',
          tabBarIcon: ({color, size}) => (
            <Icon name={'fast-forward'} size={size} color={color} />
          ),
        }}
        name={'Home'}
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Order',
          tabBarIcon: ({color, size}) => (
            <Feather name={'file-text'} size={size} color={color} />
          ),
        }}
        name={'Order'}
        component={OrderScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Nearby',
          tabBarIcon: ({color, size}) => (
            <Feather name={'map'} size={size} color={color} />
          ),
        }}
        name={'Nearby'}
        component={NearbyScreen}
      />
    </Tab.Navigator>
  );
};

// Component Stack Navigator
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Splash'} component={SplashScreen} />
      <Stack.Screen name={'Landing'} component={LandingPage} />
      <Stack.Screen name={'Login'} component={LoginScreen} />
      <Stack.Screen name={'Signup'} component={SignupScreen} />
      <Stack.Screen name={'Starter'} component={StarterScreen} />
      <Stack.Screen name={'Main'} component={TabNavigator} />
      <Stack.Screen name={'DetailMenu'} component={DetailMenu} />
      <Stack.Screen name={'DetailField'} component={DetailField} />
      <Stack.Screen name={'OrderField'} component={OrderField} />
      <Stack.Screen name={'Profile'} component={ProfileScreen} />
      <Stack.Screen name={'Change Password'} component={ChangePasswordScreen} />
      <Stack.Screen name={'Detail Order'} component={DetailOrder} />
      <Stack.Screen name={'SearchField'} component={SearchField} />
    </Stack.Navigator>
  );
};

// Main Navigator for Apps
const MainNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
      <LoadingOverlay />
    </NavigationContainer>
  );
};

export default MainNavigator;
