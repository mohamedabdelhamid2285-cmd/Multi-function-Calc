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
        const mobileAds = require('react-native-google-mobile-ads').default;
        mobileAds()
          .initialize()
          .then((adapterStatuses: any) => {
            console.log('Google Mobile Ads initialized:', adapterStatuses);
          })
          .catch((error: any) => {
            console.error('Failed to initialize Google Mobile Ads:', error);
          });
      } catch (error) {
        console.log('AdMob not available on this platform:', error);
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
