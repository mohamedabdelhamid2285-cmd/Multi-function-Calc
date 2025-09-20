import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCalculator } from '@/contexts/CalculatorContext';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import BannerAdComponent from '@/components/BannerAdComponent';

import { useEffect } from 'react';

export default function StatisticsScreen() {
  const { state } = useCalculator();
  const { showInterstitialAd } = useInterstitialAd();
  const isDark = state.theme === 'dark';

  const backgroundColors = isDark ? ['#121212', '#1E1E1E'] : ['#F3F4F6', '#FFFFFF'];
  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const inputBackgroundColor = isDark ? '#2C2C2C' : '#E0E0E0';
  const buttonBackgroundColor = isDark ? '#4A4A4A' : '#D1D5DB';
  const buttonTextColor = isDark ? '#FFFFFF' : '#1F2937';

  const [dataInput, setDataInput] = useState('');
  const [results, setResults] = useState<{ [key: string]: number | string | null }>({});
  const [hasShownResult, setHasShownResult] = useState(false);

  const parseData = (input: string): number[] => {
    return input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  };

  const calculateMean = (data: number[]) => {
    if (data.length === 0) return null;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  };

  const calculateMedian = (data: number[]) => {
    if (data.length === 0) return null;
    const sortedData = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    return sortedData.length % 2 === 0 ? (sortedData[mid - 1] + sortedData[mid]) / 2 : sortedData[mid];
  };

  const calculateMode = (data: number[]) => {
    if (data.length === 0) return null;
    const frequencyMap: { [key: number]: number } = {};
    data.forEach(num => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    let maxFreq = 0;
    let modes: number[] = [];
    for (const numStr in frequencyMap) {
      const num = parseFloat(numStr);
      if (frequencyMap[num] > maxFreq) {
        maxFreq = frequencyMap[num];
        modes = [num];
      } else if (frequencyMap[num] === maxFreq) {
        modes.push(num);
      }
    }
    return modes.length === data.length ? 'No mode' : modes.join(', ');
  };

  const calculateStdDev = (data: number[]) => {
    if (data.length < 2) return null;
    const mean = calculateMean(data);
    if (mean === null) return null;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1);
    return Math.sqrt(variance);
  };

  const handleCalculate = (type: string) => {
    const data = parseData(dataInput);
    if (data.length === 0) {
      setResults({ error: 'Please enter valid numbers.' });
      setHasShownResult(false);
      return;
    }

    let newResults: { [key: string]: number | string | null } = {};
    switch (type) {
      case 'mean':
        newResults.mean = calculateMean(data);
        setHasShownResult(true);
        break;
      case 'median':
        newResults.median = calculateMedian(data);
        setHasShownResult(true);
        break;
      case 'mode':
        newResults.mode = calculateMode(data);
        setHasShownResult(true);
        break;
      case 'stdDev':
        newResults.stdDev = calculateStdDev(data);
        setHasShownResult(true);
        break;
      case 'all':
        newResults.mean = calculateMean(data);
        newResults.median = calculateMedian(data);
        newResults.mode = calculateMode(data);
        newResults.stdDev = calculateStdDev(data);
        setHasShownResult(true);
        break;
    }
    setResults(newResults);
  };

  // Show interstitial ad after successful calculation
  useEffect(() => {
    if (hasShownResult) {
      showInterstitialAd();
    }
  }, [hasShownResult, showInterstitialAd]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={backgroundColors} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: textColor }]}>Statistics</Text>
            <Text style={[styles.description, { color: textColor }]}>
              Analyze data with statistical functions. Enter numbers separated by commas.
            </Text>

            <TextInput
              style={[styles.dataInput, { backgroundColor: inputBackgroundColor, color: textColor }]}
              placeholder="e.g., 1, 2, 3, 4, 5"
              placeholderTextColor={isDark ? '#A0A0A0' : '#6B7280'}
              keyboardType="numbers-and-punctuation"
              multiline
              numberOfLines={4}
              value={dataInput}
              onChangeText={setDataInput}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleCalculate('mean')}>
                <Text style={{ color: buttonTextColor }}>Mean</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleCalculate('median')}>
                <Text style={{ color: buttonTextColor }}>Median</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleCalculate('mode')}>
                <Text style={{ color: buttonTextColor }}>Mode</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleCalculate('stdDev')}>
                <Text style={{ color: buttonTextColor }}>Std Dev</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleCalculate('all')}>
                <Text style={{ color: buttonTextColor }}>Calculate All</Text>
              </TouchableOpacity>
            </View>

            {Object.keys(results).length > 0 && (
              <View style={styles.resultsContainer}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Results</Text>
                {results.error ? (
                  <Text style={[styles.resultText, { color: 'red' }]}>{results.error}</Text>
                ) : (
                  <>
                    {results.mean !== undefined && results.mean !== null && (
                      <Text style={[styles.resultText, { color: textColor }]}>Mean: {typeof results.mean === 'number' ? results.mean.toFixed(4) : results.mean}</Text>
                    )}
                    {results.median !== undefined && results.median !== null && (
                      <Text style={[styles.resultText, { color: textColor }]}>Median: {typeof results.median === 'number' ? results.median.toFixed(4) : results.median}</Text>
                    )}
                    {results.mode !== undefined && results.mode !== null && (
                      <Text style={[styles.resultText, { color: textColor }]}>Mode: {results.mode}</Text>
                    )}
                    {results.stdDev !== undefined && results.stdDev !== null && (
                      <Text style={[styles.resultText, { color: textColor }]}>Standard Deviation: {typeof results.stdDev === 'number' ? results.stdDev.toFixed(4) : results.stdDev}</Text>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Banner Ad at bottom */}
        <BannerAdComponent />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    width: '90%',
    maxWidth: 600,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  dataInput: {
    width: '100%',
    minHeight: 100,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  operationButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  resultsContainer: {
    width: '100%',
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B7280',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 5,
  },
});
