import { useEffect, useRef, useCallback } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useCalculator } from '@/contexts/CalculatorContext';

// Test ID for interstitial ads - replace with your actual ad unit ID in production
const INTERSTITIAL_AD_UNIT_ID = TestIds.INTERSTITIAL;

export const useInterstitialAd = () => {
  const { state } = useCalculator();
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const isLoadingRef = useRef(false);
  const isLoadedRef = useRef(false);

  // Initialize the interstitial ad
  useEffect(() => {
    if (!interstitialRef.current) {
      interstitialRef.current = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      // Set up event listeners
      const unsubscribeLoaded = interstitialRef.current.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log('Interstitial ad loaded');
          isLoadedRef.current = true;
          isLoadingRef.current = false;
        }
      );

      const unsubscribeError = interstitialRef.current.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          console.log('Interstitial ad failed to load:', error);
          isLoadedRef.current = false;
          isLoadingRef.current = false;
        }
      );

      const unsubscribeClosed = interstitialRef.current.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('Interstitial ad closed');
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
    if (state.isProUser) {
      console.log('User is Pro - not loading interstitial ad');
      return;
    }

    if (interstitialRef.current && !isLoadingRef.current && !isLoadedRef.current) {
      console.log('Loading interstitial ad...');
      isLoadingRef.current = true;
      interstitialRef.current.load();
    }
  }, [state.isProUser]);

  // Function to show the ad
  const showAd = useCallback(() => {
    if (state.isProUser) {
      console.log('User is Pro - not showing interstitial ad');
      return;
    }

    if (interstitialRef.current && isLoadedRef.current) {
      console.log('Showing interstitial ad...');
      interstitialRef.current.show();
    } else {
      console.log('Interstitial ad not ready to show');
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