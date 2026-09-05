'use client';

import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';

import Button from '@/@shared/components/Button';
import Input from '@/@shared/components/Input';

import { useDebounce } from '@/@shared/hooks/useDebounce';
import { IUser } from '@/@features/users/users.types';
import { useUsers } from '@/@features/users/useUsers.hook';
import DataTable, { DataTableColumn } from '@/@shared/components/Table';
import Pagination from '@/@shared/components/Pagination';

const columns: DataTableColumn<IUser>[] = [
  {
    key: 'name',
    header: 'الاسم',
    render: (user: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
      <span className="font-medium text-gray-900">
        {user.name}
      </span>
    ),
  },
  {
    key: 'email',
    header: 'البريد الإلكتروني',
    render: (user) => user.email,
  },
  {
    key: 'phone',
    header: 'الهاتف',
    render: (user) => user.phone ?? '-',
  },
  {
    key: 'roles',
    header: 'الأدوار',
    render: (user) =>
      user.roles.length
        ? user.roles
            .map((role) => role.name)
            .join('، ')
        : '-',
  },
  {
    key: 'status',
    header: 'الحالة',
    render: (user) => (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          user.isActive
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}
      >
        {user.isActive ? 'نشط' : 'غير نشط'}
      </span>
    ),
  },
];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useUsers({ page, limit, key: debouncedSearch});

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

        <DataTable
          data={users}
          columns={columns}
          getRowKey={(user) => user.id}
          isLoading={isLoading}
          emptyMessage="لا يوجد مستخدمون"
        />

        {meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            onPrevious={() =>
              setPage((current) => current - 1)
            }
            onNext={() =>
              setPage((current) => current + 1)
            }
          />
        )}
      </div>
    </div>
  );
}