// Root/App.tsx
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import * as Font from 'expo-font';

import { AuthProvider } from './src/providers/AuthProvider';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);
  // Preload icon in splash image
  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          ...FontAwesome.font,
          ...AntDesign.font,
          ...Entypo.font,
        });
      } catch (e) {
        console.warn('Icon preload failed', e);
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!ready) return null;

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
