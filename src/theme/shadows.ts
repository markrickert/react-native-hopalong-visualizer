import { ColorValue, Platform, ViewStyle } from 'react-native';

interface PlatformShadowStyleProps {
  xOffset?: number;
  yOffset?: number;
  shadowColor?: ColorValue;
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

// Whenever you use a shadow in the app, you should be using this function.
// It will return a standardized shadow for ios or android based on the platform's capabilities.
// This function also optimizes the usage of shadowOpacity by including it in the color's alpha
// instead of taking longer to render a shadowOpacity on the hardware.
//
// https://reactnative.dev/docs/shadow-props
//
// Usage:
// const styleWithShadow = {
//   width: 10,
//   height: 10,
//   borderRadius: 3,
//   // This will put a shadow above the box on ios and fallback to elevation on android
//   ...platformShadowStyle({
//     xOffset: 0,
//     yOffset: 2,
//     shadowColor: theme.shadow,
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 4,
//   }),
// }
export const platformShadowStyle = ({
  xOffset = 0,
  yOffset = 0,
  shadowColor = 'black',
  shadowOpacity = 0.25,
  shadowRadius = 4,
  elevation = 4,
}: PlatformShadowStyleProps) => {
  // Because there are significant performance issues with using shadowOpacity
  // we simply apply the opacity as an alpha value of the shadowColor.
  // TODO: the theme styles always define "black" or "white" but if we want to support
  // hex values or anything other than a color string we'll have to be more intelligent about this.
  const newColor =
    shadowColor.toString() === 'black'
      ? `rgba(0.0, 0.0, 0.0, ${shadowOpacity})`
      : `rgba(0.74, 0.74, 0.74, ${shadowOpacity})`; // grey for dark mode
  return Platform.select({
    ios: {
      shadowColor: newColor,
      shadowOffset: { width: xOffset, height: yOffset },
      shadowRadius,
      shadowOpacity: 1,
    },
    android: {
      elevation,
    },
  }) as ViewStyle;
};
