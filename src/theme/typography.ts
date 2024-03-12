// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"

import {
  Figtree_300Light as figtreeLight,
  Figtree_400Regular as figtreeRegular,
  Figtree_500Medium as figtreeMedium,
  Figtree_600SemiBold as figtreeSemiBold,
  Figtree_700Bold as figtreeBold,
} from "@expo-google-fonts/figtree"

export const customFontsToLoad = {
  figtreeLight,
  figtreeRegular,
  figtreeMedium,
  figtreeSemiBold,
  figtreeBold,
}

const fonts = {
  figtree: {
    // Cross-platform Google font.
    light: "figtreeLight",
    normal: "figtreeRegular",
    medium: "figtreeMedium",
    semiBold: "figtreeSemiBold",
    bold: "figtreeBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.figtree,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}
