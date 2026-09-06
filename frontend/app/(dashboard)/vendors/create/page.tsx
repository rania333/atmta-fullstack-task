import CreateVendorForm from "@/@core/vendor/CreateVendorForm";

export default function CreateVendorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          إضافة مورد
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          إضافة مورد جديد
        </p>
      </div>

      <CreateVendorForm />
    </div>
  );
}