import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <div className="relative flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(199,181,255,0.18),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(110,231,183,0.12),transparent_50%)]" />
        <Sidebar />
        <main className="relative z-10 flex-1 px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
