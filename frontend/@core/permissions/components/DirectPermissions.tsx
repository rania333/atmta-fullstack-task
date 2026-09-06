'use client';

import { useState } from 'react';
import { IPermissionRes } from '../permissions.types';
import { IDirectPermissionInput, PermissionEffect } from '@/@features/users/users.types';


interface DirectPermissionsProps {
  modules: IPermissionRes[];
  value: IDirectPermissionInput[];
  onChange: (value: IDirectPermissionInput[]) => void;
}

export default function DirectPermissions({
  modules,
  value,
  onChange,
}: DirectPermissionsProps) {
  const [openModules, setOpenModules] = useState<number[]>([]);

  const toggleModule = (moduleId: number) => {
    setOpenModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    );
  };

  const getEffect = (
    permissionId: number,
  ): PermissionEffect | 'inherit' => {
    const currentPermission = value.find(
      (item) => item.permissionId === permissionId,
    );

    return currentPermission?.effect ?? 'inherit';
  };

  const handleChange = (
    permissionId: number,
    effect: PermissionEffect | 'inherit',
  ) => {
    const otherPermissions = value.filter(
      (item) => item.permissionId !== permissionId,
    );

    if (effect === 'inherit') {
      onChange(otherPermissions);
      return;
    }

    onChange([
      ...otherPermissions,
      {
        permissionId,
        effect,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          الصلاحيات المباشرة
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          يمكنك منح أو سحب صلاحيات مباشرة لهذا المستخدم
        </p>
      </div>

      {modules.map((module) => {
        const isOpen = openModules.includes(module.id);

        return (
          <div
            key={module.id}
            className="overflow-hidden rounded-lg border border-gray-200"
          >
            <button
              type="button"
              onClick={() => toggleModule(module.id)}
              className="flex w-full cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 text-right hover:bg-gray-100"
            >
              <span className="font-medium text-gray-900">
                {module.displayName}
              </span>

              <span className="text-gray-600">
                {isOpen ? '▲' : '▼'}
              </span>
            </button>

            {isOpen && (
              <div className="divide-y divide-gray-100">
                {module.permissions.map((permission) => {
                  const effect = getEffect(permission.id);

                  return (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {permission.action}
                      </span>

                      <select
                        value={effect}
                        onChange={(event) =>
                          handleChange(
                            permission.id,
                            event.target.value as
                              | PermissionEffect
                              | 'inherit',
                          )
                        }
                        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-blue-500"
                      >
                        <option value="inherit">
                          حسب الدور
                        </option>

                        <option value="grant">
                          منح
                        </option>

                        <option value="revoke">
                          سحب
                        </option>
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}