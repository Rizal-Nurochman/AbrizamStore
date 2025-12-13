import { Sidebar } from "@/components/Sidebar";
import { UserNav } from "@/components/UserNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]"> {/* Light aesthetic background */}
      <Sidebar />
      <main className="flex-1 relative overflow-hidden">
        {/* Background blobs for vibrancy */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />

        <div className="relative h-screen overflow-y-auto scroll-smooth">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24">
            <div className="flex justify-end mb-6">
              <UserNav />
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
