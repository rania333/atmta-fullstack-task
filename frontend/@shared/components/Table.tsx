'use client';

import { Fragment, useState, type ReactNode} from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];

  getRowKey: (item: T) => string | number;

  isLoading?: boolean;
  emptyMessage?: string;

  isRowExpandable?: (item: T) => boolean;
  renderExpandedRow?: (item: T) => ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  isLoading = false,
  emptyMessage = 'لا توجد بيانات',
  isRowExpandable,
  renderExpandedRow,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<
    Set<string | number>
  >(new Set());

  const hasExpandableRows = !!renderExpandedRow;

  const toggleRow = (rowKey: string | number) => {
    setExpandedRows((current) => {
      const updated = new Set(current);

      if (updated.has(rowKey)) {
        updated.delete(rowKey);
      } else {
        updated.add(rowKey);
      }

      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {hasExpandableRows && (
              <th className="w-12 px-2 py-3" />
            )}

            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-sm font-medium text-gray-600"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const rowKey = getRowKey(item);

            const expandable =
              isRowExpandable?.(item) ?? false;

            const isExpanded =
              expandedRows.has(rowKey);

            return (
              <Fragment key={rowKey}>
                <tr className="border-b border-gray-100">
                  {hasExpandableRows && (
                    <td className="w-12 px-2 py-4 text-center">
                      {expandable && (
                        <button
                          type="button"
                          onClick={() =>
                            toggleRow(rowKey)
                          }
                          className="h-7 w-7 rounded text-gray-500 hover:bg-gray-100"
                          aria-label={
                            isExpanded
                              ? 'إغلاق الصف'
                              : 'فتح الصف'
                          }
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      )}
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-4 text-sm text-gray-600"
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>

                {expandable &&
                  isExpanded &&
                  renderExpandedRow && (
                    <tr className="border-b border-gray-100">
                      <td
                        colSpan={
                          columns.length +
                          (hasExpandableRows ? 1 : 0)
                        }
                        className="bg-gray-50 px-6 py-4"
                      >
                        {renderExpandedRow(item)}
                      </td>
                    </tr>
                  )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}