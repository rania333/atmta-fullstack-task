'use client';

import UpdateCategoryForm from '@/@core/permissions/components/category/UpdateCategoryForm';
import { useCategory } from '@/@features/categories/categories.hook';
import { useParams } from 'next/navigation';

export default function EditCategoryPage() {
  const params = useParams();

  const categoryId = Number(params.id);
  const { data: categoryResponse, isLoading } = useCategory(categoryId);
  
  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        جاري تحميل التصنيف...
      </div>
    );
  }

  const category = categoryResponse?.data

  if (!category) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        التصنيف غير موجود
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          تعديل التصنيف
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          تعديل بيانات التصنيف
        </p>
      </div>

      <UpdateCategoryForm category={category} />
    </div>
  );
}
