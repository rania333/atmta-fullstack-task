'use client';

import { useState } from 'react';

import Pagination from '@/@shared/components/Pagination';
import Input from '@/@shared/components/Input';
import { useDebounce } from '@/@shared/hooks/useDebounce';
import { useCategories } from '@/@features/categories/categories.hook';
import { useDeleteVendor, useExportVendors, useVendors } from '@/@features/vendors/vendors.hook';
import DataTable from '@/@shared/components/Table';
import { IVendorRes } from '@/@features/vendors/vendors.types';
import Table from '@/@shared/components/Table';
import { hasPermission } from '@/@shared/libs/permission.helper';
import { auth } from '@/@shared/libs/auth';
import { useProfile } from '@/@core/profile/userProfile.hook';
import { useRouter } from 'next/navigation';
import Button from '@/@shared/components/Button';
import ConfirmDialog from '@/@shared/components/ConfirmDialog';

export default function VendorsPage() {
  const router = useRouter();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 500);

  const { data: vendorsResponse, isLoading } = useVendors({
    page, limit: 10,
    key: debouncedSearch || undefined, categoryId,
  });

  const { data: categoriesResponse } = useCategories({ page: 1, limit: 100 });

  const vendors = vendorsResponse?.data ?? [];
  const meta = vendorsResponse?.meta;

  const categories = categoriesResponse?.data ?? [];
  

  // Pemissions
  const currentUser = auth.getUser();
  const { data: profileResponse } = useProfile(currentUser?.id ?? 0);
  const permissions = profileResponse?.data.effectivePermissions ?? [];
  const canCreate = hasPermission(permissions, 'vendors.create');
  const canUpdate = hasPermission(permissions, 'vendors.update');
  const canDelete = hasPermission(permissions, 'vendors.delete');
  const canExport = hasPermission(permissions, 'vendors.export');

  // Delete
  const [selectedVendor, setSelectedVendor] = useState<IVendorRes | null>(null);
  const deleteVendorMutation = useDeleteVendor();

  // Export
  const exportVendorsMutation = useExportVendors();
  const columns = [
    {
      key: 'nameAr',
      header: 'الاسم بالعربي',
      render: (vendor: IVendorRes) => (
        <span className="font-medium text-gray-900">
          {vendor.nameAr}
        </span>
      ),
    },
    {
      key: 'nameEn',
      header: 'الاسم بالإنجليزي',
      render: (vendor: IVendorRes) => (
        <span className="text-gray-700">
          {vendor.nameEn}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'التصنيف',
      render: (vendor: IVendorRes) => (
        <span className="text-gray-700">
          {vendor.category?.nameAr ?? '-'}
        </span>
      ),
    },
    {
      key: 'crNumber',
      header: 'السجل التجاري',
      render: (vendor: IVendorRes) => (
        <span className="text-gray-700">
          {vendor.crNumber}
        </span>
      ),
    },
    {
      key: 'mobile',
      header: 'رقم الجوال',
      render: (vendor: IVendorRes) => (
        <span className="text-gray-700">
          {vendor.mobile}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
      render: (vendor: IVendorRes) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            vendor.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {vendor.isActive ? 'نشط' : 'غير نشط'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      render: (vendor: IVendorRes) => (
        <div className="flex items-center gap-3">
          {canUpdate && (
            <button
              type="button"
              onClick={() =>
                router.push(`/vendors/${vendor.id}/edit`)
              }
              className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              تعديل
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => setSelectedVendor(vendor)}
              className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800"
            >
              حذف
            </button>
          )}

          <button
            type="button"
            onClick={() => router.push(`/vendors/${vendor.id}`)}
            className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            عرض
          </button>
          
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            الموردون
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            إدارة الموردين وبياناتهم
          </p>
        </div>
        <div className='flex gap-3'>

        {canCreate && (
          <Button
            onClick={() => router.push('/vendors/create')}
          >
            إضافة مورد
          </Button>
        )}
        {canExport && (
          <Button
            type="button" color='green'
            isLoading={exportVendorsMutation.isPending}
            loadingText="جاري التصدير..."
            onClick={() =>
              exportVendorsMutation.mutate({
                page, limit: 100,
                key: debouncedSearch || undefined,
                categoryId: categoryId || undefined,
              })
            }
          >
            تصدير Excel
          </Button>
        )}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="w-full md:max-w-md">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            } }
            placeholder="بحث في الموردين..." label={''}          />
        </div>

        <select
          value={categoryId ?? ''}
          onChange={(event) => {
            const value = event.target.value;

            setCategoryId(
              value ? Number(value) : undefined,
            );

            setPage(1);
          }}
          className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 md:w-64"
        >
          <option value="">
            كل التصنيفات
          </option>

          {categories.map((category) => (
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
        data={vendors}
        getRowKey={(vendor) => vendor.id}
        isLoading={isLoading}
        emptyMessage="لا يوجد موردون"
      />

      <ConfirmDialog
        isOpen={!!selectedVendor}
        title="حذف المورد"
        message={`هل أنتِ متأكدة من حذف المورد "${selectedVendor?.nameAr}"؟`}
        confirmText="حذف"
        isLoading={deleteVendorMutation.isPending}
        onCancel={() => setSelectedVendor(null)}
        onConfirm={() => {
          if (!selectedVendor) return;

          deleteVendorMutation.mutate(selectedVendor.id, {
            onSuccess: () => {
              setSelectedVendor(null);
            },
          });
        }}
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
    </div>
  );
}
