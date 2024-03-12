import React, { useEffect } from "react"
import { ViewStyle } from "react-native"

import { useFonts } from "expo-font"
import { Slot, Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { ErrorBoundary } from "src/components/ErrorBoundary/ErrorBoundary"
import Config from "src/config"
import { useInitialRootStore } from "src/models"
import { customFontsToLoad } from "src/theme"

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts")

  // Register dev menu items
  require("src/devtools/DevExtensions.ts")
}

SplashScreen.preventAutoHideAsync()

const hideSplashScreen = () => {
  SplashScreen.hideAsync()
}

export default function RootLayout() {
  const [areFontsLoaded, fontError] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    setTimeout(hideSplashScreen, 500)
  })

  useEffect(() => {
    if (areFontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [areFontsLoaded, fontError])

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rehydrated || !areFontsLoaded) return null

  return <RootLayoutNav />
}

const RootLayoutNav = observer(function RootLayoutNav() {
  // Wait for stores to load and render our layout inside of it so we have access
  // to auth info etc
  const { rehydrated } = useInitialRootStore()
  if (!rehydrated) {
    return null
  }

  return (
    <GestureHandlerRootView style={$flex}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
        <StatusBar />
      </ErrorBoundary>
    </GestureHandlerRootView>
  )
})

const $flex: ViewStyle = { flex: 1 }
