import React, { forwardRef } from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(' ');

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700',
          'bg-white dark:bg-gray-800 px-3 py-2 text-sm',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-gray-500 dark:placeholder:text-gray-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-600',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:text-gray-100',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
