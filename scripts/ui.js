// scripts/ui.js
import {
    loadTransactions,
    saveTransactions,
    generateId,
    loadSettings,
    saveSettings
} from './storage.js';
import { validateTransaction } from './validators.js';
import {
    filterTransactions,
    highlightMatches,
    compileRegex,
    commonPatterns
} from './search.js';

// Global state
let transactions = [];
let settings = {};
let currentSort = { field: 'date', direction: 'desc' };
let currentSearch = '';
let filteredTransactions = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load data
    transactions = loadTransactions();
    settings = loadSettings();

    // Initialize filtered transactions
    filteredTransactions = [...transactions];

    // Initialize UI
    renderTransactions();
    updateDashboard();
    setupEventListeners();
    loadSettingsForm();
    setupSearchExamples();
    loadSearchFromUrl();
}

function setupEventListeners() {
    // Form submission
    const form = document.getElementById('transaction-form');
    form.addEventListener('submit', handleFormSubmit);

    // Search input
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', handleSearch);

    // Settings form
    const settingsForm = document.getElementById('save-settings');
    settingsForm.addEventListener('click', handleSaveSettings);

    // Table sorting (we'll implement this later)
}

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const transaction = {
        description: formData.get('description').trim(),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        date: formData.get('date'),
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Validate
    const validation = validateTransaction(transaction);

    // Clear previous errors
    clearErrors();

    if (validation.isValid) {
        // Add transaction
        transactions.push(transaction);
        saveTransactions(transactions);

        // Update filtered transactions if searching
        if (currentSearch) {
            const searchRegex = compileRegex(currentSearch);
            if (searchRegex && searchRegex.test(transaction.description) ||
                searchRegex.test(transaction.category) ||
                searchRegex.test(transaction.amount.toString()) ||
                searchRegex.test(transaction.date)) {
                filteredTransactions.push(transaction);
            }
        } else {
            filteredTransactions = [...transactions];
        }

        // Update UI
        renderTransactions();
        updateDashboard();

        // Reset form
        event.target.reset();

        // Show success message
        showMessage('Transaction added successfully!', 'success');
    } else {
        // Show errors
        showErrors(validation.errors);
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-msg');
    errorElements.forEach(el => el.textContent = '');
}

function showErrors(errors) {
    Object.entries(errors).forEach(([field, fieldErrors]) => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement && fieldErrors.length > 0) {
            errorElement.textContent = fieldErrors.join(', ');
        }
    });
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        border-radius: 4px;
        z-index: 1000;
        color: ${type === 'success' ? '#155724' : '#721c24'};
    `;

    document.body.appendChild(messageEl);

