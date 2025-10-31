// src/loginUI/components/AuthOptionsScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  LogBox,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@login/navigation/types';
import { useFacebookAuthRequest } from '../services/facebookAuth';

LogBox.ignoreAllLogs(false); // show warnings/errors while testing

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthOptions'>;

// safe JSON pretty-print for alerts
const j = (v: any) => {
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
};

const AuthOptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // NOTE: hook must return discovery for makeAuthUrlAsync()
  const { request, response, promptAsync, redirectUri, discovery } = useFacebookAuthRequest();

  useEffect(() => {
    console.log('🔐 redirectUri at runtime =', redirectUri);

    if (!response) return;

    console.log('🛰️ response object:', response);

    if (response.type === 'success') {
      const token = (response as any).params?.access_token;
      console.log('✅ FB success. token =', token);
      Alert.alert('FB Success', token ? `token:\n${token}` : 'No access_token in params');
      if (token) navigation.navigate('MainService');
    } else if (response.type === 'error') {
      console.log('❌ FB error object:', (response as any).error || response);
      Alert.alert('FB Error (response)', j((response as any).error || response));
    } else {
      console.log('ℹ️ FB flow result type:', response.type);
      Alert.alert('FB Result', response.type);
    }
  }, [response, redirectUri, navigation]);

  const handleFacebookLogin = async () => {
    try {
      if (!request) {
        Alert.alert('DEBUG', 'Request is not ready');
        return;
      }

      console.log('▶️ calling promptAsync…');

      // Show the EXACT URL (includes client_id & redirect_uri) for verification
      const authUrl = await request.makeAuthUrlAsync(discovery);
      console.log('🔗 authUrl =', authUrl);
      Alert.alert('Auth URL', authUrl);

      // Safety timeout so we know if FB never returns
      const timeout = new Promise((_, rej) =>
        setTimeout(() => rej(new Error('FB did not return within 20s')), 20000)
      );

      const result = await Promise.race([
        promptAsync({ preferEphemeralSession: true }),
        timeout,
      ]);

      console.log('🔎 promptAsync result:', result);
      Alert.alert('promptAsync result', j(result));
    } catch (err: any) {
      console.error('💥 FB login exception:', err);
      Alert.alert('FB Exception (catch)', j(err));
    }
  };

  const handleResetFacebookSession = async () => {
    await WebBrowser.openBrowserAsync('https://m.facebook.com/logout.php');
    Alert.alert('Session Reset', 'Facebook session cleared. Try logging in again.');
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

        {/* Testing helper: clear FB session */}
        <TouchableOpacity onPress={handleResetFacebookSession} style={{ alignSelf: 'center', marginTop: 8 }}>
          <Text style={{ color: 'white', textDecorationLine: 'underline' }}>
            Having trouble? Reset Facebook session
          </Text>
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
