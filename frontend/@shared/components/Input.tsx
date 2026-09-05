import {
  InputHTMLAttributes,
} from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={id}
        {...props}
        className={`w-full rounded-lg border px-4 py-3 text-gray-900
        placeholder:text-gray-300 outline-none transition focus:ring-2
        ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
        }
        ${className}`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}