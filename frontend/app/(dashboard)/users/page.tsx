'use client';

import { useState } from 'react';

import Button from '@/@shared/components/Button';
import Input from '@/@shared/components/Input';

import { useDebounce } from '@/@shared/hooks/useDebounce';
import { IUser } from '@/@features/users/users.types';
import { useUpdateUserStatus, useUsers } from '@/@features/users/users.hook';
import DataTable, { DataTableColumn } from '@/@shared/components/Table';
import Pagination from '@/@shared/components/Pagination';
import { useProfile } from '@/@core/profile/userProfile.hook';
import { auth } from '@/@shared/libs/auth';
import { hasPermission } from '@/@shared/libs/permission.helper';
import ConfirmDialog from '@/@shared/components/ConfirmDialog';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useUsers({ page, limit, key: debouncedSearch});

  const users = data?.data ?? [];
  const meta = data?.meta;

  // Crnt user
  const currentUser = auth.getUser();
  const { data: profileResponse } = useProfile(currentUser?.id);
  const permissions = profileResponse?.data.effectivePermissions ?? [];

  // Check permissions
  const canCreate = hasPermission(permissions, 'users.create');
  const canUpdate = hasPermission(permissions, 'users.update');

  // For deactive
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const updateStatusMutation = useUpdateUserStatus();


  // Cols  
  const columns: DataTableColumn<IUser>[] = [
    {
      key: 'name',
      header: 'الاسم',
      render: (user) => (
        <span className="font-medium text-gray-900">
          {user.name}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'البريد الإلكتروني',
      render: (user) => user.email,
    },
    {
      key: 'phone',
      header: 'الهاتف',
      render: (user) => user.phone ?? '-',
    },
    {
      key: 'roles',
      header: 'الأدوار',
      render: (user) =>
        user.roles.length
          ? user.roles
              .map((role) => role.name)
              .join('، ')
          : '-',
    },
    {
      key: 'status',
      header: 'الحالة',
      render: (user) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            user.isActive
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {user.isActive ? 'نشط' : 'غير نشط'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      render: (user) => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Button size="sm" variant="soft" color="blue"
              onClick={() => router.push(`/users/${user.id}/edit`)}>
              تعديل 
            </Button>
          )}

          {canUpdate && (
            <Button size="sm" variant="soft" color= { user?.isActive ? 'red': 'green'} 
              onClick={() => setSelectedUser(user)}>
                { user?.isActive ? 'تعطيل ' : 'تفعيل '}
            </Button>
          )}
        </div>
      ),
    }
  ];


  return (
    <>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              المستخدمون
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              إدارة المستخدمين والأدوار الخاصة بهم
            </p>
          </div>

          {canCreate && (
            <Button onClick={() => router.push('/users/create')}>
              إضافة مستخدم
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            <div className="max-w-sm">
              <Input
                placeholder="البحث عن مستخدم..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                } } label={''}            />
            </div>
          </div>

          <DataTable
            data={users}
            columns={columns}
            getRowKey={(user) => user.id}
            isLoading={isLoading}
            emptyMessage="لا يوجد مستخدمون"
          />

          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPrevious={() =>
                setPage((current) => current - 1)
              }
              onNext={() =>
                setPage((current) => current + 1)
              }
            />
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={!!selectedUser}
        confirmColor={selectedUser?.isActive ? 'red' : 'green'}
        title={
          selectedUser?.isActive
            ? 'تعطيل المستخدم'
            : 'تفعيل المستخدم'
        }
        message={
          selectedUser
            ? `هل أنتِ متأكدة من ${
                selectedUser.isActive ? 'تعطيل' : 'تفعيل'
              } المستخدم "${selectedUser.name}"؟`
            : ''
        }
        confirmText={
          selectedUser?.isActive ? 'تعطيل' : 'تفعيل'
        }
        isLoading={updateStatusMutation.isPending}
        onCancel={() => setSelectedUser(null)}
        onConfirm={() => {
          if (!selectedUser) return;

          updateStatusMutation.mutate(
            {
              userId: selectedUser.id,
              isActive: !selectedUser.isActive,
            },
            {
              onSuccess: () => {
                setSelectedUser(null);
              },
            },
          );
        }}
      />
    </>
  );

  
}

