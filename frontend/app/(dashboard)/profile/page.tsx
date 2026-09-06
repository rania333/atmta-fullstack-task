'use client';

import { useProfileDetails } from '@/@features/profile/profile.hook';
import { auth } from '@/@shared/libs/auth';

export default function ProfilePage() {
  const currentUser = auth.getUser();
  const userId = currentUser?.id ?? 0;

  const { data: profileResponse, isLoading } = useProfileDetails(userId);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        جاري تحميل البيانات...
      </div>
    );
  }

  const profile = profileResponse?.data;
  const createdVendors = profile?.createdVendors ?? [];

  if (!profile) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        بيانات المستخدم غير موجودة
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          الملف الشخصي
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          بيانات المستخدم والصلاحيات
        </p>
      </div>

      <div className="space-y-6">

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            البيانات الأساسية
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProfileItem label="الاسم" value={profile.name} />

            <ProfileItem label="البريد الإلكتروني" value={profile.email} />

            <ProfileItem
              label="رقم الهاتف"
              value={profile.phone || '-'}
            />

            <ProfileItem
              label="الحالة"
              value={profile.isActive ? 'نشط' : 'غير نشط'}
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            الأدوار
          </h2>

          <div className="flex flex-wrap gap-2">
            {profile.roles.length > 0 ? (
              profile.roles.map((role) => (
                <span
                  key={role.id}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {role.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                لا توجد أدوار
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            الصلاحيات الفعلية
          </h2>

          <div className="flex flex-wrap gap-2">
            {profile.effectivePermissions.length > 0 ? (
              profile.effectivePermissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
                >
                  {permission}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                لا توجد صلاحيات
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            الموردون الذين تم إنشاؤهم
          </h2>

          {createdVendors.length === 0 ? (
            <p className="text-sm text-gray-500">
              لم يتم إنشاء موردين بواسطة هذا المستخدم
            </p>
          ) : (
            <div className="space-y-3">
              {createdVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {vendor.nameAr}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {vendor.nameEn}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {vendor.category.nameAr}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      vendor.isActive
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {vendor.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

interface ProfileItemProps {
  label: string;
  value: string;
}

function ProfileItem({
  label,
  value,
}: ProfileItemProps) {
  return (
    <div>
      <p className="mb-1 text-sm text-gray-500">
        {label}
      </p>

      <p className="font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}
