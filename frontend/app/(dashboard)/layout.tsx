import AuthGuard from "@/@shared/layout/AuthGuard";
import Sidebar from "@/@shared/layout/Sidebar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
