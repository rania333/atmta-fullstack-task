'use client';
import CreateUserForm from '@/@core/permissions/components/CreateUserForm';

export default function CreateUserPage() {
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

      <CreateUserForm />
    </div>
  );
}
