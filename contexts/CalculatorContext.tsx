import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { create, all } from 'mathjs';

// Define the state and action types for the calculator
interface CalculatorState {
  expression: string;
  result: string;
  history: { expression: string; result: string }[];
  error: string | null;
  angleUnit: 'deg' | 'rad'; // 'deg' for degrees, 'rad' for radians
  lastInputType: 'number' | 'operator' | 'function' | 'parenthesis' | 'equals' | null;
  theme: 'light' | 'dark'; // Add theme to state
  memoryValue: number; // Add memoryValue to state
  shiftActive: boolean; // Add shiftActive state
  alphaActive: boolean; // Add alphaActive state
  storeActive: boolean; // Add storeActive state for STO mode
  variables: { [key: string]: number }; // Store variables (A, B, C, X, Y)
  calculationCount: number; // Track calculation count for ad display
}

type CalculatorAction =
  | { type: 'NUMBER_PRESS'; payload: string }
  | { type: 'OPERATOR_PRESS'; payload: string }
  | { type: 'FUNCTION_PRESS'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'DELETE' }
  | { type: 'EQUALS' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'TOGGLE_ANGLE_UNIT' }
  | { type: 'ADD_PARENTHESIS'; payload: '(' | ')' }
  | { type: 'TOGGLE_THEME' } // Action for theme toggling
  | { type: 'SET_ANGLE_UNIT'; payload: 'deg' | 'rad' } // Action to set angle unit
  | { type: 'MEMORY_STORE'; payload: string } // Action for memory store
  | { type: 'MEMORY_RECALL' } // Action for memory recall
  | { type: 'MEMORY_CLEAR' } // Action for memory clear
  | { type: 'TOGGLE_SHIFT' } // Action for toggling shift mode
  | { type: 'TOGGLE_ALPHA' } // Action for toggling alpha mode
  | { type: 'TOGGLE_STORE' } // Action for toggling store mode
  | { type: 'STORE_VARIABLE'; payload: { variableName: string; value: number } } // Action to store a variable
  | { type: 'INSERT_VARIABLE'; payload: string } // Action to insert a variable into expression
  | { type: 'INCREMENT_CALCULATION_COUNT' } // Action to increment calculation count
  | { type: 'RESET_CALCULATION_COUNT' } // Action to reset calculation count

const initialState: CalculatorState = {
  expression: '',
  result: '0',
  history: [],
  error: null,
  angleUnit: 'deg', // Default to degrees
  lastInputType: null,
  theme: 'light', // Default theme
  memoryValue: 0, // Default memory value
  shiftActive: false, // Default shift state
  alphaActive: false, // Default alpha state
  storeActive: false, // Default store state
  variables: {
    'A': 0,
    'B': 0,
    'C': 0,
    'X': 0,
    'Y': 0,
  },
  calculationCount: 0, // Initialize calculation count
};

// Helper function to check if a character is an operator
const isOperator = (char: string) => ['+', '-', '*', '/', '%', '^'].includes(char);

// Helper function to check if a character is a function
const isFunction = (char: string) => ['sin', 'cos', 'tan', 'log', 'sqrt', 'log10', 'pi', 'e', 'nthRoot'].includes(char);

const calculatorReducer = (state: CalculatorState, action: CalculatorAction): CalculatorState => {
  // Reset alpha/store modes on most actions, unless it's a specific variable action
  const resetModes = (currentState: CalculatorState) => {
    if (action.type !== 'TOGGLE_ALPHA' && action.type !== 'TOGGLE_STORE' &&
        action.type !== 'STORE_VARIABLE' && action.type !== 'INSERT_VARIABLE') {
      return { ...currentState, alphaActive: false, storeActive: false };
    }
    return currentState;
  };

  let newState = state;

  switch (action.type) {
    case 'NUMBER_PRESS':
      let newExpression = state.expression;
      if (state.lastInputType === 'equals' || state.error) {
        // If last action was equals or there was an error, start a new expression
        newExpression = action.payload;
      } else if (newExpression === '0' && action.payload !== '.') {
        // Prevent multiple leading zeros unless it's a decimal
        newExpression = action.payload;
      } else if (newExpression === '' && action.payload === '.') {
        // Handle initial '.' input to display '0.'
        newExpression = '0.';
      } else if (action.payload === '.' && newExpression.includes('.') && state.lastInputType === 'number') {
        // Prevent multiple decimals in a single number
        const lastNumber = newExpression.split(/[\+\-\*\/%()^]/).pop();
        if (lastNumber && lastNumber.includes('.')) {
          return resetModes(state);
        }
        newExpression += action.payload;
      } else {
        newExpression += action.payload;
      }

      newState = {
        ...state,
        expression: newExpression,
        lastInputType: 'number',
        error: null,
      };
      return resetModes(newState);

    case 'OPERATOR_PRESS':
      let exprAfterOperator = state.expression;
      if (state.lastInputType === 'equals' || state.error) {
        // If last action was equals or there was an error, start with the result
        exprAfterOperator = state.result;
      }

      // Prevent adding an operator if the expression is empty and the operator is not '-'
      if (exprAfterOperator === '' && action.payload !== '-') {
        return resetModes(state);
      }

      // If the last input was an operator, replace it with the new one (unless it's a double negative)
      if (state.lastInputType === 'operator') {
        const lastChar = exprAfterOperator.slice(-1);
        if (isOperator(lastChar) && !(action.payload === '-' && lastChar === '-')) {
          newState = {
            ...state,
            expression: exprAfterOperator.slice(0, -1) + action.payload,
            lastInputType: 'operator',
            error: null,
          };
          return resetModes(newState);
        }
      }

      // Prevent adding an operator right after an opening parenthesis
      if (exprAfterOperator.endsWith('(') && isOperator(action.payload) && action.payload !== '-') {
        return resetModes(state);
      }

      newState = {
        ...state,
        expression: exprAfterOperator + action.payload,
        lastInputType: 'operator',
        error: null,
      };
      return resetModes(newState);

    case 'FUNCTION_PRESS':
      // Append the function name followed by an opening parenthesis
      newState = {
        ...state,
        expression: state.expression + action.payload,
        lastInputType: 'function',
        error: null,
      };
      return resetModes(newState);

    case 'ADD_PARENTHESIS':
      const lastChar = state.expression.slice(-1);
      const openParenthesesCount = (state.expression.match(/\(/g) || []).length;
      const closeParenthesesCount = (state.expression.match(/\)/g) || []).length;

      if (action.payload === '(') {
        // Allow opening parenthesis after operators, other opening parentheses, or at the start
        if (state.expression === '' || isOperator(lastChar) || lastChar === '(' || isFunction(lastChar)) {
          newState = { ...state, expression: state.expression + '(', lastInputType: 'parenthesis', error: null };
          return resetModes(newState);
        }
        // Allow opening parenthesis after a number if the next operation is multiplication (implied)
        if (/\d/.test(lastChar) || lastChar === ')') {
          newState = { ...state, expression: state.expression + '* (', lastInputType: 'parenthesis', error: null };
          return resetModes(newState);
        }
      } else { // action.payload === ')'
        // Only allow closing parenthesis if there's an open one to close
        // and the last character is not an operator or another opening parenthesis
        if (openParenthesesCount > closeParenthesesCount && !isOperator(lastChar) && lastChar !== '(') {
          newState = { ...state, expression: state.expression + ')', lastInputType: 'parenthesis', error: null };
          return resetModes(newState);
        }
      }
      return resetModes(state); // Do nothing if the parenthesis placement is invalid

    case 'CLEAR':
      // Preserve theme, angleUnit, memoryValue, and variables
      return {
        ...initialState,
        theme: state.theme,
        angleUnit: state.angleUnit,
        memoryValue: state.memoryValue,
        variables: state.variables, // Preserve variables on clear
      };

    case 'DELETE':
      newState = {
        ...state,
        expression: state.expression.slice(0, -1),
        result: '0', // Reset result when deleting
        error: null,
        lastInputType: state.expression.length > 1 ? (isOperator(state.expression.slice(-2, -1)) ? 'operator' : 'number') : null, // Simple heuristic
      };
      return resetModes(newState);

    case 'TOGGLE_SIGN':
      // Find the last number or expression segment to toggle its sign
      const expression = state.expression;
      const lastNumberMatch = expression.match(/(\d+\.?\d*)$/); // Matches last number
      if (lastNumberMatch) {
        const lastNumber = lastNumberMatch[1];
        const startIndex = lastNumberMatch.index!;
        const before = expression.substring(0, startIndex);
        const toggledNumber = parseFloat(lastNumber) * -1;
        newState = {
          ...state,
          expression: before + toggledNumber.toString(),
          error: null,
        };
        return resetModes(newState);
      } else if (expression === '') {
        newState = { ...state, expression: '-', lastInputType: 'operator', error: null };
        return resetModes(newState);
      } else if (expression === '-') {
        newState = { ...state, expression: '', lastInputType: null, error: null };
        return resetModes(newState);
      }
      return resetModes(state); // If no number to toggle, do nothing

    case 'TOGGLE_ANGLE_UNIT':
      newState = {
        ...state,
        angleUnit: state.angleUnit === 'deg' ? 'rad' : 'deg',
        error: null,
      };
      return resetModes(newState);

    case 'SET_ANGLE_UNIT':
      newState = {
        ...state,
        angleUnit: action.payload,
        error: null,
      };
      return resetModes(newState);

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };

    case 'MEMORY_STORE':
      console.log('MEMORY_STORE: Action triggered. Payload:', action.payload, 'Current memoryValue:', state.memoryValue); // Debug log
      try {
        let valueToStore: number;
        // If the payload is 'Error' or empty, don't store
        if (action.payload === 'Error' || action.payload === '') {
          console.log('MEMORY_STORE: Invalid payload, not storing.');
          return resetModes(state);
        }

        // Attempt to evaluate the expression if it's not just a number
        const math = create(all);
        if (!isNaN(Number(action.payload)) && state.lastInputType !== 'operator') {
          // If the payload is a number, store it directly
          valueToStore = Number(action.payload);
          console.log('MEMORY_STORE: Storing number directly =', valueToStore);
        } else {
          // Otherwise, evaluate the expression
          valueToStore = math.evaluate(action.payload);
          console.log('MEMORY_STORE: Storing value from expression =', valueToStore);
        }

        newState = {
          ...state,
          memoryValue: valueToStore,
          error: null,
        };
        console.log('MEMORY_STORE: New memoryValue:', newState.memoryValue); // Debug log
        return resetModes(newState);
      } catch (error) {
        console.error('Memory store error:', error);
        newState = {
          ...state,
          error: 'Memory Error',
        };
        return resetModes(newState);
      }

    case 'MEMORY_RECALL':
      console.log('MEMORY_RECALL: Action triggered. Recalling value =', state.memoryValue); // Debug log
      newState = {
        ...state,
        expression: state.expression + state.memoryValue.toString(),
        lastInputType: 'number',
        error: null,
      };
      console.log('MEMORY_RECALL: New expression:', newState.expression); // Debug log
      return resetModes(newState);

    case 'MEMORY_CLEAR':
      console.log('MEMORY_CLEAR: Action triggered. Clearing memory.'); // Debug log
      newState = {
        ...state,
        memoryValue: 0,
        error: null,
      };
      console.log('MEMORY_CLEAR: Memory cleared. New memoryValue:', newState.memoryValue); // Debug log
      return resetModes(newState);

    case 'TOGGLE_SHIFT':
      return {
        ...state,
        shiftActive: !state.shiftActive,
        error: null,
      };

    case 'TOGGLE_ALPHA':
      return {
        ...state,
        alphaActive: !state.alphaActive,
        storeActive: false, // Deactivate store mode when alpha is toggled
        error: null,
      };

    case 'TOGGLE_STORE':
      return {
        ...state,
        storeActive: !state.storeActive,
        alphaActive: false, // Deactivate alpha mode when store is toggled
        error: null,
      };

    case 'STORE_VARIABLE':
      console.log('STORE_VARIABLE: Storing variable', action.payload.variableName, 'with value', action.payload.value); // Debug log
      newState = {
        ...state,
        variables: {
          ...state.variables,
          [action.payload.variableName]: action.payload.value,
        },
        storeActive: false, // Exit store mode after storing
        error: null,
      };
      return newState;

    case 'INSERT_VARIABLE':
      newState = {
        ...state,
        expression: state.expression + action.payload,
        lastInputType: 'function', // Treat variable insertion like a function for input type
        alphaActive: false, // Exit alpha mode after inserting
        error: null,
      };
      return newState;

    case 'INCREMENT_CALCULATION_COUNT':
      console.log('Incrementing calculation count from', state.calculationCount, 'to', state.calculationCount + 1);
      return {
        ...state,
        calculationCount: state.calculationCount + 1,
      };

    case 'RESET_CALCULATION_COUNT':
      console.log('Resetting calculation count to 0');
      return {
        ...state,
        calculationCount: 0,
      };

    case 'EQUALS':
      try {
        if (!state.expression) return resetModes(state);

        const math = create(all);
        math.config({
          angle: state.angleUnit, // Use the configured angle unit directly
          number: 'BigNumber',
          precision: 14,
        });

        // Evaluate the expression directly, passing variables as scope
        let result = math.evaluate(state.expression, state.variables);
        let formattedResult = math.format(result, { precision: 14 });

        // Round very small numbers to 0 for display
        const numericResult = parseFloat(formattedResult);
        if (Math.abs(numericResult) < 1e-12) { // If very close to zero
          formattedResult = '0';
        } else if (Math.abs(numericResult - Math.round(numericResult)) < 1e-12) {
          // Round to nearest integer if very close to an integer (e.g., log(e) = 1)
          formattedResult = Math.round(numericResult).toString();
        }


        const newHistory = [
          ...state.history.slice(-9),
          { expression: state.expression, result: formattedResult }
        ];

        newState = {
          ...state,
          result: formattedResult,
          expression: '', // Clear expression after equals, result is shown
          history: newHistory,
          error: null,
          lastInputType: 'equals', // Mark last input as equals
          calculationCount: state.calculationCount + 1, // Increment calculation count
        };
        return resetModes(newState);
      } catch (error) {
        console.error('Math evaluation error:', error);
        newState = {
          ...state,
          error: 'Math Error',
          result: 'Error',
          expression: '', // Clear expression on error
          lastInputType: null,
        };
        return resetModes(newState);
      }

    default:
      return resetModes(state);
  }
};

interface CalculatorContextType {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
  shouldShowInterstitialAd: () => boolean;
  markInterstitialAdShown: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

interface CalculatorProviderProps {
  children: ReactNode;
}

export const CalculatorProvider: React.FC<CalculatorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Function to check if interstitial ad should be shown (every 10 calculations)
  const shouldShowInterstitialAd = () => {
    const shouldShow = state.calculationCount >= 10;
    return shouldShow;
  };

  // Function to mark that interstitial ad was shown and reset counter
  const markInterstitialAdShown = () => {
    dispatch({ type: 'RESET_CALCULATION_COUNT' });
  };
  return (
    <CalculatorContext.Provider value={{ 
      state, 
      dispatch, 
      shouldShowInterstitialAd, 
      markInterstitialAdShown 
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};
