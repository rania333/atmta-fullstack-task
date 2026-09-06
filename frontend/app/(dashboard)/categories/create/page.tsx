import CreateCategoryForm from "@/@core/permissions/components/category/CreateCategoryForm";

export default function CreateCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          إضافة تصنيف
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          إضافة تصنيف جديد أو تصنيف فرعي
        </p>
      </div>

      <CreateCategoryForm />
    </div>
  );
}