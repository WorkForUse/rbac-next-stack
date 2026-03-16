'use client';
import { useEffect, useState } from 'react';
import { Activity, Calendar, Search, ShieldAlert, Database } from 'lucide-react';
import api from '@/lib/axios';

// Audit Log Interface updated for better type safety
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
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Note: Error handling ko aur better kiya hai
    api.get('/audit-logs')
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Audit Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500">Track all system activities and security events.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B3D] outline-none w-full md:w-72"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading system activity...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-2">
            <Database className="w-10 h-10 text-gray-300" />
            <p className="text-gray-500">No logs found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 text-xs uppercase tracking-wider">
                  <th className="p-4">Action</th>
                  <th className="p-4">Performed By</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Resource</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-800 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#FF6B3D]" />
                      {log.action}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{log.performedBy}</td>
                    <td className="p-4 text-sm text-gray-500">{log.userId || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-500">{log.resourceId || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(log.createdAt).toLocaleDateString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}