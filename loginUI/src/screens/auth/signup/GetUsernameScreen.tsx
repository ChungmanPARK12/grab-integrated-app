// src/login/components/GetStartedNameScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
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

import { AuthStackParamList } from '@login/navigation/types';
import { useAuth } from '@/src/providers/AuthProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'GetStartedName'>;

const BASE_URL = 'http://192.168.20.9:3000';

const completeSignupUsername = async (username: string, tempToken: string) => {
  const response = await fetch(`${BASE_URL}/signup/username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tempToken}`,
    },
    body: JSON.stringify({ username }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data as {
    ok: true;
    user: {
      id: string;
      phone: string;
      username: string | null;
      role: 'user' | 'admin';
      isVerified: boolean;
      signupCompleted: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
};

const GetStartedNameScreen = ({ navigation, route }: Props) => {
  const { phoneNumber, tempToken } = route.params;

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { signIn } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Get Started',
    });
  }, [navigation]);

  const isNextEnabled = useMemo(() => {
    return username.trim().length > 0 && !loading;
  }, [username, loading]);

  const onNext = async () => {
  if (!isNextEnabled) return;

  try {
    setLoading(true);
    setErrorMessage('');

    const result = await completeSignupUsername(username.trim(), tempToken);

    signIn(result.accessToken, result.refreshToken, 'signup completed');
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to complete signup';
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
        <Text style={styles.label}>Name</Text>
        <Text style={styles.question}>
          What should people call you?
        </Text>

        <Text style={styles.phoneText}>{phoneNumber}</Text>

        <TextInput
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setErrorMessage('');
          }}
          placeholder=""
          autoFocus
          returnKeyType="done"
          style={styles.input}
          editable={!loading}
        />

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <Text style={styles.terms}>
          By continuing, you confirm you&apos;ve read and agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Notice</Text> on how we collect, use,
          disclose, and process your personal data.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          onPress={onNext}
          disabled={!isNextEnabled}
          style={[styles.nextBtn, !isNextEnabled && styles.nextBtnDisabled]}
        >
          <Text
            style={[
              styles.nextText,
              !isNextEnabled && styles.nextTextDisabled,
            ]}
          >
            {loading ? 'Creating...' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GetStartedNameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  label: {
    fontSize: 14,
    color: '#111',
    marginBottom: 10,
  },
  question: {
    fontSize: 14,
    color: '#9a9a9a',
    marginBottom: 10,
  },
  phoneText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 14,
  },

  input: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    fontSize: 16,
    color: '#111',
    paddingVertical: 8,
    marginBottom: 18,
  },

  errorText: {
    color: '#d93025',
    fontSize: 14,
    marginBottom: 12,
  },

  terms: {
    fontSize: 12,
    color: '#9a9a9a',
    lineHeight: 18,
    marginTop: 10,
  },
  link: {
    color: '#2F6FED',
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
    backgroundColor: '#DFF3E7',
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  nextTextDisabled: {
    color: '#93C9A6',
  },
});