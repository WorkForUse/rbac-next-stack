'use client';
import { useEffect, useState } from 'react';
import { Calendar, User, Edit, Trash2, FileText, Loader2, Plus } from 'lucide-react';
import api from '@/lib/axios';

interface Report {
  id: number;
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  content: string;
  author: { id: number; name?: string };
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: 'daily' | 'weekly' | 'monthly';
  }>({
    title: '',
    content: '',
    type: 'monthly',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = localStorage.getItem('userData');
      if (userData) setUserPerms(JSON.parse(userData).permissions);

      const response = await api.get('/reports');
      setReports(response.data);
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await api.post('/reports', formData);
      setSuccessMsg('Report created successfully');
      setShowCreateModal(false);
      resetForm();
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create report');
    }
  };

  const handleUpdateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      setError(null);
      await api.patch(`/reports/${selectedReport.id}`, formData);
      setSuccessMsg('Report updated successfully');
      setShowEditModal(false);
      resetForm();
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update report');
    }
  };

  const handleDeleteReport = async (id: number) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      setError(null);
      await api.delete(`/reports/${id}`);
      setSuccessMsg('Report deleted successfully');
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete report');
    }
  };

  const openEditModal = (report: Report) => {
    setSelectedReport(report);
    setFormData({
      title: report.title,
      content: report.content,
      type: report.type,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'monthly',
    });
    setSelectedReport(null);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8 text-[#FF6B3D]" /></div>;

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
          <span>✓</span> {successMsg}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-sm text-gray-500">Track and manage business analytics.</p>
        </div>
        
        {userPerms.includes('manage_reports') && (
          <button 
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="flex items-center gap-2 bg-[#FF6B3D] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#e85a2d] transition-all"
          >
            <Plus size={18} /> New Report
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Author</th>
              <th className="p-4">Created</th>
              {userPerms.includes('manage_reports') && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-800 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {report.title}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      report.type === 'daily' ? 'bg-blue-50 text-blue-600' :
                      report.type === 'weekly' ? 'bg-amber-50 text-amber-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{report.author?.name || `User #${report.author?.id}`}</td>
                  <td className="p-4 text-sm text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</td>
                  
                  {userPerms.includes('manage_reports') && (
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(report)}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Report</h2>
            <form onSubmit={handleCreateReport} className="space-y-4">
              <input
                type="text"
                placeholder="Report Title"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <textarea
                placeholder="Report Content"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#FF6B3D] text-white rounded-lg font-bold hover:bg-[#e85a2d]"
                >
                  Create Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Report</h2>
            <form onSubmit={handleUpdateReport} className="space-y-4">
              <input
                type="text"
                placeholder="Report Title"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <textarea
                placeholder="Report Content"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#FF6B3D] text-white rounded-lg font-bold hover:bg-[#e85a2d]"
                >
                  Update Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}