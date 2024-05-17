import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import { BookPreview } from './bookPreview.js';  

// Defining the main application object
const app = {
    // Current page number
    page: 1,
    
    // Initialization function to set up the application
    init() {
        this.matches = books.slice();
        this.renderInitialBooks();
        this.renderGenres();
        this.renderAuthors();
        this.setTheme();
        this.addEventListeners();
    },

    // Function to render the initial set of books on page load
    renderInitialBooks() {
        // Rendering first page of books
        this.renderBooks(this.matches.slice(0, BOOKS_PER_PAGE));
        // Updating the "Show more" button state
        this.updateListButton();
    },

    // Function to render a list of books
    renderBooks(books) {
        // Creating a document fragment to hold book elements
        const fragment = document.createDocumentFragment();
        // Looping through each book and creating its HTML element
        for (const book of books) {
            const element = this.createBookElement(book);
            fragment.appendChild(element);
        }
        // Clearing the previous list and appending the new one
        document.querySelector('[data-list-items]').innerHTML = '';
        document.querySelector('[data-list-items]').appendChild(fragment);
    },

    // Function to create HTML element for a single book
    createBookElement(book) {
        // Creating a button element for the book preview
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', book.id);
        // Populating the button with book information
        element.innerHTML = `
            <img class="preview__image" src="${book.image}"/>
            <div class="preview__info">
                <h3 class="preview__title">${book.title}</h3>
                <div class="preview__author">${authors[book.author]}</div>
            </div>
        `;
        return element;
    },

    // Function to render filter options for genres
    renderGenres() {
        // Creating HTML options for each genre
        const genreHtml = this.createOptionsHtml(genres, 'All Genres');
        // Appending the options to the genres filter select element
        document.querySelector('[data-search-genres]').appendChild(genreHtml);
    },

    // Function to render filter options for authors
    renderAuthors() {
        // Creating HTML options for each author
        const authorsHtml = this.createOptionsHtml(authors, 'All Authors');
        // Appending the options to the authors filter select element
        document.querySelector('[data-search-authors]').appendChild(authorsHtml);
    },

    // Function to create HTML options for filter dropdowns
    createOptionsHtml(data, firstOption) {
        // Creating a document fragment to hold option elements
        const fragment = document.createDocumentFragment();
        // Creating the first option element
        const firstOptionElement = document.createElement('option');
        firstOptionElement.value = 'any';
        firstOptionElement.innerText = firstOption;
        fragment.appendChild(firstOptionElement);

        // Looping through each data entry and creating an option element
        for (const [id, name] of Object.entries(data)) {
            const element = document.createElement('option');
            element.value = id;
            element.innerText = name;
            fragment.appendChild(element);
        }
        return fragment;
    },

    // Function to set the theme based on user preference
    setTheme() {
        // Determining the preferred theme (light/dark) based on user's system preference
        const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
        this.applyTheme(preferredTheme);
        // Setting the theme dropdown value to the preferred theme
        document.querySelector('[data-settings-theme]').value = preferredTheme;
    },

    // Function to apply the chosen theme
    applyTheme(theme) {
        // Setting CSS variables based on the chosen theme
        const darkColor = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
        const lightColor = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
        document.documentElement.style.setProperty('--color-dark', darkColor);
        document.documentElement.style.setProperty('--color-light', lightColor);
    },

    // Function to add event listeners to UI elements
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

    // Function to open search overlay
    openSearchOverlay() {
        document.querySelector('[data-search-overlay]').open = true;
        document.querySelector('[data-search-title]').focus();
    },

    // Function to close search overlay
    closeSearchOverlay() {
        document.querySelector('[data-search-overlay]').open = false;
    },

    // Function to open settings overlay
    openSettingsOverlay() {
        document.querySelector('[data-settings-overlay]').open = true;
    },

    // Function to close settings overlay
    closeSettingsOverlay() {
        document.querySelector('[data-settings-overlay]').open = false;
    },

    // Function to handle theme change
    handleThemeChange(event) {
        this.handleFormSubmit(event, formData => {
            const { theme } = formData;
            this.applyTheme(theme);
            this.closeSettingsOverlay();
        });
    },

    // Function to handle search form submission
    handleSearch(event) {
        this.handleFormSubmit(event, filters => {
            // Filtering books based on search criteria
            this.filterBooks(filters);
            // Resetting page number to 1
            this.page = 1;
            // Updating "Show more" button state
            this.updateListButton();
            // Closing search overlay
            this.closeSearchOverlay();
        });
    },

    // Function to handle form submission
    handleFormSubmit(event, callback) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData);
        callback(formValues);
    },

    // Function to filter books based on search criteria
    filterBooks(filters) {
        // Filtering books based on title, author, and genre
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
        // Rendering filtered books
        this.renderBooks(this.matches.slice(0, BOOKS_PER_PAGE));
    },

    // Function to load more books
    loadMoreBooks() {
        // Calculating start and end index for the next page
        const start = this.page * BOOKS_PER_PAGE;
        const end = start + BOOKS_PER_PAGE;
        // Selecting books for the next page
        const booksToRender = this.matches.slice(start, end);
        // Rendering the next page of books
        this.renderBooks(booksToRender);
        // Incrementing page number
        this.page += 1;
        // Updating "Show more" button state
        this.updateListButton();
    },

    // Function to update "Show more" button text and state
    updateListButton() {
        // Calculating remaining books
        const remaining = Math.max(this.matches.length - (this.page * BOOKS_PER_PAGE), 0);
        // Updating button text with remaining books count
        const buttonText = `Show more (${remaining})`;
        document.querySelector('[data-list-button]').innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${remaining})</span>
        `;
        // Disabling button if no more books to show
        document.querySelector('[data-list-button]').disabled = remaining === 0;
    },

    // Function to handle book click event
    handleBookClick(event) {
        // Finding the clicked book and displaying its details
        const targetButton = event.target.closest('button.preview');
        if (targetButton) {
            const bookId = targetButton.getAttribute('data-preview');
            const activeBook = books.find(book => book.id === bookId);
            if (activeBook) {
                this.showBookDetails(activeBook);
            }
        }
    },

    // Function to show book details overlay
    showBookDetails(book) {
        const overlay = document.querySelector('[data-list-active]');
        overlay.open = true;
        // Populating book details in the overlay
        document.querySelector('[data-list-blur]').src = book.image;
        document.querySelector('[data-list-image]').src = book.image;
        document.querySelector('[data-list-title]').innerText = book.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = book.description;
    
        // Adding event listener to close button
        const closeButton = document.querySelector('[data-list-close]');
        closeButton.addEventListener('click', function() {
            overlay.open = false; 
        });
    }
};

// Initializing the application
app.init();