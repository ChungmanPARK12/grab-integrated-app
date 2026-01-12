// mainServiceUI/ui/tokens/serviceGrid.ts
import { Platform } from "react-native";

export const SERVICE_GRID_TOKENS = Platform.select({
  ios: {
    gridPaddingTop: 20,
    gridPaddingHorizontal: 0,
    gridAlignItems: "center" as const,

    itemWidth: 63,
    itemMarginTop: 10,
    itemMarginBottom: 15,
    itemMarginRight: 5,

    // Keep iOS
    itemMarginLeft: 25,

    tagTop: -8,
    tagRight: 12,
    tagFontSize: 10,
    tagPaddingHorizontal: 4,
    tagBorderRadius: 4,

    iconWrapperWidth: 80,
    iconWrapperHeight: 90,
    iconWrapperRadius: 16,
    iconWrapperMarginBottom: -16,

    iconSize: 80,

    placeholderSize: 65,
    placeholderRadius: 10,
    placeholderOpacity: 0.8,
  },

  android: {
    gridPaddingTop: 20,
    gridPaddingHorizontal: 0,
    gridAlignItems: "center" as const,

    itemWidth: 63,
    itemMarginTop: 10,
    itemMarginBottom: 15,
    itemMarginRight: 5,

    // Move the 8 items
    itemMarginLeft: 28,

    tagTop: -8,
    tagRight: 12,
    tagFontSize: 10,
    tagPaddingHorizontal: 4,
    tagBorderRadius: 4,

    iconWrapperWidth: 80,
    iconWrapperHeight: 90,
    iconWrapperRadius: 16,
    iconWrapperMarginBottom: -16,

    iconSize: 80,

    placeholderSize: 65,
    placeholderRadius: 10,
    placeholderOpacity: 0.8,
  },
})!;
