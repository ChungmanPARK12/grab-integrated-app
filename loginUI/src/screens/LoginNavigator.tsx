import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@login/components/LoginScreen';
import AuthOptionsScreen from '@login/components/AuthOptionsScreen';
import MainServiceScreen from '@main/screens/MainServiceScreen';

const Stack = createNativeStackNavigator();

// Splash screen(Showing loading image, grab logo)
const LoginNavigator = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar hidden />
        <Image
          source={require('../../assets/loading.jpg')}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#00B14F" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
         <Stack.Screen name="MainService" component={MainServiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoginNavigator;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#00B14F',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});
