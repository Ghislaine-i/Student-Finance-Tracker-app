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