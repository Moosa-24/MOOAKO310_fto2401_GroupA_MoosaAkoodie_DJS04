import { authors } from "../data.js";

// Define the custom element for BookPreview
class BookPreview extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM tree to the custom element
        this.attachShadow({ mode: 'open' });
        
        // Create a template element to define the structure and content of the shadow DOM
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* Styles for the book preview component */
                .book-preview {
                    border: 1px solid #ddd;
                    padding: 16px;
                    border-radius: 8px;
                    max-width: 300px;
                    font-family: Arial, sans-serif;
                }
                .book-title {
                    font-size: 1.5em;
                    margin-bottom: 8px;
                }
                .book-author {
                    color: #555;
                    margin-bottom: 12px;
                }
                .book-description {
                    font-size: 1em;
                    color: #333;
                }
            </style>
            <div class="book-preview">
                <div class="book-title"></div>
                <div class="book-author"></div>
                <div class="book-description"></div>
            </div>
        `;
        
        // Append the cloned content of the template to the shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Lifecycle method called when the element is inserted into the DOM
    connectedCallback() {
        // Fetch book data when the element is connected to the DOM
        this.fetchBookData();
    }

    // Method to fetch book data based on the book-id attribute
    async fetchBookData() {
        // Get the book ID from the element's attributes
        const bookId = this.getAttribute('book-id');
        
        // Make a fetch request to retrieve book data from the server
        const response = await fetch(`/api/books/${bookId}`);
        
        // Parse the JSON response to get the book data
        const data = await response.json();
        
        // Render the book data in the component
        this.render(data);
    }

    // Method to render the book data in the shadow DOM
    render(data) {
        // Update the content of the shadow DOM elements with the fetched data
        this.shadowRoot.querySelector('.book-title').textContent = data.title;
        this.shadowRoot.querySelector('.book-author').textContent = `by ${data.author}`;
        this.shadowRoot.querySelector('.book-description').textContent = data.description;
    }
}

// Define the custom element with the tag name 'book-preview'
customElements.define('book-preview', BookPreview);
