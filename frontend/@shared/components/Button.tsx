import { ButtonHTMLAttributes } from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export default function Button({
  children,
  isLoading = false,
  loadingText = 'جاري التحميل...',
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`rounded-lg bg-blue-600 px-4 py-3 font-medium text-white
        transition hover:bg-blue-700
        disabled:cursor-not-allowed disabled:opacity-60
        ${className}`}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}