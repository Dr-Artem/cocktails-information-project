import { fetchApi } from './js/fetchApi';
import Notiflix, { Loading } from 'notiflix';
import cocktailCardsTemplate from './templates/cocktailCardsTemplate.hbs';
import ingredientCardsTemplate from './templates/ingredientCardsTemplate.hbs';
import modalIngridientInfo from './templates/modalIngridientInfo.hbs';
import modalCocktailInfo from './templates/modalCocktailInfo.hbs';
import paginationBtns from './templates/paginationBtns.hbs';

export default class initMain {
    constructor() {
        this.switchValue = document.querySelector('.header__switch-input');
        this.turnLight = document.querySelector('.header__switch-light');
        this.turnDark = document.querySelector('.header__switch-dark');
        this.burger = document.querySelector('.header__menu-btn');

        this.menuList = document.querySelector('#main-list');
        this.cocktailsList = document.querySelector('#cocktails-list');
        this.ingredientsList = document.querySelector('#ingredients-list');
        this.searchForm = document.querySelector('.header__search-form');
        this.clearFormButton = document.querySelector('.header__search-form-cancel');
        this.alphabetList = document.querySelector('.alphabet-list');
        this.alphabetSelect = document.querySelector('.alphabet-select');
        this.cocktailModal = document.querySelector('.modal-cocktail__backdrop');
        this.cocktailModalInfo = document.querySelector('.modal-cocktail');
        this.ingredientModal = document.querySelector('.modal-ingredient__backdrop');
        this.ingredientModalInfo = document.querySelector('.modal-ingredient');
        this.cardsTitle = document.querySelector('.cards__title');
        this.imageEr = document.querySelector('.error-wrapper__img');
        this.messageEr = document.querySelector('.title-error');
        this.addBtn =
            "Add To <svg class='menu-list__add-icon' viewBox='0 0 36 32'><path fill='#fd5103' style='fill: var(--color1, #fd5103)' d='M26.674 2.56c0.92-0.001 1.83 0.184 2.678 0.545s1.616 0.889 2.261 1.554c1.327 1.365 2.071 3.204 2.071 5.12s-0.744 3.755-2.071 5.12l-13.086 13.427-13.086-13.427c-1.327-1.365-2.071-3.204-2.071-5.12s0.744-3.755 2.071-5.12c0.644-0.665 1.413-1.193 2.261-1.554s1.758-0.546 2.678-0.546c0.92 0 1.83 0.186 2.678 0.546s1.617 0.889 2.261 1.554l3.208 3.328 3.196-3.302c0.642-0.673 1.411-1.208 2.262-1.574s1.766-0.553 2.69-0.551zM26.674 0c-1.256-0.001-2.5 0.252-3.658 0.744s-2.208 1.214-3.087 2.123l-1.402 1.434-1.402-1.434c-0.881-0.907-1.93-1.628-3.088-2.119s-2.401-0.745-3.657-0.745c-1.256 0-2.499 0.253-3.657 0.745s-2.208 1.212-3.088 2.119c-1.791 1.848-2.795 4.335-2.795 6.925s1.004 5.077 2.795 6.925l14.893 15.283 14.893-15.283c1.791-1.848 2.795-4.335 2.795-6.925s-1.004-5.077-2.795-6.925c-0.88-0.908-1.93-1.629-3.088-2.121s-2.401-0.746-3.657-0.746z'></path></svg>";
        this.removeBtn =
            "Remove <svg class='menu-list__add-icon' viewBox='0 0 36 32'><path fill='#fd5103'style='fill: var(--color1, #fd5103)' d='M17.882 32l-2.593-2.302c-9.209-8.144-15.289-13.515-15.289-20.107 0-5.371 4.328-9.591 9.835-9.591 3.112 0 6.098 1.413 8.047 3.645 1.949-2.232 4.936-3.645 8.047-3.645 5.508 0 9.835 4.22 9.835 9.591 0 6.592-6.080 11.963-15.289 20.124l-2.593 2.284z' ></path><path fill='#fd5103' style='fill: var(--color2, #fd5103)' d='M17.882 28.631l-2.099-1.817c-7.455-6.429-12.377-10.67-12.377-15.874 0-4.24 3.503-7.572 7.962-7.572 2.519 0 4.936 1.115 6.514 2.877 1.578-1.762 3.995-2.877 6.514-2.877 4.459 0 7.962 3.332 7.962 7.572 0 5.204-4.922 9.444-12.377 15.888l-2.099 1.803z'></path></svg>";

        this.alphabet = [
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

        this.favouriteCocktails = {
            id: [],
            cocktails: [],
        };
        this.favouriteIngredients = {
            id: [],
            ingredients: [],
        };

        this.drinkParams = {
            inputValue: '',
            identificator: '',
            type: '',
        };

        this.isFormSearchedBefore = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.menuList) {
            this.renderRandom();
            const selectList = this.alphabetSelect.querySelector('.alphabet-select__list');
            this.alphabet.forEach(abc => {
                this.alphabetList.insertAdjacentHTML('beforeend', `<button class='letter-button'><span class='letter'>${abc}</span></button>`);
                selectList.insertAdjacentHTML('beforeend', `<li><button class='letter-button'><span class='letter'>${abc}</span></button></li>`);
            });
            this.alphabetList.addEventListener('click', this.onAlphabetClick.bind(this));
            this.alphabetSelect.addEventListener('click', this.onAlphabetClick.bind(this));
            this.menuList.addEventListener('click', event => this.onListClick(event, 'lookup', 'i='));
        }

        if (localStorage.getItem('favouriteCocktails')) {
            const parsedFavouriteCocktails = JSON.parse(localStorage.getItem('favouriteCocktails'));
            this.favouriteCocktails = parsedFavouriteCocktails;
        }
        if (localStorage.getItem('favouriteIngredients')) {
            const parsedFavouriteIngredients = JSON.parse(localStorage.getItem('favouriteIngredients'));
            this.favouriteIngredients = parsedFavouriteIngredients;
        }

        if (this.cocktailsList) {
            this.getFavouriteCocktails();
            this.cocktailsList.addEventListener('click', event => this.onListClick(event, 'lookup', 'i='));
        }

        if (this.ingredientsList) {
            this.getFavouriteIngredients();
            this.ingredientsList.addEventListener('click', event => this.onListClick(event, 'lookup', 'iid='));
        }

        this.burger.addEventListener('click', this.menuToggle.bind(this));
        this.searchForm.addEventListener('submit', this.onSubmit.bind(this));
        this.searchForm.addEventListener('input', this.handleInput.bind(this));
        this.clearFormButton.addEventListener('click', this.onClearForm.bind(this));
        this.cocktailModal.addEventListener('click', this.closeModals.bind(this));
        this.ingredientModal.addEventListener('click', this.closeModals.bind(this));
    }

    menuToggle(e) {
        const toggleBtn = e?.currentTarget;
        const headerNav = document.querySelector('.header__navigation-wrapper');
        const attr = toggleBtn.getAttribute('data-toggle');
        if (attr === 'false') {
            toggleBtn.setAttribute('data-toggle', 'true');
            headerNav.setAttribute('data-open', 'true');
            document.body.classList.add('_lock');
        } else {
            toggleBtn.setAttribute('data-toggle', 'false');
            headerNav.setAttribute('data-open', 'false');
            document.body.classList.remove('_lock');
        }
    }

    handleShownContent(val, list) {
        if (val) {
            this.cardsTitle.classList.remove('hidden');
            list.classList.remove('hidden');
            this.messageEr.classList.add('hidden');
            this.imageEr.classList.add('hidden');
            return;
        }

        this.cardsTitle.classList.add('hidden');
        list.classList.add('hidden');
        this.messageEr.classList.remove('hidden');
        this.imageEr.classList.remove('hidden');
        Notiflix.Notify.failure('Нажаль такий коктейль або інгредієнт відсутній');
    }

    async renderRandom() {
        const data = await this.fetchData('search', 'f=', 'a');

        this.handleShownContent(true, this.menuList);
        this.renderCards(data.drinks, cocktailCardsTemplate, this.menuList);
    }

    handleInput({ target }) {
        this.drinkParams.inputValue = target.value;
    }

    async filterLocalData(dataKey, formInputValue, propertyList, propertyName, listElement, template) {
        listElement.innerHTML = '';
        const data = JSON.parse(localStorage.getItem(dataKey));
        const filteredData = data[propertyList].filter(item => {
            const itemName = item[propertyName].toLowerCase();
            return itemName.includes(formInputValue.toLowerCase());
        });
        this.renderCards(filteredData, template, listElement);
        this.handleShownContent(filteredData.length > 0, listElement);
    }

    async handleFormAction(formInputValue) {
        const toggleBtn = document.querySelector('.header__menu-btn');
        const headerNav = document.querySelector('.header__navigation-wrapper');
        toggleBtn.setAttribute('data-toggle', 'false');
        headerNav.setAttribute('data-open', 'false');
        document.body.classList.remove('_lock');
        localStorage.setItem('pagination', 1);

        if (window.location.href.includes('/favourite-ingredient')) {
            await this.filterLocalData('favouriteIngredients', formInputValue, 'ingredients', 'strIngredient', this.ingredientsList, ingredientCardsTemplate);
        } else if (window.location.href.includes('/favourite-cocktail')) {
            await this.filterLocalData('favouriteCocktails', formInputValue, 'cocktails', 'strDrink', this.cocktailsList, cocktailCardsTemplate);
        } else {
            const data = await this.fetchData('search', 'f=', formInputValue);
            this.menuList.innerHTML = '';
            this.renderCards(data.drinks, cocktailCardsTemplate, this.menuList);
            this.handleShownContent(data.drinks ? true : false, this.menuList);
        }
    }

    async onSubmit(event) {
        event.preventDefault();
        const formInputValue = this.searchForm.elements['search-input'].value;
        this.isFormSearchedBefore = true;
        await this.handleFormAction(formInputValue);
    }

    async onClearForm() {
        this.searchForm.elements['search-input'].value = '';
        this.drinkParams.inputValue = '';
        if (this.isFormSearchedBefore) {
            await this.handleFormAction('a');
            this.isFormSearchedBefore = false;
        }
    }

    async onAlphabetClick(event) {
        const currentVal = this.alphabetSelect.querySelector('.alphabet-select__current');
        const alphabetListTag = event.currentTarget;
        const letters = alphabetListTag.querySelectorAll('.letter');

        letters.forEach(letter => {
            letter.classList.remove('active');
        });
        event.target.classList.add('active');

        if (currentVal.textContent !== event.target.textContent ?? currentVal.textContent !== 'Select') {
            const inputValue = event.target.textContent;
            const data = await this.fetchData('search', 'f=', inputValue);
            localStorage.setItem('pagination', 1);

            this.handleShownContent(data.drinks ? true : false, this.menuList);
            currentVal.textContent = inputValue;

            this.menuList.innerHTML = '';
            this.renderCards(data.drinks, cocktailCardsTemplate, this.menuList);
        }
    }

    onListClick(event, type, identificator) {
        if (event.target.className === 'menu-list__lookup') {
            this.handleLearnMore(event, type, identificator);
        }
        if (event.target.className === 'menu-list__add') {
            this.handleAddRemove(event);
        }
    }

    async handleLearnMore({ target }, type, identificator) {
        const inputValue = target.id;

        const data = await this.fetchData(type, identificator, inputValue);
        if (identificator === 'i=') {
            this.fetchCocktailInfo(data);
        } else {
            this.fetchIngridientInfo(data);
        }

        document.body.classList.add('_lock');
    }

    async onIngridientClick(event) {
        const identificator = 'i=';
        const type = 'search';
        const inputValue = event.target.id;

        const data = await this.fetchData(type, identificator, inputValue);
        this.fetchIngridientInfo(data);
    }

    renderCards(data, template, list) {
        const previousUrl = !document.referrer ? new URLSearchParams(window.location.search).get('prevURL') : document.referrer;
        const pagination = document.querySelector('.pagination');
        let end = 9;
        let pageNumber = 1;
        let paginatedData;

        const localePagination = localStorage.getItem('pagination');

        if (window.innerWidth < 1280) {
            end = 6;
        }
        if (window.innerWidth < 768) {
            end = 3;
        }

        paginatedData = this.paginationHandler(data, localePagination && previousUrl === window.location.href ? parseInt(localePagination) : pageNumber, end);
        list.insertAdjacentHTML('beforeend', template(paginatedData));

        if (pagination) {
            pagination.innerHTML = '';
        }
        for (let i = 0; i < data?.length; i += end) {
            pagination.insertAdjacentHTML('beforeend', paginationBtns(pageNumber));
            pageNumber += 1;
        }

        const setActivePage = document.querySelector(`[data-page-number="${localePagination && previousUrl === window.location.href ? localePagination : 1}"]`);
        setActivePage?.classList.add('active');

        const favouriteBtns = list.querySelectorAll('.menu-list__add');
        favouriteBtns.forEach(favourite => {
            if (this.favouriteCocktails.id.includes(favourite.id) || this.favouriteIngredients.id.includes(favourite.id)) {
                favourite.innerHTML = this.removeBtn;
            }
        });

        const paginationButtons = pagination?.querySelectorAll('.pagination__btn');
        paginationButtons?.forEach(button => {
            button.addEventListener('click', () => {
                const pageNumber = parseInt(button.dataset.pageNumber);
                paginatedData = this.paginationHandler(data, pageNumber, end);
                list.innerHTML = '';
                list.insertAdjacentHTML('beforeend', template(paginatedData));
                const favouriteBtns = list.querySelectorAll('.menu-list__add');
                favouriteBtns.forEach(favourite => {
                    if (this.favouriteCocktails.id.includes(favourite.id) || this.favouriteIngredients.id.includes(favourite.id)) {
                        favourite.innerHTML = this.removeBtn;
                    }
                });
            });
        });
    }

    paginationHandler(data, pageNumber, end) {
        const paginationButtons = document.querySelectorAll('.pagination__btn');
        let start = 0;

        paginationButtons.forEach(button => {
            button.classList.remove('active');
            const activePage = button.getAttribute('data-page-number');
            if (activePage == pageNumber) {
                button.classList.add('active');
            }
        });

        localStorage.setItem('pagination', pageNumber);
        start = (pageNumber - 1) * end;
        end = start + end;

        return data?.slice(start, end);
    }

    fetchData(type, identificator, inputValue) {
        const data = fetchApi(type, identificator, inputValue);
        return data;
    }

    handleAddRemove(event) {
        const self = this;
        const elementId = event.target.id;
        const elementToggleBtn = event.target;

        if (this.cocktailsList || this.menuList) {
            if (this.favouriteCocktails.id.includes(elementId)) {
                const cocktailIndex = self.favouriteCocktails.id.indexOf(elementId);
                self.favouriteCocktails.id.splice(cocktailIndex, 1);
                self.favouriteCocktails.cocktails.splice(cocktailIndex, 1);
                localStorage.setItem('favouriteCocktails', JSON.stringify(self.favouriteCocktails));
                elementToggleBtn.innerHTML = self.addBtn;
                if (self.cocktailsList) {
                    document.location.reload();
                }
            } else {
                const elementItem = document.getElementById(elementId);
                const elementImage = elementItem.querySelector('.menu-list__image');
                const elementTitle = elementItem.querySelector('.menu-list__name');
                const cardPreferences = {
                    idDrink: elementId,
                    strDrinkThumb: elementImage.src,
                    strDrink: elementTitle.textContent,
                };

                self.favouriteCocktails.id.push(elementId);
                self.favouriteCocktails.cocktails.push(cardPreferences);
                localStorage.setItem('favouriteCocktails', JSON.stringify(self.favouriteCocktails));
                elementToggleBtn.innerHTML = self.removeBtn;
            }
        }

        if (this.ingredientsList) {
            if (this.favouriteIngredients.id.includes(elementId)) {
                const ingredientIndex = self.favouriteIngredients.id.indexOf(elementId);
                self.favouriteIngredients.id.splice(ingredientIndex, 1);
                self.favouriteIngredients.ingredients.splice(ingredientIndex, 1);
                localStorage.setItem('favouriteIngredients', JSON.stringify(self.favouriteIngredients));
                if (self.ingredientsList) {
                    document.location.reload();
                }
            }
        }
    }

    fetchCocktailInfo(data) {
        const self = this;
        this.cocktailModal.setAttribute('data-modal', 'opened');

        let ingredients = {};
        const element = data.drinks[0];
        for (let num = 1; num <= 15; num++) {
            if (element[`strIngredient${num}`] !== null) {
                let words = element[`strIngredient${num}`].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                ingredients[words] = element[`strMeasure${num}`];
            }
        }

        const cocktailInfoObject = {
            id: element.idDrink,
            name: element.strDrink,
            insrtuction: element.strInstructions,
            image: element.strDrinkThumb,
            ingredients,
        };

        this.cocktailModalInfo.innerHTML = modalCocktailInfo(cocktailInfoObject);

        const ingredientsLinks = document.querySelectorAll('.modal-cocktail__ingredient-link');
        ingredientsLinks.forEach(link => {
            link.addEventListener('click', event => this.onIngridientClick(event));
        });

        const addToFavourite = document.querySelector('.modal-cocktail__add-favourite');
        if (this.favouriteCocktails.id.includes(data.drinks[0].idDrink)) {
            addToFavourite.textContent = 'Remove from favourite';
        }
        addToFavourite.onclick = event => {
            let itemId = event.target.id;
            const nodeList = document.querySelectorAll('.menu-list__add');
            const modalToggleBtn = [...nodeList].find(add => add.id === itemId);

            if (self.favouriteCocktails.id.includes(data.drinks[0].idDrink)) {
                let cocktailIndex = self.favouriteCocktails.id.indexOf(itemId);
                self.favouriteCocktails.id.splice(cocktailIndex, 1);
                self.favouriteCocktails.cocktails.splice(cocktailIndex, 1);
                localStorage.setItem('favouriteCocktails', JSON.stringify(self.favouriteCocktails));

                if (self.cocktailsList) {
                    document.location.reload();
                }

                addToFavourite.textContent = 'Add to favourite';
                modalToggleBtn.innerHTML = self.addBtn;
            } else {
                self.favouriteCocktails.id.push(data.drinks[0].idDrink);
                self.favouriteCocktails.cocktails.push(data.drinks[0]);
                localStorage.setItem('favouriteCocktails', JSON.stringify(self.favouriteCocktails));
                addToFavourite.textContent = 'Remove from favourite';
                modalToggleBtn.innerHTML = self.removeBtn;
            }
        };

        const ingredientList = Object.keys(ingredients);
        this.favouriteIngredients.ingredients.forEach(item => {
            if (ingredientList.includes(item.strIngredient)) {
                let ingredientLink = document.getElementById(item.strIngredient);
                ingredientLink.style.color = '#fd5103b8';
            }
        });

        const closeCocktail = document.querySelector('.modal-cocktail__close');
        closeCocktail.addEventListener('click', () => this.closeModals(closeCocktail));
    }

    fetchIngridientInfo(data) {
        const self = this;
        this.ingredientModalInfo.innerHTML = '';
        let ingredientLink = document.getElementById(data.ingredients[0].strIngredient);
        if (!ingredientLink) {
            ingredientLink = document.getElementById(data.ingredients[0].strIngredient[0].toUpperCase() + data.ingredients[0].strIngredient.substring(1));
        }

        if (data.ingredients[0].strDescription !== null) {
            this.ingredientModal.setAttribute('data-modal', 'opened');
            document.body.classList.add('_lock');
            this.ingredientModalInfo.innerHTML = modalIngridientInfo(data.ingredients[0]);

            const addToFavourite = this.ingredientModalInfo.querySelector('.modal-ingredient__add-favourite');
            if (this.favouriteIngredients.id.includes(data.ingredients[0].idIngredient)) {
                addToFavourite.textContent = 'Remove from favourite';
            }
            addToFavourite.onclick = event => {
                let itemId = event.target.id;
                if (self.favouriteIngredients.id.includes(data.ingredients[0].idIngredient)) {
                    let ingredientIndex = self.favouriteIngredients.id.indexOf(itemId);
                    self.favouriteIngredients.id.splice(ingredientIndex, 1);
                    self.favouriteIngredients.ingredients.splice(ingredientIndex, 1);
                    localStorage.setItem('favouriteIngredients', JSON.stringify(self.favouriteIngredients));
                    ingredientLink.style.color = 'inherit';

                    if (self.ingredientsList) {
                        document.location.reload();
                    }
                    addToFavourite.textContent = 'Add to favourite';
                } else {
                    self.favouriteIngredients.id.push(data.ingredients[0].idIngredient);
                    self.favouriteIngredients.ingredients.push(data.ingredients[0]);
                    localStorage.setItem('favouriteIngredients', JSON.stringify(self.favouriteIngredients));
                    addToFavourite.textContent = 'Remove from favourite';
                    ingredientLink.style.color = '#fd5103b8';
                }
            };

            const closeIngredient = this.ingredientModalInfo.querySelector('.modal-ingredient__close');
            closeIngredient.addEventListener('click', () => this.closeModals(closeIngredient));
        } else {
            Notiflix.Notify.warning('No info about this ingredient for now');
        }
    }

    getFavouriteCocktails() {
        const cocktailTitle = document.querySelector('.fav-cocktail__title');
        this.imageEr.classList.add('hidden');
        cocktailTitle.classList.remove('hidden');
        this.messageEr.classList.add('hidden');

        const localFavouriteCocktails = JSON.parse(localStorage.getItem('favouriteCocktails'));
        const listOfFavouriteCocktails = localFavouriteCocktails?.cocktails;
        this.renderCards(listOfFavouriteCocktails, cocktailCardsTemplate, this.cocktailsList);

        if (this.cocktailsList.innerHTML == '') {
            this.imageEr.classList.remove('hidden');
            cocktailTitle.classList.add('hidden');
            this.messageEr.classList.remove('hidden');
        }
    }

    getFavouriteIngredients() {
        const ingredientTitle = document.querySelector('.fav-ingredient__title');
        this.imageEr.classList.add('hidden');
        ingredientTitle.classList.remove('hidden');
        this.messageEr.classList.add('hidden');

        const localFavouriteIngredients = JSON.parse(localStorage.getItem('favouriteIngredients'));
        const listOfFavouriteIngredients = localFavouriteIngredients?.ingredients;
        this.renderCards(listOfFavouriteIngredients, ingredientCardsTemplate, this.ingredientsList);

        if (this.ingredientsList.innerHTML == '') {
            this.imageEr.classList.remove('hidden');
            ingredientTitle.classList.add('hidden');
            this.messageEr.classList.remove('hidden');
        }
    }

    closeModals(element) {
        const modalMap = {
            'modal-cocktail__close': this.cocktailModal,
            'modal-cocktail__backdrop': this.cocktailModal,
            'modal-ingredient__close': this.ingredientModal,
            'modal-ingredient__backdrop': this.ingredientModal,
        };

        let modalElement = modalMap[element instanceof HTMLElement ? element.className : element.target.className];

        if (modalElement) {
            if (modalElement === this.cocktailModal) {
                document.body.classList.remove('_lock');
            }
            modalElement.setAttribute('data-modal', 'closed');
        }
    }
}
