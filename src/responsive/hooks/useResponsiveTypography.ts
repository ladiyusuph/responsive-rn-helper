import { useResponsiveValue } from "./useResponsiveValue";

export function useResponsiveTypography() {
  return {
    xxs: useResponsiveValue(
      {
        small: 8,
        phone: 9,
        tablet: 10,
        largeTablet: 10,
      },
      9,
    ),

    xs: useResponsiveValue(
      {
        small: 10,
        phone: 10,
        tablet: 11,
        largeTablet: 12,
      },
      10,
    ),

    sm: useResponsiveValue(
      {
        small: 12,
        phone: 12,
        tablet: 13,
        largeTablet: 14,
      },
      12,
    ),

    md: useResponsiveValue(
      {
        small: 14,
        phone: 14,
        tablet: 15,
        largeTablet: 16,
      },
      14,
    ),

    lg: useResponsiveValue(
      {
        small: 16,
        phone: 16,
        tablet: 17,
        largeTablet: 18,
      },
      16,
    ),

    xl: useResponsiveValue(
      {
        small: 18,
        phone: 18,
        tablet: 20,
        largeTablet: 21,
      },
      18,
    ),

    xxl: useResponsiveValue(
      {
        small: 20,
        phone: 20,
        tablet: 22,
        largeTablet: 24,
      },
      20,
    ),

    "2xl": useResponsiveValue(
      {
        small: 22,
        phone: 22,
        tablet: 24,
        largeTablet: 28,
      },
      22,
    ),

    "3xl": useResponsiveValue(
      {
        small: 26,
        phone: 26,
        tablet: 28,
        largeTablet: 32,
      },
      26,
    ),
  };
}
