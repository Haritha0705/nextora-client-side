export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
}

export interface ValidationErrors {
    [key: string]: string;
}

export const validators = {
    email: (value: string): string | null => {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        if (value.length > 100) return 'Email must be less than 100 characters';
        return null;
    },

    password: (value: string): string | null => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (value.length > 100) return 'Password must be less than 100 characters';
        return null;
    },

    confirmPassword: (value: string, password: string): string | null => {
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return null;
    },

    required: (value: any, fieldName: string): string | null => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return `${fieldName} is required`;
        }
        return null;
    },

    maxLength: (value: string, max: number, fieldName: string): string | null => {
        if (value && value.length > max) {
            return `${fieldName} must be less than ${max} characters`;
        }
        return null;
    },

    phone: (value: string): string | null => {
        if (!value) return null; // Optional field
        if (value.length > 15) return 'Phone number must be less than 15 characters';
        const phoneRegex = /^[+]?[\d\s-()]+$/;
        if (!phoneRegex.test(value)) return 'Invalid phone number format';
        return null;
    },

    dateInPast: (value: string): string | null => {
        if (!value) return null;
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date >= today) return 'Date must be in the past';
        return null;
    },

    dateNotFuture: (value: string): string | null => {
        if (!value) return null;
        const date = new Date(value);
        const today = new Date();
        if (date > today) return 'Date cannot be in the future';
        return null;
    }
};

export function validateField(value: any, rules: ValidationRule): string | null {
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return 'This field is required';
    }

    if (value && typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
            return `Must be at least ${rules.minLength} characters`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            return `Must be less than ${rules.maxLength} characters`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            return 'Invalid format';
        }
    }

    if (rules.custom) {
        return rules.custom(value);
    }

    return null;
}

export function validateForm(data: any, schema: { [key: string]: ValidationRule }): ValidationErrors {
    const errors: ValidationErrors = {};

    Object.keys(schema).forEach(key => {
        const error = validateField(data[key], schema[key]);
        if (error) {
            errors[key] = error;
        }
    });

    return errors;
}

export function getPasswordStrength(password: string): {
    strength: 'weak' | 'medium' | 'strong';
    score: number;
    feedback: string;
} {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) {
        return { strength: 'weak', score, feedback: 'Use a longer password with mixed characters' };
    } else if (score <= 4) {
        return { strength: 'medium', score, feedback: 'Good! Add special characters for extra security' };
    } else {
        return { strength: 'strong', score, feedback: 'Excellent password strength!' };
    }
}
