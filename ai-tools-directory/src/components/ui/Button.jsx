import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const baseStyles = {
  solid: 'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  outline: 'inline-flex items-center justify-center rounded-full border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
};

const variantStyles = {
  solid: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600',
    white: 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  },
  outline: {
    primary: 'border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/50',
    secondary: 'border-secondary-600 text-secondary-600 hover:bg-secondary-50 dark:border-secondary-400 dark:text-secondary-400 dark:hover:bg-secondary-900/50',
    white: 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
  },
};

const sizeStyles = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-base',
};

const Button = forwardRef(({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  className = '',
  href,
  disabled,
  children,
  ...props
}, ref) => {
  const styles = [
    baseStyles[variant],
    variantStyles[variant][color],
    sizeStyles[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  ].filter(Boolean).join(' ');

  const MotionComponent = motion[href ? Link : 'button'];

  return (
    <MotionComponent
      ref={ref}
      to={href}
      disabled={disabled}
      className={styles}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
});

Button.displayName = 'Button';

export default Button;
