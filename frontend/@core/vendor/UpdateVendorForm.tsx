'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/@shared/components/Input';
import Button from '@/@shared/components/Button';
import { IVendorRes } from '@/@features/vendors/vendors.types';
import { useCategories } from '@/@features/categories/categories.hook';
import { useUpdateVendor } from '@/@features/vendors/vendors.hook';

interface UpdateVendorFormProps {
  vendor: IVendorRes;
}

export default function UpdateVendorForm({
  vendor,
}: UpdateVendorFormProps) {
  const router = useRouter();

  const [nameAr, setNameAr] = useState(vendor.nameAr);
  const [nameEn, setNameEn] = useState(vendor.nameEn);
  const [about, setAbout] = useState(vendor.about);
  const [logo, setLogo] = useState(vendor.logo ?? '');
  const [crNumber, setCrNumber] = useState(vendor.crNumber);
  const [mobile, setMobile] = useState(vendor.mobile);
  const [categoryId, setCategoryId] = useState<number>(vendor.category.id);
  const [isActive, setIsActive] = useState(vendor.isActive);

  const { data: categoriesResponse } = useCategories({ page: 1, limit: 100 });
  const updateVendorMutation = useUpdateVendor();

  const categories = categoriesResponse?.data ?? [];

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    updateVendorMutation.mutate(
      {
        vendorId: vendor.id,
        data: {
          nameAr,
          nameEn,
          about,
          logo: logo || undefined,
          crNumber,
          mobile,
          categoryId,
          isActive,
        },
      },
      {
        onSuccess: () => {
          router.push('/vendors');
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
          label="الاسم بالعربي"
          value={nameAr}
          onChange={(event) =>
            setNameAr(event.target.value)
          }
          required
        />

        <Input
          label="الاسم بالإنجليزي"
          value={nameEn}
          onChange={(event) =>
            setNameEn(event.target.value)
          }
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            نبذة عن المورد
          </label>

          <textarea
            value={about}
            onChange={(event) =>
              setAbout(event.target.value)
            }
            className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
          />
        </div>

        <Input
          label="رابط الشعار"
          value={logo}
          onChange={(event) =>
            setLogo(event.target.value)
          }
        />

        <Input
          label="رقم السجل التجاري"
          value={crNumber}
          onChange={(event) =>
            setCrNumber(event.target.value)
          }
          maxLength={10}
          required
        />

        <Input
          label="رقم الجوال"
          value={mobile}
          onChange={(event) =>
            setMobile(event.target.value)
          }
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            التصنيف
          </label>

          <select
            value={categoryId}
            onChange={(event) =>
              setCategoryId(Number(event.target.value))
            }
            required
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.nameAr}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) =>
              setIsActive(event.target.checked)
            }
          />

          <span className="text-sm text-gray-700">
            المورد نشط
          </span>
        </label>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button
          type="button"
          onClick={() => router.push('/vendors')}
          disabled={updateVendorMutation.isPending}
        >
          إلغاء
        </Button>

        <Button
          type="submit"
          isLoading={updateVendorMutation.isPending}
          loadingText="جاري الحفظ..."
        >
          حفظ التعديلات
        </Button>
      </div>
    </form>
  );
}