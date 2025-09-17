import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import mobileAds from 'react-native-google-mobile-ads';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CalculatorProvider } from '@/contexts/CalculatorContext';

export default function RootLayout() {
  useFrameworkReady();

  // Initialize Google Mobile Ads
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('Google Mobile Ads initialized:', adapterStatuses);
      })
      .catch(error => {
        console.error('Failed to initialize Google Mobile Ads:', error);
      });
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
