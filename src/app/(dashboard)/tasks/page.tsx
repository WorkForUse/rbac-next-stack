'use client';
import { useEffect, useState } from 'react';
import { ClipboardList, Loader2, CheckCircle2, Clock, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/axios';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  assignedTo?: { id: number; name: string; email: string } | null;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as const,
  });
  const [assignedToId, setAssignedToId] = useState<number | null>(null);
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

      const [tasksRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users')
      ]);
      
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await api.post('/tasks', {
        ...formData,
        assignedToId: assignedToId || undefined
      });
      setSuccessMsg('Task created successfully');
      setShowCreateModal(false);
      resetForm();
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      setError(null);
      await api.patch(`/tasks/${selectedTask.id}`, {
        ...formData,
        assignedToId: assignedToId || undefined
      });
      setSuccessMsg('Task updated successfully');
      setShowEditModal(false);
      resetForm();
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      setError(null);
      await api.delete(`/tasks/${id}`);
      setSuccessMsg('Task deleted successfully');
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
    });
    setAssignedToId(task.assignedTo?.id || null);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
    });
    setAssignedToId(null);
    setSelectedTask(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#FF6B3D]" /></div>;

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
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-sm text-gray-500">Track and manage your daily deliverables.</p>
        </div>
        {userPerms.includes('manage_tasks') && (
          <button 
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="flex items-center gap-2 bg-[#FF6B3D] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#e85a2d] transition-all"
          >
            <Plus size={18} /> Create Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tasks found
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${task.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <ClipboardList className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    {getStatusIcon(task.status)}
                    {task.status.replace('-', ' ')}
                  </div>
                  {userPerms.includes('manage_tasks') && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                        title="Edit"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2">{task.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
              
              {task.assignedTo && (
                <div className="mb-4 p-2 bg-orange-50 rounded text-xs">
                  <span className="text-gray-600">Assigned to: </span>
                  <span className="text-[#FF6B3D] font-medium">{task.assignedTo.name}</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100 text-xs font-medium text-gray-400">
                Status: {task.status.replace('-', ' ').toUpperCase()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <textarea
                placeholder="Description"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={assignedToId || ''}
                onChange={(e) => setAssignedToId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Assign to (optional)</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h2>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <textarea
                placeholder="Description"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B3D] outline-none"
                value={assignedToId || ''}
                onChange={(e) => setAssignedToId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Assign to (optional)</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
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
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}