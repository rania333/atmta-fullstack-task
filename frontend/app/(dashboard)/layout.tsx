import AuthGuard from "@/@shared/layout/AuthGuard";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
  <AuthGuard>
    <div className="flex min-h-screen">
      <aside>
        Sidebar
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  </AuthGuard>
  );
}
