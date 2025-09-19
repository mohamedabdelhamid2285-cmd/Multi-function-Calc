import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CalculatorProvider } from '@/contexts/CalculatorContext';

export default function RootLayout() {
  useFrameworkReady();

  // Initialize Google Mobile Ads
  useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        const { default: mobileAds } = require('react-native-google-mobile-ads');
        mobileAds()
          .initialize()
          .then(() => {
            // AdMob initialized successfully
          })
          .catch(() => {
            // AdMob initialization failed - silently handle
          });
      } catch (error) {
        // Silently handle - AdMob not available in web preview
      }
    }
  }, []);

  return (
    <CalculatorProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </CalculatorProvider>
  );
}
