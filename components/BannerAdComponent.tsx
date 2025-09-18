import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useCalculator } from '@/contexts/CalculatorContext';
import FallbackBannerAd from './BannerAd';

// Conditional import for AdMob (only on native platforms)
let BannerAdNative: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

if (Platform.OS !== 'web') {
  try {
    const AdMob = require('react-native-google-mobile-ads');
    BannerAdNative = AdMob.BannerAd;
    BannerAdSize = AdMob.BannerAdSize;
    TestIds = AdMob.TestIds;
  } catch (error) {
    console.log('AdMob not available:', error);
  }
}

// Test ID for banner ads - replace with your actual ad unit ID in production
const BANNER_AD_UNIT_ID = TestIds?.BANNER || 'ca-app-pub-3940256099942544/6300978111';

interface BannerAdComponentProps {
  size?: any;
}

export const BannerAdComponent: React.FC<BannerAdComponentProps> = ({ 
  size = BannerAdSize?.FULL_BANNER
}) => {
  const { state } = useCalculator();

  // Don't render anything if user is Pro
  if (state.isProUser) {
    return null;
  }

  // Show fallback banner ad on web or when AdMob is not available
  if (Platform.OS === 'web' || !BannerAdNative) {
    return <FallbackBannerAd />;
  }

  // Show real AdMob banner on native platforms
  return (
    <View style={styles.container}>
      <BannerAdNative
        unitId={BANNER_AD_UNIT_ID}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Native banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.log('Native banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default BannerAdComponent;