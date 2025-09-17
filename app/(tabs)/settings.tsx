import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCalculator } from '@/contexts/CalculatorContext';
import CalculatorButton from '@/components/CalculatorButton';
import { PrivacyPolicyContent } from '@/components/PrivacyPolicyContent';
import { TermsOfServiceContent } from '@/components/TermsOfServiceContent';

export default function SettingsScreen() {
  const { state, dispatch } = useCalculator();
  const isDark = state.theme === 'dark';

  const backgroundColors = isDark ? ['#121212', '#1E1E1E'] : ['#F3F4F6', '#FFFFFF'];
  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const cardBgColor = isDark ? '#2A2A2A' : '#F8F9FA';

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const clearHistory = () => {
    // This will now correctly clear calculation history by dispatching the 'CLEAR' action
    dispatch({ type: 'CLEAR' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={backgroundColors} style={styles.container}>
        <ScrollView style={styles.content}>
          <Text style={[styles.title, { color: textColor }]}>Settings</Text>
          
          {/* Theme Settings */}
          <View style={[styles.settingCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>Appearance</Text>
            
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Dark Theme
              </Text>
              <Switch
                value={state.theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#E0E0E0', true: '#3B82F6' }}
                thumbColor={state.theme === 'dark' ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>
          </View>

          {/* Calculation Settings */}
          <View style={[styles.settingCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>Calculation</Text>
            <View style={styles.settingColumn}>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Angle Unit
              </Text>
              <View style={styles.angleButtons}>
                {(['deg', 'rad', 'grad'] as const).map((unit) => (
                  <CalculatorButton
                    key={unit}
                    symbol={unit.toUpperCase()}
                    type={state.angleUnit === unit ? 'function' : 'digit'}
                    onPress={() => {
                      dispatch({ type: 'SET_ANGLE_UNIT', payload: unit });
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Pro User Settings */}
          <View style={[styles.settingCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>Premium</Text>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Pro User Status: {state.isProUser ? 'Active' : 'Free'}
              </Text>
              <Switch
                value={state.isProUser}
                onValueChange={(value) => dispatch({ type: 'SET_PRO_USER', payload: value })}
                trackColor={{ false: '#E0E0E0', true: '#3B82F6' }}
                thumbColor={state.isProUser ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>
            <Text style={[styles.settingLabel, { color: textColor, fontSize: 12, opacity: 0.7 }]}>
              Toggle this to simulate Pro user experience (removes all ads)
            </Text>
          </View>

          <View style={[styles.settingCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>Memory</Text>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: textColor }]}>
              </Text>
            </View>
            <View style={styles.memoryButtons}>
              <CalculatorButton
                symbol="Clear Memory"
                type="clear"
                onPress={() => dispatch({ type: 'MEMORY_CLEAR' })}
              />
            </View>
          </View>

          <View style={[styles.settingCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>History</Text>
            <View style={styles.settingColumn}>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Calculation History ({state.history.length} entries)
              </Text>
              <Text style={[styles.settingLabel, { color: textColor }]}>
                Main Calculator Count: {state.calculationCount}/10 (until next ad)
              </Text>
              {state.history.length > 0 && (
                <ScrollView style={styles.historyList} nestedScrollEnabled>
                  {state.history.slice(-5).reverse().map((entry, index) => (
                    <View key={index} style={styles.historyItem}>
                      <Text style={[styles.historyExpression, { color: textColor }]}>
                        {entry.expression}
                      </Text>
                      <Text style={[styles.historyResult, { color: '#3B82F6' }]}>
                        = {entry.result}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              )}
              <View style={styles.historyButtons}>
                <CalculatorButton
                  symbol="Clear History"
                  type="clear"
                  onPress={clearHistory}
                />
              </View>
            </View>
          </View>

          {/* User Manual */}
          <View style={[styles.settingCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>User Manual</Text>
            <Text style={[styles.manualSectionTitle, { color: textColor }]}>Basic Operations</Text>
            <Text style={[styles.manualText, { color: textColor }]}>
              - **Numbers (0-9, .):** Input numerical values.
              - **Operators (+, -, *, /):** Perform basic arithmetic.
              - **= (Equals):** Calculate the result of the current expression.
              - **AC (All Clear):** Clears the current expression and result, but preserves theme, angle unit, and memory.
              - **DEL (Delete):** Deletes the last character from the expression.
            </Text>

            <Text style={[styles.manualSectionTitle, { color: textColor }]}>Advanced Functions</Text>
            <Text style={[styles.manualText, { color: textColor }]}>
              - **SHIFT:** Activates secondary functions (e.g., inverse trigonometric functions).
              - **sin, cos, tan:** Trigonometric functions. Use SHIFT for asin, acos, atan.
              - **log, ln:** Logarithmic functions.
              - **^ (Power):** Raise a number to a power (e.g., 2^3 = 8).
              - **sqrt (Square Root):** Calculates the square root.
              - **! (Factorial):** Calculates the factorial of a number.
              - **% (Percentage):** Converts a number to a percentage (e.g., 50% = 0.5).
              - **+/- (Toggle Sign):** Changes the sign of the current number.
            </Text>

            <Text style={[styles.manualSectionTitle, { color: textColor }]}>Memory Functions</Text>
            <Text style={[styles.manualText, { color: textColor }]}>
              - **MS (Memory Store):** Stores the current result into memory.
              - **MR (Memory Recall):** Recalls the value from memory to the display.
              - **MC (Memory Clear):** Clears the stored memory value.
              - **M+ (Memory Add):** Adds the current result to the memory value.
              - **M- (Memory Subtract):** Subtracts the current result from the memory value.
            </Text>

            <Text style={[styles.manualSectionTitle, { color: textColor }]}>Variable Storage (ALPHA + STO)</Text>
            <Text style={[styles.manualText, { color: textColor }]}>
              - **ALPHA:** Activates variable input mode.
              - **STO (Store):** Used with ALPHA to store a value into a variable (A, B, C, X, Y).
                - *Example:* To store 10 into variable A: `10` then `STO` then `ALPHA` then `A`.
              - **Recalling Variables:** Press `ALPHA` then the variable key (A, B, C, X, Y) to insert its value into the expression.
            </Text>

            <Text style={[styles.manualSectionTitle, { color: textColor }]}>Settings</Text>
            <Text style={[styles.manualText, { color: textColor }]}>
              - **Dark Theme:** Toggle between light and dark mode.
              - **Angle Unit:** Select angle units for trigonometric functions (Degrees, Radians, Gradians).
              - **Clear History:** Erase all past calculations from the history.
            </Text>
          </View>

          {/* Legal Documents */}
          <View style={[styles.settingCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>Legal</Text>
            <View style={styles.legalSection}>
              <PrivacyPolicyContent textColor={textColor} />
            </View>
            <View style={styles.legalSection}>
              <TermsOfServiceContent textColor={textColor} />
            </View>
          </View>

          {/* About */}
          <View style={[styles.settingCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>About ScalarCalc</Text>
            <Text style={[styles.aboutText, { color: textColor }]}>
              Version: 1.0.0
            </Text>
            <Text style={[styles.aboutText, { color: textColor }]}>
              Advanced scientific calculator with 400+ mathematical functions
            </Text>
            <Text style={[styles.aboutText, { color: textColor }]}>
              Supports matrices, vectors, statistics, and complex expressions
            </Text>
          </View>
        </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingColumn: {
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  angleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  memoryButtons: {
    marginTop: 8,
  },
  historyList: {
    maxHeight: 150,
    marginVertical: 8,
  },
  historyItem: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  historyExpression: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  historyResult: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  historyButtons: {
    marginTop: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  manualSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  manualText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  legalSection: {
    marginBottom: 20,
  },
});
