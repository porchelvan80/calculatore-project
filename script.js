// Calculator Class using Functions and Operators
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    // Clear function - resets calculator to initial state
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    // Delete function - removes last digit
    delete() {
        if (this.currentOperand.length > 1) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        } else {
            this.currentOperand = '0';
        }
    }

    // Append number function
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    // Choose operation function
    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    // Compute function - performs calculations using operators
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        // Using switch statement with operators
        switch (this.operation) {
            case '+':
                computation = prev + current; // Addition operator
                break;
            case '-':
                computation = prev - current; // Subtraction operator
                break;
            case '×':
                computation = prev * current; // Multiplication operator
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current; // Division operator
                break;
            case '%':
                computation = prev % current; // Modulo operator
                break;
            case 'mod':
                computation = prev % current; // Modulo operator
                break;
            case 'x²':
                computation = current * current; // Power operator (squared)
                break;
            case '√':
                if (current < 0) {
                    alert('Cannot calculate square root of negative number!');
                    return;
                }
                computation = Math.sqrt(current); // Square root function
                break;
            case 'x^y':
                computation = Math.pow(prev, current); // Power function
                break;
            default:
                return;
        }

        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
    }

    // Special operations that work on current number only
    performUnaryOperation(operation) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        let computation;

        switch (operation) {
            case '%':
                computation = current / 100; // Percentage function
                break;
            case 'x²':
                computation = current * current; // Square function using multiplication operator
                break;
            case '√':
                if (current < 0) {
                    alert('Cannot calculate square root of negative number!');
                    return;
                }
                computation = Math.sqrt(current); // Square root function
                break;
            default:
                return;
        }

        this.currentOperand = this.formatNumber(computation);
    }

    // Format number function - adds commas for thousands
    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Update display function
    updateDisplay() {
        this.currentOperandElement.innerText = this.formatNumber(this.currentOperand);
        if (this.operation != null) {
            const operationSymbol = this.getOperationSymbol(this.operation);
            this.previousOperandElement.innerText = 
                `${this.formatNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    // Get operation symbol function
    getOperationSymbol(operation) {
        const symbols = {
            '+': '+',
            '-': '−',
            '×': '×',
            '÷': '÷',
            '%': '%',
            'mod': 'mod',
            'x²': '²',
            '√': '√',
            'x^y': '^'
        };
        return symbols[operation] || '';
    }
}

// DOM Elements
const previousOperandElement = document.querySelector('[data-previous-operand]');
const currentOperandElement = document.querySelector('[data-current-operand]');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');

// Create calculator instance
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event Listeners for Number Buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

// Event Listeners for Operation Buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const operation = button.getAttribute('data-operation');
        
        // Special unary operations
        if (operation === 'clear') {
            calculator.clear();
        } else if (operation === 'backspace') {
            calculator.delete();
        } else if (operation === 'percent' && calculator.previousOperand === '') {
            calculator.performUnaryOperation('%');
        } else if (operation === 'x²' && calculator.previousOperand === '') {
            calculator.performUnaryOperation('x²');
        } else if (operation === 'sqrt' && calculator.previousOperand === '') {
            calculator.performUnaryOperation('√');
        } else if (operation === 'equals') {
            calculator.compute();
        } else {
            // Map operation attribute to operation symbol
            const operationMap = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷',
                'modulo': 'mod',
                'percent': '%',
                'power': 'x²',
                'sqrt': '√',
                'power-y': 'x^y'
            };
            calculator.chooseOperation(operationMap[operation] || operation);
        }
        
        calculator.updateDisplay();
    });
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }
    if (e.key === '+' || e.key === '-') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    }
    if (e.key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    }
    if (e.key === '/') {
        e.preventDefault();
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    }
    if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    }
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});

