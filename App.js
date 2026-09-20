import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './src/Router';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#212529" />
      <MainNavigator />
    </SafeAreaProvider>
  );
};

export default App;
