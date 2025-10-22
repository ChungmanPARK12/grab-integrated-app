// src/loginUI/components/AuthOptionsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@login/navigation/types';
import { useFacebookAuthRequest } from '../services/facebookAuth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthOptions'>;

const AuthOptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // ✅ From your hook (Option A already sets useProxy in the hook)
  const { request, response, promptAsync } = useFacebookAuthRequest();

  const handleFacebookLogin = async () => {
    try {
      const result = await promptAsync(); // ✅ No useProxy here

      if (result.type === 'success' && result.params?.access_token) {
        Alert.alert('Login Success', `Access Token: ${result.params.access_token}`);
        navigation.navigate('MainService');
      } else {
        Alert.alert('Login Cancelled');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', 'Something went wrong during Facebook login.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo + Tagline at Top */}
      <View style={styles.topArea}>
        <Text style={styles.logoline}>Grab</Text>
        <Text style={styles.tagline}>Your everyday everything app</Text>
      </View>

      {/* Buttons at Bottom */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.authButton, !request && styles.authButtonDisabled]}
          onPress={handleFacebookLogin}
          disabled={!request}
        >
          {!request ? (
            <ActivityIndicator />
          ) : (
            <>
              <FontAwesome name="facebook" size={20} color="#1877F2" style={styles.icon} />
              <Text style={styles.authText}>Continue With Facebook</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.authButton}>
          <AntDesign name="google" size={20} color="#DB4437" style={styles.icon} />
          <Text style={styles.authText}>Continue With Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.authButton}>
          <AntDesign name="apple1" size={20} color="black" style={styles.icon} />
          <Text style={styles.authText}>Continue With Apple</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.authButton}>
          <Entypo name="phone" size={20} color="black" style={styles.icon} />
          <Text style={styles.authText2}>Continue With Mobile Number</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthOptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00B14F',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topArea: {
    alignItems: 'center',
    marginTop: 50,
  },
  logoline: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 0,
  },
  tagline: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonArea: {
    marginBottom: 20,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    width: '85%',
    paddingVertical: 14,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 12,
  },
  authText: {
    marginLeft: 35,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 14,
  },
  authText2: {
    marginLeft: 13,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'white',
  },
  orText: {
    marginHorizontal: 8,
    color: 'white',
  },
});
