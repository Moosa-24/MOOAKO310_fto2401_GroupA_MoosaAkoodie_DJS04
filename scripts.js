import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

const app = {
    page: 1,
    matches: [],
    
    init() {
        this.renderInitialBooks();
        this.renderGenres();
        this.renderAuthors();
        this.setTheme();
        this.addEventListeners();
    },

    renderInitialBooks() {
        this.matches = books.slice(0, BOOKS_PER_PAGE);
        this.renderBooks(this.matches);
        this.updateListButton();
    },

    renderBooks(books) {
        const fragment = document.createDocumentFragment();
        for (const book of books) {
            const element = this.createBookElement(book);
            fragment.appendChild(element);
        }
        document.querySelector('[data-list-items]').innerHTML = '';
        document.querySelector('[data-list-items]').appendChild(fragment);
    },

    createBookElement(book) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', book.id);
        element.innerHTML = `
            <img class="preview__image" src="${book.image}"/>
            <div class="preview__info">
                <h3 class="preview__title">${book.title}</h3>
                <div class="preview__author">${authors[book.author]}</div>
            </div>
        `;
        return element;
    },

    renderGenres() {
        const genreHtml = this.createOptionsHtml(genres, 'All Genres');
        document.querySelector('[data-search-genres]').appendChild(genreHtml);
    },

    renderAuthors() {
        const authorsHtml = this.createOptionsHtml(authors, 'All Authors');
        document.querySelector('[data-search-authors]').appendChild(authorsHtml);
    },

    createOptionsHtml(data, firstOption) {
        const fragment = document.createDocumentFragment();
        const firstOptionElement = document.createElement('option');
        firstOptionElement.value = 'any';
        firstOptionElement.innerText = firstOption;
        fragment.appendChild(firstOptionElement);

        for (const [id, name] of Object.entries(data)) {
            const element = document.createElement('option');
            element.value = id;
            element.innerText = name;
            fragment.appendChild(element);
        }
        return fragment;
    },

    setTheme() {
        const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
        this.applyTheme(preferredTheme);
        document.querySelector('[data-settings-theme]').value = preferredTheme;
    },

    applyTheme(theme) {
        const darkColor = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
        const lightColor = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
        document.documentElement.style.setProperty('--color-dark', darkColor);
        document.documentElement.style.setProperty('--color-light', lightColor);
    },

    addEventListeners() {
        document.querySelector('[data-header-search]').addEventListener('click', () => this.openSearchOverlay());
        document.querySelector('[data-header-settings]').addEventListener('click', () => this.openSettingsOverlay());
        document.querySelector('[data-search-cancel]').addEventListener('click', () => this.closeSearchOverlay());
        document.querySelector('[data-settings-cancel]').addEventListener('click', () => this.closeSettingsOverlay());
        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => this.handleThemeChange(event));
        document.querySelector('[data-search-form]').addEventListener('submit', (event) => this.handleSearch(event));
        document.querySelector('[data-list-button]').addEventListener('click', () => this.loadMoreBooks());
        document.querySelector('[data-list-items]').addEventListener('click', (event) => this.handleBookClick(event));
    },

    openSearchOverlay() {
        document.querySelector('[data-search-overlay]').open = true;
        document.querySelector('[data-search-title]').focus();
    },

    closeSearchOverlay() {
        document.querySelector('[data-search-overlay]').open = false;
    },

    openSettingsOverlay() {
        document.querySelector('[data-settings-overlay]').open = true;
    },

    closeSettingsOverlay() {
        document.querySelector('[data-settings-overlay]').open = false;
    },

    handleThemeChange(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
        this.applyTheme(theme);
        this.closeSettingsOverlay();
    },

    handleSearch(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        this.filterBooks(filters);
        this.page = 1;
        this.updateListButton();
        this.closeSearchOverlay();
    },

    filterBooks(filters) {
        this.matches = books.filter(book => {
            let genreMatch = filters.genre === 'any';
            for (const singleGenre of book.genres) {
                if (genreMatch) break;
                if (singleGenre === filters.genre) { genreMatch = true; }
            }
            return (
                (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                (filters.author === 'any' || book.author === filters.author) &&
                genreMatch
            );
        });
        this.renderBooks(this.matches.slice(0, BOOKS_PER_PAGE));
    },

    loadMoreBooks() {
        const startIndex = this.page * BOOKS_PER_PAGE;
        const endIndex = (this.page + 1) * BOOKS_PER_PAGE;
        const newBooks = this.matches.slice(startIndex, endIndex);
        this.renderBooks(newBooks);
        this.page++;
        this.updateListButton();
    },

    updateListButton() {
        const remaining = Math.max(this.matches.length - (this.page * BOOKS_PER_PAGE), 0);
        const buttonText = `Show more (${remaining})`;
        document.querySelector('[data-list-button]').innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${remaining})</span>
        `;
        document.querySelector('[data-list-button]').disabled = remaining === 0;
    },

    handleBookClick(event) {
        const targetButton = event.target.closest('button.preview');
        if (targetButton) {
            const bookId = targetButton.getAttribute('data-preview');
            const activeBook = books.find(book => book.id === bookId);
            if (activeBook) {
                this.showBookDetails(activeBook);
            }
        }
    },

    showBookDetails(book) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = book.image;
        document.querySelector('[data-list-image]').src = book.image;
        document.querySelector('[data-list-title]').innerText = book.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = book.description;
    }
};

app.init();
