'use client';

import { useRouter } from 'next/navigation';


import { auth } from '@/@shared/libs/auth';

import Button from '@/@shared/components/Button';
import { useProfile } from '@/@core/profile/userProfile.hook';
import { useDeleteRole, useRoles } from '@/@features/roles/roles.hook';
import { hasPermission } from '@/@shared/libs/permission.helper';
import { IRolesRes } from '@/@features/roles/roles.types';
import Table from '@/@shared/components/Table';
import { useState } from 'react';
import ConfirmDialog from '@/@shared/components/ConfirmDialog';

export default function RolesPage() {
  const router = useRouter();

  const currentUser = auth.getUser();

  const { data: profileResponse } = useProfile(currentUser?.id ?? 0);

  const { data: rolesResponse, isLoading } = useRoles();

  const roles = rolesResponse?.data ?? [];

  const permissions = profileResponse?.data.effectivePermissions ?? [];

  const canCreate = hasPermission(permissions, 'roles.create');
  const canUpdate = hasPermission(permissions, 'roles.update');
  const canDelete = hasPermission(permissions, 'roles.delete');

  // Delete
  const [selectedRole, setSelectedRole] = useState<IRolesRes | null>(null);
  const deleteRoleMutation = useDeleteRole();

  const columns = [
    {
      key: 'name',
      header: 'اسم الدور',
      render: (role: IRolesRes) => (
        <span className="font-medium text-gray-900">
          {role.name}
        </span>
      ),
    },

    {
      key: 'modules',
      header: 'الوحدات',
      render: (role: IRolesRes) => {
        const modules = [
          ...new Set(
            role.permissions.map(
              (permission) => permission.module,
            ),
          ),
        ];

        return (
          <div className="flex flex-wrap gap-2">
            {modules.map((module) => (
              <span
                key={module}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                {module}
              </span>
            ))}
          </div>
        );
      },
    },

    {
      key: 'permissions',
      header: 'عدد الصلاحيات',
      render: (role: IRolesRes) => (
        <span className="text-gray-700">
          {role.permissions.length}
        </span>
      ),
    },

    {
      key: 'actions',
      header: 'الإجراءات',
      render: (role: IRolesRes) => (
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Button size="sm" variant="soft" color="blue"
              onClick={() =>
                router.push(`/roles/${role.id}/edit`)
              }
              className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              تعديل
            </Button>
          )}

          {canDelete && (
            <Button size="sm" variant="soft" color="red"
              className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800"
              onClick={() => setSelectedRole(role)}>
              حذف
            </Button>
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
            الأدوار
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            إدارة الأدوار والصلاحيات الخاصة بالنظام
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={() => router.push('/roles/create')}
          >
            إضافة دور
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={roles}
        getRowKey={(role) => role.id}
        isLoading={isLoading}
        emptyMessage="لا توجد أدوار"
      />

      <ConfirmDialog
        isOpen={!!selectedRole}
        title="حذف الدور"
        message={`هل أنت متأكد من حذف الدور "${selectedRole?.name}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        isLoading={deleteRoleMutation.isPending}
        onCancel={() => setSelectedRole(null)}
        onConfirm={() => {
          if (!selectedRole) return;

          deleteRoleMutation.mutate(selectedRole.id, {
            onSuccess: () => {
              setSelectedRole(null);
            },
          });
        }}
      />
    </div>
  );
}