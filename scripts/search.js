// scripts/search.js

// Safe regex compiler with error handling
export function compileRegex(input, flags = 'i') {
    if (!input || input.trim() === '') {
        return null;
    }

    try {
        // Remove forward slashes if user entered regex literal
        let pattern = input.trim();
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            pattern = pattern.slice(1, -1);

            // Extract flags from regex literal if present
            const lastSlash = input.lastIndexOf('/');
            if (lastSlash > 0) {
                const extractedFlags = input.slice(lastSlash + 1);
                if (extractedFlags) {
                    flags = extractedFlags;
                }
            }
        }

        // Validate that pattern is not empty after trimming slashes
        if (!pattern) {
            return null;
        }

        return new RegExp(pattern, flags);
    } catch (error) {
        console.warn('Invalid regex pattern:', error.message);
        return null;
    }
}

// Highlight matches in text
export function highlightMatches(text, regex) {
    if (!regex || !text) {
        return escapeHtml(text);
    }

    try {
        // Use a function to handle the replacement
        return text.replace(regex, (match) => {
            return `<mark>${escapeHtml(match)}</mark>`;
        });
    } catch (error) {
        console.warn('Error highlighting matches:', error);
        return escapeHtml(text);
    }
}

// Filter transactions based on regex search
export function filterTransactions(transactions, searchPattern) {
    if (!searchPattern || !searchPattern.trim()) {
        return transactions;
    }

    const regex = compileRegex(searchPattern);
    if (!regex) {
        console.log('Invalid regex pattern, returning all transactions');
        return transactions;
    }

    console.log(`Filtering transactions with regex:`, regex);

    const filtered = transactions.filter(transaction => {
        // Search in multiple fields
        return regex.test(transaction.description) ||
            regex.test(transaction.category) ||
            regex.test(transaction.amount.toString()) ||
            regex.test(transaction.date) ||
            regex.test(transaction.id);
    });

    console.log(`Found ${filtered.length} matching transactions`);
    return filtered;
}

// Advanced search with field-specific filtering
export function advancedSearch(transactions, searchConfig) {
    const { pattern, field = 'all', useRegex = false } = searchConfig;

    if (!pattern || !pattern.trim()) {
        return transactions;
    }

    let regex = null;
    if (useRegex) {
        regex = compileRegex(pattern);
        if (!regex) {
            return transactions; // Return all if invalid regex
        }
    } else {
        // Simple text search - escape special regex characters
        const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(escapedPattern, 'i');
    }

    return transactions.filter(transaction => {
        switch (field) {
            case 'description':
                return regex.test(transaction.description);
            case 'category':
                return regex.test(transaction.category);
            case 'amount':
                return regex.test(transaction.amount.toString());
            case 'date':
                return regex.test(transaction.date);
            case 'all':
            default:
                return regex.test(transaction.description) ||
                    regex.test(transaction.category) ||
                    regex.test(transaction.amount.toString()) ||
                    regex.test(transaction.date);
        }
    });
}

// Common regex patterns for finance tracking
export const commonPatterns = {
    // Find transactions with cents
    hasCents: /\.\d{2}\b/,

    // Food-related transactions
    food: /(coffee|tea|lunch|dinner|food|cafe|restaurant|snack)/i,

    // Large amounts (over 1000)
    largeAmounts: /\b([1-9]\d{3,}(\.\d{2})?)\b/,

    // Duplicate words in description
    duplicateWords: /\b(\w+)\s+\1\b/i,

    // Specific categories
    categoryFood: /\b(food|coffee|restaurant|cafe)\b/i,
    categoryBooks: /\b(books|textbook|stationery|library)\b/i,
    categoryTransport: /\b(transport|bus|fuel|uber|taxi|train)\b/i,
    categoryEntertainment: /\b(entertainment|movie|game|concert)\b/i,

    // Amount ranges
    smallAmounts: /\b(\d{1,2}(\.\d{2})?)\b/, // Less than 100
    mediumAmounts: /\b([1-9]\d{2}(\.\d{2})?)\b/, // 100-999

    // Date patterns
    thisMonth: new RegExp(`^${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`),
    thisYear: new RegExp(`^${new Date().getFullYear()}`),

    // Description patterns
    startsWithThe: /^the\s+/i,
    containsDigits: /\d+/,
};

// Get pattern description for UI
export function getPatternDescription(patternName) {
    const descriptions = {
        hasCents: 'Find transactions with cents (e.g., 12.50)',
        food: 'Find food-related transactions',
        largeAmounts: 'Find large amounts (≥1000 RWF)',
        duplicateWords: 'Find descriptions with duplicate words',
        categoryFood: 'Find transactions in Food category',
        categoryBooks: 'Find transactions in Books category',
        categoryTransport: 'Find transactions in Transport category',
        smallAmounts: 'Find small amounts (<100 RWF)',
        mediumAmounts: 'Find medium amounts (100-999 RWF)',
        thisMonth: 'Find transactions from this month',
        thisYear: 'Find transactions from this year',
        startsWithThe: 'Find descriptions starting with "The"',
        containsDigits: 'Find descriptions containing numbers'
    };

    return descriptions[patternName] || 'Custom pattern';
}

// Validate if a string is a valid regex pattern
export function isValidRegex(pattern) {
    if (!pattern || pattern.trim() === '') {
        return { isValid: false, error: 'Pattern cannot be empty' };
    }

    try {
        // Test compilation
        compileRegex(pattern);
        return { isValid: true, error: null };
    } catch (error) {
        return { isValid: false, error: error.message };
    }
}

// Search suggestions based on input
export function getSearchSuggestions(input) {
    if (!input || input.length < 2) {
        return [];
    }

    const suggestions = [];

    // Common category suggestions
    const categories = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
    categories.forEach(category => {
        if (category.toLowerCase().includes(input.toLowerCase())) {
            suggestions.push({
                type: 'category',
                display: `Category: ${category}`,
                value: category
            });
        }
    });

    // Common pattern suggestions
    Object.entries(commonPatterns).forEach(([name, pattern]) => {
        if (name.toLowerCase().includes(input.toLowerCase())) {
            suggestions.push({
                type: 'pattern',
                display: `Pattern: ${getPatternDescription(name)}`,
                value: pattern.toString()
            });
        }
    });

    // Common amount suggestions
    if (/^\d+$/.test(input)) {
        suggestions.push({
            type: 'amount',
            display: `Amount: ${input} RWF`,
            value: input
        });
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (text == null) {
        return '';
    }

    const div = document.createElement('div');
    div.textContent = text.toString();
    return div.innerHTML;
}

// Export utility functions for testing
export const TestUtils = {
    escapeHtml,
    compileRegex,
    isValidRegex
};