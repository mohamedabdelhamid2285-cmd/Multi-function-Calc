import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCalculator } from '@/contexts/CalculatorContext';
import FallbackBannerAd from './BannerAd';

interface BannerAdComponentProps {
  size?: any;
}

export const BannerAdComponent: React.FC<BannerAdComponentProps> = () => {
  const { state } = useCalculator();

  // Don't render anything if user is Pro
  if (state.isProUser) {
    return null;
  }

  // Always show fallback banner ad for now
  return (
    <View style={styles.container}>
      <FallbackBannerAd />
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