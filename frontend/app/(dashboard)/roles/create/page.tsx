import CreateRoleForm from "@/@core/permissions/components/Role/CreateRoleForm";

export default function CreateRolePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          إضافة دور
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          إنشاء دور جديد وتحديد الصلاحيات الخاصة به
        </p>
      </div>

      <CreateRoleForm />
    </div>
  );
}