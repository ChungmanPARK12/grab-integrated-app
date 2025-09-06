import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  AuthOptions: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const backgroundImage = require('../../assets/grab-background.png');

  return (
    <>
      {!bgLoaded && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )};

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

              <TouchableOpacity style={styles.signupButton}>
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
  },
  signupButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 15,
    borderRadius: 50,
  },
  signupText: {
    textAlign: 'center',
    color: '#222',
  },
});
