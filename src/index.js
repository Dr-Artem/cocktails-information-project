import { fetchApi } from './js/fetchApi';
import Notiflix from 'notiflix';
import renderCocktailCards from './templates/renderCocktailCards.hbs';
import renderIngredientCards from './templates/renderIngredientCards.hbs';
import modalCocktailInfo from './templates/modalCocktailInfo.hbs';
import modalIngridientInfo from './templates/modalIngridientInfo.hbs';

const searchForm = document.querySelector('.header__search-form');
const alphabetList = document.querySelector('.alphabet-list');
const cocktailsMenuList = document.querySelector('.menu-list');
const favouriteCocktailsList = document.querySelector('.fav-cocktail__list');
const favouriteIngredientsList = document.querySelector('.fav-ingredient__list');
const selectValue = document.querySelector('.select-value');

const cocktailModal = document.querySelector('.modal-cocktail');
const cocktailModalInfo = document.querySelector('.modal-cocktail__info');
const ingredientModal = document.querySelector('.modal-ingredient');
const ingredientModalInfo = document.querySelector('.modal-ingredient__info');
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const abcList = document.querySelector('.alphabet-list');

const switchValue = document.querySelector('.header__switch-input');

const cardsTitle = document.querySelector('.cards__title');
const imageEr = document.querySelector('.error-wrapper__img');
const messageEr = document.querySelector('.title-error');
let parentLi;

let inputValue = '';
let identificator = '';
let type = '';

let localKeys = [];
for (const key in localStorage) {
    localKeys.push(key);
}

async function getDrink() {
    const data = await fetchApi(type, identificator, inputValue);
    messageEr.classList.add('hidden');
    imageEr.classList.add('hidden');

    try {
        if (type === 'random') {
            fetchRandomCocktailCards(data.drinks);
        }

        if (type === 'search') {
            cardsTitle.classList.remove('hidden');
            cocktailsMenuList.classList.remove('hidden');
            if (identificator === 's=' || identificator === 'f=') {
                if (!data.drinks) {
                    throw new Error();
                }
                fetchCocktailCards(data.drinks);
            }
            if (identificator === 'i=') {
                fetchIngridientInfo(data);
            }
        }
        if (type === 'lookup') {
            if (identificator === 'i=') {
                fetchCocktailInfo(data);
            }
        }
        let its = document.querySelectorAll('.menu-list__add');
        its.forEach(it => {
            if (localKeys.includes(it.id)) {
                it.innerHTML =
                    "Remove <svg class='menu-list__add-icon' viewBox='0 0 36 32'><path fill='#fd5103'style='fill: var(--color1, #fd5103)' d='M17.882 32l-2.593-2.302c-9.209-8.144-15.289-13.515-15.289-20.107 0-5.371 4.328-9.591 9.835-9.591 3.112 0 6.098 1.413 8.047 3.645 1.949-2.232 4.936-3.645 8.047-3.645 5.508 0 9.835 4.22 9.835 9.591 0 6.592-6.080 11.963-15.289 20.124l-2.593 2.284z' ></path><path fill='#fd5103' style='fill: var(--color2, #fd5103)' d='M17.882 28.631l-2.099-1.817c-7.455-6.429-12.377-10.67-12.377-15.874 0-4.24 3.503-7.572 7.962-7.572 2.519 0 4.936 1.115 6.514 2.877 1.578-1.762 3.995-2.877 6.514-2.877 4.459 0 7.962 3.332 7.962 7.572 0 5.204-4.922 9.444-12.377 15.888l-2.099 1.803z'></path></svg>";
            }
        });
    } catch (error) {
        messageEr.classList.remove('hidden');
        imageEr.classList.remove('hidden');
        cardsTitle.classList.add('hidden');
        cocktailsMenuList.classList.add('hidden');

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
    document.body.classList.add('_lock');
}

function handleAddRemove(event) {
    let elementId = event.target.id;
    let element = event.target;

    let cardItem = document.querySelectorAll('.menu-list__item');

    if (localKeys.includes(elementId)) {
        localStorage.removeItem(elementId);
        event.target.innerHTML =
            "Add To <svg class='menu-list__add-icon' viewBox='0 0 36 32'><path fill='#fd5103' style='fill: var(--color1, #fd5103)' d='M26.674 2.56c0.92-0.001 1.83 0.184 2.678 0.545s1.616 0.889 2.261 1.554c1.327 1.365 2.071 3.204 2.071 5.12s-0.744 3.755-2.071 5.12l-13.086 13.427-13.086-13.427c-1.327-1.365-2.071-3.204-2.071-5.12s0.744-3.755 2.071-5.12c0.644-0.665 1.413-1.193 2.261-1.554s1.758-0.546 2.678-0.546c0.92 0 1.83 0.186 2.678 0.546s1.617 0.889 2.261 1.554l3.208 3.328 3.196-3.302c0.642-0.673 1.411-1.208 2.262-1.574s1.766-0.553 2.69-0.551zM26.674 0c-1.256-0.001-2.5 0.252-3.658 0.744s-2.208 1.214-3.087 2.123l-1.402 1.434-1.402-1.434c-0.881-0.907-1.93-1.628-3.088-2.119s-2.401-0.745-3.657-0.745c-1.256 0-2.499 0.253-3.657 0.745s-2.208 1.212-3.088 2.119c-1.791 1.848-2.795 4.335-2.795 6.925s1.004 5.077 2.795 6.925l14.893 15.283 14.893-15.283c1.791-1.848 2.795-4.335 2.795-6.925s-1.004-5.077-2.795-6.925c-0.88-0.908-1.93-1.629-3.088-2.121s-2.401-0.746-3.657-0.746z'></path></svg>";
        let localIndex = localKeys.indexOf(`${event.target.id}`);
        localKeys.splice(localIndex, 1);
        if (favouriteCocktailsList) {
            document.location.reload();
        }
    } else {
        localKeys.push(elementId);

        cardItem.forEach(item => {
            if (item.id === elementId) {
                parentLi = item.innerHTML;
            }
        });
        localStorage.setItem(elementId, parentLi);
        event.target.innerHTML =
            "Remove <svg class='menu-list__add-icon' viewBox='0 0 36 32'><path fill='#fd5103' style='fill: var(--color1, #fd5103)'' d='M17.684 32l-2.564-2.302c-9.107-8.144-15.12-13.515-15.12-20.107 0-5.371 4.28-9.591 9.726-9.591 3.077 0 6.030 1.413 7.958 3.645 1.928-2.232 4.881-3.645 7.958-3.645 5.447 0 9.726 4.22 9.726 9.591 0 6.592-6.013 11.963-15.12 20.124l-2.564 2.284z'></path></svg>";
    }
}

if (favouriteCocktailsList) {
    // const imageEr = document.querySelector('.error-wrapper__img');
    const cocktailTitle = document.querySelector('.fav-cocktail__title');
    // const messageEr = document.querySelector('.title-error');
    imageEr.classList.add('hidden');
    cocktailTitle.classList.remove('hidden');
    messageEr.classList.add('hidden');

    favouriteCocktailsList.addEventListener('click', mainFunc);
    for (let i = 0; i < localStorage.length; i++) {
        const localCocktailId = localStorage.key(i);
        if (localCocktailId.startsWith('strDrink')) {
            const cocktailInfo = localStorage.getItem(localCocktailId);
            favouriteCocktailsList.insertAdjacentHTML('beforeend', `<li class='menu-list__item' id='${localCocktailId}'>${cocktailInfo}</li>`);
        }
    }
    if (favouriteCocktailsList.innerHTML == '') {
        imageEr.classList.remove('hidden');
        cocktailTitle.classList.add('hidden');
        messageEr.classList.remove('hidden');
    }
    let addButtons = document.querySelectorAll('.menu-list__add');
    addButtons.forEach(add => {
        if (localKeys.includes(add.id)) {
            add.innerHTML =
                "Remove <svg class='menu-list__add-icon' viewBox='0 0 36 32'><path fill='#fd5103'style='fill: var(--color1, #fd5103)' d='M17.882 32l-2.593-2.302c-9.209-8.144-15.289-13.515-15.289-20.107 0-5.371 4.328-9.591 9.835-9.591 3.112 0 6.098 1.413 8.047 3.645 1.949-2.232 4.936-3.645 8.047-3.645 5.508 0 9.835 4.22 9.835 9.591 0 6.592-6.080 11.963-15.289 20.124l-2.593 2.284z' ></path><path fill='#fd5103' style='fill: var(--color2, #fd5103)' d='M17.882 28.631l-2.099-1.817c-7.455-6.429-12.377-10.67-12.377-15.874 0-4.24 3.503-7.572 7.962-7.572 2.519 0 4.936 1.115 6.514 2.877 1.578-1.762 3.995-2.877 6.514-2.877 4.459 0 7.962 3.332 7.962 7.572 0 5.204-4.922 9.444-12.377 15.888l-2.099 1.803z'></path></svg>";
        }
    });
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
    // cocktailModal.style.display = 'block';
    cocktailModal.style.opacity = '1';
    cocktailModal.style.visibility = 'visible';
    let cocktailInfoObject = {};
    let ingredients = {};

    const element = data.drinks[0];

    for (let num = 1; num <= 15; num++) {
        if (element[`strIngredient${num}`] !== null) {
            let words = element[`strIngredient${num}`].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            ingredients[words] = element[`strMeasure${num}`];
        }
    }

    cocktailInfoObject.id = element.idDrink;
    cocktailInfoObject.name = element.strDrink;
    cocktailInfoObject.insrtuction = element.strInstructions;
    cocktailInfoObject.image = element.strDrinkThumb;
    cocktailInfoObject.ingredients = ingredients;

    cocktailModalInfo.innerHTML = modalCocktailInfo(cocktailInfoObject);

    const ingredientsLinks = document.querySelectorAll('.ingredient-link');
    ingredientsLinks.forEach(link => {
        link.addEventListener('click', handleIngridient);
    });

    const closeCocktail = document.querySelector('.modal-cocktail__close');
    const addToFavourite = document.querySelector('.modal-cocktail__add-favourite');

    if (localKeys.includes(`strDrink${element.idDrink}`)) {
        addToFavourite.textContent = 'Remove from favourite';
    }
    addToFavourite.onclick = function (event) {
        let item = event.target.id;
        let cardItem = document.querySelectorAll('.menu-list__item');
        let cardItemBtn;
        if (localKeys.includes(`strDrink${element.idDrink}`)) {
            localStorage.removeItem(item);
            let localIndex = localKeys.indexOf(item);
            localKeys.splice(localIndex, 1);
            // closeCocktail.click();
            if (favouriteCocktailsList) {
                document.location.reload();
            }
            addToFavourite.textContent = 'Add to favourite';
            cardItem.forEach(card => {
                if (card.id === item) {
                    cardItemBtn = card.querySelector('.menu-list__add');
                }
            });
            cardItemBtn.innerHTML =
                "Add To <svg class='menu-list__add-icon' viewBox='0 0 36 32'><path fill='#fd5103' style='fill: var(--color1, #fd5103)' d='M26.674 2.56c0.92-0.001 1.83 0.184 2.678 0.545s1.616 0.889 2.261 1.554c1.327 1.365 2.071 3.204 2.071 5.12s-0.744 3.755-2.071 5.12l-13.086 13.427-13.086-13.427c-1.327-1.365-2.071-3.204-2.071-5.12s0.744-3.755 2.071-5.12c0.644-0.665 1.413-1.193 2.261-1.554s1.758-0.546 2.678-0.546c0.92 0 1.83 0.186 2.678 0.546s1.617 0.889 2.261 1.554l3.208 3.328 3.196-3.302c0.642-0.673 1.411-1.208 2.262-1.574s1.766-0.553 2.69-0.551zM26.674 0c-1.256-0.001-2.5 0.252-3.658 0.744s-2.208 1.214-3.087 2.123l-1.402 1.434-1.402-1.434c-0.881-0.907-1.93-1.628-3.088-2.119s-2.401-0.745-3.657-0.745c-1.256 0-2.499 0.253-3.657 0.745s-2.208 1.212-3.088 2.119c-1.791 1.848-2.795 4.335-2.795 6.925s1.004 5.077 2.795 6.925l14.893 15.283 14.893-15.283c1.791-1.848 2.795-4.335 2.795-6.925s-1.004-5.077-2.795-6.925c-0.88-0.908-1.93-1.629-3.088-2.121s-2.401-0.746-3.657-0.746z'></path></svg>";
        } else {
            cardItem.forEach(card => {
                if (card.id === item) {
                    cardItemBtn = card.querySelector('.menu-list__add');
                    parentLi = card.innerHTML;
                }
            });
            localKeys.push(item);
            localStorage.setItem(item, parentLi);
            addToFavourite.textContent = 'Remove from favourite';
            cardItemBtn.innerHTML =
                "Remove <svg class='menu-list__add-icon' viewBox='0 0 36 32'><path fill='#fd5103'style='fill: var(--color1, #fd5103)' d='M17.882 32l-2.593-2.302c-9.209-8.144-15.289-13.515-15.289-20.107 0-5.371 4.328-9.591 9.835-9.591 3.112 0 6.098 1.413 8.047 3.645 1.949-2.232 4.936-3.645 8.047-3.645 5.508 0 9.835 4.22 9.835 9.591 0 6.592-6.080 11.963-15.289 20.124l-2.593 2.284z' ></path><path fill='#fd5103' style='fill: var(--color2, #fd5103)' d='M17.882 28.631l-2.099-1.817c-7.455-6.429-12.377-10.67-12.377-15.874 0-4.24 3.503-7.572 7.962-7.572 2.519 0 4.936 1.115 6.514 2.877 1.578-1.762 3.995-2.877 6.514-2.877 4.459 0 7.962 3.332 7.962 7.572 0 5.204-4.922 9.444-12.377 15.888l-2.099 1.803z'></path></svg>";
        }
    };
    const ingredientList = [];
    for (const key in ingredients) {
        ingredientList.push(key);
    }
    localKeys.forEach(item => {
        if (item.startsWith('strIngredient')) {
            let testValue = JSON.parse(localStorage.getItem(item));
            if (ingredientList.includes(testValue.strIngredient)) {
                let testIn = document.getElementById(testValue.strIngredient);
                testIn.style.color = '#fd510366';
            }
        }
    });

    closeCocktail.addEventListener('click', () => {
        // cocktailModal.style.display = 'none';
        cocktailModal.style.opacity = '0';
        cocktailModal.style.visibility = 'hidden';
        document.body.classList.remove('_lock');
    });
}

function fetchIngridientInfo(data) {
    ingredientModalInfo.innerHTML = '';
    let listOfIngr = document.getElementById(data.ingredients[0].strIngredient);
    if (!listOfIngr) {
        listOfIngr = document.getElementById(data.ingredients[0].strIngredient[0].toUpperCase() + data.ingredients[0].strIngredient.substring(1));
    }

    if (data.ingredients[0].strDescription !== null) {
        // ingredientModal.style.display = 'block';
        ingredientModal.style.opacity = '1';
        ingredientModal.style.visibility = 'visible';
        ingredientModalInfo.innerHTML = modalIngridientInfo(data.ingredients[0]);

        const closeIngredient = document.querySelector('.modal-ingredient__close');
        const addIngrBtn = ingredientModalInfo.querySelector('.modal-ingredient__add-favourite');
        if (localKeys.includes(`strIngredient${data.ingredients[0].idIngredient}`)) {
            addIngrBtn.textContent = 'Remove from favourite';
        }
        addIngrBtn.onclick = function (event) {
            let ingrBtnId = event.target.id;
            if (localKeys.includes(ingrBtnId)) {
                localStorage.removeItem(ingrBtnId);
                let localIndex = localKeys.indexOf(ingrBtnId);
                localKeys.splice(localIndex, 1);
                listOfIngr.style.color = '#5f6775';
                closeIngredient.click();
                if (favouriteIngredientsList) {
                    document.location.reload();
                }
                addIngrBtn.textContent = 'Add to favourite';
            } else {
                let jsonSerialize = JSON.stringify(data.ingredients[0]);
                localStorage.setItem(ingrBtnId, jsonSerialize);
                localKeys.push(ingrBtnId);
                addIngrBtn.textContent = 'Remove from favourite';
                listOfIngr.style.color = '#fd510366';
            }
        };
        const closeIngridient = ingredientModalInfo.querySelector('.modal-ingredient__close');
        closeIngridient.addEventListener('click', () => {
            // ingredientModal.style.display = 'none';
            ingredientModal.style.opacity = '0';
            ingredientModal.style.visibility = 'hidden';
        });
    }
    if (data.ingredients[0].strDescription === null) {
        Notiflix.Notify.warning('No info about this ingredient for now');
    }
}

if (favouriteIngredientsList) {
    // const imageEr = document.querySelector('.error-wrapper__img');
    const ingredientTitle = document.querySelector('.fav-ingredient__title');
    // const messageEr = document.querySelector('.title-error');
    imageEr.classList.add('hidden');
    ingredientTitle.classList.remove('hidden');
    messageEr.classList.add('hidden');
    for (let i = 0; i < localStorage.length; i++) {
        let localIngredientId = localStorage.key(i);
        if (localIngredientId.startsWith('strIngredient')) {
            let ingredientInfo = localStorage.getItem(localIngredientId);
            ingredientInfo = JSON.parse(ingredientInfo);
            favouriteIngredientsList.insertAdjacentHTML('beforeend', renderIngredientCards(ingredientInfo));
        }
    }
    if (favouriteIngredientsList.innerHTML == '') {
        imageEr.classList.remove('hidden');
        ingredientTitle.classList.add('hidden');
        messageEr.classList.remove('hidden');
    }
    favouriteIngredientsList.onclick = function (event) {
        if (event.target.className === 'fav-ingredient__learn') {
            handleIngridient(event);
        }
        if (event.target.className === 'fav-ingredient__remove') {
            localStorage.removeItem(event.target.id);
            document.location.reload();
        }
    };
}

function mainFunc(event) {
    if (event.target.className === 'menu-list__lookup') {
        handleLearnMore(event);
    }
    if (event.target.className === 'menu-list__add') {
        handleAddRemove(event);
    }
}

window.onclick = function ({ target }) {
    if (target == ingredientModal) {
        // ingredientModal.style.display = 'none';
        ingredientModal.style.opacity = '0';
        ingredientModal.style.visibility = 'hidden';
    }
    if (target == cocktailModal) {
        // cocktailModal.style.display = 'none';
        cocktailModal.style.opacity = '0';
        cocktailModal.style.visibility = 'hidden';
        document.body.classList.remove('_lock');
    }
};
const turnLight = document.querySelector('.header__switch-light');
const turnDark = document.querySelector('.header__switch-dark');
if (localStorage.getItem('dark') === 'true') {
    switchValue.checked = true;
    document.body.classList.add('dark');
    cocktailModalInfo.classList.add('dark');
    ingredientModalInfo.classList.add('dark');
    turnDark.classList.add('dark');
    turnLight.classList.add('dark');
}

function handleChangeCheckbox() {
    if (switchValue.checked === true) {
        document.body.classList.add('dark');
        cocktailModalInfo.classList.add('dark');
        ingredientModalInfo.classList.add('dark');
        turnDark.classList.add('dark');
        turnLight.classList.add('dark');
        localStorage.setItem('dark', 'true');
    } else {
        document.body.classList.remove('dark');
        cocktailModalInfo.classList.remove('dark');
        ingredientModalInfo.classList.remove('dark');
        turnDark.classList.remove('dark');
        turnLight.classList.remove('dark');
        localStorage.setItem('dark', 'false');
    }
}

switchValue.addEventListener('change', handleChangeCheckbox);
alphabetList.addEventListener('click', handleAlphabet);
getRandom(9);
alphabet.forEach(abc => {
    abcList.insertAdjacentHTML('beforeend', `<button class='letter'><span class='letter-button'>${abc}</span></button>`);
});
searchForm.addEventListener('submit', handleSubmit);
searchForm.addEventListener('input', handleInput);
document.body.addEventListener('click', mainFunc);
// selectValue.addEventListener('change', handleSelect);
