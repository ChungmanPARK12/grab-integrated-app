import { Platform } from 'react-native';

export const TravelSmarterT = Platform.select({
  ios: {
    headerFontScale: 1,
    titleFontScale: 1,
    descriptionFontScale: 1,
  },
  android: {
    headerFontScale: 1.2,
    titleFontScale: 1.2,
    descriptionFontScale: 1.2,
  },
})!;
