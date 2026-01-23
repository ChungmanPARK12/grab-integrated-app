import { Platform } from 'react-native';

export const PaymentPointsT = Platform.select({
  ios: {
    // typography
    titleFontScale: 1,
    subtitleFontScale: 1,

    // icon sizing (deltas)
    iconWrapperSizeDelta: 0,   // affects width & height (28 + delta)
    iconSizeDelta: 0,          // affects width & height (38 + delta)
  },
  android: {
    // typography (android slightly bigger)
    titleFontScale: 1.2,
    subtitleFontScale: 1.2,

    // icon sizing (android a bit bigger)
    iconWrapperSizeDelta: 2,
    iconSizeDelta: 4,
  },
})!;
