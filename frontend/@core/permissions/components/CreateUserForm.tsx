'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/@shared/components/Input';
import Button from '@/@shared/components/Button';
import MultiSelect from '@/@shared/components/MultiSelect';
import { useRoles } from '@/@features/roles/roles.hook';
import { useCreateUser } from '@/@features/users/users.hook';

export default function CreateUserForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [roleIds, setRoleIds] = useState<number[]>([]);

  const { data: rolesResponse, isLoading: rolesLoading } = useRoles();

  const createUserMutation = useCreateUser();

  const roles = rolesResponse?.data ?? [];

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    createUserMutation.mutate(
      {
        name,
        email,
        password,
        phone: phone || '',
        roleIds,
      },
      {
        onSuccess: () => {
          router.push('/users');
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
          placeholder="أدخل اسم المستخدم"
          required
        />

        <Input
          label="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@email.com"
          required
        />

        <Input
          label="كلمة المرور"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="أدخل كلمة المرور"
          required
        />

        <Input
          label="رقم الهاتف"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+9665XXXXXXXX"
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

      <div className="mt-8 flex justify-end gap-3">
        <Button
          type="button"
          onClick={() => router.push('/users')}
          disabled={createUserMutation.isPending}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          إلغاء
        </Button>

        <Button
          type="submit"
          isLoading={createUserMutation.isPending}
          loadingText="جاري الإضافة..."
        >
          إضافة المستخدم
        </Button>
      </div>
    </form>
  );
}