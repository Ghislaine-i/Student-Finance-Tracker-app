// scripts/validators.js

// Regex patterns
export const patterns = {
    description: /^\S(?:.*\S)?$/, // No leading/trailing spaces
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // Positive numbers, optional 2 decimals
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // YYYY-MM-DD
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, // Letters, spaces, hyphens
    duplicateWords: /\b(\w+)\s+\1\b/i // Advanced: duplicate words detection
};

// Validation functions
export function validateDescription(description) {
    const errors = [];

    if (!description || !description.trim()) {
        errors.push('Description is required');
    } else if (!patterns.description.test(description)) {
        errors.push('Description cannot have leading/trailing spaces');
    } else if (patterns.duplicateWords.test(description)) {
        errors.push('Description contains duplicate words');
    }

    return errors;
}

export function validateAmount(amount) {
    const errors = [];

    if (!amount && amount !== 0) {
        errors.push('Amount is required');
    } else if (!patterns.amount.test(amount.toString())) {
        errors.push('Amount must be a positive number with up to 2 decimal places');
    } else if (parseFloat(amount) <= 0) {
        errors.push('Amount must be greater than 0');
    }

    return errors;
}

export function validateCategory(category) {
    const errors = [];

    if (!category) {
        errors.push('Category is required');
    } else if (!patterns.category.test(category)) {
        errors.push('Category can only contain letters, spaces, and hyphens');
    }

    return errors;
}

export function validateDate(date) {
    const errors = [];

    if (!date) {
        errors.push('Date is required');
    } else if (!patterns.date.test(date)) {
        errors.push('Date must be in YYYY-MM-DD format');
    } else {
        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        if (inputDate > today) {
            errors.push('Date cannot be in the future');
        }
    }

    return errors;
}

// Validate entire transaction object
export function validateTransaction(transaction) {
    const errors = {
        description: validateDescription(transaction.description),
        amount: validateAmount(transaction.amount),
        category: validateCategory(transaction.category),
        date: validateDate(transaction.date)
    };

    const isValid = Object.values(errors).every(errorArray => errorArray.length === 0);

    return { isValid, errors };
}