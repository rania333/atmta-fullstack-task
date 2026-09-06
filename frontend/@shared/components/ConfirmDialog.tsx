'use client';

import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: 'blue' | 'red' | 'green' | 'gray';
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  isLoading = false,
  confirmColor = 'red',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            size="md"
            color="gray"
            variant="soft"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="جاري التنفيذ..."
            size="md"
            color={confirmColor}
            variant="solid"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
