'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@/@features/users/users.hook';
import UpdateUserForm from '@/@core/permissions/components/User/UpdateUserForm';

export default function EditUserPage() {
  const params = useParams();
  const userId = Number(params.id);

  const validUserId = Number.isInteger(userId) && userId > 0;
  const { data: userResponse, isPending, isError, refetch } = useUser(validUserId ? userId : undefined);
  const user = userResponse?.data;

  if (!validUserId) {
    return <p role="alert" className="text-red-600">رقم المستخدم غير صحيح.</p>;
  }

  if (isPending) {
    return <p role="status" className="text-gray-600">جاري تحميل بيانات المستخدم...</p>;
  }

  if (isError) {
    return (
      <div role="alert" className="space-y-3">
        <p className="text-red-600">تعذّر تحميل بيانات المستخدم.</p>
        <button type="button" onClick={() => void refetch()} className="text-blue-700 underline">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!user) {
    return <p role="alert" className="text-gray-600">لم يتم العثور على بيانات المستخدم.</p>;
  }

  return (
     <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          تعديل المستخدم
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          تعديل بيانات المستخدم والأدوار الخاصة به
        </p>
      </div>

      <UpdateUserForm key={user.id} user={user} />
    </div>
  );
}
