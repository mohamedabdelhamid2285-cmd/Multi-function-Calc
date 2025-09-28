import React from 'react';
    import {
      View,
      Text,
      StyleSheet,
      ScrollView,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { useCalculator } from '@/contexts/CalculatorContext';

    export default function Display() {
      const { state } = useCalculator();
      const isDark = state.theme === 'dark';

      const containerColors = isDark ? ['#1E1E1E', '#2A2A2A'] : ['#FFFFFF', '#F8F9FA'];
      const textColor = isDark ? '#FFFFFF' : '#1F2937';
      const expressionColor = isDark ? '#A0A0A0' : '#6B7280';

      // Apply display name transformations
      let displayedExpression = state.expression;
      displayedExpression = displayedExpression.replace(/nthRoot\(/g, 'y√x(');
      displayedExpression = displayedExpression.replace(/log\(/g, 'ln(');


      return (
        <LinearGradient
          colors={containerColors}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.statusBar}>
            <Text style={[styles.angleUnit, { color: textColor }]}>
              {state.angleUnit.toUpperCase()}
            </Text>
            <View style={styles.modeIndicators}>
              {state.memoryValue !== 0 && (
                <Text style={[styles.modeIndicator, { color: '#10B981' }]}>
                  M
                </Text>
              )}
              {state.shiftActive && (
                <Text style={[styles.modeIndicator, { color: '#FFD700' }]}>
                  SHIFT
                </Text>
              )}
              {state.isAlphaModeActive && (
                <Text style={[styles.modeIndicator, { color: '#FF6347' }]}>
                  ALPHA
                </Text>
              )}
              {state.selectedVariable && (
                <Text style={[styles.modeIndicator, { color: '#60A5FA' }]}>
                  {state.selectedVariable}
                </Text>
              )}
            </View>
          </View>

          {/* Variable Status Bar */}
          {Object.entries(state.variables).some(([_, value]) => value !== 0) && (
            <View style={styles.variableBar}>
              {Object.entries(state.variables).map(([variable, value]) => 
                value !== 0 ? (
                  <Text key={variable} style={[styles.variableText, { color: textColor }]}>
                    {variable}={value.toFixed(2)}
                  </Text>
                ) : null
              )}
            </View>
          )}

          <ScrollView
            style={styles.displayArea}
            contentContainerStyle={styles.displayContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Display the current expression being typed */}
            {state.expression !== '' && (
              <Text style={[styles.expression, { color: expressionColor }]}>
                {displayedExpression}
              </Text>
            )}
            {/* Display the result or error */}
            <Text style={[styles.result, { color: state.error ? '#EF4444' : textColor }]}>
              {state.error || state.result}
            </Text>
          </ScrollView>
        </LinearGradient>
      );
    }

    const styles = StyleSheet.create({
      container: {
        height: 180,
        borderRadius: 16,
        margin: 16,
        padding: 16,
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      },
      angleUnit: {
        fontSize: 14,
        fontWeight: '600',
      },
      modeIndicators: {
        flexDirection: 'row',
      },
      modeIndicator: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
      },
      variableBar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        gap: 8,
      },
      variableText: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
      },
      displayArea: {
        flex: 1,
      },
      displayContent: {
        justifyContent: 'flex-end',
        minHeight: '100%',
      },
      expression: {
        fontSize: 16,
        textAlign: 'right',
        marginBottom: 8,
        lineHeight: 20,
      },
      result: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'right',
        lineHeight: 40,
      },
    });