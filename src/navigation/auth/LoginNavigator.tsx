// Root/src/navigation/auth/LoginNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthOptionsScreen from '@/loginUI/src/screens/auth/login/AuthOptionsScreen';
import LoginScreen from '@/loginUI/src/screens/auth/login/LoginScreen';
import GetStartedPhoneScreen from '@/loginUI/src/screens/auth/signup/GetStartedPhoneScreen';
import VerifyOtpScreen from '@/loginUI/src/screens/auth/signup/VerifyOtpScreen';
import GetUsernameScreen from '@/loginUI/src/screens/auth/signup/GetUsernameScreen';

import type { AuthStackParamList } from '@/loginUI/src/navigation/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const LoginNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="GetStartedSignup" component={GetStartedPhoneScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="GetStartedName" component={GetUsernameScreen} />
      <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
