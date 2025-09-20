import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCalculator } from '@/contexts/CalculatorContext';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import BannerAdComponent from '@/components/BannerAdComponent';

export default function VectorScreen() {
  const { state } = useCalculator();
  const { showInterstitialAd } = useInterstitialAd();
  const isDark = state.theme === 'dark';

  const backgroundColors = isDark ? ['#121212', '#1E1E1E'] : ['#F3F4F6', '#FFFFFF'];
  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const inputBackgroundColor = isDark ? '#2C2C2C' : '#E0E0E0';
  const buttonBackgroundColor = isDark ? '#4A4A4A' : '#D1D5DB';
  const buttonTextColor = isDark ? '#FFFFFF' : '#1F2937';

  const [vectorA, setVectorA] = useState<number[]>([0, 0, 0]);
  const [vectorB, setVectorB] = useState<number[]>([0, 0, 0]);
  const [resultVector, setResultVector] = useState<number[] | null>(null);
  const [resultScalar, setResultScalar] = useState<number | null>(null);
  const [currentOperation, setCurrentOperation] = useState('');
  const [hasShownResult, setHasShownResult] = useState(false);

  const handleVectorAChange = (text: string, index: number) => {
    const newVector = [...vectorA];
    newVector[index] = parseFloat(text || '0');
    setVectorA(newVector);
  };

  const handleVectorBChange = (text: string, index: number) => {
    const newVector = [...vectorB];
    newVector[index] = parseFloat(text || '0');
    setVectorB(newVector);
  };

  const calculateResult = useCallback(() => {
    setResultVector(null);
    setResultScalar(null);
    setHasShownResult(false);

    const a = vectorA;
    const b = vectorB;

    if (a.length !== b.length && currentOperation !== 'magnitudeA') {
      Alert.alert("Error", "Vectors must have the same dimension for this operation.");
      return;
    }

    switch (currentOperation) {
      case 'add':
        setResultVector(a.map((val, i) => val + b[i]));
        setHasShownResult(true);
        break;
      case 'subtract':
        setResultVector(a.map((val, i) => val - b[i]));
        setHasShownResult(true);
        break;
      case 'dotProduct':
        setResultScalar(a.reduce((sum, val, i) => sum + val * b[i], 0));
        setHasShownResult(true);
        break;
      case 'crossProduct':
        if (a.length !== 3 || b.length !== 3) {
          Alert.alert("Error", "Cross product is only defined for 3D vectors.");
          return;
        }
        setResultVector([
          a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0],
        ]);
        setHasShownResult(true);
        break;
      case 'magnitudeA':
        setResultScalar(Math.sqrt(a.reduce((sum, val) => sum + val * val, 0)));
        setHasShownResult(true);
        break;
      default:
        break;
    }
  }, [vectorA, vectorB, currentOperation]);

  // Show interstitial ad after successful calculation
  useEffect(() => {
    if (hasShownResult) {
      showInterstitialAd();
    }
  }, [hasShownResult, showInterstitialAd]);

  useEffect(() => {
    if (currentOperation) {
      calculateResult();
    }
  }, [currentOperation, vectorA, vectorB, calculateResult]); // Recalculate if vectors or operation changes

  const handleOperationPress = (operation: string) => {
    setCurrentOperation(operation);
  };

  const renderVectorInput = (vector: number[], handleVectorChange: (text: string, index: number) => void) => (
    <View style={styles.vectorInputContainer}>
      {vector.map((component, index) => (
        <TextInput
          key={index}
          style={[styles.vectorComponentInput, { backgroundColor: inputBackgroundColor, color: textColor }]}
          keyboardType="numeric"
          value={component.toString()} // Use value instead of defaultValue for controlled component
          onChangeText={(text) => handleVectorChange(text, index)}
        />
      ))}
    </View>
  );

  const renderVectorOutput = (vector: number[]) => (
    <Text style={[styles.resultText, { color: textColor }]}>
      [{vector.map(c => c.toFixed(2)).join(', ')}]
    </Text>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={backgroundColors} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: textColor }]}>Vector Calculator</Text>
            <Text style={[styles.description, { color: textColor }]}>
              Perform operations on vectors.
            </Text>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Vector A</Text>
              {renderVectorInput(vectorA, handleVectorAChange)}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Vector B</Text>
              {renderVectorInput(vectorB, handleVectorBChange)}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('add')}>
                <Text style={{ color: buttonTextColor }}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('subtract')}>
                <Text style={{ color: buttonTextColor }}>Subtract</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('dotProduct')}>
                <Text style={{ color: buttonTextColor }}>Dot Product</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('crossProduct')}>
                <Text style={{ color: buttonTextColor }}>Cross Product</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('magnitudeA')}>
                <Text style={{ color: buttonTextColor }}>Magnitude A</Text>
              </TouchableOpacity>
            </View>

            {(resultVector || resultScalar !== null) && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Result ({currentOperation})</Text>
                {resultVector && renderVectorOutput(resultVector)}
                {resultScalar !== null && (
                  <Text style={[styles.resultText, { color: textColor }]}>
                    {resultScalar.toFixed(2)}
                  </Text>
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
  section: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  vectorInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  vectorComponentInput: {
    width: 80,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 16,
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
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
