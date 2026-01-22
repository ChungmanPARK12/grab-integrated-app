import { Platform } from 'react-native';

export const LoginT = Platform.select({
  ios: {
    buttonsOffsetY: 5,   
  },
  android: {
    buttonsOffsetY: -10,

    loginTextFontScale: 1.2,
    signupTextFontScale: 1.2,
  },
})!;
