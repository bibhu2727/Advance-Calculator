document.addEventListener('DOMContentLoaded', () => {
    const primaryDisplay = document.getElementById('display');
    const secondaryDisplay = document.getElementById('secondary-display');
    const keys = document.querySelector('.calculator-keys');

    keys.addEventListener('click', e => {
        if (!e.target.matches('button')) return;

        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = primaryDisplay.textContent;
        const previousKeyType = keys.dataset.previousKeyType;

        if (!action) {
            if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
                primaryDisplay.textContent = keyContent;
            } else {
                primaryDisplay.textContent = displayedNum + keyContent;
            }
            keys.dataset.previousKeyType = 'number';
        }

        if (action === 'decimal') {
            if (!displayedNum.includes('.')) {
                primaryDisplay.textContent = displayedNum + '.';
            } else if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
                primaryDisplay.textContent = '0.';
            }
            keys.dataset.previousKeyType = 'decimal';
        }

        if (action === 'clear') {
            primaryDisplay.textContent = '0';
            secondaryDisplay.textContent = '';
            keys.dataset.firstValue = '';
            keys.dataset.modValue = '';
            keys.dataset.operator = '';
            keys.dataset.previousKeyType = '';
        }

        if (action === 'delete') {
            primaryDisplay.textContent = displayedNum.slice(0, -1) || '0';
            keys.dataset.previousKeyType = 'delete';
        }

        if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide' || action === 'percentage' || action === 'fraction' || action === 'lcm' || action === 'hcf') {
            const firstValue = keys.dataset.firstValue;
            const operator = keys.dataset.operator;
            const secondValue = displayedNum;

            if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
                const calcValue = calculate(firstValue, operator, secondValue);
                primaryDisplay.textContent = calcValue;
                secondaryDisplay.textContent = `${calcValue} ${keyContent}`;
                keys.dataset.firstValue = calcValue;
            } else {
                keys.dataset.firstValue = displayedNum;
                secondaryDisplay.textContent = `${displayedNum} ${keyContent}`;
            }

            primaryDisplay.textContent = '0';
            keys.dataset.operator = action;
            keys.dataset.previousKeyType = 'operator';
        }

        if (action === 'calculate') {
            let firstValue = keys.dataset.firstValue;
            const operator = keys.dataset.operator;
            let secondValue = displayedNum;

            if (firstValue) {
                if (previousKeyType === 'calculate') {
                    firstValue = displayedNum;
                    secondValue = keys.dataset.modValue;
                }

                primaryDisplay.textContent = calculate(firstValue, operator, secondValue);
                secondaryDisplay.textContent = `${firstValue} ${operatorSymbol(operator)} ${secondValue} =`;

                keys.dataset.modValue = secondValue;
                keys.dataset.previousKeyType = 'calculate';
            }
        }

        keys.dataset.previousKeyType = action;
    });

    function calculate(first, operator, second) {
        const firstNum = parseFloat(first);
        const secondNum = parseFloat(second);

        if (operator === 'add') return firstNum + secondNum;
        if (operator === 'subtract') return firstNum - secondNum;
        if (operator === 'multiply') return firstNum * secondNum;
        if (operator === 'divide') return firstNum / secondNum;
        if (operator === 'percentage') return (firstNum * secondNum) / 100;
        if (operator === 'fraction') return 1 / firstNum;
        if (operator === 'lcm') return lcm(firstNum, secondNum);
        if (operator === 'hcf') return hcf(firstNum, secondNum);
    }

    function operatorSymbol(operator) {
        if (operator === 'add') return '+';
        if (operator === 'subtract') return '−';
        if (operator === 'multiply') return '×';
        if (operator === 'divide') return '÷';
        if (operator === 'percentage') return '%';
        if (operator === 'fraction') return '1/';
        if (operator === 'lcm') return 'LCM';
        if (operator === 'hcf') return 'HCF';
    }

    function lcm(a, b) {
        return Math.abs(a * b) / hcf(a, b);
    }

    function hcf(a, b) {
        if (!b) return a;
        return hcf(b, a % b);
    }
});
