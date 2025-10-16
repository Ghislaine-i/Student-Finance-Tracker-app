// scripts/validators.js

// Validation functions
export function validateDescription(description) {
    const errors = [];

    if (!description || !description.trim()) {
        errors.push('Description is required');
    } else if (description.trim().length < 2) {
        errors.push('Description must be at least 2 characters long');
    }

    return errors;
}

export function validateAmount(amount) {
    const errors = [];

    if (amount === null || amount === undefined || amount === '') {
        errors.push('Amount is required');
    } else {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            errors.push('Amount must be a valid number');
        } else if (numAmount <= 0) {
            errors.push('Amount must be greater than 0');
        } else if (numAmount > 10000000) { // Reasonable upper limit
            errors.push('Amount is too large');
        }
    }

    return errors;
}

export function validateCategory(category) {
    const errors = [];

    if (!category) {
        errors.push('Category is required');
    }

    return errors;
}

export function validateDate(date) {
    const errors = [];

    if (!date) {
        errors.push('Date is required');
    } else {
        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        if (isNaN(inputDate.getTime())) {
            errors.push('Date is invalid');
        } else if (inputDate > today) {
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