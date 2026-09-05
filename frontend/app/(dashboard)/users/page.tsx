'use client';

import { useState } from 'react';
import Input from '@/@shared/components/Input';
import Button from '@/@shared/components/Button';
import { useUsers } from '@/@features/users/useUsers.hook';
import { useDebounce } from '@/@shared/hooks/useDebounce';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useUsers({ page, limit, key: debouncedSearch });
  
  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            المستخدمون
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            إدارة المستخدمين والأدوار الخاصة بهم
          </p>
        </div>

        <Button>
          إضافة مستخدم
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <div className="max-w-sm">
            <Input
              placeholder="البحث عن مستخدم..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              } } label={''}            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            جاري تحميل المستخدمين...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      الاسم
                    </th>

                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      البريد الإلكتروني
                    </th>

                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      الهاتف
                    </th>

                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      الأدوار
                    </th>

                    <th className="px-4 py-3 text-sm font-medium text-gray-600">
                      الحالة
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {user.name}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {user.phone ?? '-'}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {user.roles
                          .map((role) => role.name)
                          .join('، ')}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {user.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-500">
                لا يوجد مستخدمون
              </div>
            )}

            {meta && (
              <div className="flex items-center justify-between border-t border-gray-200 p-4">
                <p className="text-sm text-gray-500">
                  إجمالي المستخدمين: {meta.total}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    السابق
                  </Button>

                  <span className="px-2 text-sm text-gray-600">
                    {meta.page} من {meta.totalPages}
                  </span>

                  <Button
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}