// src/screens/LoginNavigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

import AuthOptionsScreen from '@/loginUI/src/components/auth/login/AuthOptionsScreen';
import LoginScreen from '@/loginUI/src/components/auth/login/LoginScreen';
import MainServiceScreen from '@main/screens/MainServiceScreen';
import GetStartedPhoneScreen from '@/loginUI/src/components/auth/signup/GetStartedPhoneScreen';
import VerifyOtpScreen from '../components/auth/signup/VerifyOtpScreen';

const Stack = createNativeStackNavigator();

// Splash screen (showing loading image / Grab logo)
const LoginNavigator = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate splash loading time
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
  }

  return (
    // Default: hide headers. Each screen can enable/set header options dynamically via navigation.setOptions.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="GetStartedSignup" component={GetStartedPhoneScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
      <Stack.Screen name="MainService" component={MainServiceScreen} />
    </Stack.Navigator>
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
