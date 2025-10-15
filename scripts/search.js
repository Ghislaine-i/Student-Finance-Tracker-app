// scripts/search.js

// Safe regex compiler with error handling
export function compileRegex(input, flags = 'i') {
    if (!input) return null;

    try {
        // Remove forward slashes if user entered regex literal
        let pattern = input;
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            pattern = pattern.slice(1, -1);
        }

        return new RegExp(pattern, flags);
    } catch (error) {
        console.warn('Invalid regex pattern:', error);
        return null;
    }
}

// Highlight matches in text
export function highlightMatches(text, regex) {
    if (!regex || !text) return escapeHtml(text);

    try {
        return text.replace(regex, match => `<mark>${escapeHtml(match)}</mark>`);
    } catch (error) {
        console.warn('Error highlighting matches:', error);
        return escapeHtml(text);
    }
}

// Filter transactions based on regex search
export function filterTransactions(transactions, searchPattern) {
    if (!searchPattern) return transactions;

    const regex = compileRegex(searchPattern);
    if (!regex) return transactions; // Return all if invalid regex

    return transactions.filter(transaction => {
        // Search in multiple fields
        return regex.test(transaction.description) ||
            regex.test(transaction.category) ||
            regex.test(transaction.amount.toString()) ||
            regex.test(transaction.date);
    });
}

// Common regex patterns for finance tracking
export const commonPatterns = {
    // Find transactions with cents
    hasCents: /\.\d{2}\b/,

    // Food-related transactions
    food: /(coffee|tea|lunch|dinner|food|cafe|restaurant)/i,

    // Large amounts (over 1000)
    largeAmounts: /\b([1-9]\d{3,}(\.\d{2})?)\b/,

    // Duplicate words in description
    duplicateWords: /\b(\w+)\s+\1\b/i,

    // Specific categories
    categoryFood: /\b(food|coffee|restaurant)\b/i,
    categoryBooks: /\b(books|textbook|stationery)\b/i,
    categoryTransport: /\b(transport|bus|fuel|uber)\b/i,

    // Amount ranges
    smallAmounts: /\b(\d{1,2}(\.\d{2})?)\b/, // Less than 100
    mediumAmounts: /\b([1-9]\d{2}(\.\d{2})?)\b/, // 100-999
};

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
}
}