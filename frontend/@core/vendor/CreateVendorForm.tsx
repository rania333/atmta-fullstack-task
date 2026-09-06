'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/@shared/components/Input';
import Button from '@/@shared/components/Button';
import { useCategories } from '@/@features/categories/categories.hook';
import { useCreateVendor } from '@/@features/vendors/vendors.hook';

export default function CreateVendorForm() {
  const router = useRouter();

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [about, setAbout] = useState('');
  const [logo, setLogo] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);

  const { data: categoriesResponse } = useCategories({ page: 1, limit: 100 });
  
  const createVendorMutation = useCreateVendor();

  const categories = categoriesResponse?.data ?? [];

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();


    createVendorMutation.mutate(
      {
        nameAr,
        nameEn,
        about,
        logo: logo || undefined,
        crNumber,
        mobile,
        categoryId,
        isActive,
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
          onChange={(event) => setNameAr(event.target.value)}
          required
        />

        <Input
          label="الاسم بالإنجليزي"
          value={nameEn}
          onChange={(event) => setNameEn(event.target.value)}
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            نبذة عن المورد
          </label>

          <textarea
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
          />
        </div>

        <Input
          label="رابط الشعار"
          value={logo}
          onChange={(event) => setLogo(event.target.value)}
          placeholder="https://example.com/logo.png"
        />

        <Input
          label="رقم السجل التجاري"
          value={crNumber}
          onChange={(event) => setCrNumber(event.target.value)}
          placeholder="1234567890"
          maxLength={10}
          required
        />

        <Input
          label="رقم الجوال"
          value={mobile}
          onChange={(event) => setMobile(event.target.value)}
          placeholder="05XXXXXXXX أو +9665XXXXXXXX"
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            التصنيف
          </label>

          <select
            required
            value={categoryId ?? ''}
            onChange={(event) =>
              setCategoryId(
                event.target.value
                  ? Number(event.target.value)
                  : undefined,
              )
            }
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
          >
            <option value="">
              اختر التصنيف
            </option>

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
          disabled={createVendorMutation.isPending}
        >
          إلغاء
        </Button>

        <Button
          type="submit"
          isLoading={createVendorMutation.isPending}
          loadingText="جاري الإضافة..."
        >
          إضافة المورد
        </Button>
      </div>
    </form>
  );
}