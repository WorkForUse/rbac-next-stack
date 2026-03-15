'use client';
import { LayoutDashboard, Users, BookOpen, ClipboardList } from 'lucide-react';

export default function DashboardPage() {
  /* Mock stats (Real app mein aap useEffect se API call karenge) */
  const stats = [
    { title: 'Total Leads', value: '482', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Active Tasks', value: '12', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'System Users', value: '8', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Open Reports', value: '5', icon: LayoutDashboard, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className={`p-3 rounded-xl w-fit mb-4 ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Recent Notifications</h3>
          <p className="text-sm text-gray-500 italic">No new system alerts at the moment.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="flex gap-4">
             <button className="px-4 py-2 bg-[#FF6B3D] text-white rounded-xl text-sm font-medium hover:bg-[#F28C5F]">Add Lead</button>
             <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}