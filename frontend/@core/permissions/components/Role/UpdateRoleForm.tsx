'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/@shared/components/Input';
import Button from '@/@shared/components/Button';
import { IRolesRes } from '@/@features/roles/roles.types';
import { usePermissions } from '../../permissions.hook';
import { useUpdateRole } from '@/@features/roles/roles.hook';

interface UpdateRoleFormProps {
  role: IRolesRes;
}

export default function UpdateRoleForm({
  role,
}: UpdateRoleFormProps) {
  const router = useRouter();

  const [name, setName] = useState(role.name);

  const [permissionIds, setPermissionIds] =
    useState<number[]>(
      role.permissions.map(
        (permission) => permission.id,
      ),
    );

  const [openModules, setOpenModules] = useState<number[]>([]);

  const { data: permissionsResponse, isLoading: permissionsLoading } = usePermissions();

  const updateRoleMutation = useUpdateRole();

  const modules = permissionsResponse?.data ?? [];

  const toggleModule = (moduleId: number) => {
    setOpenModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    );
  };

  const togglePermission = (
    permissionId: number,
  ) => {
    setPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter(
            (id) => id !== permissionId,
          )
        : [...current, permissionId],
    );
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    updateRoleMutation.mutate(
      {
        roleId: role.id,
        data: {
          name,
          permissionIds,
        },
      },
      {
        onSuccess: () => {
          router.push('/roles');
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl rounded-xl border border-gray-200 bg-white p-6"
    >
      <Input
        label="اسم الدور"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        required
      />

      <div className="my-6 border-t border-gray-200" />

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          الصلاحيات
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          تعديل الصلاحيات الخاصة بهذا الدور
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {permissionsLoading ? (
          <p className="text-sm text-gray-500">
            جاري تحميل الصلاحيات...
          </p>
        ) : (
          modules.map((module) => {
            const isOpen =
              openModules.includes(module.id);

            return (
              <div
                key={module.id}
                className="overflow-hidden rounded-lg border border-gray-200"
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleModule(module.id)
                  }
                  className="flex w-full cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">
                    {module.displayName}
                  </span>

                  <span className="text-gray-500">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isOpen && (
                  <div className="grid gap-3 p-4 sm:grid-cols-2">
                    {module.permissions.map(
                      (permission) => (
                        <label
                          key={permission.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={permissionIds.includes(
                              permission.id,
                            )}
                            onChange={() =>
                              togglePermission(
                                permission.id,
                              )
                            }
                            className="h-4 w-4 cursor-pointer"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            {permission.action}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button
          type="button"
          onClick={() => router.push('/roles')}
          disabled={updateRoleMutation.isPending}
          className="bg-gray-300 text-gray-700 hover:bg-gray-200"
        >
          إلغاء
        </Button>

        <Button
          type="submit"
          isLoading={updateRoleMutation.isPending}
          loadingText="جاري الحفظ..."
        >
          حفظ التعديلات
        </Button>
      </div>
    </form>
  );
}