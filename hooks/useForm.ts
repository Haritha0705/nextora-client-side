// useForm Hook - Generic form state management with validation
'use client';

import { useState, useCallback, ChangeEvent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ValidationRule<T = any> {
    validate: (value: unknown, formData: T) => boolean;
    message: string;
}

export type ValidationSchema<T> = {
    [K in keyof T]?: ValidationRule<T>[];
};

export interface UseFormOptions<T> {
    initialValues: T;
    validationSchema?: ValidationSchema<T>;
    onSubmit?: (values: T) => Promise<void> | void;
}

export interface UseFormReturn<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    isValid: boolean;
    handleChange: (field: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => void;
    handleBlur: (field: keyof T) => () => void;
    setFieldValue: (field: keyof T, value: T[keyof T]) => void;
    setFieldError: (field: keyof T, error: string) => void;
    clearFieldError: (field: keyof T) => void;
    validate: () => boolean;
    validateField: (field: keyof T) => boolean;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    reset: () => void;
    setValues: (values: Partial<T>) => void;
}

export function useForm<T extends object>({
    initialValues,
    validationSchema,
    onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
    const [values, setValuesState] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = useCallback((field: keyof T): boolean => {
        if (!validationSchema?.[field]) return true;

        const rules = validationSchema[field]!;
        for (const rule of rules) {
            if (!rule.validate(values[field], values)) {
                setErrors(prev => ({ ...prev, [field]: rule.message }));
                return false;
            }
        }
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
        return true;
    }, [validationSchema, values]);

    const validate = useCallback((): boolean => {
        if (!validationSchema) return true;

        const newErrors: Partial<Record<keyof T, string>> = {};
        let isValid = true;

        for (const field of Object.keys(validationSchema) as (keyof T)[]) {
            const rules = validationSchema[field]!;
            for (const rule of rules) {
                if (!rule.validate(values[field], values)) {
                    newErrors[field] = rule.message;
                    isValid = false;
                    break;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    }, [validationSchema, values]);

    const handleChange = useCallback((field: keyof T) =>
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
            const value = e.target.value as T[keyof T];
            setValuesState(prev => ({ ...prev, [field]: value }));
            // Clear error when user starts typing
            if (errors[field]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        }, [errors]);

    const handleBlur = useCallback((field: keyof T) => () => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field);
    }, [validateField]);

    const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
        setValuesState(prev => ({ ...prev, [field]: value }));
    }, []);

    const setFieldError = useCallback((field: keyof T, error: string) => {
        setErrors(prev => ({ ...prev, [field]: error }));
    }, []);

    const clearFieldError = useCallback((field: keyof T) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    const setValues = useCallback((newValues: Partial<T>) => {
        setValuesState(prev => ({ ...prev, ...newValues }));
    }, []);

    const reset = useCallback(() => {
        setValuesState(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit?.(values);
        } finally {
            setIsSubmitting(false);
        }
    }, [validate, onSubmit, values]);

    const isValid = Object.keys(errors).length === 0;

    return {
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldError,
        clearFieldError,
        validate,
        validateField,
        handleSubmit,
        reset,
        setValues,
    };
}

// Common validation rules - generic types simplified for ease of use
export const validators = {
    required: (message = 'This field is required'): ValidationRule => ({
        validate: (value) => value !== undefined && value !== null && value !== '',
        message,
    }),
    email: (message = 'Invalid email format'): ValidationRule => ({
        validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
        message,
    }),
    minLength: (min: number, message?: string): ValidationRule => ({
        validate: (value) => !value || String(value).length >= min,
        message: message ?? `Must be at least ${min} characters`,
    }),
    maxLength: (max: number, message?: string): ValidationRule => ({
        validate: (value) => !value || String(value).length <= max,
        message: message ?? `Must be at most ${max} characters`,
    }),
    matches: <T extends object>(field: keyof T, message = 'Fields do not match'): ValidationRule<T> => ({
        validate: (value, formData) => value === formData[field],
        message,
    }),
    pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
        validate: (value) => !value || regex.test(String(value)),
        message,
    }),
};

