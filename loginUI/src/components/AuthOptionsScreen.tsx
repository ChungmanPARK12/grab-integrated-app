// src/loginUI/components/AuthOptionsScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Alert, ActivityIndicator, LogBox,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@login/navigation/types';
import { useFacebookLogin, FacebookLoginResult } from '../services/facebookAuth';

LogBox.ignoreAllLogs(false);

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthOptions'>;

const AuthOptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);

  // ✅ facebookAuth.ts 에서 페이스북 관련 로직을 모두 가져옴
  //   - App ID 읽기
  //   - redirectUri 생성
  //   - AuthSession 설정
  //   - authUrl (디버그용)
  //   - login() (버튼에서 호출)
  const {
    request,
    redirectUri,
    authUrl,
    login,
    facebookAppId,
  } = useFacebookLogin();

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const ready = !!request && !!redirectUri;

  // 진단 로그 (기존 그대로 유지, FB_APP_ID 대신 facebookAppId 사용)
  useEffect(() => {
    console.log('🔐 FB_APP_ID in use =', facebookAppId);
    console.log('🔐 redirectUri at runtime =', redirectUri);
    if (request?.state) console.log('🧩 request.state =', request.state);
    if (authUrl) console.log('🔎 FB authorize URL =>', authUrl);
  }, [redirectUri, authUrl, request, facebookAppId]);

  /**
   * ✅ 페이스북 버튼 핸들러
   * - 더 이상 promptAsync 직접 호출 X
   * - useFacebookLogin().login() 호출 결과만 보고 UI 처리
   */
  const handleFacebookLogin = useCallback(async () => {
    if (!ready) {
      Alert.alert('Facebook Login', 'Auth request is not ready yet.');
      return;
    }

    if (loading) {
      // 이미 로그인 시도 중이면 추가 탭 무시
      return;
    }

    if (isMountedRef.current) setLoading(true);

    try {
      const result: FacebookLoginResult = await login();

      if (!result) {
        Alert.alert('Facebook Login', 'No response from Facebook.');
        return;
      }

      if (result.ok && result.accessToken) {
        // ✅ 로그인 성공 케이스
        Alert.alert('FB Success', 'Logged in successfully.');
        navigation.navigate('MainService');
        return;
      }

      if (result.cancelled) {
        // 사용자가 취소한 경우는 보통 조용히 패스
        console.log('ℹ️ User cancelled Facebook login.');
        return;
      }

      if (result.errorMessage) {
        Alert.alert('Facebook Login', result.errorMessage);
        return;
      }

      Alert.alert('Facebook Login', 'Unknown Facebook login result.');
    } catch (err: any) {
      console.error('💥 FB login exception (AuthOptionsScreen):', err);
      Alert.alert('Facebook Login', err?.message ?? 'Something went wrong.');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [ready, loading, login, navigation]);

  const handleResetFacebookSession = useCallback(async () => {
    await WebBrowser.openBrowserAsync('https://m.facebook.com/logout.php');
    Alert.alert('Session Reset', 'Facebook session cleared. Try logging in again.');
  }, []);

  const handleOpenAuthorizeUrl = useCallback(async () => {
    if (!authUrl) return;
    await WebBrowser.openBrowserAsync(authUrl);
  }, [authUrl]);

  const handleCopyAuthorizeUrl = useCallback(() => {
    if (!authUrl) return;
    console.log('📋 Copy this authorize URL:', authUrl);
    Alert.alert('Copied to logs', 'Authorize URL printed to console.');
  }, [authUrl]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topArea}>
        <Text style={styles.logoline}>Grab</Text>
        <Text style={styles.tagline}>Your everyday everything app</Text>
      </View>

      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.authButton, (!ready || loading) && styles.authButtonDisabled]}
          onPress={handleFacebookLogin}
          disabled={!ready || loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <FontAwesome name="facebook" size={20} style={styles.icon} color="#1877F2" />
              <Text style={styles.authText}>Continue With Facebook</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.authButton} disabled>
          <AntDesign name="google" size={20} color="#DB4437" style={styles.icon} />
          <Text style={styles.authText}>Continue With Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.authButton} disabled>
          <AntDesign name="apple1" size={20} color="black" style={styles.icon} />
          <Text style={styles.authText}>Continue With Apple</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.authButton} disabled>
          <Entypo name="phone" size={20} color="black" style={styles.icon} />
          <Text style={styles.authText2}>Continue With Mobile Number</Text>
        </TouchableOpacity>

        {/* Testing helpers */}
        <TouchableOpacity onPress={handleResetFacebookSession} style={{ alignSelf: 'center', marginTop: 8 }}>
          <Text style={{ color: 'white', textDecorationLine: 'underline' }}>
            Having trouble? Reset Facebook session
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOpenAuthorizeUrl} style={{ alignSelf: 'center', marginTop: 6 }}>
          <Text style={{ color: 'white', textDecorationLine: 'underline' }}>
            Debug: Open authorize URL
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCopyAuthorizeUrl} style={{ alignSelf: 'center', marginTop: 6 }}>
          <Text style={{ color: 'white', textDecorationLine: 'underline' }}>
            Debug: Log authorize URL
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthOptionsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00B14F', paddingHorizontal: 24, justifyContent: 'space-between' },
  topArea: { alignItems: 'center', marginTop: 50 },
  logoline: { fontSize: 48, fontWeight: 'bold', color: 'white', marginBottom: 0 },
  tagline: { color: 'white', fontSize: 20, textAlign: 'center', marginBottom: 10 },
  buttonArea: { marginBottom: 20 },
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
  authButtonDisabled: { opacity: 0.6 },
  icon: { marginRight: 12 },
  authText: { marginLeft: 35, fontWeight: 'bold', color: 'black', fontSize: 14 },
  authText2: { marginLeft: 13, fontWeight: 'bold', color: 'black', fontSize: 14 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  divider: { flex: 1, height: 1, backgroundColor: 'white' },
  orText: { marginHorizontal: 8, color: 'white' },
});
