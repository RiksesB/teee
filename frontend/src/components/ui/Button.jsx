import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const variantStyles = {
  primary:
    'rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  secondary:
    'rounded-lg bg-secondary-600 px-4 py-2 text-white hover:bg-secondary-700 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
  outline:
    'rounded-lg px-4 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  ghost:
    'rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  danger:
    'rounded-lg bg-danger-600 px-4 py-2 text-white hover:bg-danger-700 focus:ring-2 focus:ring-danger-500 focus:ring-offset-2',
};

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg px-6 py-3',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  to,
  href,
  ...props
}) => {
  const classes = clsx(
    'inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
