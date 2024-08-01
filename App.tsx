import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MAX_DIGITS_BEFORE_OPERATOR = 10; 
const MAX_DIGITS_AFTER_OPERATOR = 11; 
const MAX_RESULT_LENGTH = 22; 

const App = () => {
  const [input, setInput] = useState('');
  const [lastOperator, setLastOperator] = useState(false);
  const [isResultDisplayed, setIsResultDisplay] = useState(false)

  const handlePress = (value) => {
	// Checks that the operator does not come before the operand and does it come after another operator
    if (['+', '-', '*', '/'].includes(value)) {  
      if (input.length > 0 && !lastOperator) {  
        setInput(input + value);
        setLastOperator(true);
		    setIsResultDisplay(false);
      }
	// If we use the +- button, we will check what the last number is
    } else if (value === '+-' && !lastOperator) {
      const lastOperatorIndex = Math.max(input.lastIndexOf('+'), input.lastIndexOf('-'), input.lastIndexOf('*'), input.lastIndexOf('/'));
      let lastSegment = input.slice(lastOperatorIndex + 1);
      let lastOperator = input[lastOperatorIndex];
  
      if (lastOperator === '+') {
		// If the last operator is a plus, replace it with a minus
        const updatedInput = input.slice(0, lastOperatorIndex) + '-' + lastSegment;
        setInput(updatedInput);
      } else if (lastOperator === '-') {
		// If the last operator is a minus, replace it with a plus
        const updatedInput = input.slice(0, lastOperatorIndex) + '+' + lastSegment;
        setInput(updatedInput);
      } else {
        // If the last operator is double or division, add a minus after the last operator
        if (lastSegment.startsWith('-')) {
          // If the last number already starts with a minus, remove the minus
          const updatedInput = input.slice(0, lastOperatorIndex + 1) + lastSegment.slice(1);
          setInput(updatedInput);
        } else {
			// Add a minus after the last operator
          const updatedInput = input.slice(0, lastOperatorIndex + 1) + '-' + lastSegment;
          setInput(updatedInput);
        }
      }
    } else {
      const currentDigitCount = input.replace(/[^0-9]/g, '').length;
      const hasOperator = /[+\-*/]/.test(input); 
	  

	  if (isResultDisplayed && !['+', '-', '*', '/'].includes(value)) {
		setInput(value);
		setIsResultDisplay(false);
	  } else if (hasOperator) {
		if (currentDigitCount < MAX_DIGITS_AFTER_OPERATOR) {
			setInput(input + value);
			setLastOperator(false);
		}
	  } else {
		if (input.length < MAX_DIGITS_BEFORE_OPERATOR || (input.length < MAX_DIGITS_BEFORE_OPERATOR + MAX_DIGITS_AFTER_OPERATOR)) {
			setInput(input + value);
			setLastOperator(value === '+' || value === '-' || value === '*' || value === '/');
		}
	  }
    }
  };
  // Resets the calculator
  const handleClear = () => {
    setInput('');
    setLastOperator(false);
	setIsResultDisplay(false);
  };

  const calculate = (expression) => {
    try {
		// Handle percentages
      const percentageExpression = expression
        .replace(/(\d+)\s*([+\-/])\s*(\d+)%/g, (match, p1, operator, p2) => {
          // Calculate percentages
          const percentageValue = p2 / 100 * parseFloat(p1);
          return `${p1} ${operator} ${percentageValue}`;
        })
        .replace(/(\d+)%/g, (match, p1) => `* (${p1} / 100)`);
      if (percentageExpression.trim() === '') {
        return 'Error';
      }

      const result = new Function('return ' + percentageExpression)();
      
      const resultString = result.toString();
      return resultString.length > MAX_RESULT_LENGTH
        ? resultString.slice(0, MAX_RESULT_LENGTH) // Correction: cutting the result from the left and not the right
        : resultString;
    } catch (e) {
      return 'Error';
    }
  };

  const handleEqual = () => {
    setInput(calculate(input));
    setLastOperator(false);
	setIsResultDisplay(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{input}</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={handleClear}>
          <Text style={styles.buttonText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('+-')}>
          <Text style={styles.buttonText}>+/-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('%')}>
          <Text style={styles.buttonText}>%</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('/')}>
          <Text style={styles.buttonText}>/</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('7')}>
          <Text style={styles.buttonText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('8')}>
          <Text style={styles.buttonText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('9')}>
          <Text style={styles.buttonText}>9</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('*')}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('4')}>
          <Text style={styles.buttonText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('5')}>
          <Text style={styles.buttonText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('6')}>
          <Text style={styles.buttonText}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('-')}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('1')}>
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('2')}>
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('3')}>
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('+')}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('0')}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('.')}>
          <Text style={styles.buttonText}>.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.equalButton} onPress={handleEqual}>
          <Text style={styles.buttonText}>=</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderColor: '#0000ff',
    borderWidth: 5,
    borderRadius: 10,
  },
  displayContainer: {
    backgroundColor: '#00a000',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  displayText: {
    fontSize: 48,
    color: 'white',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#f569bf',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 5,
  },
  equalButton: {
    backgroundColor: '#ff0000',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3.5,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default App;