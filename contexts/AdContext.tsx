import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AdContextType {
  isPremium: boolean;
  setPremium: (premium: boolean) => void;
  adFreeTrial: boolean;
  startAdFreeTrial: () => void;
  showInterstitialAd: () => void;
  showRewardedAd: (onReward: () => void) => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

interface AdProviderProps {
  children: ReactNode;
}

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [adFreeTrial, setAdFreeTrial] = useState(false);
  const [trialStartTime, setTrialStartTime] = useState<number | null>(null);

  // Load premium status from storage
  useEffect(() => {
    const loadPremiumStatus = async () => {
      try {
        const premiumStatus = await AsyncStorage.getItem('isPremium');
        const trialStatus = await AsyncStorage.getItem('adFreeTrial');
        const trialTime = await AsyncStorage.getItem('trialStartTime');
        
        if (premiumStatus === 'true') {
          setIsPremium(true);
        }
        
        if (trialStatus === 'true' && trialTime) {
          const startTime = parseInt(trialTime);
          const currentTime = Date.now();
          const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          
          if (currentTime - startTime < twentyFourHours) {
            setAdFreeTrial(true);
            setTrialStartTime(startTime);
          } else {
            // Trial expired
            await AsyncStorage.removeItem('adFreeTrial');
            await AsyncStorage.removeItem('trialStartTime');
          }
        }
      } catch (error) {
        console.error('Error loading premium status:', error);
      }
    };
    
    loadPremiumStatus();
  }, []);

  const setPremium = async (premium: boolean) => {
    setIsPremium(premium);
    try {
      await AsyncStorage.setItem('isPremium', premium.toString());
      if (premium) {
        // If user becomes premium, remove trial
        setAdFreeTrial(false);
        await AsyncStorage.removeItem('adFreeTrial');
        await AsyncStorage.removeItem('trialStartTime');
      }
    } catch (error) {
      console.error('Error saving premium status:', error);
    }
  };

  const startAdFreeTrial = async () => {
    if (!isPremium && !adFreeTrial) {
      const startTime = Date.now();
      setAdFreeTrial(true);
      setTrialStartTime(startTime);
      
      try {
        await AsyncStorage.setItem('adFreeTrial', 'true');
        await AsyncStorage.setItem('trialStartTime', startTime.toString());
      } catch (error) {
        console.error('Error saving trial status:', error);
      }
      
      // Set timer to end trial after 24 hours
      setTimeout(async () => {
        setAdFreeTrial(false);
        setTrialStartTime(null);
        try {
          await AsyncStorage.removeItem('adFreeTrial');
          await AsyncStorage.removeItem('trialStartTime');
        } catch (error) {
          console.error('Error removing trial status:', error);
        }
      }, 24 * 60 * 60 * 1000); // 24 hours
    }
  };

  const showInterstitialAd = () => {
    // In a real implementation, you would show an interstitial ad here
    // For now, we'll just log it
    console.log('Showing interstitial ad...');
    
    // Simulate ad loading and showing
    setTimeout(() => {
      console.log('Interstitial ad completed');
    }, 2000);
  };

  const showRewardedAd = (onReward: () => void) => {
    // Rewarded ads can be shown even for premium users
    console.log('Showing rewarded ad...');
    
    // Simulate ad loading and showing
    setTimeout(() => {
      console.log('Rewarded ad completed');
      onReward();
    }, 3000);
  };

  return (
    <AdContext.Provider value={{
      isPremium,
      setPremium,
      adFreeTrial,
      startAdFreeTrial,
      showInterstitialAd,
      showRewardedAd,
    }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};