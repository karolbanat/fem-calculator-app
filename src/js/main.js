const themeSwitcherButtons = document.querySelectorAll('.theme-switcher__radio-btn');
/* caluculator elements */
const calculator = document.querySelector('.calculator');
const valueKeys = calculator.querySelectorAll('button[data-value]');
const operationKeys = calculator.querySelectorAll('button[data-operation]');
const calculatorOutput = calculator.querySelector('#calculator-output');

/* theme handling */
const loadTheme = () => {
	const theme = localStorage.getItem('theme');

	if (theme) changeTheme(theme);
	else loadPreferedTheme();
};

const changeTheme = theme => {
	document.body.setAttribute('data-theme', theme);
	checkRadioBtn(theme);
	saveTheme(theme);
};

const saveTheme = theme => {
	localStorage.setItem('theme', theme);
};

const loadPreferedTheme = () => {
	const preferedTheme =
		window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	checkRadioBtn(preferedTheme);
};

const checkRadioBtn = theme => {
	themeSwitcherButtons.forEach(btn => {
		if (btn.value === theme) btn.checked = true;
	});
};
themeSwitcherButtons.forEach(btn => btn.addEventListener('change', e => changeTheme(e.target.value)));
/* theme handling end */

/* calculator handling */
class Calculator {
	result = 0.0;
	operation = '='; // '=' treated as default operation
	buffer = '0';

	invokeOperation(nextOperation = '=') {
		switch (this.operation) {
			case '+':
				this.result = this.result + parseFloat(this.buffer);
				this.clearBuffer();
				break;
			case '-':
				this.result = this.result - parseFloat(this.buffer);
				this.clearBuffer();
				break;
			case '/':
				this.result = this.result / parseFloat(this.buffer);
				this.clearBuffer();
				break;
			case '*':
				this.result = this.result * parseFloat(this.buffer);
				this.clearBuffer();
				break;
			case '=':
				/* after pressing '=' operation if there is no result
          or there is result and non empty buffer (meaning buffer needs to replace result),
          move buffer to result and clear buffer */
				if (this.result === 0 || (this.result !== 0 && this.buffer !== '0')) {
					this.result = parseFloat(this.buffer);
					this.clearBuffer();
				}
		}

		this.setOperation(nextOperation);
	}

	setOperation(operation) {
		this.operation = operation;
	}

	reset() {
		this.clearBuffer();
		this.result = 0.0;
		this.operation = '=';
	}

	clearBuffer() {
		this.buffer = '0';
	}

	hasEmptyBuffer() {
		return this.buffer === '0';
	}

	increaseValue(value) {
		/* don't add '.' if it is present */
		if (value === '.' && this.buffer.includes('.')) return;

		this.buffer += value;
		this.transformLead();
	}

	decreaseValue() {
		this.buffer = this.buffer.slice(0, -1) || '0';
	}

	/* formatting */
	formattedResult() {
		return this.result.toString().replace(/[^\.]+/, match => parseInt(match).toLocaleString('en-US'));
	}

	formattedBuffer() {
		/* searches for numbers before '.' and formats it */
		return this.buffer.replace(/[^\.]+/, match => parseInt(match).toLocaleString('en-US'));
	}

	transformLead() {
		this.trimLeadingZeros();
		this.convertLeadingDot();
	}

	trimLeadingZeros() {
		/* remove leading zeros */
		this.buffer = this.buffer.replace(/^0+/, '') || '0';
	}

	convertLeadingDot() {
		/* if there is dot at the start, replace it with 0. */
		this.buffer = this.buffer.replace(/^\./, '0.');
	}
}

const calc = new Calculator();

const handleOperationKey = e => {
	const operation = e.target.dataset.operation;
	switch (operation) {
		case 'delete':
			calc.decreaseValue();
			displayOutput(calc.formattedBuffer());
			break;
		case 'reset':
			calc.reset();
			displayOutput(calc.formattedBuffer());
			break;
		case '-':
			/* if no value provided, then add '-' sign at the front (treating it as value),
        else treat it as subtracting operation */
			if (calc.hasEmptyBuffer()) calc.increaseValue('-');
			else calc.invokeOperation(operation);

			displayOutput(calc.formattedBuffer());
			break;
		case '+':
		case '/':
		case '*':
			calc.invokeOperation(operation);
			displayOutput(calc.formattedBuffer());
			break;
		case '=':
			calc.invokeOperation();
			displayOutput(calc.formattedResult());
			break;
	}
};

const displayOutput = (value = '0') => (calculatorOutput.innerText = value);

valueKeys.forEach(key =>
	key.addEventListener('click', e => {
		calc.increaseValue(e.target.dataset.value);
		displayOutput(calc.formattedBuffer());
	})
);

operationKeys.forEach(key => key.addEventListener('click', handleOperationKey));

loadTheme();
