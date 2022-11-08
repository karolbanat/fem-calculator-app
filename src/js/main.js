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
	operation = undefined;
	buffer = '0';

	invokeOperation(nextOperation = undefined) {
		switch (this.operation) {
			case '+':
				this.result = this.result + parseFloat(this.buffer);
				break;
			case '-':
				this.result = this.result - parseFloat(this.buffer);
				break;
			case '/':
				this.result = this.result / parseFloat(this.buffer);
				break;
			case '*':
				this.result = this.result * parseFloat(this.buffer);
				break;
			default:
				this.result = parseFloat(this.buffer);
		}

		this.setOperation(nextOperation);
		this.buffer = '0';
	}

	setOperation(operation) {
		this.operation = operation;
	}

	reset() {
		this.buffer = '0';
		this.result = 0.0;
		this.operation = undefined;
	}

	increaseValue(value) {
		if (value === '.' && this.buffer.includes('.')) return;

		this.buffer += value;
		this.transformLead();
	}

	decreaseValue() {
		this.buffer = this.buffer.slice(0, -1) || '0';
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
			displayOutput(calc.buffer);
			break;
		case 'reset':
			calc.reset();
			displayOutput(calc.buffer);
			break;
		case '+':
		case '-':
		case '/':
		case '*':
			calc.invokeOperation(operation);
			displayOutput(calc.buffer);
			break;
		case '=':
			calc.invokeOperation();
			displayOutput(calc.result);
			break;
	}
};
const displayOutput = (value = '0') => {
	calculatorOutput.innerText = value;
};

valueKeys.forEach(key =>
	key.addEventListener('click', e => {
		calc.increaseValue(e.target.dataset.value);
		displayOutput(calc.buffer);
	})
);

operationKeys.forEach(key => key.addEventListener('click', handleOperationKey));

loadTheme();
