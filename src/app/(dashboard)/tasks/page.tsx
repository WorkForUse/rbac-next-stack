'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Data fetch karne ka function
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 border rounded shadow-sm bg-white">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
            <div className="mt-2 flex justify-between">
              <span className="text-sm text-blue-500 font-medium">Status: {task.status}</span>
              <span className="text-sm text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}