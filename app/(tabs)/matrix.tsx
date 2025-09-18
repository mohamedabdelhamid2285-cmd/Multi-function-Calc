import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCalculator } from '@/contexts/CalculatorContext';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import BannerAdComponent from '@/components/BannerAdComponent';

export default function MatrixScreen() {
  const { state } = useCalculator();
  const { showInterstitialAd } = useInterstitialAd();
  const isDark = state.theme === 'dark';

  const backgroundColors = isDark ? ['#121212', '#1E1E1E'] : ['#F3F4F6', '#FFFFFF'];
  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const inputBackgroundColor = isDark ? '#2C2C2C' : '#E0E0E0';
  const buttonBackgroundColor = isDark ? '#4A4A4A' : '#D1D5DB';
  const buttonTextColor = isDark ? '#FFFFFF' : '#1F2937';

  const [matrixA, setMatrixA] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[0, 0], [0, 0]]);
  const [rowsA, setRowsA] = useState('2');
  const [colsA, setColsA] = useState('2');
  const [rowsB, setRowsB] = useState('2');
  const [colsB, setColsB] = useState('2');
  const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
  const [resultScalar, setResultScalar] = useState<number | null>(null); // For determinant
  const [currentOperation, setCurrentOperation] = useState('');
  const [hasShownResult, setHasShownResult] = useState(false);

  const createMatrix = (rows: string, cols: string) => {
    const numRows = parseInt(rows);
    const numCols = parseInt(cols);
    if (isNaN(numRows) || isNaN(numCols) || numRows <= 0 || numCols <= 0) return [[0, 0], [0, 0]];
    return Array(numRows).fill(0).map(() => Array(numCols).fill(0));
  };

  const handleMatrixAChange = (text: string, r: number, c: number) => {
    const newMatrix = [...matrixA];
    newMatrix[r][c] = parseFloat(text || '0');
    setMatrixA(newMatrix);
  };

  const handleMatrixBChange = (text: string, r: number, c: number) => {
    const newMatrix = [...matrixB];
    newMatrix[r][c] = parseFloat(text || '0');
    setMatrixB(newMatrix);
  };

  const updateMatrixDimensions = (matrixType: 'A' | 'B', rows: string, cols: string) => {
    if (matrixType === 'A') {
      setRowsA(rows);
      setColsA(cols);
      setMatrixA(createMatrix(rows, cols));
    } else {
      setRowsB(rows);
      setColsB(cols);
      setMatrixB(createMatrix(rows, cols));
    }
  };

  const calculateMatrixResult = useCallback(() => {
    setResultMatrix(null);
    setResultScalar(null);
    setHasShownResult(false);

    const numRowsA = matrixA.length;
    const numColsA = matrixA[0]?.length || 0;
    const numRowsB = matrixB.length;
    const numColsB = matrixB[0]?.length || 0;

    try {
      switch (currentOperation) {
        case 'add':
          if (numRowsA !== numRowsB || numColsA !== numColsB) {
            Alert.alert("Error", "Matrices must have the same dimensions for addition.");
            return;
          }
          const sumMatrix = Array(numRowsA).fill(0).map((_, r) =>
            Array(numColsA).fill(0).map((_, c) => matrixA[r][c] + matrixB[r][c])
          );
          setResultMatrix(sumMatrix);
          setHasShownResult(true);
          break;

        case 'subtract':
          if (numRowsA !== numRowsB || numColsA !== numColsB) {
            Alert.alert("Error", "Matrices must have the same dimensions for subtraction.");
            return;
          }
          const diffMatrix = Array(numRowsA).fill(0).map((_, r) =>
            Array(numColsA).fill(0).map((_, c) => matrixA[r][c] - matrixB[r][c])
          );
          setResultMatrix(diffMatrix);
          setHasShownResult(true);
          break;

        case 'multiply':
          if (numColsA !== numRowsB) {
            Alert.alert("Error", "Number of columns in Matrix A must equal number of rows in Matrix B for multiplication.");
            return;
          }
          const productMatrix = Array(numRowsA).fill(0).map((_, r) =>
            Array(numColsB).fill(0).map((_, c) => {
              let sum = 0;
              for (let k = 0; k < numColsA; k++) {
                sum += matrixA[r][k] * matrixB[k][c];
              }
              return sum;
            })
          );
          setResultMatrix(productMatrix);
          setHasShownResult(true);
          break;

        case 'transposeA':
          const transposedMatrixA = Array(numColsA).fill(0).map((_, c) =>
            Array(numRowsA).fill(0).map((_, r) => matrixA[r][c])
          );
          setResultMatrix(transposedMatrixA);
          setHasShownResult(true);
          break;

        case 'determinantA':
          if (numRowsA !== numColsA) {
            Alert.alert("Error", "Determinant is only defined for square matrices.");
            return;
          }
          if (numRowsA === 1) {
            setResultScalar(matrixA[0][0]);
            setHasShownResult(true);
          } else if (numRowsA === 2) {
            setResultScalar(matrixA[0][0] * matrixA[1][1] - matrixA[0][1] * matrixA[1][0]);
            setHasShownResult(true);
          } else if (numRowsA === 3) {
            const det =
              matrixA[0][0] * (matrixA[1][1] * matrixA[2][2] - matrixA[1][2] * matrixA[2][1]) -
              matrixA[0][1] * (matrixA[1][0] * matrixA[2][2] - matrixA[1][2] * matrixA[2][0]) +
              matrixA[0][2] * (matrixA[1][0] * matrixA[2][1] - matrixA[1][1] * matrixA[2][0]);
            setResultScalar(det);
            setHasShownResult(true);
          } else {
            Alert.alert("Error", "Determinant calculation for matrices larger than 3x3 is not implemented yet.");
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Matrix calculation error:", error);
      Alert.alert("Calculation Error", "An error occurred during matrix calculation.");
    }
  }, [matrixA, matrixB, currentOperation]);

  // Show interstitial ad after successful calculation
  useEffect(() => {
    if (hasShownResult && !state.isProUser) {
      showInterstitialAd();
    }
  }, [hasShownResult, state.isProUser, showInterstitialAd]);

  useEffect(() => {
    if (currentOperation) {
      calculateMatrixResult();
    }
  }, [currentOperation, matrixA, matrixB, calculateMatrixResult]);

  const handleOperationPress = (operation: string) => {
    setCurrentOperation(operation);
  };

  const renderMatrixInput = (matrix: number[][], handleMatrixChange: (text: string, r: number, c: number) => void) => (
    <View style={styles.matrixGrid}>
      {matrix.map((row, rIdx) => (
        <View key={rIdx} style={styles.matrixRow}>
          {row.map((cell, cIdx) => (
            <TextInput
              key={`${rIdx}-${cIdx}`}
              style={[styles.matrixCellInput, { backgroundColor: inputBackgroundColor, color: textColor }]}
              keyboardType="numeric"
              value={cell.toString()} // Use value for controlled component
              onChangeText={(text) => handleMatrixChange(text, rIdx, cIdx)}
            />
          ))}
        </View>
      ))}
    </View>
  );

  const renderMatrix = (matrix: number[][]) => (
    <View style={styles.matrixGrid}>
      {matrix.map((row, rIdx) => (
        <View key={rIdx} style={styles.matrixRow}>
          {row.map((cell, cIdx) => (
            <Text key={`${rIdx}-${cIdx}`} style={[styles.matrixCellText, { color: textColor }]}>
              {cell.toFixed(2)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={backgroundColors} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: textColor }]}>Matrix Calculator</Text>
            <Text style={[styles.description, { color: textColor }]}>
              Perform operations on matrices.
            </Text>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Matrix A</Text>
              <View style={styles.dimensionInputs}>
                <TextInput
                  style={[styles.dimensionInput, { backgroundColor: inputBackgroundColor, color: textColor }]}
                  keyboardType="numeric"
                  value={rowsA}
                  onChangeText={(text) => updateMatrixDimensions('A', text, colsA)}
                  placeholder="Rows"
                  placeholderTextColor={isDark ? '#A0A0A0' : '#6B7280'}
                />
                <Text style={{ color: textColor }}>x</Text>
                <TextInput
                  style={[styles.dimensionInput, { backgroundColor: inputBackgroundColor, color: textColor }]}
                  keyboardType="numeric"
                  value={colsA}
                  onChangeText={(text) => updateMatrixDimensions('A', rowsA, text)}
                  placeholder="Cols"
                  placeholderTextColor={isDark ? '#A0A0A0' : '#6B7280'}
                />
              </View>
              {renderMatrixInput(matrixA, handleMatrixAChange)}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Matrix B</Text>
              <View style={styles.dimensionInputs}>
                <TextInput
                  style={[styles.dimensionInput, { backgroundColor: inputBackgroundColor, color: textColor }]}
                  keyboardType="numeric"
                  value={rowsB}
                  onChangeText={(text) => updateMatrixDimensions('B', text, colsB)}
                  placeholder="Rows"
                  placeholderTextColor={isDark ? '#A0A0A0' : '#6B7280'}
                />
                <Text style={{ color: textColor }}>x</Text>
                <TextInput
                  style={[styles.dimensionInput, { backgroundColor: inputBackgroundColor, color: textColor }]}
                  keyboardType="numeric"
                  value={colsB}
                  onChangeText={(text) => updateMatrixDimensions('B', rowsB, text)}
                  placeholder="Cols"
                  placeholderTextColor={isDark ? '#A0A0A0' : '#6B7280'}
                />
              </View>
              {renderMatrixInput(matrixB, handleMatrixBChange)}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('add')}>
                <Text style={{ color: buttonTextColor }}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('subtract')}>
                <Text style={{ color: buttonTextColor }}>Subtract</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('multiply')}>
                <Text style={{ color: buttonTextColor }}>Multiply</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('transposeA')}>
                <Text style={{ color: buttonTextColor }}>Transpose A</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.operationButton, { backgroundColor: buttonBackgroundColor }]} onPress={() => handleOperationPress('determinantA')}>
                <Text style={{ color: buttonTextColor }}>Determinant A</Text>
              </TouchableOpacity>
            </View>

            {(resultMatrix || resultScalar !== null) && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Result ({currentOperation})</Text>
                {resultMatrix && renderMatrix(resultMatrix)}
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
  dimensionInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  dimensionInput: {
    width: 60,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  matrixGrid: {
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 8,
    padding: 5,
  },
  matrixRow: {
    flexDirection: 'row',
  },
  matrixCellInput: {
    width: 60,
    height: 40,
    margin: 2,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
  },
  matrixCellText: {
    width: 60,
    height: 40,
    margin: 2,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 40, // Center text vertically
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
