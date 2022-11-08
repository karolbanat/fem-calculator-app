const themeSwitcherButtons = document.querySelectorAll('.theme-switcher__radio-btn');

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
/* theme handling end */

/* event listeners */
themeSwitcherButtons.forEach(btn => btn.addEventListener('change', e => changeTheme(e.target.value)));

loadTheme();
