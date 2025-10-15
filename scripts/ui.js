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
let currentSort = { field: 'date', direction: 'desc' };
let currentSearch = '';
let filteredTransactions = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    initializeApp();
});

function initializeApp() {
    // Load data
    transactions = loadTransactions();
    settings = loadSettings();
    console.log('Loaded transactions:', transactions.length);

    // Initialize filtered transactions
    filteredTransactions = [...transactions];

    // Initialize UI
    renderTransactions();
    updateDashboard();
    setupEventListeners();
    loadSettingsForm();

    console.log('App initialized successfully');
}

function setupEventListeners() {
    // Form submission
    const form = document.getElementById('transaction-form');
    console.log('Form element found:', !!form);

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
}

function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Form submitted!');

    // Get form values
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    console.log('Form values:', { description, amount, category, date });

    // Basic validation
    if (!description) {
        showError('description', 'Description is required');
        return;
    }

    if (!amount || amount <= 0) {
        showError('amount', 'Amount must be greater than 0');
        return;
    }

    if (!category) {
        showError('category', 'Category is required');
        return;
    }

    if (!date) {
        showError('date', 'Date is required');
        return;
    }

    // Clear any previous errors
    clearErrors();

    // Create transaction object
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

    // Add to transactions array
    transactions.push(transaction);

    // Save to localStorage
    const saveResult = saveTransactions(transactions);
    console.log('Save result:', saveResult);

    // Update filtered transactions for search
    if (currentSearch) {
        filteredTransactions = filterTransactions(transactions, currentSearch);
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

    console.log('Transaction added successfully. Total transactions:', transactions.length);
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
        padding: 1rem;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        border-radius: 4px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    document.body.appendChild(messageEl);

    // Remove after 3 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 3000);
}

function renderTransactions() {
    const tbody = document.getElementById('records-body');
    if (!tbody) {
        console.error('Records table body not found!');
        return;
    }

    tbody.innerHTML = '';

    const transactionsToRender = currentSearch ? filteredTransactions : transactions;
    console.log('Rendering transactions:', transactionsToRender.length);

    if (transactionsToRender.length === 0) {
        const noResultsMessage = currentSearch ?
            'No transactions match your search' :
            'No transactions yet. Add your first transaction above!';
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #666;">${noResultsMessage}</td></tr>`;
        return;
    }

    const searchRegex = compileRegex(currentSearch);

    transactionsToRender.forEach(transaction => {
        const row = document.createElement('tr');

        // Highlight matches if searching
        const description = currentSearch && searchRegex ?
            highlightMatches(transaction.description, searchRegex) :
            escapeHtml(transaction.description);

        const category = currentSearch && searchRegex ?
            highlightMatches(transaction.category, searchRegex) :
            escapeHtml(transaction.category);

        row.innerHTML = `
            <td>${description}</td>
            <td>${formatAmount(transaction.amount)} RWF</td>
            <td><span class="category-tag">${category}</span></td>
            <td>${formatDate(transaction.date)}</td>
            <td class="actions">
                <button onclick="editTransaction('${transaction.id}')" class="btn-edit" title="Edit transaction">Edit</button>
                <button onclick="deleteTransaction('${transaction.id}')" class="btn-delete" title="Delete transaction">Delete</button>
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

    totalRecordsEl.textContent = transactions.length;

    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    totalAmountEl.textContent = `${formatAmount(totalAmount)} RWF`;

    // Find top category
    const categoryTotals = {};
    transactions.forEach(txn => {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
    });

    const topCategory = Object.keys(categoryTotals).reduce((top, category) => {
        return !top || categoryTotals[category] > categoryTotals[top] ? category : top;
    }, null);

    topCategoryEl.textContent = topCategory || 'N/A';

    // Update cap status
    updateCapStatus(totalAmount);

    // Update chart
    renderWeeklyChart();
}

function updateCapStatus(totalAmount) {
    const capStatusEl = document.getElementById('cap-status');
    if (!capStatusEl) return;

    const budgetCap = settings.budgetCap || 0;

    if (budgetCap > 0) {
        const remaining = budgetCap - totalAmount;
        if (remaining >= 0) {
            capStatusEl.textContent = `Under limit by ${formatAmount(remaining)} RWF`;
            capStatusEl.style.color = '#27ae60';
        } else {
            capStatusEl.textContent = `Over limit by ${formatAmount(Math.abs(remaining))} RWF`;
            capStatusEl.style.color = '#e74c3c';
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

    // Set canvas size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (weeklyData.total === 0) {
        // Show message if no data
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No transactions in the past 7 days', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    const barWidth = (chartWidth / 7) - 5;

    // Find maximum amount for scaling
    const maxAmount = Math.max(...weeklyData.days.map(day => day.amount));
    const scaleFactor = maxAmount > 0 ? (chartHeight / maxAmount) : 1;

    // Draw bars
    weeklyData.days.forEach((day, index) => {
        const barHeight = day.amount * scaleFactor;
        const x = padding + (index * (barWidth + 5));
        const y = padding + (chartHeight - barHeight);

        // Draw bar with different color for current day
        const isToday = index === 6;
        ctx.fillStyle = isToday ? '#e74c3c' : '#3498db';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw day label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(day.day, x + barWidth / 2, canvas.height - 10);

        // Draw amount label
        if (day.amount > 0) {
            ctx.fillStyle = '#2c3e50';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(formatAmount(day.amount), x + barWidth / 2, y - 5);
        }
    });

    // Draw chart title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Weekly Spending Trend', canvas.width / 2, 20);
}

function getLast7DaysSpending() {
    const days = [];
    let total = 0;

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const dayAmount = transactions
            .filter(txn => txn.date === dateString)
            .reduce((sum, txn) => sum + txn.amount, 0);

        days.push({
            day: dayNames[date.getDay()],
            amount: dayAmount,
            date: dateString
        });

        total += dayAmount;
    }

    return { days, total };
}

// Search functionality
function handleSearch(event) {
    const searchInput = event.target.value;
    currentSearch = searchInput;

    console.log('Searching:', searchInput);

    // Filter transactions
    if (searchInput.trim()) {
        filteredTransactions = filterTransactions(transactions, searchInput);
    } else {
        filteredTransactions = [...transactions];
    }

    // Re-render transactions
    renderTransactions();
}

// Settings functionality
function handleSaveSettings() {
    const currencyRate = parseFloat(document.getElementById('currency-rate').value) || 1200;
    const budgetCap = parseFloat(document.getElementById('budget-cap').value) || 0;

    settings.currencyRate = currencyRate;
    settings.budgetCap = budgetCap;

    if (saveSettings(settings)) {
        showMessage('Settings saved successfully!', 'success');
        updateDashboard();
    } else {
        showMessage('Error saving settings', 'error');
    }
}

function loadSettingsForm() {
    const currencyRateEl = document.getElementById('currency-rate');
    const budgetCapEl = document.getElementById('budget-cap');

    if (currencyRateEl && budgetCapEl) {
        currencyRateEl.value = settings.currencyRate || 1200;
        budgetCapEl.value = settings.budgetCap || '';
    }
}

// Utility functions
function formatAmount(amount) {
    return new Intl.NumberFormat().format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global functions for buttons
window.editTransaction = function(id) {
    console.log('Edit transaction:', id);
    showMessage('Edit functionality coming soon!', 'info');
};

window.deleteTransaction = function(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(txn => txn.id !== id);
        filteredTransactions = filteredTransactions.filter(txn => txn.id !== id);
        saveTransactions(transactions);
        renderTransactions();
        updateDashboard();
        showMessage('Transaction deleted successfully!', 'success');
    }
};

// Make app responsive to window resize
window.addEventListener('resize', function() {
    renderWeeklyChart();
});