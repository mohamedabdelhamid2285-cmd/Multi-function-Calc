import React, { useEffect } from 'react';
    import {
      View,
      StyleSheet,
      useColorScheme,
      SafeAreaView,
      StatusBar,
      Text, // Import Text for the SHIFT indicator
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { useCalculator } from '@/contexts/CalculatorContext';
    import { useInterstitialAd } from '@/hooks/useInterstitialAd';
    import Display from '@/components/Display';
    import CalculatorButton from '@/components/CalculatorButton';

    export default function CalculatorScreen() {
      const { state, dispatch, shouldShowInterstitialAd, markInterstitialAdShown } = useCalculator();
      const { showInterstitialAd } = useInterstitialAd();
      const isDark = state.theme === 'dark';

      useEffect(() => {
        console.log('CalculatorScreen: Component mounted/re-rendered');
      }, [state.theme, state.shiftActive, state.alphaActive, state.storeActive]); // Log on initial mount, theme, and shift changes

      // Check if we should show interstitial ad after calculation
      useEffect(() => {
        if (shouldShowInterstitialAd()) {
          showInterstitialAd();
          markInterstitialAdShown();
        }
      }, [state.calculationCount, shouldShowInterstitialAd, showInterstitialAd, markInterstitialAdShown]);

      const backgroundColors = isDark ? ['#121212', '#1E1E1E'] : ['#F3F4F6', '#FFFFFF'];
      const textColor = isDark ? '#FFFFFF' : '#1F2937';

      const handlePress = (action: any) => {
        console.log('CalculatorScreen: handlePress called with action:', action); // Log when handlePress is triggered
        dispatch(action);
      };

      return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent
          />
          <LinearGradient
            colors={backgroundColors}
            style={styles.container}
          >
            <Display />
            <View style={styles.buttonGrid}>
              {/* Row 1: Scientific Functions */}
              <View style={styles.row}>
                <CalculatorButton
                  symbol="SHIFT"
                  type={state.shiftActive ? 'equals' : 'function'} // Highlight SHIFT when active
                  onPress={() => handlePress({ type: 'TOGGLE_SHIFT' })}
                />
                <CalculatorButton
                  symbol="ALPHA"
                  type={state.alphaActive ? 'equals' : 'function'} // Highlight ALPHA when active
                  onPress={() => handlePress({ type: 'TOGGLE_ALPHA' })}
                />
                {/* Display next angle unit */}
                <CalculatorButton
                  symbol={state.angleUnit === 'deg' ? 'RAD' : 'DEG'}
                  type="function"
                  onPress={() => handlePress({ type: 'TOGGLE_ANGLE_UNIT' })}
                />
                <CalculatorButton
                  symbol="("
                  type="function"
                  onPress={() => handlePress({ type: 'ADD_PARENTHESIS', payload: '(' })}
                />
                <CalculatorButton
                  symbol=")"
                  type="function"
                  onPress={() => handlePress({ type: 'ADD_PARENTHESIS', payload: ')' })}
                />
              </View>

              {/* Row 2: Advanced Functions */}
              <View style={styles.row}>
                <CalculatorButton
                  symbol={state.shiftActive ? 'x³' : 'x²'}
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? '^3' : '^2' })}
                />
                <CalculatorButton
                  symbol={state.shiftActive ? 'y√x' : 'xʸ'}
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'nthRoot(' : '^' })}
                />
                <CalculatorButton
                  symbol={state.shiftActive ? 'sin⁻¹' : 'sin'}
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'asin(' : 'sin(' })}
                />
                <CalculatorButton
                  symbol={state.shiftActive ? 'cos⁻¹' : 'cos'}
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'acos(' : 'cos(' })}
                />
                <CalculatorButton
                  symbol={state.shiftActive ? 'tan⁻¹' : 'tan'}
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'atan(' : 'tan(' })}
                />
              </View>

              {/* Row 3: More Functions */}
              <View style={styles.row}>
                <CalculatorButton
                  symbol={state.shiftActive ? '³√x' : '√'}
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'cbrt(' : 'sqrt(' })}
                />
                <CalculatorButton
                  symbol={state.shiftActive ? '10ˣ' : 'log'}
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? '10^' : 'log10(' })}
                />
                <CalculatorButton
                  symbol={state.shiftActive ? 'eˣ' : 'ln'}
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'e^' : 'log(' })}
                />
                <CalculatorButton
                  symbol="π"
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: 'pi' })}
                />
                <CalculatorButton
                  symbol="e"
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: 'e' })}
                />
              </View>

              {/* Row 4: Memory and Clear */}
              <View style={styles.row}>
                <CalculatorButton
                  symbol="MS"
                  type="memory"
                  onPress={() => handlePress({ type: 'MEMORY_STORE', payload: state.result })}
                />
                <CalculatorButton
                  symbol="MR"
                  type="memory"
                  onPress={() => handlePress({ type: 'MEMORY_RECALL' })}
                />
                <CalculatorButton
                  symbol="MC"
                  type="memory"
                  onPress={() => handlePress({ type: 'MEMORY_CLEAR' })}
                />
                <CalculatorButton
                  symbol="DEL"
                  type="clear"
                  onPress={() => handlePress({ type: 'DELETE' })}
                />
                <CalculatorButton
                  symbol="AC"
                  type="clear"
                  onPress={() => handlePress({ type: 'CLEAR' })}
                />
              </View>

              {/* Row 5: Numbers and Operations */}
              <View style={styles.row}>
                <CalculatorButton
                  symbol="7"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '7' })}
                />
                <CalculatorButton
                  symbol="8"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '8' })}
                />
                <CalculatorButton
                  symbol="9"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '9' })}
                />
                <CalculatorButton
                  symbol="×"
                  type="operator"
                  onPress={() => handlePress({ type: 'OPERATOR_PRESS', payload: '*' })}
                />
                <CalculatorButton
                  symbol="÷"
                  type="operator"
                  onPress={() => handlePress({ type: 'OPERATOR_PRESS', payload: '/' })}
                />
              </View>

              {/* Row 6 */}
              <View style={styles.row}>
                <CalculatorButton
                  symbol="4"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '4' })}
                />
                <CalculatorButton
                  symbol="5"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '5' })}
                />
                <CalculatorButton
                  symbol="6"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '6' })}
                />
                <CalculatorButton
                  symbol="+"
                  type="operator"
                  onPress={() => handlePress({ type: 'OPERATOR_PRESS', payload: '+' })}
                />
                <CalculatorButton
                  symbol="−"
                  type="operator"
                  onPress={() => handlePress({ type: 'OPERATOR_PRESS', payload: '-' })}
                />
              </View>

              {/* Row 7 */}
              <View style={styles.row}>
                <CalculatorButton
                  symbol="1"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '1' })}
                />
                <CalculatorButton
                  symbol="2"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '2' })}
                />
                <CalculatorButton
                  symbol="3"
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '3' })}
                />
                <CalculatorButton
                  symbol={state.alphaActive || state.storeActive ? 'A' : 'Ans'} // Display 'A' if alpha/store active
                  type="function"
                  onPress={() => {
                    if (state.alphaActive) {
                      handlePress({ type: 'INSERT_VARIABLE', payload: 'A' });
                    } else if (state.storeActive) {
                      // Ensure state.result is a valid number before storing
                      const valueToStore = parseFloat(state.result);
                      console.log('STO A: state.result =', state.result, 'valueToStore =', valueToStore, 'isNaN =', isNaN(valueToStore)); // Debug log
                      if (!isNaN(valueToStore)) {
                        handlePress({ type: 'STORE_VARIABLE', payload: { variableName: 'A', value: valueToStore } });
                      } else {
                        console.warn('Cannot store non-numeric result:', state.result);
                        // Optionally dispatch an error or clear storeActive
                        dispatch({ type: 'TOGGLE_STORE' }); // Exit store mode if invalid result
                      }
                    } else if (state.result) {
                      handlePress({ type: 'NUMBER_PRESS', payload: state.result });
                    }
                  }}
                />
                <CalculatorButton
                  symbol="="
                  type="equals"
                  onPress={() => handlePress({ type: 'EQUALS' })}
                />
              </View>

              {/* Row 8 */}
              <View style={styles.row}>
                <CalculatorButton
                  symbol="0"
                  flex={2}
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '0' })}
                />
                <CalculatorButton
                  symbol="."
                  onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '.' })}
                />
                <CalculatorButton
                  symbol="+/-"
                  type="function"
                  onPress={() => handlePress({ type: 'TOGGLE_SIGN' })}
                />
                <CalculatorButton
                  symbol="STO" // Replaced EXP with STO
                  type={state.storeActive ? 'equals' : 'function'} // Highlight STO when active
                  onPress={() => handlePress({ type: 'TOGGLE_STORE' })}
                />
                <CalculatorButton
                  symbol="!"
                  type="function"
                  onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: '!' })}
                />
              </View>
            </View>
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
      buttonGrid: {
        flex: 1,
        padding: 16,
        paddingTop: 8,
      },
      row: {
        flexDirection: 'row',
        flex: 1,
      },
    });