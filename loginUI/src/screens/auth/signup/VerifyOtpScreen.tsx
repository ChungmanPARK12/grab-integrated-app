// src/screens/auth/signup/VerifyOtpScreen.tsx
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

const BASE_URL = 'https://nonlyrical-melonie-eudiometric.ngrok-free.dev';

type OtpRequestResponse = {
  requestId: string;
  expiresAt: string;
  devOtp?: string;
};

type VerifySignupOtpResponse = {
  verified: true;
  tempToken: string;
};

type VerifyLoginOtpResponse = {
  ok: true;
  user: {
    id: string;
    phone: string;
    username: string | null;
    role: 'user' | 'admin';
  };
  accessToken: string;
  refreshToken: string;
};

const requestSignupPhone = async (phone: string) => {
  const response = await fetch(`${BASE_URL}/api/signup/phone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data as OtpRequestResponse;
};

const requestLoginPhone = async (phone: string) => {
  const response = await fetch(`${BASE_URL}/api/login/phone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data as OtpRequestResponse;
};

const verifySignupOtpRequest = async (requestId: string, otp: string) => {
  const response = await fetch(`${BASE_URL}/api/signup/otp`, {
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

  return data as VerifySignupOtpResponse;
};

const verifyLoginOtpRequest = async (requestId: string, otp: string) => {
  const response = await fetch(`${BASE_URL}/api/login/otp`, {
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

  return data as VerifyLoginOtpResponse;
};

const VerifyOtpScreen = ({ navigation, route }: Props) => {
  const { phoneNumber, flow } = route.params;

  const [requestId, setRequestId] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | undefined>(undefined);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [hasRequestedOtp, setHasRequestedOtp] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
    });
  }, [navigation]);

  useEffect(() => {
    if (!hasRequestedOtp || !expiresAt) {
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
  }, [expiresAt, hasRequestedOtp]);

  useEffect(() => {
    if (hasRequestedOtp && isExpired) {
      setErrorMessage('Code expired. Please request a new OTP.');
    }
  }, [isExpired, hasRequestedOtp]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [secondsLeft]);

  const canEnterOtp = hasRequestedOtp && !isExpired;
  const showRequestOtpButton = !hasRequestedOtp || isExpired;

  const isNextEnabled = useMemo(() => {
    return otp.trim().length === 6 && !loading && !requestingOtp && canEnterOtp;
  }, [otp, loading, requestingOtp, canEnterOtp]);

  const helperText = !hasRequestedOtp
    ? 'Tap below to request an OTP.'
    : isExpired
      ? 'Your code has expired. Request a new OTP.'
      : `Code expires in ${formattedTime}.`;

  const onChangeOtp = (text: string) => {
    const onlyDigits = text.replace(/[^\d]/g, '').slice(0, 6);
    setOtp(onlyDigits);

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const onRequestOtp = async () => {
    if (loading || requestingOtp || !showRequestOtpButton) return;

    try {
      setRequestingOtp(true);
      setErrorMessage('');
      setOtp('');
      setRequestId('');
      setExpiresAt(undefined);
      setIsExpired(false);

      const result =
        flow === 'signup'
          ? await requestSignupPhone(phoneNumber)
          : await requestLoginPhone(phoneNumber);

      setRequestId(result.requestId);
      setExpiresAt(result.expiresAt);
      setHasRequestedOtp(true);
      setIsExpired(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to request OTP';
      setErrorMessage(message);
      setHasRequestedOtp(false);
      setRequestId('');
      setExpiresAt(undefined);
    } finally {
      setRequestingOtp(false);
    }
  };

  const onNext = async () => {
    if (!isNextEnabled) return;

    try {
      setLoading(true);
      setErrorMessage('');

      if (flow === 'signup') {
        const result = await verifySignupOtpRequest(requestId, otp.trim());

        navigation.navigate('GetStartedName', {
          phoneNumber,
          requestId,
          tempToken: result.tempToken,
        });
        return;
      }

      const result = await verifyLoginOtpRequest(requestId, otp.trim());

      console.log('Login OTP verified:', result);
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
          style={[styles.otpInput, !canEnterOtp && styles.otpInputDisabled]}
          editable={canEnterOtp && !loading && !requestingOtp}
        />

        {hasRequestedOtp && !isExpired ? (
          <Text style={styles.timerText}>Code expires in {formattedTime}</Text>
        ) : null}

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        {showRequestOtpButton ? (
          <View style={styles.actions}>
            <Pressable
              style={styles.linkBtn}
              onPress={onRequestOtp}
              disabled={loading || requestingOtp}
            >
              <Text
                style={[
                  styles.linkText,
                  (loading || requestingOtp) && styles.linkTextDisabled,
                ]}
              >
                {requestingOtp ? 'Requesting OTP...' : 'Request OTP'}
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.helper}>
          <Text style={styles.helperTitle}>Didn't receive it?</Text>
          <Text style={styles.helperSub}>{helperText}</Text>
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
    marginBottom: 12,
  },

  errorText: {
    color: '#d93025',
    fontSize: 14,
    marginBottom: 12,
  },

  actions: {
    marginBottom: 24,
    gap: 10,
  },

  linkBtn: {
    alignSelf: 'flex-start',
  },

  linkText: {
    fontSize: 16,
    color: '#00B14F',
    fontWeight: '600',
  },

  linkTextDisabled: {
    color: '#9ccfb1',
  },

  helper: {
    marginTop: 8,
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
    paddingTop: 10,
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