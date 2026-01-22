// promoBannerTokens.ts (원하는 위치에)
import { Platform } from 'react-native';

export const PromoT = Platform.select({
  ios: {
    //main banner box
    overlayPaddingTop: 140,
    textSectionMarginTop: 90,
    titleMarginTop: -20,
    subtitleMarginTop: 15,
    promoCardsMarginTop: 12,

    // 3 cards
    titleFontScale: 1,
    subtitleFontScale: 1,
    cardTextFontScale: 1,
  },
  android: {
    //main banner box
    overlayPaddingTop: 160,     
    textSectionMarginTop: 70,   
    titleMarginTop: -18,
    subtitleMarginTop: 12,
    
    // 3 cards
    promoCardsMarginTop: 10,

    titleFontScale: 1.2,
    subtitleFontScale: 1.3,
    cardTextFontScale: 1.3, 
    
    promoCardWidthDelta: 0,    
    promoCardHeightDelta: 50,
  },
})!;