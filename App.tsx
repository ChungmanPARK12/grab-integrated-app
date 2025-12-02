// App.tsx
import React from 'react';
import * as WebBrowser from 'expo-web-browser';  // ✅ Add this
import { NavigationContainer } from '@react-navigation/native';
import  LoginNavigator from '@login/screens/LoginNavigator';

// ✅ Must be called once, before rendering anything
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  return (
    <NavigationContainer>
      <LoginNavigator />
    </NavigationContainer>
  );
}
