'use client';
import { useEffect, useState, useCallback } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, Plus, Edit, Trash2, Search, X, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

interface Reminder {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  category: string;
  createdAt: string;
}


export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '09:00',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'Work',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) setUserPerms(JSON.parse(userData).permissions);
    
    fetchTasks();
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tasks');
      setReminders(response.data || response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reminders');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = fetchTasks;

  // Validate and format date for API submission
  const validateAndFormatDate = (dateStr: string): { valid: boolean; error?: string; date?: string } => {
    if (!dateStr) {
      return { valid: false, error: 'Date is required' };
    }

    try {
      // Parse the date string from input (YYYY-MM-DD format)
      const dateObj = new Date(dateStr + 'T00:00:00Z');
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return { valid: false, error: 'Invalid date format' };
      }

      // Return the date in YYYY-MM-DD format
      return { 
        valid: true, 
        date: dateStr 
      };
    } catch (err) {
      return { valid: false, error: 'Unable to parse date' };
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (!formData.title || !formData.dueDate) {
        setError('Please fill in reminder title and date');
        return;
      }

      // Validate date format
      const dateValidation = validateAndFormatDate(formData.dueDate);
      if (!dateValidation.valid) {
        setError(dateValidation.error || 'Invalid date');
        return;
      }

      const response = await api.post('/tasks', {
        title: formData.title,
        description: formData.description,
        dueDate: dateValidation.date, // Use validated date
        dueTime: formData.dueTime || '09:00',
        priority: formData.priority,
        category: formData.category,
        status: 'pending',
      });

      const newReminder = response.data || response.data.data;
      setReminders([...reminders, newReminder]);
      
      setSuccessMsg('Reminder created successfully');
      setShowCreateModal(false);
      resetForm();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create reminder';
      setError(errorMsg);
      console.error('Create error:', err);
    }
  };

  const handleUpdateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReminder) return;
    try {
      setError(null);

      // Validate date format
      const dateValidation = validateAndFormatDate(formData.dueDate);
      if (!dateValidation.valid) {
        setError(dateValidation.error || 'Invalid date');
        return;
      }

      // Try PUT first, fallback to PATCH if not available
      try {
        await api.put(`/tasks/${selectedReminder.id}`, {
          title: formData.title,
          description: formData.description,
          dueDate: dateValidation.date, // Use validated date
          dueTime: formData.dueTime || '09:00',
          priority: formData.priority,
          category: formData.category,
        });
      } catch (putErr: any) {
        if (putErr.response?.status === 404) {
          // Fallback to PATCH if PUT is not supported
          console.log('PUT not supported, trying PATCH instead');
          await api.patch(`/tasks/${selectedReminder.id}`, {
            title: formData.title,
            description: formData.description,
            dueDate: dateValidation.date, // Use validated date
            dueTime: formData.dueTime || '09:00',
            priority: formData.priority,
            category: formData.category,
          });
        } else {
          throw putErr;
        }
      }

      setSuccessMsg('Reminder updated successfully');
      setShowEditModal(false);
      resetForm();
      
      // Refetch reminders after update
      await fetchTasks();
      
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update reminder';
      setError(errorMsg);
      console.error('Update error:', err);
    }
  };

  const handleDeleteReminder = async (id: number) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    try {
      setError(null);
      await api.delete(`/tasks/${id}`);
      
      const updatedReminders = reminders.filter(r => r.id !== id);
      setReminders(updatedReminders);
      
      setSuccessMsg('Reminder deleted successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete reminder');
      console.error('Delete error:', err);
    }
  };

  const handleToggleComplete = async (id: number) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      try {
        setError(null);
        const newStatus = reminder.status === 'pending' ? 'completed' : 'pending';
        
        const response = await api.patch(`/tasks/${id}`, {
          status: newStatus,
        });

        const updatedReminder = response.data || response.data.data;
        const updatedReminders = reminders.map(r =>
          r.id === id
            ? { ...r, ...updatedReminder }
            : r
        );
        setReminders(updatedReminders);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update status');
        console.error('Toggle error:', err);
      }
    }
  };

  const openEditModal = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      dueDate: reminder.dueDate,
      dueTime: reminder.dueTime || '09:00',
      priority: reminder.priority as 'low' | 'medium' | 'high',
      category: reminder.category,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '09:00',
      priority: 'medium' as 'low' | 'medium' | 'high',
      category: 'Work',
    });
    setSelectedReminder(null);
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || reminder.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || reminder.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
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
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-1">Stay on top of important tasks and deadlines</p>
        </div>

        {userPerms.includes('manage_tasks') && (
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            <Plus size={16} /> New Reminder
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
          <p className="text-sm text-gray-600">Total Reminders</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{reminders.filter(r => r.status === 'pending').length}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{reminders.filter(r => r.status === 'completed').length}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search reminders..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No reminders found</p>
          </div>
        ) : (
          filteredReminders.map(reminder => (
            <div
              key={reminder.id}
              className={`p-4 border rounded-2xl flex items-start gap-4 hover:shadow-md transition-shadow ${
                reminder.status === 'completed'
                  ? 'bg-gray-50 border-gray-200'
                  : getPriorityColor(reminder.priority)
              }`}
            >
              <button
                onClick={() => handleToggleComplete(reminder.id)}
                className="mt-1 shrink-0"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  reminder.status === 'completed'
                    ? 'bg-green-600 border-green-600'
                    : 'border-gray-400 hover:border-gray-600'
                }`}>
                  {reminder.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      reminder.status === 'completed'
                        ? 'text-gray-500 line-through'
                        : 'text-gray-900'
                    }`}>
                      {reminder.title}
                    </h3>
                    {reminder.description && (
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${getPriorityBadgeColor(reminder.priority || 'medium')}`}>
                        {(reminder.priority || 'medium').charAt(0).toUpperCase() + (reminder.priority || 'medium').slice(1)} Priority
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                        {reminder.category || 'General'}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-700">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(reminder.dueDate).toLocaleDateString()} {reminder.dueTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {userPerms.includes('manage_tasks') && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(reminder)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Reminder</h2>
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

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter reminder title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Communication">Communication</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Finance">Finance</option>
                </select>
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
      {showEditModal && selectedReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Reminder</h2>
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

            <form onSubmit={handleUpdateReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
