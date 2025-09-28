import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCalculator } from '@/contexts/CalculatorContext';

interface CalculatorButtonProps {
  symbol: string;
  onPress: () => void;
  type?: 'digit' | 'operator' | 'function' | 'memory' | 'equals' | 'clear';
  flex?: number;
  fontSize?: number;
}

export default function CalculatorButton({
  symbol,
  onPress,
  type = 'digit',
  flex = 1,
  fontSize = 18,
}: CalculatorButtonProps) {
  const { state } = useCalculator();
  const isDark = state.theme === 'dark';

  const getButtonColors = () => {
    const colors = {
      digit: isDark ? ['#2A2A2A', '#1E1E1E'] : ['#F8F9FA', '#E9ECEF'],
      operator: ['#F59E0B', '#D97706'],
      function: ['#3B82F6', '#2563EB'],
      memory: ['#10B981', '#059669'],
      equals: ['#EF4444', '#DC2626'],
      clear: ['#6B7280', '#4B5563'],
    };
    return colors[type];
  };

  const getTextColor = () => {
    if (type === 'digit') {
      return isDark ? '#FFFFFF' : '#1F2937';
    }
    return '#FFFFFF';
  };

  const buttonStyle: ViewStyle = {
    flex,
    margin: 2,
    minHeight: 48,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  };

  const textStyle: TextStyle = {
    color: getTextColor(),
    fontSize,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={() => {
        console.log(`CalculatorButton: ${symbol} pressed directly`); // Direct log for debugging
        onPress(); // Call the original onPress prop
      }}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getButtonColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Text style={textStyle}>{symbol}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
});
