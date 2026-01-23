import { Platform } from 'react-native';

export const DiscoverT = Platform.select({
  ios: {
    titleFontScale: 1,
    subTextFontScale: 1,
  },
  android: {
    titleFontScale: 1.2,
    subTextFontScale: 1.25,
  },
})!;
