interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;

  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({ page, totalPages, total, onPrevious, onNext }: PaginationProps) {
  if (total === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 p-4">
      <p className="text-sm text-gray-500">
        إجمالي النتائج: {total}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={onPrevious}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          السابق
        </button>

        <span className="text-sm text-gray-600">
          {page} من {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={onNext}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
}