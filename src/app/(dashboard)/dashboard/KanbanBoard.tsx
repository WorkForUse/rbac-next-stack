'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Loader2 } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: { id: number; name: string; email: string };
}

const statusMap: Record<string, string> = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'completed': 'Completed'
};

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-50',
  'in-progress': 'bg-blue-50',
  'completed': 'bg-green-50'
};

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = ['pending', 'in-progress', 'completed'] as const;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {columns.map((status) => {
        const statusTasks = tasks.filter(t => t.status === status);
        return (
          <div key={status} className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {statusMap[status]}
              </h3>
              <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded-full">
                {statusTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {statusTasks.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-xs">
                  No tasks
                </div>
              ) : (
                statusTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`${
                      statusColors[status] || 'bg-white'
                    } p-4 rounded-xl shadow-sm border border-gray-100 space-y-2 cursor-grab hover:shadow-md transition-shadow`}
                  >
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    {task.assignedTo && (
                      <p className="text-xs text-gray-500">{task.assignedTo.name}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}