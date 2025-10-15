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
        if (data) {
            const transactions = JSON.parse(data);
            console.log(`Loaded ${transactions.length} transactions from localStorage`);
            return transactions;
        }
        console.log('No transactions found in localStorage, returning empty array');
        return [];
    } catch (error) {
        console.error('Error loading transactions:', error);
        return [];
    }
}

// Save transactions to localStorage
export function saveTransactions(transactions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        console.log(`Saved ${transactions.length} transactions to localStorage`);
        return true;
    } catch (error) {
        console.error('Error saving transactions:', error);
        showMessage('Error saving transactions to storage', 'error');
        return false;
    }
}

// Load settings
export function loadSettings() {
    try {
        const settings = localStorage.getItem(SETTINGS_KEY);
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            console.log('Loaded settings from localStorage:', parsedSettings);
            return parsedSettings;
        }
        console.log('No settings found, returning defaults');
        return {
            currencyRate: 1200,
            budgetCap: 0,
            baseCurrency: 'RWF'
        };
    } catch (error) {
        console.error('Error loading settings:', error);
        return { currencyRate: 1200, budgetCap: 0, baseCurrency: 'RWF' };
    }
}

// Save settings
export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        console.log('Settings saved to localStorage:', settings);
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

        console.log(`Imported ${data.transactions.length} transactions successfully`);
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
}

// Helper function to show messages (for storage errors)
function showMessage(message, type) {
    // This would typically be imported from ui.js, but here's a basic version
    console[type === 'error' ? 'error' : 'log'](`Storage: ${message}`);
}