'use client';

import { useParams, useRouter } from 'next/navigation';

import Button from '@/@shared/components/Button';
import { useVendor } from '@/@features/vendors/vendors.hook';

export default function VendorDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const vendorId = Number(params.id);

  const {
    data: vendorResponse,
    isLoading,
  } = useVendor(vendorId);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        جاري تحميل بيانات المورد...
      </div>
    );
  }

  const vendor = vendorResponse?.data;

  if (!vendor) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        المورد غير موجود
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            تفاصيل المورد
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            عرض جميع بيانات المورد
          </p>
        </div>

        <Button
          type="button"
          onClick={() => router.push('/vendors')}
        >
          رجوع
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <DetailItem
            label="الاسم بالعربي"
            value={vendor.nameAr}
          />

          <DetailItem
            label="الاسم بالإنجليزي"
            value={vendor.nameEn}
          />

          <DetailItem
            label="التصنيف"
            value={vendor.category.nameAr}
          />

          <DetailItem
            label="رقم السجل التجاري"
            value={vendor.crNumber}
          />

          <DetailItem
            label="رقم الجوال"
            value={vendor.mobile}
          />

          <DetailItem
            label="الحالة"
            value={vendor.isActive ? 'نشط' : 'غير نشط'}
          />

          <DetailItem
            label="أنشئ بواسطة"
            value={vendor.createdBy}
          />

          <DetailItem
            label="آخر تعديل بواسطة"
            value={vendor.updatedBy || '-'}
          />

          <DetailItem
            label="تاريخ الإنشاء"
            value={new Date(vendor.createdAt).toLocaleString('ar-EG')}
          />

          <DetailItem
            label="تاريخ آخر تعديل"
            value={new Date(vendor.updatedAt).toLocaleString('ar-EG')}
          />

          <div className="md:col-span-2">
            <DetailItem
              label="نبذة عن المورد"
              value={vendor.about || '-'}
            />
          </div>

          {vendor.logo && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm text-gray-500">
                الشعار
              </p>

              <img
                src={vendor.logo}
                alt={vendor.nameAr}
                className="h-20 w-20 rounded-lg border border-gray-200 object-contain"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({
  label,
  value,
}: DetailItemProps) {
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