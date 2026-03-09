// src/login/components/VerifyOtpScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { AuthStackParamList } from '@login/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

const BASE_URL = 'http://192.168.20.9:3000';

const verifySignupOtpRequest = async (requestId: string, otp: string) => {
  const response = await fetch(`${BASE_URL}/signup/otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requestId,
      otp,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data as {
    verified: true;
    tempToken: string;
  };
};

const VerifyOtpScreen = ({ navigation, route }: Props) => {
  const { phoneNumber, requestId, expiresAt, devOtp, flow } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDevOtp, setShowDevOtp] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
    });
  }, [navigation]);

  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(0);
      setIsExpired(false);
      return;
    }

    const updateTimer = () => {
      const diffMs = new Date(expiresAt).getTime() - Date.now();
      const nextSeconds = Math.max(0, Math.ceil(diffMs / 1000));

      setSecondsLeft(nextSeconds);
      setIsExpired(nextSeconds === 0);
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [secondsLeft]);

  const isNextEnabled = useMemo(() => {
    return otp.trim().length === 6 && !loading && !isExpired;
  }, [otp, loading, isExpired]);

  const onChangeOtp = (text: string) => {
    const onlyDigits = text.replace(/[^\d]/g, '').slice(0, 6);
    setOtp(onlyDigits);
    setErrorMessage('');
  };

  const onShowOtp = () => {
    if (!devOtp || isExpired || loading) return;

    setOtp(devOtp);
    setShowDevOtp(true);
    setErrorMessage('');
  };

  const onNext = async () => {
    if (!isNextEnabled) return;
    if (flow !== 'signup') return;

    try {
      setLoading(true);
      setErrorMessage('');

      const result = await verifySignupOtpRequest(requestId, otp.trim());

      navigation.navigate('GetStartedName', {
        phoneNumber,
        requestId,
        tempToken: result.tempToken,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to verify OTP';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.content}>
        <Text style={styles.description}>
          Enter the 6-digit code sent to {phoneNumber} by SMS.
        </Text>

        <TextInput
          value={otp}
          onChangeText={onChangeOtp}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          maxLength={6}
          style={[styles.otpInput, isExpired && styles.otpInputDisabled]}
          editable={!loading && !isExpired}
        />

        {expiresAt ? (
          isExpired ? (
            <Text style={styles.expiredText}>
              Code expired. Please request a new OTP.
            </Text>
          ) : (
            <Text style={styles.timerText}>Code expires in {formattedTime}</Text>
          )
        ) : null}

        {devOtp ? (
          <Pressable
            style={styles.sendBtn}
            onPress={onShowOtp}
            disabled={loading || isExpired}
          >
            <Text
              style={[
                styles.sendText,
                (loading || isExpired) && styles.sendTextDisabled,
              ]}
            >
              {showDevOtp ? 'OTP inserted' : 'Use dev OTP'}
            </Text>
          </Pressable>
        ) : null}

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.helper}>
          <Text style={styles.helperTitle}>Didn't receive it?</Text>
          <Text style={styles.helperSub}>
            Go back and request a new OTP after the timer ends.
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={[styles.nextBtn, !isNextEnabled && styles.nextBtnDisabled]}
          onPress={onNext}
          disabled={!isNextEnabled}
        >
          <Text style={[styles.nextText, !isNextEnabled && styles.nextTextDisabled]}>
            {loading ? 'Verifying...' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  description: {
    fontSize: 14,
    color: '#111',
    marginBottom: 24,
  },

  otpInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 22,
    letterSpacing: 6,
    color: '#111',
    marginBottom: 12,
  },
  otpInputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },

  timerText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  expiredText: {
    fontSize: 13,
    color: '#d93025',
    marginBottom: 16,
  },

  sendBtn: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  sendText: {
    fontSize: 16,
    color: '#00B14F',
    fontWeight: '600',
  },
  sendTextDisabled: {
    color: '#9ccfb1',
  },

  errorText: {
    color: '#d93025',
    fontSize: 14,
    marginBottom: 16,
  },

  helper: {
    marginTop: 24,
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
  nextBtnDisabled: {
    backgroundColor: '#E7E7E7',
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  nextTextDisabled: {
    color: '#9B9B9B',
  },
});