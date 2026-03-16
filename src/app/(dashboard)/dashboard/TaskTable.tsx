'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Loader2 } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  status: string;
  assignedTo?: { id: number; name: string; email: string };
  dueDate?: string;
}

export function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data.slice(0, 5)); // Show first 5 tasks
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 mt-4 p-8 flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 mt-4 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr className="text-gray-400 text-xs uppercase tracking-wider">
            <th className="p-4 text-left font-medium">Title</th>
            <th className="p-4 text-left font-medium">Assigned To</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-left font-medium">Due Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No tasks found
              </td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium">{task.title}</td>
                <td className="p-4 text-gray-600">{task.assignedTo?.name || 'Unassigned'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase ${
                    task.status === 'completed' ? 'bg-green-50 text-green-600' :
                    task.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                    'bg-yellow-50 text-yellow-600'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="p-4 text-gray-600">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}