import type { ButtonHTMLAttributes } from 'react';

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const colors = {
  blue: {
    solid: 'bg-blue-600 text-white enabled:hover:bg-blue-700',
    soft: 'bg-blue-50 text-blue-700 enabled:hover:bg-blue-100',
    ghost: 'text-blue-700 enabled:hover:bg-blue-50',
  },
  red: {
    solid: 'bg-red-600 text-white enabled:hover:bg-red-700',
    soft: 'bg-red-50 text-red-700 enabled:hover:bg-red-100',
    ghost: 'text-red-700 enabled:hover:bg-red-50',
  },
  green: {
    solid: 'bg-green-600 text-white enabled:hover:bg-green-700',
    soft: 'bg-green-50 text-green-700 enabled:hover:bg-green-100',
    ghost: 'text-green-700 enabled:hover:bg-green-50',
  },
  gray: {
    solid: 'bg-gray-700 text-white enabled:hover:bg-gray-800',
    soft: 'bg-gray-100 text-gray-700 enabled:hover:bg-gray-200',
    ghost: 'text-gray-700 enabled:hover:bg-gray-100',
  },
};

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  size?: keyof typeof sizes;
  color?: keyof typeof colors;
  variant?: 'solid' | 'soft' | 'ghost';
}

export default function Button({
  children,
  isLoading = false,
  loadingText = 'جاري التحميل...',
  disabled,
  size = 'lg',
  color = 'blue',
  variant = 'solid',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer rounded-lg font-medium
        transition-colors focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${sizes[size]} ${colors[color][variant]}
        ${className}`}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
