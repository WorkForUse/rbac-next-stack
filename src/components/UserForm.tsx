'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Role {
  id: number;
  name: string;
}

interface UserFormProps {
  user?: {
    id: number;
    email: string;
    roleId?: number;
    status: 'active' | 'suspended' | 'banned';
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
}

export default function UserForm({ user, isOpen, onClose, onSuccess, mode }: UserFormProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roleId: 0,
    status: 'active' as 'active' | 'suspended' | 'banned',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      if (user && mode === 'edit') {
        setFormData({
          email: user.email,
          password: '',
          roleId: user.roleId || 0,
          status: user.status,
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, user, mode]);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data);
    } catch (error) {
      console.error('Failed to fetch roles');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      roleId: 0,
      status: 'active',
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (mode === 'create' && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    if (formData.roleId === 0) newErrors.roleId = 'Please select a role';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'create') {
        await api.post('/users', formData);
      } else if (user) {
        await api.patch(`/users/${user.id}`, {
          email: formData.email,
          roleId: formData.roleId,
          status: formData.status,
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Operation failed';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B3D] focus:border-transparent ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B3D] focus:border-transparent ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: parseInt(e.target.value) })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B3D] focus:border-transparent ${
                errors.roleId ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              <option value={0}>Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B3D] focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-[#FF6B3D] text-white rounded-xl font-bold hover:bg-[#F28C5F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              mode === 'create' ? 'Create User' : 'Update User'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
