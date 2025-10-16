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
    compileRegex
} from './search.js';

// Global state
let transactions = [];
let settings = {};
let currentSearch = '';
let filteredTransactions = [];
let editingId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Student Finance Tracker Initializing...');
    initializeApp();
});

function initializeApp() {
    // Load data
    transactions = loadTransactions();
    settings = loadSettings();

    // Set default exchange rate if not set
    if (!settings.currencyRate) {
        settings.currencyRate = 1448;
        saveSettings(settings);
    }

    console.log('Loaded transactions:', transactions.length);
    console.log('Settings:', settings);

    // Initialize filtered transactions
    filteredTransactions = [...transactions];

    // Initialize UI
    renderTransactions();
    updateDashboard();
    setupEventListeners();
    loadSettingsForm();
}

function setupEventListeners() {
    // Form submission
    const form = document.getElementById('transaction-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Search input
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Settings form
    const settingsForm = document.getElementById('save-settings');
    if (settingsForm) {
        settingsForm.addEventListener('click', handleSaveSettings);
    }

    // Regex toggle
    const regexToggle = document.getElementById('regex-toggle');
    if (regexToggle) {
        regexToggle.addEventListener('change', handleSearch);
    }

    // Handle window resize for chart
    window.addEventListener('resize', function() {
        renderWeeklyChart();
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    // Get form values
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    console.log('Form submitted:', { description, amount, category, date });

    // Basic validation
    if (!validateForm(description, amount, category, date)) {
        return;
    }

    clearErrors();

    if (editingId) {
        updateExistingTransaction(editingId, description, amount, category, date);
    } else {
        addNewTransaction(description, amount, category, date);
    }
}

function validateForm(description, amount, category, date) {
    let isValid = true;

    if (!description) {
        showError('description', 'Description is required');
        isValid = false;
    }

    if (!amount || amount <= 0 || isNaN(amount)) {
        showError('amount', 'Valid amount greater than 0 is required');
        isValid = false;
    }

    if (!category) {
        showError('category', 'Category is required');
        isValid = false;
    }

    if (!date) {
        showError('date', 'Date is required');
        isValid = false;
    }

    return isValid;
}

function addNewTransaction(description, amount, category, date) {
    const transaction = {
        description: description,
        amount: amount,
        category: category,
        date: date,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    console.log('Adding transaction:', transaction);

    transactions.push(transaction);
    saveTransactions(transactions);
    updateUIAfterChange();
    resetForm();
    showMessage('Transaction added successfully!', 'success');
}

function updateExistingTransaction(id, description, amount, category, date) {
    const transactionIndex = transactions.findIndex(txn => txn.id === id);

    if (transactionIndex !== -1) {
        transactions[transactionIndex] = {
            ...transactions[transactionIndex],
            description: description,
            amount: amount,
            category: category,
            date: date,
            updatedAt: new Date().toISOString()
        };

        console.log('Updating transaction:', transactions[transactionIndex]);

        saveTransactions(transactions);
        updateUIAfterChange();
        resetForm();
        showMessage('Transaction updated successfully!', 'success');
    } else {
        showMessage('Transaction not found!', 'error');
    }
}

function updateUIAfterChange() {
    // Update filtered transactions for search
    if (currentSearch) {
        filteredTransactions = filterTransactions(transactions, currentSearch);
    } else {
        filteredTransactions = [...transactions];
    }

    // Update UI
    renderTransactions();
    updateDashboard();

    // Force chart update
    setTimeout(() => {
        renderWeeklyChart();
    }, 100);
}

function resetForm() {
    const form = document.getElementById('transaction-form');
    const submitBtn = document.getElementById('add-btn');

    form.reset();
    submitBtn.textContent = 'Add Transaction';
    submitBtn.style.background = '#27ae60';
    editingId = null;

    // Focus on description field for better UX
    document.getElementById('description').focus();
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-msg');
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function showError(field, message) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#e74c3c';
    }
}

function showMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#d4edda' :
        type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' :
        type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' :
        type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px;
    `;

    document.body.appendChild(messageEl);

    // Remove after 4 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 4000);
}

function renderTransactions() {
    const tbody = document.getElementById('records-body');
    if (!tbody) {
        console.error('Records table body not found!');
        return;
    }

    tbody.innerHTML = '';

    const transactionsToRender = currentSearch ? filteredTransactions : transactions;
    const exchangeRate = settings.currencyRate || 1448;

    console.log('Rendering transactions:', transactionsToRender.length);

    if (transactionsToRender.length === 0) {
        const noResultsMessage = currentSearch ?
            'No transactions match your search' :
            'No transactions yet. Add your first transaction above!';
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: #666; font-style: italic;">
                    ${noResultsMessage}
                </td>
            </tr>`;
        return;
    }

    // Compile regex for highlighting if searching
    let searchRegex = null;
    if (currentSearch) {
        const useRegex = document.getElementById('regex-toggle')?.checked || false;
        if (useRegex) {
            searchRegex = compileRegex(currentSearch);
        } else {
            // For simple text search, create a case-insensitive regex
            const escapedPattern = currentSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            searchRegex = new RegExp(escapedPattern, 'gi');
        }
    }

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactionsToRender].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    sortedTransactions.forEach(transaction => {
        const row = document.createElement('tr');

        // Apply highlighting
        const description = searchRegex ?
            highlightMatches(transaction.description, searchRegex) :
            escapeHtml(transaction.description);

        const category = searchRegex ?
            highlightMatches(transaction.category, searchRegex) :
            escapeHtml(transaction.category);

        // Calculate USD amount using exchange rate
        const amountUSD = (transaction.amount / exchangeRate).toFixed(2);

        row.innerHTML = `
            <td>${description}</td>
            <td>
                <div style="font-weight: bold;">${formatAmount(transaction.amount)} RWF</div>
                <div style="font-size: 0.8em; color: #666; margin-top: 2px;">
                    ≈ $${amountUSD} USD
                </div>
            </td>
            <td><span class="category-tag">${category}</span></td>
            <td>${formatDate(transaction.date)}</td>
            <td class="actions">
                <button onclick="editTransaction('${transaction.id}')" class="btn-edit" title="Edit transaction">
                    Edit
                </button>
                <button onclick="deleteTransaction('${transaction.id}')" class="btn-delete" title="Delete transaction">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateDashboard() {
    console.log('Updating dashboard...');

    // Update basic stats
    const totalRecordsEl = document.getElementById('total-records');
    const totalAmountEl = document.getElementById('total-amount');
    const topCategoryEl = document.getElementById('top-category');
    const capStatusEl = document.getElementById('cap-status');

    if (!totalRecordsEl || !totalAmountEl || !topCategoryEl || !capStatusEl) {
        console.error('Dashboard elements not found!');
        return;
    }

    // Calculate total amount
    const totalAmountRWF = transactions.reduce((sum, txn) => {
        return sum + parseFloat(txn.amount);
    }, 0);

    // Convert to USD using exchange rate
    const exchangeRate = settings.currencyRate || 1448;
    const totalAmountUSD = (totalAmountRWF / exchangeRate).toFixed(2);

    console.log('Total amounts - RWF:', totalAmountRWF, 'USD:', totalAmountUSD, 'Rate:', exchangeRate);

    totalRecordsEl.textContent = transactions.length;
    totalAmountEl.innerHTML = `
        <div style="font-weight: bold; font-size: 1.1em;">${formatAmount(totalAmountRWF)} RWF</div>
        <div style="font-size: 0.9em; color: #666; margin-top: 4px;">
            ≈ $${formatAmount(totalAmountUSD)} USD
        </div>
    `;

    // Find top category
    const categoryTotals = {};
    transactions.forEach(txn => {
        const amount = parseFloat(txn.amount);
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + amount;
    });

    console.log('Category totals:', categoryTotals);

    const topCategory = Object.keys(categoryTotals).reduce((top, category) => {
        return !top || categoryTotals[category] > categoryTotals[top] ? category : top;
    }, null);

    topCategoryEl.textContent = topCategory || 'N/A';

    // Update cap status
    updateCapStatus(totalAmountRWF);

    // Update chart
    renderWeeklyChart();
}

function updateCapStatus(totalAmountRWF) {
    const capStatusEl = document.getElementById('cap-status');
    if (!capStatusEl) return;

    const budgetCap = settings.budgetCap || 0;
    console.log('Budget cap:', budgetCap, 'Total amount:', totalAmountRWF);

    if (budgetCap > 0) {
        const remaining = budgetCap - totalAmountRWF;
        if (remaining >= 0) {
            capStatusEl.textContent = `Under limit by ${formatAmount(remaining)} RWF`;
            capStatusEl.style.color = '#27ae60';
            capStatusEl.style.fontWeight = '600';
        } else {
            capStatusEl.textContent = `Over limit by ${formatAmount(Math.abs(remaining))} RWF`;
            capStatusEl.style.color = '#e74c3c';
            capStatusEl.style.fontWeight = '600';
        }
    } else {
        capStatusEl.textContent = 'No budget cap set';
        capStatusEl.style.color = '#666';
    }
}

function renderWeeklyChart() {
    const canvas = document.getElementById('weekly-chart');
    if (!canvas) {
        console.log('Chart canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    const weeklyData = getLast7DaysSpending();

    console.log('Weekly data for chart:', weeklyData);

    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = 160;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (weeklyData.total === 0) {
        // Show message if no data
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Add transactions with dates from the last 7 days to see the chart', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Chart dimensions
    const padding = { top: 25, right: 15, bottom: 25, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    const barSpacing = 6;
    const barWidth = (chartWidth / 7) - barSpacing;

    // Find maximum amount for scaling
    const maxAmount = Math.max(...weeklyData.days.map(day => day.amount));
    const scaleFactor = maxAmount > 0 ? (chartHeight / maxAmount) : 1;

    // Draw Y-axis grid lines and labels
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#6c757d';
    ctx.font = '9px Arial';
    ctx.textAlign = 'right';

    // Draw grid lines
    const gridLines = 3;
    for (let i = 0; i <= gridLines; i++) {
        const value = (maxAmount / gridLines) * i;
        const y = padding.top + (chartHeight - (value * scaleFactor));

        // Grid line
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();

        // Label
        if (value > 0) {
            ctx.fillText(formatAmount(value), padding.left - 5, y + 3);
        }
    }

    // Draw bars
    weeklyData.days.forEach((day, index) => {
        const barHeight = day.amount * scaleFactor;
        const x = padding.left + (index * (barWidth + barSpacing));
        const y = padding.top + (chartHeight - barHeight);

        // Check if this is today
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const isToday = day.date === todayString;

        // Bar color
        ctx.fillStyle = isToday ? '#e74c3c' : '#3498db';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw day label
        ctx.fillStyle = '#2c3e50';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(day.day, x + barWidth / 2, canvas.height - 8);

        // Draw amount label (only if amount > 0)
        if (day.amount > 0) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';

            // Position text inside bar if there's space, otherwise above
            if (barHeight > 18) {
                ctx.fillText(formatAmount(day.amount), x + barWidth / 2, y + 12);
            } else if (barHeight > 0) {
                ctx.fillStyle = '#2c3e50';
                ctx.fillText(formatAmount(day.amount), x + barWidth / 2, y - 5);
            }
        }
    });

    // Draw chart title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Last 7 Days Spending', canvas.width / 2, 15);
}

function getLast7DaysSpending() {
    const days = [];
    let total = 0;

    // Generate last 7 days including today
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Calculate total for this day
        const dayAmount = transactions
            .filter(txn => txn.date === dateString)
            .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

        days.push({
            day: dayNames[date.getDay()],
            amount: dayAmount,
            date: dateString,
            fullDate: date.toLocaleDateString()
        });

        total += dayAmount;
    }

    console.log('Weekly spending data:', days);
    return { days, total };
}

function handleSearch(event) {
    const searchInput = document.getElementById('search');
    if (!searchInput) {
        console.error('Search input not found!');
        return;
    }

    const searchTerm = searchInput.value;
    const useRegex = document.getElementById('regex-toggle')?.checked || false;
    currentSearch = searchTerm;

    console.log('Searching:', searchTerm, 'Regex:', useRegex);

    // Filter transactions
    if (searchTerm.trim()) {
        if (useRegex) {
            // Use regex search
            filteredTransactions = filterTransactions(transactions, searchTerm);
            const regex = compileRegex(searchTerm);
            showSearchFeedback(regex, filteredTransactions.length, true);
        } else {
            // Simple text search
            const lowerSearch = searchTerm.toLowerCase();
            filteredTransactions = transactions.filter(transaction => {
                return transaction.description.toLowerCase().includes(lowerSearch) ||
                    transaction.category.toLowerCase().includes(lowerSearch) ||
                    transaction.amount.toString().includes(lowerSearch) ||
                    transaction.date.includes(lowerSearch);
            });
            showSearchFeedback(null, filteredTransactions.length, false);
        }
    } else {
        filteredTransactions = [...transactions];
        clearSearchFeedback();
    }

    console.log(`Search results: ${filteredTransactions.length} transactions found`);

    // Re-render transactions with highlighting
    renderTransactions();
    updateSearchStats();
}

function showSearchFeedback(regex, matchCount, isRegex) {
    const searchInput = document.getElementById('search');
    const feedbackEl = document.getElementById('search-feedback') || createSearchFeedbackElement();

    if (isRegex && !regex) {
        searchInput.style.borderColor = '#e74c3c';
        feedbackEl.textContent = 'Invalid regex pattern';
        feedbackEl.className = 'search-feedback error';
    } else {
        searchInput.style.borderColor = '#27ae60';
        const searchType = isRegex ? 'Regex search' : 'Text search';
        feedbackEl.innerHTML = `
            ${searchType} ✓ 
            <span class="match-count">${matchCount} transaction${matchCount !== 1 ? 's' : ''} matched</span>
        `;
        feedbackEl.className = 'search-feedback success';
    }
}

function clearSearchFeedback() {
    const searchInput = document.getElementById('search');
    const feedbackEl = document.getElementById('search-feedback');

    searchInput.style.borderColor = '';
    if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.className = 'search-feedback';
    }
}

function createSearchFeedbackElement() {
    const feedbackEl = document.createElement('div');
    feedbackEl.id = 'search-feedback';
    feedbackEl.className = 'search-feedback';
    feedbackEl.setAttribute('aria-live', 'polite');

    const searchContainer = document.querySelector('.search-section');
    if (searchContainer) {
        searchContainer.appendChild(feedbackEl);
    }

    return feedbackEl;
}

function updateSearchStats() {
    const stats = document.getElementById('search-stats') || createSearchStatsElement();

    if (currentSearch) {
        const total = transactions.length;
        const matched = filteredTransactions.length;
        stats.textContent = `Showing ${matched} of ${total} transactions`;
        stats.style.display = 'block';
    } else {
        stats.style.display = 'none';
    }
}

function createSearchStatsElement() {
    const statsEl = document.createElement('div');
    statsEl.id = 'search-stats';
    statsEl.className = 'search-stats';

    const searchBar = document.querySelector('.search-section');
    if (searchBar && searchBar.parentNode) {
        searchBar.parentNode.insertBefore(statsEl, searchBar.nextSibling);
    }

    return statsEl;
}

// Settings functionality
function handleSaveSettings() {
    const currencyRate = parseFloat(document.getElementById('currency-rate').value) || 1448;
    const budgetCap = parseFloat(document.getElementById('budget-cap').value) || 0;

    // Validate settings
    if (currencyRate <= 0) {
        showMessage('Exchange rate must be greater than 0', 'error');
        return;
    }

    if (budgetCap < 0) {
        showMessage('Budget cap cannot be negative', 'error');
        return;
    }

    settings.currencyRate = currencyRate;
    settings.budgetCap = budgetCap;

    if (saveSettings(settings)) {
        showMessage('Settings saved successfully!', 'success');
        // Refresh everything to show new currency conversions
        updateDashboard();
        renderTransactions();
    } else {
        showMessage('Error saving settings', 'error');
    }
}

function loadSettingsForm() {
    const currencyRateEl = document.getElementById('currency-rate');
    const budgetCapEl = document.getElementById('budget-cap');

    if (currencyRateEl && budgetCapEl) {
        currencyRateEl.value = settings.currencyRate || 1448;
        budgetCapEl.value = settings.budgetCap || '';

        console.log('Loaded settings form - Rate:', currencyRateEl.value, 'Cap:', budgetCapEl.value);
    }
}

// Utility functions
function formatAmount(amount) {
    return new Intl.NumberFormat().format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global functions for buttons
window.editTransaction = function(id) {
    console.log('Editing transaction:', id);

    const transaction = transactions.find(txn => txn.id === id);
    if (!transaction) {
        showMessage('Transaction not found!', 'error');
        return;
    }

    // Populate form with transaction data
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('category').value = transaction.category;
    document.getElementById('date').value = transaction.date;

    // Change button to "Update"
    const submitBtn = document.getElementById('add-btn');
    submitBtn.textContent = 'Update Transaction';
    submitBtn.style.background = '#f39c12';

    // Store the ID being edited
    editingId = id;

    // Scroll to form
    document.getElementById('add-record').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    // Focus on description field
    document.getElementById('description').focus();

    showMessage('Transaction loaded for editing. Make changes and click "Update Transaction"', 'info');
};

window.deleteTransaction = function(id) {
    const transaction = transactions.find(txn => txn.id === id);
    if (!transaction) {
        showMessage('Transaction not found!', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete "${transaction.description}" - ${formatAmount(transaction.amount)} RWF?`)) {
        transactions = transactions.filter(txn => txn.id !== id);
        filteredTransactions = filteredTransactions.filter(txn => txn.id !== id);
        saveTransactions(transactions);

        renderTransactions();
        updateDashboard();

        showMessage('Transaction deleted successfully!', 'success');
        console.log('Deleted transaction:', id);
    }
};
function renderMobileCards() {
    const cardsContainer = document.getElementById('records-cards');
    if (!cardsContainer) return;

    const transactionsToRender = currentSearch ? filteredTransactions : transactions;
    const exchangeRate = settings.currencyRate || 1448;

    cardsContainer.innerHTML = '';

    if (transactionsToRender.length === 0) {
        const noResultsMessage = currentSearch ?
            'No transactions match your search' :
            'No transactions yet. Add your first transaction above!';
        cardsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666; font-style: italic;">
                ${noResultsMessage}
            </div>`;
        return;
    }

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactionsToRender].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    sortedTransactions.forEach(transaction => {
        const amountUSD = (transaction.amount / exchangeRate).toFixed(2);
        const card = document.createElement('div');
        card.className = 'record-card';
        card.innerHTML = `
            <div class="record-card-header">
                <h3 class="record-card-description">${escapeHtml(transaction.description)}</h3>
                <div class="record-card-amount">
                    ${formatAmount(transaction.amount)} RWF
                    <div class="record-card-usd">≈ $${amountUSD} USD</div>
                </div>
            </div>
            <div class="record-card-details">
                <span class="record-card-category">${escapeHtml(transaction.category)}</span>
                <span class="record-card-date">${formatDate(transaction.date)}</span>
            </div>
            <div class="record-card-actions">
                <button onclick="editTransaction('${transaction.id}')" class="btn-edit">Edit</button>
                <button onclick="deleteTransaction('${transaction.id}')" class="btn-delete">Delete</button>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}