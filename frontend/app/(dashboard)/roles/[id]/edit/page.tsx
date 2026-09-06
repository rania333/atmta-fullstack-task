'use client';

import UpdateRoleForm from '@/@core/permissions/components/Role/UpdateRoleForm';
import { useRoles } from '@/@features/roles/roles.hook';
import { useParams } from 'next/navigation';

export default function EditRolePage() {
  const params = useParams();

  const roleId = Number(params.id);

  const { data: rolesResponse, isLoading } = useRoles();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        جاري تحميل الدور...
      </div>
    );
  }

  const role = rolesResponse?.data.find(
    (role) => role.id === roleId,
  );

  if (!role) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        الدور غير موجود
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          تعديل الدور
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          تعديل اسم الدور والصلاحيات الخاصة به
        </p>
      </div>

      <UpdateRoleForm role={role} />
    </div>
  );
}