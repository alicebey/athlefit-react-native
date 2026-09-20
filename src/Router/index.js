import React from 'react';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
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
import AdminVenuesScreen from '../Screen/AdminVenues';
import ForgotPasswordScreen from '../Screen/ForgotPassword';
import OwnerVenuesScreen from '../Screen/OwnerVenues';
import OwnerVenueScreen from '../Screen/OwnerVenue';

// Building Stack Navigation
const Stack = createStackNavigator();

// Building Bottom tab navigation
const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#52B788',
    background: '#212529',
    card: '#1B1F22',
    text: '#F8F9FA',
    border: '#343A40',
  },
};

const renderGameOnIcon = ({color, size}) => (
  <Icon name="fast-forward" size={size} color={color} />
);
const renderOrderIcon = ({color, size}) => (
  <Feather name="file-text" size={size} color={color} />
);
const renderNearbyIcon = ({color, size}) => (
  <Feather name="map" size={size} color={color} />
);
const renderProfileIcon = ({color, size}) => (
  <Icon name="account-circle" size={size} color={color} />
);

// Component Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          paddingTop: 7,
          backgroundColor: '#1B1F22',
          borderTopColor: '#343A40',
        },
        tabBarLabelStyle: {fontSize: 11, paddingBottom: 4},
        tabBarActiveTintColor: '#52B788',
        tabBarInactiveTintColor: '#ADB5BD',
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Game On',
          tabBarAccessibilityLabel: 'Game On, home',
          tabBarIcon: renderGameOnIcon,
        }}
        name={'Home'}
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Order',
          tabBarAccessibilityLabel: 'Orders',
          tabBarIcon: renderOrderIcon,
        }}
        name={'Order'}
        component={OrderScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Nearby',
          tabBarAccessibilityLabel: 'Nearby venues',
          tabBarIcon: renderNearbyIcon,
        }}
        name={'Nearby'}
        component={NearbyScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: renderProfileIcon,
        }}
        name={'Profile'}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

// Component Stack Navigator
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#212529'},
      }}>
      <Stack.Screen name={'Splash'} component={SplashScreen} />
      <Stack.Screen name={'Landing'} component={LandingPage} />
      <Stack.Screen name={'Login'} component={LoginScreen} />
      <Stack.Screen name={'Signup'} component={SignupScreen} />
      <Stack.Screen name={'Forgot Password'} component={ForgotPasswordScreen} />
      <Stack.Screen name={'Starter'} component={StarterScreen} />
      <Stack.Screen name={'Main'} component={TabNavigator} />
      <Stack.Screen name={'DetailMenu'} component={DetailMenu} />
      <Stack.Screen name={'DetailField'} component={DetailField} />
      <Stack.Screen name={'OrderField'} component={OrderField} />
      <Stack.Screen name={'Change Password'} component={ChangePasswordScreen} />
      <Stack.Screen name={'Detail Order'} component={DetailOrder} />
      <Stack.Screen name={'SearchField'} component={SearchField} />
      <Stack.Screen name={'Admin Venues'} component={AdminVenuesScreen} />
      <Stack.Screen name={'Owner Venues'} component={OwnerVenuesScreen} />
      <Stack.Screen name={'Owner Venue'} component={OwnerVenueScreen} />
    </Stack.Navigator>
  );
};

// Main Navigator for Apps
const MainNavigator = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <StackNavigator />
      <LoadingOverlay />
    </NavigationContainer>
  );
};

export default MainNavigator;
