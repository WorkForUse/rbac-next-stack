'use client';
import { useEffect, useState } from 'react';
import { Activity, Calendar, Search } from 'lucide-react';
import api from '@/lib/axios';

interface AuditLog {
  id: number;
  action: string;
  performedBy: string;
  userId?: string;
  details?: string;
  resourceId?: string;
  user?: { id: number; name?: string };
  createdAt: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/audit-logs')
      .then((res) => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch audit logs');
        setLoading(false);
      });
  }, []);

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="text-center py-12">Loading audit logs...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search actions or users..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B3D] focus:border-transparent w-64"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 text-left text-sm">
              <th className="p-4 font-medium">Action</th>
              <th className="p-4 font-medium">Performed By</th>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Resource</th>
              <th className="p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#FF6B3D]" />
                    {log.action}
                  </div>
                </td>
                <td className="p-4">{log.performedBy}</td>
                <td className="p-4">{log.userId || log.user?.name || 'N/A'}</td>
                <td className="p-4">{log.resourceId || 'N/A'}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(log.createdAt).toLocaleString()}
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
