'use client';

import { useCategories } from "@/@features/categories/categories.hook";
import { ICategoryRes } from "@/@features/categories/categories.types";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface CategoryChildrenProps {
  parentId: number;
  level?: number;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (category: ICategoryRes) => void;
}

export default function CategoryChildren({ parentId, level = 1, canUpdate, canDelete, onDelete }: CategoryChildrenProps) {
  const { data, isLoading } = useCategories({
    page: 1,
    limit: 10,
    parentCategoryId: parentId,
  });

  const children = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        جاري تحميل التصنيفات الفرعية...
      </div>
    );
  }

  if (!children.length) {
    return (
      <div className="p-4 text-sm text-gray-500">
        لا توجد تصنيفات فرعية
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3">
      {children.map((child) => (
        <CategoryChildRow
          key={child.id}
          category={child}
          level={level}
          canUpdate={canUpdate}
          canDelete={canDelete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface CategoryChildRowProps {
  category: ICategoryRes;
  level: number;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (category: ICategoryRes) => void;
}
function CategoryChildRow({
  category,
  level,
  canUpdate,
  canDelete,
  onDelete,
}: CategoryChildRowProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = (category.childrenCount ?? 0) > 0;

  return (
    <div>
      <div
        className="grid grid-cols-5 items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
        style={{
          marginRight: `${level * 20}px`,
        }}
      >
        <div className="flex items-center gap-2">
          {hasChildren && (
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="cursor-pointer text-gray-600"
            >
              {isOpen ? '▼' : '◀'}
            </button>
          )}

          <span className="font-medium text-gray-900">
            {category.nameAr}
          </span>
        </div>

        <span className="text-sm text-gray-700">
          {category.nameEn}
        </span>

        <span className="text-sm text-gray-600">
          {category.parent?.nameAr ?? '-'}
        </span>

        <span className="text-sm text-gray-700">
          {category.childrenCount}
        </span>

        <div className="flex items-center gap-3">
          {canUpdate && (
            <button
              type="button"
              onClick={() =>
                router.push(`/categories/${category.id}/edit`)
              }
              className="cursor-pointer text-sm font-medium text-blue-600"
            >
              تعديل
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(category)}
              className="cursor-pointer text-sm font-medium text-red-600"
            >
              حذف
            </button>
          )}
        </div>
      </div>

      {isOpen && hasChildren && (
        <CategoryChildren
          parentId={category.id}
          level={level + 1}
          canUpdate={canUpdate}
          canDelete={canDelete}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
