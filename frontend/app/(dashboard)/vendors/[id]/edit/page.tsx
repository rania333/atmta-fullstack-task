'use client';

import UpdateVendorForm from '@/@core/vendor/UpdateVendorForm';
import { useVendor } from '@/@features/vendors/vendors.hook';
import { useParams } from 'next/navigation';

export default function EditVendorPage() {
  const params = useParams();

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          تعديل المورد
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          تعديل بيانات المورد
        </p>
      </div>

      <UpdateVendorForm vendor={vendor} />
    </div>
  );
}