'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { auth } from '@/@shared/libs/auth';
import { useProfile } from '@/@core/profile/userProfile.hook';

const menuItems = [
  {
    label: 'المستخدمون',
    href: '/users',
    permission: 'users.read',
  },
  {
    label: 'الأدوار والصلاحيات',
    href: '/roles',
    permission: 'roles.read',
  },
  {
    label: 'التصنيفات',
    href: '/categories',
    permission: 'categories.read',
  },
  {
    label: 'الموردون',
    href: '/vendors',
    permission: 'vendors.read',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const user = auth.getUser();
  const { data, isLoading } = useProfile(user?.id);
  const profile = data?.data;

  const visibleItems = menuItems.filter((item) =>
    profile?.effectivePermissions.includes(
      item.permission,
    ),
  );

  return (
    <aside className="min-h-screen w-64 border-l border-gray-200 bg-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">
          لوحة التحكم
        </h2>

        {user && (
          <p className="mt-1 text-sm text-gray-500">
            {user.name}
          </p>
        )}
      </div>

      <nav className="space-y-2">
        {isLoading ? (
          <p className="px-4 py-3 text-sm text-gray-500">
            جاري التحميل...
          </p>
        ) : (
          <>
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/profile"
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                pathname === '/profile'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              الملف الشخصي
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
