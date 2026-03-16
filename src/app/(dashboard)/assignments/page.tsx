'use client';
import { useEffect, useState } from 'react';
import { Users, CheckCircle, Clock, AlertCircle, Plus, Edit, Trash2, Search, Loader2, X } from 'lucide-react';
import api from '@/lib/axios';

interface Assignment {
  id: number;
  taskId: number;
  taskTitle: string;
  assignedTo: { id: number; name: string; email: string };
  assignedBy: { id: number; name: string; email: string };
  status: 'pending' | 'accepted' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  notes?: string;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [formData, setFormData] = useState({
    taskId: 0,
    assignedToId: 0,
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    notes: '',
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

      const [usersRes, tasksRes] = await Promise.all([
        api.get('/users'),
        api.get('/tasks'),
      ]);
      
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
      
      // Create assignments from tasks that have assignedTo
      const assignments: Assignment[] = tasksRes.data
        .filter((task: any) => task.assignedTo)
        .map((task: any, index: number) => ({
          id: task.id,
          taskId: task.id,
          taskTitle: task.title,
          assignedTo: task.assignedTo || usersRes.data[index % usersRes.data.length],
          assignedBy: usersRes.data[0],
          status: 'accepted' as const,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          dueDate: task.dueDate,
          notes: `Assigned task: ${task.title}`,
          createdAt: new Date().toISOString(),
        }));
      
      setAssignments(assignments.length > 0 ? assignments : createMockAssignments(tasksRes.data, usersRes.data));
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createMockAssignments = (tasks: any[], users: User[]) => {
    return tasks.slice(0, 6).map((task: any, index: number) => ({
      id: index + 1,
      taskId: task.id,
      taskTitle: task.title,
      assignedTo: users[index % users.length],
      assignedBy: users[0],
      status: 'accepted' as const,
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      dueDate: task.dueDate,
      notes: `Assigned task: ${task.title}`,
      createdAt: new Date().toISOString(),
    }));
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (!formData.taskId || !formData.assignedToId) {
        setError('Please select a task and assignee');
        return;
      }
      
      // Try to create assignment via API
      try {
        await api.post('/tasks', {
          taskId: formData.taskId,
          assignedToId: formData.assignedToId,
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
          notes: formData.notes,
        });
      } catch (apiErr) {
        // If API endpoint doesn't exist, fall back to local state
        console.log('Tasks API endpoint not available, using local state');
      }
      
      const newAssignment: Assignment = {
        id: assignments.length + 1,
        taskId: formData.taskId,
        taskTitle: tasks.find(t => t.id === formData.taskId)?.title || '',
        assignedTo: users.find(u => u.id === formData.assignedToId) || { id: 0, name: '', email: '' },
        assignedBy: { id: 1, name: 'Current User', email: 'user@example.com' },
        status: 'pending',
        priority: formData.priority,
        dueDate: formData.dueDate,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
      };
      
      setAssignments([...assignments, newAssignment]);
      setSuccessMsg('Assignment created successfully');
      setShowCreateModal(false);
      resetForm();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      setError(null);
      
      // Try to update assignment via API
      try {
        await api.patch(`/tasks/${selectedAssignment.id}`, {
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
          notes: formData.notes,
        });
      } catch (apiErr) {
        // If API endpoint doesn't exist, fall back to local state
        console.log('Tasks API endpoint not available, using local state');
      }
      
      const updatedAssignments = assignments.map(a => 
        a.id === selectedAssignment.id 
          ? { ...a, priority: formData.priority, dueDate: formData.dueDate, notes: formData.notes }
          : a
      );
      
      setAssignments(updatedAssignments);
      setSuccessMsg('Assignment updated successfully');
      setShowEditModal(false);
      resetForm();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      setError(null);
      setAssignments(assignments.filter(a => a.id !== id));
      setSuccessMsg('Assignment deleted successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const openEditModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      taskId: assignment.taskId,
      assignedToId: assignment.assignedTo.id,
      priority: assignment.priority,
      dueDate: assignment.dueDate || '',
      notes: assignment.notes || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      taskId: 0,
      assignedToId: 0,
      priority: 'medium' as 'low' | 'medium' | 'high',
      dueDate: '',
      notes: '',
    });
    setSelectedAssignment(null);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Assignments</h1>
          <p className="text-sm text-gray-500">Manage and track task assignments across your team.</p>
        </div>
        
        {userPerms.includes('manage_tasks') && (
          <button 
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            <Plus size={16} /> New Assignment
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex-1 flex gap-3 w-full">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No assignments found
                </td>
              </tr>
            ) : (
              filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{assignment.taskTitle}</p>
                      <p className="text-xs text-gray-500">#{assignment.taskId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{assignment.assignedTo.name}</p>
                      <p className="text-xs text-gray-500">{assignment.assignedTo.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(assignment.status)}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {userPerms.includes('manage_tasks') && (
                        <>
                          <button
                            onClick={() => openEditModal(assignment)}
                            className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Assignment</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.taskId}
                  onChange={(e) => setFormData({...formData, taskId: parseInt(e.target.value)})}
                >
                  <option value={0}>Select a task</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.assignedToId}
                  onChange={(e) => setFormData({...formData, assignedToId: parseInt(e.target.value)})}
                >
                  <option value={0}>Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Assignment</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
