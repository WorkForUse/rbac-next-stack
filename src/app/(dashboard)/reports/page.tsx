'use client';
import { useEffect, useState } from 'react';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/axios';

interface Report {
  id: number;
  title: string;
  content: string;
  type: 'daily' | 'weekly' | 'monthly';
  author: { id: number; name?: string };
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports')
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((_err) => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-12">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports Management</h1>
        <button className="bg-[#FF6B3D] text-white px-6 py-2 rounded-xl hover:bg-orange-500 transition-colors">
          + New Report
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 text-left text-sm">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Author</th>
              <th className="p-4 font-medium">Created</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium max-w-md truncate">{report.title}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.type === 'daily' ? 'bg-blue-100 text-blue-800' :
                    report.type === 'weekly' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.type.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {report.author?.name || `User #${report.author?.id}`}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:underline text-sm p-1 rounded hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:underline text-sm p-1 rounded hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
