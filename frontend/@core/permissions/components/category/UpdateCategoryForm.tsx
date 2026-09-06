'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/@shared/components/Input';
import Button from '@/@shared/components/Button';
import { ICategoryRes } from '@/@features/categories/categories.types';
import { useCategories, useUpdateCategory } from '@/@features/categories/categories.hook';

interface UpdateCategoryFormProps {
  category: ICategoryRes;
}

export default function UpdateCategoryForm({ category }: UpdateCategoryFormProps) {
  const router = useRouter();

  const [nameAr, setNameAr] = useState(category.nameAr);
  const [nameEn, setNameEn] = useState(category.nameEn);
  const [parentCategoryId, setParentCategoryId] = useState<number | undefined>( category.parent?.id );

  const { data: categoriesResponse } = useCategories({ page: 1, limit: 100 });
  const updateCategoryMutation = useUpdateCategory();

  const categories = categoriesResponse?.data ?? [];

  const availableParents = categories.filter(
    (item) => item.id !== category.id,
  ); // Prevent category from selecting itself as parent

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    updateCategoryMutation.mutate(
      {
        categoryId: category.id,
        data: {
          nameAr,
          nameEn,
          parentId: parentCategoryId,
        },
      },
      {
        onSuccess: () => {
          router.push('/categories');
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6"
    >
      <div className="space-y-5">
        <Input
          label="الاسم بالعربي"
          value={nameAr}
          onChange={(event) =>
            setNameAr(event.target.value)
          }
          required
        />

        <Input
          label="الاسم بالإنجليزي"
          value={nameEn}
          onChange={(event) =>
            setNameEn(event.target.value)
          }
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            التصنيف الأب
          </label>

          <select
            value={parentCategoryId ?? ''}
            onChange={(event) =>
              setParentCategoryId(
                event.target.value
                  ? Number(event.target.value)
                  : undefined,
              )
            }
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
          >
            <option value="">
              بدون تصنيف أب
            </option>

            {availableParents.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.nameAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button
          type="button"
          onClick={() =>
            router.push('/categories')
          }
          disabled={updateCategoryMutation.isPending}
        >
          إلغاء
        </Button>

        <Button
          type="submit"
          isLoading={updateCategoryMutation.isPending}
          loadingText="جاري الحفظ..."
        >
          حفظ التعديلات
        </Button>
      </div>
    </form>
  );
}