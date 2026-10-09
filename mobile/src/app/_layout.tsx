import {
  PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold, useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';
import { ModeWipe, PresentationPage, Toast, useWideWeb } from '../components/chrome';
import { DuoProvider, useDuo } from '../store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
  });
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <DuoProvider>
        <Shell />
      </DuoProvider>
    </SafeAreaProvider>
  );
}

/** Insets of the iPhone frame used on the wide web presentation page. */
const FRAME_INSETS = { top: 54, bottom: 34, left: 0, right: 0 };

function Shell() {
  const wide = useWideWeb();
  const app = (
    <View style={{ flex: 1, backgroundColor: '#fff', overflow: 'hidden' }}>
      <StatusBar style="dark" />
      <AppStack />
      <Toast />
      <ModeWipe />
    </View>
  );
  if (!wide) return app;
  return (
    <PresentationPage>
      <SafeAreaInsetsContext.Provider value={FRAME_INSETS}>{app}</SafeAreaInsetsContext.Provider>
    </PresentationPage>
  );
}

function AppStack() {
  const { s } = useDuo();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }}>
      <Stack.Protected guard={s.onboarding}>
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={!s.onboarding}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="thread/[id]" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="discover" options={{ animation: 'fade' }} />
        <Stack.Screen name="compose" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="story" options={{ animation: 'fade', contentStyle: { backgroundColor: '#000' } }} />
        <Stack.Screen name="call" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack.Protected>
    </Stack>
  );
}
