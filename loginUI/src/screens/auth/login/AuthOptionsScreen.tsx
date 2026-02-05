// src/loginUI/components/AuthOptionsScreen.tsx
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';
import { AuthOptionsT as T } from '@ui/tokens/authOptions';

const AuthOptionsScreen: React.FC = () => {
  const { signIn } = useAuth();

  /**
   * Temporary auth bypass for portfolio v1
   * - No real OAuth / phone auth
   * - All auth buttons just sign in and switch to Main flow via RootNavigator
   */
  const handleAuthBypass = useCallback(() => {
    signIn('AuthOptions bypass button');
  }, [signIn]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topArea}>
        <Text style={styles.logoline}>Grab</Text>
        <Text style={styles.tagline}>Your everyday everything app</Text>
      </View>

      <View style={styles.buttonArea}>
        {/* Facebook (bypass) */}
        <TouchableOpacity style={styles.authButton} onPress={handleAuthBypass}>
          <FontAwesome
            name="facebook"
            size={20}
            style={styles.icon}
            color="#1877F2"
          />
          <Text style={styles.authText}>Continue With Facebook</Text>
        </TouchableOpacity>

        {/* Google (bypass) */}
        <TouchableOpacity style={styles.authButton} onPress={handleAuthBypass}>
          <AntDesign
            name="google"
            size={20}
            color="#DB4437"
            style={styles.icon}
          />
          <Text style={styles.authText}>Continue With Google</Text>
        </TouchableOpacity>

        {/* Apple (bypass) */}
        <TouchableOpacity style={styles.authButton} onPress={handleAuthBypass}>
          <AntDesign name="apple" size={20} color="black" style={styles.icon} />
          <Text style={styles.authText}>Continue With Apple</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Phone number (bypass) */}
        <TouchableOpacity style={styles.authButton} onPress={handleAuthBypass}>
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
    transform: [{ translateY: T.topAreaOffsetY ?? 0 }],
  },
  logoline: {
    fontSize: 48 * (T.logoFontScale ?? 1),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 0,
  },
  tagline: {
    fontSize: 20 * (T.taglineFontScale ?? 1),
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonArea: {
    marginBottom: 20,
    transform: [{ translateY: T.buttonsOffsetY ?? 0 }],
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
  icon: { marginRight: 12 },
  authText: {
    marginLeft: 35,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 14 * (T.authTextFontScale ?? 1),
  },
  authText2: {
    marginLeft: 13,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 14 * (T.authTextFontScale ?? 1),
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: { flex: 1, height: 1, backgroundColor: 'white' },
  orText: { marginHorizontal: 8, color: 'white' },
});
