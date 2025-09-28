import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Dimensions,
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
  }, [state.theme, state.shiftActive, state.isAlphaModeActive, state.storeActive]);

  // Check if we should show interstitial ad after calculation
  useEffect(() => {
    if (shouldShowInterstitialAd()) {
      showInterstitialAd();
      markInterstitialAdShown();
    }
  }, [state.calculationCount, shouldShowInterstitialAd, showInterstitialAd, markInterstitialAdShown]);

  const backgroundColors = isDark ? ['#121212', '#1E1E1E'] : ['#F3F4F6', '#FFFFFF'];

  const handlePress = (action: any) => {
    console.log('CalculatorScreen: handlePress called with action:', action);
    dispatch(action);
  };

  // Get screen dimensions for responsive design
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 380;
  const buttonFontSize = isSmallScreen ? 14 : 16;

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
              type={state.shiftActive ? 'equals' : 'function'}
              onPress={() => handlePress({ type: 'TOGGLE_SHIFT' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="ALPHA"
              type={state.isAlphaModeActive ? 'equals' : 'function'}
              onPress={() => handlePress({ type: 'TOGGLE_ALPHA' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol={state.angleUnit === 'deg' ? 'RAD' : 'DEG'}
              type="function"
              onPress={() => handlePress({ type: 'TOGGLE_ANGLE_UNIT' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="("
              type="function"
              onPress={() => handlePress({ type: 'ADD_PARENTHESIS', payload: '(' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol=")"
              type="function"
              onPress={() => handlePress({ type: 'ADD_PARENTHESIS', payload: ')' })}
              fontSize={buttonFontSize}
            />
          </View>

          {/* Row 2: Advanced Functions */}
          <View style={styles.row}>
            <CalculatorButton
              symbol={state.shiftActive ? 'x³' : 'x²'}
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? '^3' : '^2' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol={state.shiftActive ? 'y√x' : 'xʸ'}
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'nthRoot(' : '^' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol={state.shiftActive ? 'sin⁻¹' : 'sin'}
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'asin(' : 'sin(' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol={state.shiftActive ? 'cos⁻¹' : 'cos'}
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'acos(' : 'cos(' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol={state.shiftActive ? 'tan⁻¹' : 'tan'}
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'atan(' : 'tan(' })}
              fontSize={buttonFontSize}
            />
          </View>

          {/* Row 3: More Functions */}
          <View style={styles.row}>
            <CalculatorButton
              symbol={state.shiftActive ? '³√x' : '√'}
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'cbrt(' : 'sqrt(' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol={state.shiftActive ? '10ˣ' : 'log'}
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? '10^' : 'log10(' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol={state.shiftActive ? 'eˣ' : 'ln'}
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: state.shiftActive ? 'e^' : 'log(' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="π"
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: 'pi' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="e"
              type="function"
              onPress={() => handlePress({ type: 'FUNCTION_PRESS', payload: 'e' })}
              fontSize={buttonFontSize}
            />
          </View>

          {/* Row 4: Memory and Clear */}
          <View style={styles.row}>
            <CalculatorButton
              symbol="MS"
              type="memory"
              onPress={() => handlePress({ type: 'MEMORY_STORE', payload: state.result })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="MR"
              type="memory"
              onPress={() => handlePress({ type: 'MEMORY_RECALL' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="MC"
              type="memory"
              onPress={() => handlePress({ type: 'MEMORY_CLEAR' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="DEL"
              type="clear"
              onPress={() => handlePress({ type: 'DELETE' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="AC"
              type="clear"
              onPress={() => handlePress({ type: 'CLEAR' })}
              fontSize={buttonFontSize}
            />
          </View>

          {/* Row 5: Numbers and Operations */}
          <View style={styles.row}>
            <CalculatorButton
              symbol="7"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '7' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="8"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '8' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="9"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '9' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="×"
              type="operator"
              onPress={() => handlePress({ type: 'OPERATOR_PRESS', payload: '*' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="÷"
              type="operator"
              onPress={() => handlePress({ type: 'OPERATOR_PRESS', payload: '/' })}
              fontSize={buttonFontSize}
            />
          </View>

          {/* Row 6 */}
          <View style={styles.row}>
            <CalculatorButton
              symbol="4"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '4' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="5"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '5' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="6"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '6' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="+"
              type="operator"
              onPress={() => handlePress({ type: 'OPERATOR_PRESS', payload: '+' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="−"
              type="operator"
              onPress={() => handlePress({ type: 'OPERATOR_PRESS', payload: '-' })}
              fontSize={buttonFontSize}
            />
          </View>

          {/* Row 7 - Variable Keys */}
          <View style={styles.row}>
            <CalculatorButton
              symbol="1"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '1' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="2"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '2' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="3"
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '3' })}
              fontSize={buttonFontSize}
            />
            {/* Variable A Button */}
            <CalculatorButton
              symbol={state.isAlphaModeActive ? 'A' : 'Ans'}
              type={state.isAlphaModeActive ? 'memory' : 'function'}
              onPress={() => {
                if (state.isAlphaModeActive) {
                  handlePress({ type: 'SELECT_VARIABLE', payload: 'A' });
                } else if (state.result) {
                  handlePress({ type: 'NUMBER_PRESS', payload: state.result });
                }
              }}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="="
              type="equals"
              onPress={() => handlePress({ type: 'EQUALS' })}
              fontSize={buttonFontSize}
            />
          </View>

          {/* Row 8 - More Variable Keys */}
          <View style={styles.row}>
            <CalculatorButton
              symbol="0"
              flex={2}
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '0' })}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="."
              onPress={() => handlePress({ type: 'NUMBER_PRESS', payload: '.' })}
              fontSize={buttonFontSize}
            />
            {/* Variable B Button */}
            <CalculatorButton
              symbol={state.isAlphaModeActive ? 'B' : '+/-'}
              type={state.isAlphaModeActive ? 'memory' : 'function'}
              onPress={() => {
                if (state.isAlphaModeActive) {
                  handlePress({ type: 'SELECT_VARIABLE', payload: 'B' });
                } else {
                  handlePress({ type: 'TOGGLE_SIGN' });
                }
              }}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="STO"
              type={state.selectedVariable ? 'equals' : 'function'}
              onPress={() => handlePress({ type: 'STORE_TO_VARIABLE' })}
              fontSize={buttonFontSize}
            />
          </View>

          {/* Row 9 - Additional Variable Keys */}
          <View style={styles.row}>
            {/* Variable C Button */}
            <CalculatorButton
              symbol={state.isAlphaModeActive ? 'C' : '!'}
              type={state.isAlphaModeActive ? 'memory' : 'function'}
              onPress={() => {
                if (state.isAlphaModeActive) {
                  handlePress({ type: 'SELECT_VARIABLE', payload: 'C' });
                } else {
                  handlePress({ type: 'FUNCTION_PRESS', payload: '!' });
                }
              }}
              fontSize={buttonFontSize}
            />
            {/* Variable X Button */}
            <CalculatorButton
              symbol={state.isAlphaModeActive ? 'X' : '%'}
              type={state.isAlphaModeActive ? 'memory' : 'function'}
              onPress={() => {
                if (state.isAlphaModeActive) {
                  handlePress({ type: 'SELECT_VARIABLE', payload: 'X' });
                } else {
                  handlePress({ type: 'FUNCTION_PRESS', payload: '%' });
                }
              }}
              fontSize={buttonFontSize}
            />
            {/* Variable Y Button */}
            <CalculatorButton
              symbol={state.isAlphaModeActive ? 'Y' : 'EXP'}
              type={state.isAlphaModeActive ? 'memory' : 'function'}
              onPress={() => {
                if (state.isAlphaModeActive) {
                  handlePress({ type: 'SELECT_VARIABLE', payload: 'Y' });
                } else {
                  handlePress({ type: 'FUNCTION_PRESS', payload: 'e' });
                }
              }}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="RCL"
              type="memory"
              onPress={() => {
                if (state.selectedVariable) {
                  handlePress({ type: 'RECALL_VARIABLE', payload: state.selectedVariable });
                }
              }}
              fontSize={buttonFontSize}
            />
            <CalculatorButton
              symbol="CLR"
              type="clear"
              onPress={() => handlePress({ type: 'CLEAR_VARIABLES' })}
              fontSize={buttonFontSize}
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
    padding: 8,
    paddingTop: 4,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 2,
  },
});