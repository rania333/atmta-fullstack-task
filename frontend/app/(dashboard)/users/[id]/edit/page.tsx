'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';


import Button from '@/@shared/components/Button';
import Input from '@/@shared/components/Input';
import MultiSelect from '@/@shared/components/MultiSelect';
import { useRoles } from '@/@features/roles/roles.hook';
import { useUser, useUpdateUser } from '@/@features/users/users.hook';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  const userId = Number(params.id);

  const { data: userResponse, isLoading } = useUser(userId);

  const { data: rolesResponse } = useRoles();

  const updateUserMutation = useUpdateUser();

  const user = userResponse?.data;
  const roles = rolesResponse?.data ?? [];

  const [name, setName] = useState('');
  const [email, setEmail] =
    useState('');
  const [phone, setPhone] =
    useState('');
  const [roleIds, setRoleIds] =
    useState<number[]>([]);

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? '');

    setRoleIds(
      user.roles.map((role) => role.id),
    );
  }, [user]);

  const roleOptions = roles.map(
    (role) => ({
      value: role.id,
      label: role.name,
    }),
  );

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    updateUserMutation.mutate(
      {
        userId,
        data: {
          name,
          email,
          phone:
            phone || undefined,
          roleIds,
        },
      },
      {
        onSuccess: () => {
          router.push('/users');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        جاري تحميل المستخدم...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          تعديل المستخدم
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          تعديل بيانات المستخدم
          والأدوار الخاصة به
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="space-y-5">
          <Input
            label="الاسم"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            required
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            required
          />

          <Input
            label="رقم الهاتف"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value,
              )
            }
          />

          <MultiSelect
            label="الأدوار"
            options={roleOptions}
            value={roleIds}
            onChange={setRoleIds}
            placeholder="اختر الأدوار"
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            onClick={() =>
              router.push('/users')
            }
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            إلغاء
          </Button>

          <Button
            type="submit"
            isLoading={
              updateUserMutation.isPending
            }
            loadingText="جاري الحفظ..."
          >
            حفظ التعديلات
          </Button>
        </div>
      </form>
    </div>
  );
}