import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({ variant = 'default', children, className }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-primary-100 text-primary-800',
  };

  return (
    <span className={twMerge(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
