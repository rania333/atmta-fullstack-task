export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}