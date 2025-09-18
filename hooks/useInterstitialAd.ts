import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { useCalculator } from '@/contexts/CalculatorContext';

// Conditional import for AdMob (only on native platforms)
let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;

if (Platform.OS !== 'web') {
  try {
    const { default: mobileAds, InterstitialAd: InterstitialAdClass, AdEventType: AdEventTypeClass, TestIds: TestIdsClass } = require('react-native-google-mobile-ads');
    InterstitialAd = InterstitialAdClass;
    AdEventType = AdEventTypeClass;
    TestIds = TestIdsClass;
  } catch (error) {
    // Silently handle the error - AdMob not available
  }
}

// Test ID for interstitial ads - replace with your actual ad unit ID in production
const INTERSTITIAL_AD_UNIT_ID = TestIds?.INTERSTITIAL || 'ca-app-pub-3940256099942544/1033173712';

export const useInterstitialAd = () => {
  const { state } = useCalculator();
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const isLoadingRef = useRef(false);
  const isLoadedRef = useRef(false);

  // Initialize the interstitial ad
  useEffect(() => {
    // Don't initialize on web or if AdMob is not available
    if (Platform.OS === 'web' || !InterstitialAd) {
      return;
    }

    if (!interstitialRef.current) {
      interstitialRef.current = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      // Set up event listeners
      const unsubscribeLoaded = interstitialRef.current.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log('Native interstitial ad loaded');
          isLoadedRef.current = true;
          isLoadingRef.current = false;
        }
      );

      const unsubscribeError = interstitialRef.current.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          console.log('Native interstitial ad failed to load:', error);
          isLoadedRef.current = false;
          isLoadingRef.current = false;
        }
      );

      const unsubscribeClosed = interstitialRef.current.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('Native interstitial ad closed');
          isLoadedRef.current = false;
          // Preload the next ad
          loadAd();
        }
      );

      // Cleanup function
      return () => {
        unsubscribeLoaded();
        unsubscribeError();
        unsubscribeClosed();
      };
    }
  }, []);

  // Function to load the ad
  const loadAd = useCallback(() => {
    if (Platform.OS === 'web' || !InterstitialAd || !interstitialRef.current) {
      return;
    }

    if (state.isProUser) {
      return;
    }

    if (!isLoadingRef.current && !isLoadedRef.current) {
      isLoadingRef.current = true;
      interstitialRef.current.load();
    }
  }, [state.isProUser]);

  // Function to show the ad
  const showAd = useCallback(() => {
    if (Platform.OS === 'web' || !InterstitialAd || !interstitialRef.current) {
      // Silently skip on web or when AdMob is not available
      return;
    }

    if (state.isProUser) {
      return;
    }

    if (interstitialRef.current && isLoadedRef.current) {
      console.log('Showing native interstitial ad...');
      interstitialRef.current.show();
    } else {
      // Try to load ad for next time
      loadAd();
    }
  }, [state.isProUser, loadAd]);

  // Load the first ad when the hook is initialized
  useEffect(() => {
    loadAd();
  }, [loadAd]);

  return {
    showInterstitialAd: showAd,
    loadInterstitialAd: loadAd,
  };
};