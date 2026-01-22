import { Platform } from 'react-native';

export const AuthOptionsT = Platform.select({
  ios: {
    logoFontScale: 1,
    taglineFontScale: 1,

    buttonsOffsetY: 25,   
  },
  android: {
    logoFontScale: 1.2,
    taglineFontScale: 1.2,
    authTextFontScale: 1.2,

    topAreaOffsetY: 25,
    buttonsOffsetY: -25,
  },
})!;
