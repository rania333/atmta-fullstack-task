'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/@shared/components/Input';
import Button from '@/@shared/components/Button';
import MultiSelect from '@/@shared/components/MultiSelect';
import { IDirectPermissionInput, IUserDetails } from '@/@features/users/users.types';
import { useRoles } from '@/@features/roles/roles.hook';
import { useUpdateDirectPermissions, useUpdateUser } from '@/@features/users/users.hook';
import { usePermissions } from '../../permissions.hook';
import DirectPermissions from '../DirectPermissions';

interface UpdateUserFormProps {
  user: IUserDetails;
}

export default function UpdateUserForm({
  user,
}: UpdateUserFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name);

  const [email, setEmail] = useState(user.email);

  const [phone, setPhone] = useState(
    user.phone ?? '',
  );

  const [roleIds, setRoleIds] = useState<number[]>(
    user.roles.map((role) => role.id),
  );

  const [directPermissions, setDirectPermissions] =
    useState<IDirectPermissionInput[]>(
        (user.directPermissions ?? []).map((permission) => ({
        permissionId: permission.id,
        effect: permission.effect,
        })),
  );
  
  const { data: permissionsResponse, isLoading: permissionsLoading} = usePermissions();
  const updatePermissionsMutation = useUpdateDirectPermissions();
  
  const permissionModules = permissionsResponse?.data ?? [];
  const { data: rolesResponse, isLoading: rolesLoading } = useRoles();

  const updateUserMutation = useUpdateUser();

  const roles = rolesResponse?.data ?? [];

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    updateUserMutation.mutate(
        {
            userId: user.id,
            data: { name, email, phone: phone || undefined, roleIds
            }
        },
        {
            onSuccess: () => {
            updatePermissionsMutation.mutate(
                { userId: user.id, permissions: directPermissions },
                {
                    onSuccess: () => { router.push('/users') }
                },
            );
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
          label="الاسم"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <Input
          label="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <Input
          label="رقم الهاتف"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />

        {rolesLoading ? (
          <p className="text-sm text-gray-500">
            جاري تحميل الأدوار...
          </p>
        ) : (
          <MultiSelect
            label="الأدوار"
            options={roleOptions}
            value={roleIds}
            onChange={setRoleIds}
            placeholder="اختر الأدوار"
          />
        )}
      </div>

      <div className="my-6 border-t border-gray-200" />
        {permissionsLoading ? (
        <p className="text-sm text-gray-500">
            جاري تحميل الصلاحيات...
        </p>
        ) : (
        <DirectPermissions
            modules={permissionModules}
            value={directPermissions}
            onChange={setDirectPermissions}
        />
    )}

      <div className="mt-8 flex justify-end gap-3">
        <Button
          type="button"
          onClick={() => router.push('/users')}
          disabled={ updateUserMutation.isPending || updatePermissionsMutation.isPending }
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          إلغاء
        </Button>

        <Button
          type="submit"
          isLoading={ updateUserMutation.isPending || updatePermissionsMutation.isPending }
          loadingText="جاري الحفظ..."
        >
          حفظ التعديلات
        </Button>
      </div>
    </form>
  );
}