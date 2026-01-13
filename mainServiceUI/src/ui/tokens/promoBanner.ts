// promoBannerTokens.ts (원하는 위치에)
import { Platform } from 'react-native';

export const PromoT = Platform.select({
  ios: {
    overlayPaddingTop: 140,
    textSectionMarginTop: 90,
    titleMarginTop: -20,
    subtitleMarginTop: 15,
    promoCardsMarginTop: 12,
  },
  android: {
    overlayPaddingTop: 120,     // ✅ 카드 전체를 위로
    textSectionMarginTop: 70,   // ✅ 텍스트 블록 때문에 내려가는 값 줄이기
    titleMarginTop: -18,
    subtitleMarginTop: 12,
    promoCardsMarginTop: 6,     // ✅ 카드 시작을 더 위로
  },
})!;
