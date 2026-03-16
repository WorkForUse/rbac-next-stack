'use client';
import Sidebar from '../../components/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#FFFDFB]">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Content */}
          <section className="animate-in fade-in duration-500">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}