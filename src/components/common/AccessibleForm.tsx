"use client";

import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

interface AccessibleFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
  help?: string;
  required?: boolean;
  fieldId?: string;
}

export const AccessibleField = forwardRef<HTMLInputElement, AccessibleFieldProps>(({
  label,
  error,
  help,
  required,
  fieldId,
  className,
  ...props
}, ref) => {
  const { generateFieldId } = useAccessibility();
  const id = fieldId || generateFieldId('field');
  
  const describedBy = [];
  if (error) describedBy.push(`${id}-error`);
  if (help) describedBy.push(`${id}-help`);

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id}
        className={cn(
          'text-sm font-medium text-gray-700',
          required && 'after:content-["*"] after:ml-1 after:text-red-600'
        )}
      >
        {label}
        {required && (
          <span className="sr-only">required field</span>
        )}
      </Label>
      
      <Input
        ref={ref}
        id={id}
        className={cn(
          // Ensure adequate contrast and focus states
          'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20',
          // Error state styling
          error && 'border-red-600 focus:border-red-600 focus:ring-red-600/20 bg-red-50',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy.length > 0 ? describedBy.join(' ') : undefined}
        aria-required={required}
        {...props}
      />
      
      {help && (
        <p 
          id={`${id}-help`}
          className="text-sm text-gray-600"
          role="note"
        >
          {help}
        </p>
      )}
      
      {error && (
        <p 
          id={`${id}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
});

AccessibleField.displayName = 'AccessibleField';

interface AccessibleTextareaProps extends React.ComponentProps<'textarea'> {
  label: string;
  error?: string;
  help?: string;
  required?: boolean;
  fieldId?: string;
}

export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(({
  label,
  error,
  help,
  required,
  fieldId,
  className,
  ...props
}, ref) => {
  const { generateFieldId } = useAccessibility();
  const id = fieldId || generateFieldId('textarea');
  
  const describedBy = [];
  if (error) describedBy.push(`${id}-error`);
  if (help) describedBy.push(`${id}-help`);

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id}
        className={cn(
          'text-sm font-medium text-gray-700',
          required && 'after:content-["*"] after:ml-1 after:text-red-600'
        )}
      >
        {label}
        {required && (
          <span className="sr-only">required field</span>
        )}
      </Label>
      
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none',
          'placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50',
          // Error state styling
          error && 'border-red-600 focus:border-red-600 focus:ring-red-600/20 bg-red-50',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy.length > 0 ? describedBy.join(' ') : undefined}
        aria-required={required}
        {...props}
      />
      
      {help && (
        <p 
          id={`${id}-help`}
          className="text-sm text-gray-600"
          role="note"
        >
          {help}
        </p>
      )}
      
      {error && (
        <p 
          id={`${id}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
});

AccessibleTextarea.displayName = 'AccessibleTextarea';

interface AccessibleSelectProps extends React.ComponentProps<'select'> {
  label: string;
  error?: string;
  help?: string;
  required?: boolean;
  fieldId?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(({
  label,
  error,
  help,
  required,
  fieldId,
  options,
  placeholder,
  className,
  ...props
}, ref) => {
  const { generateFieldId } = useAccessibility();
  const id = fieldId || generateFieldId('select');
  
  const describedBy = [];
  if (error) describedBy.push(`${id}-error`);
  if (help) describedBy.push(`${id}-help`);

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id}
        className={cn(
          'text-sm font-medium text-gray-700',
          required && 'after:content-["*"] after:ml-1 after:text-red-600'
        )}
      >
        {label}
        {required && (
          <span className="sr-only">required field</span>
        )}
      </Label>
      
      <select
        ref={ref}
        id={id}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Error state styling
          error && 'border-red-600 focus:border-red-600 focus:ring-red-600/20 bg-red-50',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy.length > 0 ? describedBy.join(' ') : undefined}
        aria-required={required}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {help && (
        <p 
          id={`${id}-help`}
          className="text-sm text-gray-600"
          role="note"
        >
          {help}
        </p>
      )}
      
      {error && (
        <p 
          id={`${id}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
});

AccessibleSelect.displayName = 'AccessibleSelect';

interface AccessibleCheckboxProps extends React.ComponentProps<'input'> {
  label: string;
  description?: string;
  error?: string;
  fieldId?: string;
}

export const AccessibleCheckbox = forwardRef<HTMLInputElement, AccessibleCheckboxProps>(({
  label,
  description,
  error,
  fieldId,
  className,
  ...props
}, ref) => {
  const { generateFieldId } = useAccessibility();
  const id = fieldId || generateFieldId('checkbox');

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cn(
            'h-4 w-4 mt-0.5 rounded border-gray-300 text-blue-600',
            'focus:ring-2 focus:ring-blue-600/20 focus:ring-offset-0',
            // Ensure minimum touch target (use padding on label to expand clickable area)
            error && 'border-red-600 focus:ring-red-600/20',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={description ? `${id}-description` : undefined}
          {...props}
        />
        <div className="flex-1">
          <Label 
            htmlFor={id}
            className="text-sm font-medium text-gray-700 cursor-pointer py-2 -my-2"
          >
            {label}
          </Label>
          {description && (
            <p 
              id={`${id}-description`}
              className="text-sm text-gray-600 mt-1"
            >
              {description}
            </p>
          )}
        </div>
      </div>
      
      {error && (
        <p 
          className="text-sm text-red-600 flex items-center gap-1 ml-7"
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
});

AccessibleCheckbox.displayName = 'AccessibleCheckbox';

interface AccessibleFieldsetProps extends React.ComponentProps<'fieldset'> {
  legend: string;
  error?: string;
  help?: string;
}

export const AccessibleFieldset = forwardRef<HTMLFieldSetElement, AccessibleFieldsetProps>(({
  legend,
  error,
  help,
  children,
  className,
  ...props
}, ref) => {
  return (
    <fieldset
      ref={ref}
      className={cn(
        'border border-gray-200 rounded-lg p-4 space-y-4',
        error && 'border-red-300 bg-red-50',
        className
      )}
      {...props}
    >
      <legend className="text-sm font-medium text-gray-700 px-2 -ml-2">
        {legend}
      </legend>
      
      {help && (
        <p className="text-sm text-gray-600" role="note">
          {help}
        </p>
      )}
      
      {children}
      
      {error && (
        <p 
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </fieldset>
  );
});

AccessibleFieldset.displayName = 'AccessibleFieldset';