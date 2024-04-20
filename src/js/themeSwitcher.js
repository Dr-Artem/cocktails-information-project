import initMain from '../index.js';

const myInit = new initMain();
const elementsToToggleDark = [document.body, myInit.turnDark, myInit.turnLight];

if (localStorage.getItem('dark') === 'true') {
    myInit.switchValue.checked = true;
    elementsToToggleDark.forEach(element => element.classList.add('dark'));
}

function handleChangeCheckbox() {
    const isDarkTheme = myInit.switchValue.checked;
    elementsToToggleDark.forEach(element => {
        if (isDarkTheme) {
            element.classList.add('dark');
        } else {
            element.classList.remove('dark');
        }
    });
    localStorage.setItem('dark', isDarkTheme.toString());
}
myInit.switchValue.addEventListener('change', handleChangeCheckbox);
