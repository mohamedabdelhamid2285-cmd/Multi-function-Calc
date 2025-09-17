import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useCalculator } from '@/contexts/CalculatorContext';

// Conditional import for AdMob (only on native platforms)
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

if (Platform.OS !== 'web') {
  try {
    const AdMob = require('react-native-google-mobile-ads');
    BannerAd = AdMob.BannerAd;
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
  size = BannerAdSize?.FULL_BANNER || 'FULL_BANNER'
}) => {
  const { state } = useCalculator();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Don't render anything if user is Pro
  if (state.isProUser) {
    console.log('User is Pro - not showing banner ad');
    return null;
  }

  // Don't render on web platform as AdMob doesn't support it
  if (Platform.OS === 'web' || !BannerAd) {
    console.log('Web platform - not showing banner ad');
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
          setAdLoaded(true);
          setAdError(false);
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
          setAdLoaded(false);
          setAdError(true);
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
    paddingVertical: 8,
  },
});

export default BannerAdComponent;