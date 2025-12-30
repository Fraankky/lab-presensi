import { forwardRef } from 'react';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProps['name'];
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, icon, iconPosition = 'left', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variantClasses = {
      primary: 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm focus:ring-zinc-900',
      secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-zinc-700 focus:ring-gray-200',
      ghost: 'hover:bg-gray-100 text-zinc-600',
    };
    
    const sizeClasses = {
      sm: 'text-[10px] h-8 px-3 rounded-md',
      md: 'text-sm h-9 px-4 rounded-md',
      lg: 'text-base h-10 px-6 rounded-md',
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left' && <Icon name={icon} width={16} />}
        {children}
        {icon && iconPosition === 'right' && <Icon name={icon} width={16} />}
      </button>
    );
  }
);

Button.displayName = 'Button';
