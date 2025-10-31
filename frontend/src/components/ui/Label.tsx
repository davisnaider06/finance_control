import React, { forwardRef } from 'react';

// Função 'cn' simples para este exemplo
const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(' ');

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          'text-sm font-medium leading-none text-gray-700 dark:text-gray-300',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';

export { Label };
