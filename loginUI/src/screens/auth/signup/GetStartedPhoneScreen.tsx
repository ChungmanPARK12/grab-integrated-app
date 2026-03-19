// src/screens/auth/signup/GetStartedPhoneScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { AuthStackParamList } from '@login/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';

type Props = NativeStackScreenProps<AuthStackParamList, 'GetStartedSignup'>;

const BASE_URL = 'https://nonlyrical-melonie-eudiometric.ngrok-free.dev';

type CheckSignupPhoneResponse = {
  available: boolean;
  message?: string;
};

const checkSignupPhone = async (phone: string) => {
  const response = await fetch(`${BASE_URL}/api/signup/check-phone`, {
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

  return data as CheckSignupPhoneResponse;
};

const GetStartedPhoneScreen = ({ navigation }: Props) => {
  const [countryCode, setCountryCode] = useState<CountryCode>('AU');
  const [callingCode, setCallingCode] = useState<string>('61');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Get Started',
    });
  }, [navigation]);

  const cleanedPhone = useMemo(() => phone.replace(/[^\d]/g, ''), [phone]);
  const isValid = cleanedPhone.length >= 9;

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);

    const firstCode = country.callingCode?.[0] ?? '';
    if (firstCode) setCallingCode(firstCode);

    setIsPickerVisible(false);
  };

  const onClear = () => setPhone('');

  const onNext = async () => {
    if (!isValid || loading) return;

    const fullPhone = `+${callingCode}${cleanedPhone}`;

    try {
      setLoading(true);
      setErrorMessage('');

      const result = await checkSignupPhone(fullPhone);

      if (!result.available) {
        setErrorMessage(
          result.message || 'This phone number is already registered.'
        );
        return;
      }

      navigation.navigate('VerifyOtp', {
        phoneNumber: fullPhone,
        flow: 'signup',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to continue';
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
        <Text style={styles.label}>Phone Number</Text>

        <View style={styles.row}>
          <Pressable
            style={styles.countryBox}
            onPress={() => setIsPickerVisible(true)}
          >
            <View style={styles.countryInner}>
              <CountryPicker
                withCallingCode
                withFilter
                withFlag
                countryCode={countryCode}
                visible={isPickerVisible}
                onClose={() => setIsPickerVisible(false)}
                onSelect={onSelectCountry}
              />
              <Text style={styles.countryText}>{`+${callingCode}`}</Text>
            </View>

            <Text style={styles.chev}>▾</Text>
          </Pressable>

          <View style={[styles.inputWrap, phone.length > 0 && styles.inputWrapActive]}>
            <TextInput
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Input mobile number"
              keyboardType="number-pad"
              returnKeyType="done"
              style={styles.input}
              autoFocus
              editable={!loading}
            />

            {phone.length > 0 && !loading && (
              <Pressable onPress={onClear} hitSlop={10} style={styles.clearBtn}>
                <Text style={styles.clearText}>×</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.bottom}>
        <Pressable
          onPress={onNext}
          disabled={!isValid || loading}
          style={[styles.nextBtn, (!isValid || loading) && styles.nextBtnDisabled]}
        >
          <Text
            style={[styles.nextText, (!isValid || loading) && styles.nextTextDisabled]}
          >
            {loading ? 'Checking...' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GetStartedPhoneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  countryBox: {
    height: 48,
    minWidth: 110,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryText: {
    fontSize: 16,
    color: '#111',
  },
  chev: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },

  inputWrap: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapActive: {
    borderColor: '#00B14F',
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    paddingVertical: 0,
  },

  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e9e9e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 18,
    lineHeight: 18,
    color: '#555',
  },

  errorText: {
    color: '#d93025',
    fontSize: 14,
    paddingHorizontal: 20,
    marginTop: 10,
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
    backgroundColor: '#a7e3bf',
  },

  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  nextTextDisabled: {
    color: '#f2fff7',
  },
});