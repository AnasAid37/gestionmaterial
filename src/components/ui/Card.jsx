import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ className, children }) => {
  return (
    <div className={twMerge('bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden', className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }) => {
  return (
    <div className={twMerge('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

const CardTitle = ({ className, children }) => {
  return (
    <h3 className={twMerge('text-lg font-semibold', className)}>
      {children}
    </h3>
  );
};

const CardContent = ({ className, children }) => {
  return (
    <div className={twMerge('px-6 py-4', className)}>
      {children}
    </div>
  );
};

const CardFooter = ({ className, children }) => {
  return (
    <div className={twMerge('px-6 py-4 bg-gray-50 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
