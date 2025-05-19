import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500',
      accent: 'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-primary-500',
      ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-primary-500',
      link: 'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500 p-0',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    // Don't apply size styles to link variant
    const sizeStyles = variant === 'link' ? '' : sizes[size];

    return (
      <button
        ref={ref}
        className={twMerge(
          baseStyles,
          variants[variant],
          sizeStyles,
          isLoading && 'relative',
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
        <span className={twMerge(isLoading && 'opacity-0', 'flex items-center gap-2')}>
          {icon && iconPosition === 'left' && !isLoading && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && !isLoading && <span>{icon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;