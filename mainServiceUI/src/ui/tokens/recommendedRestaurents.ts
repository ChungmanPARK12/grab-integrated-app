import { Platform } from 'react-native';

export const RRT = Platform.select({
  ios: {
    // typography scale
    titleFontScale: 1.0,
    nameFontScale: 1.0,
    infoFontScale: 1.0,
    discountFontScale: 1.0,
    arrowIconScale: 1.0,

    // (optional) layout deltas
    cardWidthDelta: 0,
    imageHeightDelta: 0,
  },
  android: {
    // typography scale (android slightly bigger)
    titleFontScale: 1.2,
    nameFontScale: 1.2,
    infoFontScale: 1.2,
    discountFontScale: 1.2,
    arrowIconScale: 1.2,

    // (optional) layout deltas
    cardWidthDelta: 0,
    imageHeightDelta: 0,
  },
})!;
