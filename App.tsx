// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginNavigator from '@login/screens/LoginNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <LoginNavigator />
    </NavigationContainer>
  );
}
