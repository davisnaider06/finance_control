import React, { forwardRef } from 'react';

// Função 'cn' simples para este exemplo
const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(' ');

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'ring-offset-white dark:ring-offset-gray-950',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-600',
          'disabled:pointer-events-none disabled:opacity-50',
          'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
          'h-10 px-4 py-2 w-full', // 'w-full' é comum para botões de formulário
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
