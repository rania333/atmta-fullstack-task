'use client';

import { useId, useState } from 'react';

interface MultiSelectOption {
  value: number;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  error?: string;
  onBlur?: () => void;
}

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  error,
  onBlur,
  placeholder = 'اختر',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  const toggleOption = (optionValue: number) => {
    if (value.includes(optionValue)) {
      onChange(
        value.filter((item) => item !== optionValue),
      );
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) onBlur?.();
    }}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <button
        id={id}
        aria-expanded={isOpen}
        aria-describedby={error ? `${id}-error` : undefined}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border ${error ? 'border-red-500 focus-visible:ring-red-100' : 'border-gray-300 hover:border-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-100'} bg-white px-3 py-2 text-right text-sm text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2`}
      >
        <span className={selectedOptions.length ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOptions.length > 0
            ? selectedOptions
                .map((option) => option.label)
                .join('، ')
            : placeholder}
        </span>

        <span>⌄</span>
      </button>
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{error}</p>}

      {isOpen && (
        <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg">
          {options.map((option) => {
            const isSelected = value.includes(
              option.value,
            );

            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 px-4 py-3 text-sm transition-colors ${isSelected ? 'bg-blue-50 font-medium text-blue-800 hover:bg-blue-100' : 'bg-white text-gray-900 hover:bg-gray-100'} focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 cursor-pointer accent-blue-600 [color-scheme:light]"
                  checked={isSelected}
                  onChange={() =>
                    toggleOption(option.value)
                  }
                />

                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
