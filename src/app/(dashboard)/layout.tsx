'use client';
import Sidebar from '../../components/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#FFFDFB]">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header (Optional - Aap yahan Breadcrumbs ya User Profile laga sakte hain) */}
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overview</h2>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              U
            </div>
          </header>

          {/* Page Content */}
          <section className="animate-in fade-in duration-500">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}