import { AuthStackParamList } from '@login/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LoginT as T } from '@ui/tokens/loginScreen';
import backgroundImage from '@assets/grab-background.png';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <>
      {!bgLoaded && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover"
        onLoadEnd={() => setBgLoaded(true)}
      >
        {bgLoaded && (
          <View style={styles.container}>
            <View style={styles.buttonArea}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('AuthOptions')} //navigate here
                accessibilityRole="button"
              >
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signupButton}
                onPress={() => navigation.navigate('GetStartedSignup')} // navigate to phone sign-up screen
                accessibilityRole="button">
                <Text style={styles.signupText}>New to Grab? Sign up!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ImageBackground>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00B14F',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  background: {
    flex: 1,
    backgroundColor: '#00B14F', // fallback
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonArea: {
    marginTop: 'auto',
    marginBottom: 50,
    transform: [{ translateY: T.buttonsOffsetY ?? 0 }],
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 15,
  },
  loginText: {
    color: '#00B14F',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16 * (T.loginTextFontScale ?? 1),
  },
  signupButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 15,
    borderRadius: 50,
  },
  signupText: {
    textAlign: 'center',
    color: '#222',
    fontSize: 14 * (T.signupTextFontScale ?? 1),
  },
});
