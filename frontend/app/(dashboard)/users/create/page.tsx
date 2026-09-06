'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/@shared/components/Button';
import Input from '@/@shared/components/Input';
import MultiSelect from '@/@shared/components/MultiSelect';
import { useRoles } from '@/@features/roles/roles.hook';
import { useCreateUser } from '@/@features/users/users.hook';
import { validateCreateUser } from '@/@features/users/create-user.validation';
import type { ICreateUserReq } from '@/@features/users/users.types';

export default function CreateUserPage() {
  const router = useRouter();

  // States for req data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const [touched, setTouched] = useState<Partial<Record<keyof ICreateUserReq, boolean>>>({});
  const touch = (field: keyof ICreateUserReq) =>
    setTouched((current) => ({ ...current, [field]: true }));

  // Get roles to fill the menu
  const { data: rolesResponse, isLoading: rolesLoading, isError: rolesError } = useRoles();

  const createUserMutation = useCreateUser();

  const roles = rolesResponse?.data ?? [];
  const formData = { name: name.trim(), email: email.trim(), password, phone: phone.trim(), roleIds };
  const errors = validateCreateUser(formData);
  const isValid = Object.keys(errors).length === 0 &&
    roleIds.every((id) => roles.some((role) => role.id === id));
  const canSubmit = isValid && !rolesLoading && !rolesError && !createUserMutation.isPending;

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true, phone: true, roleIds: true });
    if (!canSubmit) return;
    
    createUserMutation.mutate(
      formData,
      {
        onSuccess: () => {
          router.push('/users');
        },
      },
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          إضافة مستخدم
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          إضافة مستخدم جديد وتحديد الأدوار الخاصة به
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="space-y-5">
          <Input
            id="name"
            onBlur={() => touch('name')}
            error={touched.name ? errors.name : undefined}
            label="الاسم"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="أدخل اسم المستخدم"
            required
          />

          <Input
            id="email"
            onBlur={() => touch('email')}
            error={touched.email ? errors.email : undefined}
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="example@email.com"
            required
          />

          <Input
            id="password"
            minLength={8}
            onBlur={() => touch('password')}
            error={touched.password ? errors.password : undefined}
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="أدخل كلمة المرور"
            required
          />

          <Input
            id="phone"
            type="tel"
            required
            onBlur={() => touch('phone')}
            error={touched.phone ? errors.phone : undefined}
            label="رقم الهاتف"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
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
              onChange={(value) => { setRoleIds(value); touch('roleIds'); }}
              onBlur={() => touch('roleIds')}
              error={touched.roleIds ? errors.roleIds : undefined}
              placeholder="اختر الأدوار"
            />
          )}
          {rolesError && <p role="alert" className="text-sm text-red-600">تعذّر تحميل الأدوار. أعد تحميل الصفحة للمحاولة مرة أخرى.</p>}
          {!rolesLoading && !rolesError && roles.length === 0 && (
            <p className="text-sm text-gray-600">لا توجد أدوار متاحة. أضف دورًا قبل إنشاء المستخدم.</p>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => router.push('/users')}
            color="gray"
            variant="soft"
            disabled={createUserMutation.isPending}
          >
            إلغاء
          </Button>

          <Button
            type="submit"
            disabled={!canSubmit}
            isLoading={createUserMutation.isPending}
            loadingText="جاري الإضافة..."
          >
            إضافة المستخدم
          </Button>
        </div>
      </form>
    </div>
  );
}
