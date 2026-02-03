// src/login/components/GetStartedNameScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';

const GetUsername = ({ navigation, route }: any) => {
  const { phoneNumber, countryCode } = route.params || {};
  const [username, setUsername] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Get Started',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  const isNextEnabled = useMemo(() => {
    return username.trim().length > 0;
  }, [username]);

  const onNext = () => {
    if (!isNextEnabled) return;

    // Next step will be connected later (Main service / etc.)
    // navigation.navigate('MainService');
    console.log('Name:', username, countryCode, phoneNumber);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.question}>What should people call you?</Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder=""
          autoFocus
          returnKeyType="done"
          style={styles.input}
        />

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
          <Text style={[styles.nextText, !isNextEnabled && styles.nextTextDisabled]}>
            Next
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GetUsername;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

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

  input: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    fontSize: 16,
    color: '#111',
    paddingVertical: 8,
    marginBottom: 18,
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
    backgroundColor: '#DFF3E7', // 스샷처럼 연한 초록 느낌
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
