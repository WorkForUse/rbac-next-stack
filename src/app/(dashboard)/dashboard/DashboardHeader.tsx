'use client';
import { useState } from 'react';
import { Plus, Search, ListFilter, ArrowDownUp, UserCircle, ChevronDown, X, Loader2 } from "lucide-react";
import api from '@/lib/axios';

export function DashboardHeader() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' as const });

  const handleCreateTask = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.title.trim()) {
        setError('Task title is required');
        return;
      }

      await api.post('/tasks', {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      });

      setFormData({ title: '', description: '', status: 'pending' });
      setShowCreateModal(false);
      
      // Reload page or dispatch event to refresh tasks
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header - Glass Effect, Removed heavy borders/shadows */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl">
        <h2 className="font-bold text-[20px] text-gray-800">Tasks</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4"/>
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-9 pr-4 py-2 bg-black/5 border-none rounded-xl text-sm w-56 focus:ring-1 focus:ring-gray-300 outline-none transition-all placeholder:text-gray-400" 
            />
          </div>

          <button className="p-2 text-gray-500 hover:bg-black/5 rounded-lg transition-all"><ArrowDownUp size={16} /></button>
          <button className="p-2 text-gray-500 hover:bg-black/5 rounded-lg transition-all"><ListFilter size={16} /></button>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
          >
            <Plus size={16}/> Add
          </button>
        </div>
      </div>

      {/* Create Task Modal - Glassmorphism */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          
          {/* Modal Container - Glassmorphism */}
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Create New Task</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-800"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                value={formData.title} 
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (error) setError('');
                }} 
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-xl outline-none focus:ring-2 focus:ring-gray-200" 
                placeholder="Task title" 
              />
              <textarea 
                value={formData.description} 
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (error) setError('');
                }} 
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-xl outline-none focus:ring-2 focus:ring-gray-200" 
                placeholder="Description" 
                rows={3} 
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-black/5">Cancel</button>
              <button 
                onClick={handleCreateTask} 
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
