import { fetchApi } from './js/fetchApi';
import Notiflix from 'notiflix';
import renderCocktailCards from './templates/renderCocktailCards.hbs';
import renderCocktailInfo from './templates/renderCocktailInfo.hbs';
import renderIngridientInfo from './templates/renderIngridientInfo.hbs';

const searchForm = document.querySelector('.header__search-form');
const alphabetList = document.querySelector('.alphabet-list');
const cocktailsMenuList = document.querySelector('.menu-list');
const selectValue = document.querySelector('.select-value');

const cocktailModal = document.querySelector('.modal-cocktail');
const cocktailModalInfo = document.querySelector('.modal-cocktail__info');

const switchValue = document.querySelector('.header__switch-input');

let ingredientModal;
let ingredientModalInfo;

let inputValue = '';
let identificator = '';
let type = '';

async function getDrink() {
    const data = await fetchApi(type, identificator, inputValue);

    try {
        fetchRandomCocktailCards(data.drinks);

        let learnMoreBtn = document.querySelectorAll('.menu-list__lookup');

        learnMoreBtn.forEach(btn => {
            btn.addEventListener('click', handleLearnMore);
        });

        if (type === 'search') {
            if (identificator === 's=' || identificator === 'f=') {
                if (!data.drinks) {
                    throw new Error();
                }
                fetchCocktailCards(data.drinks);
                learnMoreBtn = document.querySelectorAll('.menu-list__lookup');

                learnMoreBtn.forEach(btn => {
                    btn.addEventListener('click', handleLearnMore);
                });
            }
            if (identificator === 'i=') {
                fetchIngridientInfo(data);
                // Notiflix.Notify.success('Hooray');
            }
        }
        if (type === 'lookup') {
            if (identificator === 'i=') {
                fetchCocktailInfo(data);
                // Notiflix.Notify.success('Hooray');
            }
        }
    } catch (error) {
        Notiflix.Notify.failure('Нажаль такий коктейль відсутній');
    }
}

function getRandom(n) {
    identificator = '';
    type = 'random';
    inputValue = '';
    for (let i = 1; i <= n; i++) {
        getDrink();
    }
}

function handleSubmit(event) {
    event.preventDefault();
    identificator = 's=';
    type = 'search';
    getDrink();
}

function handleAlphabet({ target }) {
    identificator = 'f=';
    type = 'search';
    inputValue = target.textContent;
    getDrink();
}

function handleSelect({ target }) {
    identificator = 'f=';
    type = 'search';
    inputValue = target.value;
    getDrink();
}

function handleLearnMore({ target }) {
    identificator = 'i=';
    type = 'lookup';
    inputValue = target.id;
    getDrink();
}

function handleIngridient(event) {
    identificator = 'i=';
    type = 'search';
    inputValue = event.target.id;
    getDrink();
}

function handleInput({ target }) {
    inputValue = target.value;
}

function fetchCocktailCards(data) {
    cocktailsMenuList.innerHTML = renderCocktailCards(data);
}

function fetchRandomCocktailCards(data) {
    cocktailsMenuList.insertAdjacentHTML('beforeend', renderCocktailCards(data));
}

function fetchCocktailInfo(data) {
    cocktailModal.style.display = 'block';
    let cocktailInfoObject = {};
    let ingredients = {};
    const element = data.drinks[0];

    for (let num = 1; num <= 15; num++) {
        if (element[`strIngredient${num}`] !== null) {
            ingredients[element[`strIngredient${num}`]] = element[`strMeasure${num}`];
        }
    }

    cocktailInfoObject.name = element.strDrink;
    cocktailInfoObject.insrtuction = element.strInstructions;
    cocktailInfoObject.image = element.strDrinkThumb;
    cocktailInfoObject.ingredients = ingredients;
    console.log(cocktailInfoObject);

    cocktailModalInfo.innerHTML = renderCocktailInfo(cocktailInfoObject);

    const ingrid = document.querySelectorAll('.ingredient-link');
    ingrid.forEach(ingr => {
        ingr.addEventListener('click', handleIngridient);
    });

    const closeCocktail = document.querySelector('.modal-cocktail__close');
    closeCocktail.addEventListener('click', () => {
        cocktailModal.style.display = 'none';
    });

    ingredientModal = document.querySelector('.modal-ingredient');
    ingredientModalInfo = document.querySelector('.modal-ingredient__info');
}

function fetchIngridientInfo(data) {
    ingredientModalInfo.innerHTML = '';

    if (data.ingredients[0].strDescription !== null) {
        ingredientModal.style.display = 'block';
        ingredientModalInfo.innerHTML = renderIngridientInfo(data.ingredients[0]);
        const closeIngridient = document.querySelector('.modal-ingredient__close');
        closeIngridient.addEventListener('click', () => {
            ingredientModal.style.display = 'none';
        });
    }
    if (data.ingredients[0].strDescription === null) {
        Notiflix.Notify.warning('No info about this ingredient for now');
    }
}

searchForm.addEventListener('submit', handleSubmit);
searchForm.addEventListener('input', handleInput);
alphabetList.addEventListener('click', handleAlphabet);
// selectValue.addEventListener('change', handleSelect);
getRandom(9);

window.onclick = function ({ target }) {
    if (target == ingredientModal) {
        ingredientModal.style.display = 'none';
    }
    if (target == cocktailModal) {
        cocktailModal.style.display = 'none';
    }
};

function handleChangeCheckbox({ target }) {
    if (target.checked === true) {
        document.body.style.backgroundColor = '#202025';
    }
    if (!target.checked) {
        document.body.style.backgroundColor = '#ffffff';
    }
}

switchValue.addEventListener('change', handleChangeCheckbox);

const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
];
const abcList = document.querySelector('.alphabet-list');

alphabet.forEach(abc => {
    abcList.insertAdjacentHTML(
        'beforeend',
        `<li class='letter'><span class='letter-button'>${abc}</span></li>`
    );
});
