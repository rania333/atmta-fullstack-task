'use client';

import { useState } from 'react';

import Pagination from '@/@shared/components/Pagination';
import Input from '@/@shared/components/Input';

import { useDebounce } from '@/@shared/hooks/useDebounce';
import { ICategoryRes } from '@/@features/categories/categories.types';
import { useCategories, useDeleteCategory } from '@/@features/categories/categories.hook';
import Table from '@/@shared/components/Table';
import CategoryChildren from '@/@core/permissions/components/category/CategoryChildren';
import { useRouter } from 'next/navigation';
import { hasPermission } from '@/@shared/libs/permission.helper';
import { auth } from '@/@shared/libs/auth';
import { useProfile } from '@/@core/profile/userProfile.hook';
import Button from '@/@shared/components/Button';
import ConfirmDialog from '@/@shared/components/ConfirmDialog';

export default function CategoriesPage() {
  const router = useRouter();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<number | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 500);

  const { data: categoriesResponse, isLoading } = useCategories({
    page,
    limit: 10,
    key: debouncedSearch || undefined,
    parentCategoryId,
  });

  const { data: parentCategoriesResponse } = useCategories({
    page: 1,
    limit: 100,
  });

  const categories = categoriesResponse?.data ?? [];
  const meta = categoriesResponse?.meta;

  const parentCategories = parentCategoriesResponse?.data ?? []; // menu
  // Parent only to display in table
  const rootCategories = categories.filter((category) => category.parent === null);

  // Get effective permissions
  const currentUser = auth.getUser();
  const { data: profileResponse } = useProfile(currentUser?.id);
  const permissions = profileResponse?.data.effectivePermissions ?? [];
  const canCreate = hasPermission( permissions, 'categories.create' );
  const canUpdate = hasPermission( permissions, 'categories.update' );
  const canDelete = hasPermission( permissions, 'categories.delete' );

  // DELETE
  const [selectedCategory, setSelectedCategory] = useState<ICategoryRes | null>(null);
  const deleteCategoryMutation = useDeleteCategory();

  const columns = [
    {
      key: 'nameAr',
      header: 'الاسم بالعربي',
      render: (category: ICategoryRes) => (
        <span className="font-medium text-gray-900">
          {category.nameAr}
        </span>
      ),
    },

    {
      key: 'nameEn',
      header: 'الاسم بالإنجليزي',
      render: (category: ICategoryRes) => (
        <span className="text-gray-700">
          {category.nameEn}
        </span>
      ),
    },

    {
      key: 'parent',
      header: 'التصنيف الأب',
      render: (category: ICategoryRes) => (
        <span className="text-gray-600">
          {category.parent?.nameAr ?? '-'}
        </span>
      ),
    },

    {
      key: 'children',
      header: 'عدد التصنيفات الفرعية',
      render: (category: ICategoryRes) => (
        <span className="text-gray-700">
          {category.childrenCount}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      render: (category: ICategoryRes) => (
        <div className="flex items-center gap-3">
          {canUpdate && (
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/categories/${category.id}/edit`,
                )
              }
              className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              تعديل
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => setSelectedCategory(category)}
              className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800"
            >
              حذف
            </button>
          )}

        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            التصنيفات
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            إدارة التصنيفات والتصنيفات الفرعية
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={() => router.push('/categories/create')}
          >
            إضافة تصنيف
          </Button>
        )}
      </div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="w-full md:max-w-md">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            } }
            placeholder="بحث في التصنيفات..." label={''}          />
        </div>

        <select
          value={parentCategoryId ?? ''}
          onChange={(event) => {
            const value = event.target.value;

            setParentCategoryId(
              value
                ? Number(value)
                : undefined,
            );

            setPage(1);
          }}
          className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 md:w-64"
        >
          <option value="">
            كل التصنيفات
          </option>

          {parentCategories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.nameAr}
            </option>
          ))}
        </select>
      </div>

      <Table
        columns={columns}
        data={parentCategoryId? categories : rootCategories}
        getRowKey={(category) => category.id}
        isLoading={isLoading}
        emptyMessage="لا توجد تصنيفات"
        isRowExpandable={(category) => (category.childrenCount ?? 0) > 0}
        renderExpandedRow={(category) => (
          <CategoryChildren
            parentId={category.id}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onDelete={setSelectedCategory}
          />
      )}

      />

      {meta && meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            onPrevious={() => setPage((current) => current - 1)}
            onNext={() => setPage((current) => current + 1)}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!selectedCategory}
        title="حذف التصنيف"
        message={`هل أنت متأكد من حذف التصنيف "${selectedCategory?.nameAr}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deleteCategoryMutation.isPending}
        onCancel={() => setSelectedCategory(null)}
        onConfirm={() => {
          if (!selectedCategory) return;

          deleteCategoryMutation.mutate(
            selectedCategory.id,
            {
              onSuccess: () => {
                setSelectedCategory(null);
              },
            },
          );
        }}
      />
    </div>

  );
}
