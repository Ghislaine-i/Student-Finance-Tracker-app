// scripts/storage.js

const STORAGE_KEY = 'student-finance-tracker';
const SETTINGS_KEY = 'finance-settings';

// Generate unique ID
export function generateId() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Load transactions from localStorage
export function loadTransactions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading transactions:', error);
        return [];
    }
}

// Save transactions to localStorage
export function saveTransactions(transactions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        return true;
    } catch (error) {
        console.error('Error saving transactions:', error);
        return false;
    }
}

// Load settings
export function loadSettings() {
    try {
        const settings = localStorage.getItem(SETTINGS_KEY);
        return settings ? JSON.parse(settings) : {
            currencyRate: 1200, // 1 USD = 1200 RWF
            budgetCap: 100000, // Monthly cap
            baseCurrency: 'RWF'
        };
    } catch (error) {
        console.error('Error loading settings:', error);
        return { currencyRate: 1200, budgetCap: 100000, baseCurrency: 'RWF' };
    }
}

// Save settings
export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Export data as JSON
export function exportData() {
    const transactions = loadTransactions();
    const settings = loadSettings();
    return JSON.stringify({ transactions, settings }, null, 2);
}

// Import data from JSON
export function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        // Validate structure
        if (!data.transactions || !Array.isArray(data.transactions)) {
            throw new Error('Invalid data format: transactions array missing');
        }

        // Basic validation for each transaction
        data.transactions.forEach(txn => {
            if (!txn.id || !txn.description || !txn.amount || !txn.category || !txn.date) {
                throw new Error('Invalid transaction data structure');
            }
        });

        // Save imported data
        saveTransactions(data.transactions);
        if (data.settings) {
            saveSettings(data.settings);
        }

        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
}