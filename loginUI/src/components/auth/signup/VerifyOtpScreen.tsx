// src/login/components/VerifyOtpScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const VerifyOtpScreen = ({ navigation, route }: any) => {
  const { phoneNumber, countryCode } = route.params || {};

  const [otp, setOtp] = useState('000000');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  // Generate random 6-digit code
  const generateOtp = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(randomCode);
  };

  const onNext = () => {
    // Next step will be connected later (Name screen / Main service)
    // navigation.navigate('GetStartedName');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.content}>
        <Text style={styles.description}>
          Enter the 6-digit code sent to {countryCode} {phoneNumber} by SMS.
        </Text>

        {/* OTP display */}
        <Text style={styles.otpText}>{otp}</Text>

        {/* Send button */}
        <Pressable style={styles.sendBtn} onPress={generateOtp}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>

        <View style={styles.helper}>
          <Text style={styles.helperTitle}>Didn't receive it?</Text>
          <Text style={styles.helperSub}>
            Get new code or send by WhatsApp in 00:21
          </Text>
        </View>
      </View>

      {/* Next CTA */}
      <View style={styles.bottom}>
        <Pressable style={styles.nextBtn} onPress={onNext}>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  description: {
    fontSize: 14,
    color: '#111',
    marginBottom: 32,
  },

  otpText: {
    fontSize: 36,
    letterSpacing: 6,
    color: '#cfcfcf',
    marginBottom: 20,
  },

  sendBtn: {
    alignSelf: 'flex-start',
    marginBottom: 40,
  },
  sendText: {
    fontSize: 16,
    color: '#00B14F',
    fontWeight: '600',
  },

  helper: {
    marginTop: 40,
  },
  helperTitle: {
    fontSize: 14,
    color: '#111',
    marginBottom: 4,
  },
  helperSub: {
    fontSize: 13,
    color: '#9a9a9a',
  },

  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  nextBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00B14F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});
