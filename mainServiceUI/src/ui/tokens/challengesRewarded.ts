import { Platform } from 'react-native';

export const ChallengeT = Platform.select({
  ios: {
    headingFontScale: 1,
    titleFontScale: 1,
    dateFontScale: 1,
    linkFontScale: 1,
  },
  android: {
    headingFontScale: 1.2,
    titleFontScale: 1.2,
    dateFontScale: 1.2,
    linkFontScale: 1.2,
  },
})!;
