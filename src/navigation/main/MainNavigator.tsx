// Root/src/navigation/main/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainServiceScreen from '@main/screens/MainServiceScreen';

export type MainStackParamList = {
  MainService: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainService" component={MainServiceScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
