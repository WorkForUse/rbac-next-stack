'use client';
import { useState, ReactNode } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/axios';

interface PermissionAtom {
  id: string;
  label: string;
}

interface TargetUser {
  id: string;
  email: string;
  permissions: string[];
}

interface PermissionEditorProps {
  targetUser: TargetUser;
  currentUserPermissions: string[];
  onUpdate: () => void;
}

export default function PermissionEditor({ targetUser, currentUserPermissions, onUpdate }: PermissionEditorProps) {

  const [selectedPermissions, setSelectedPermissions] = useState(targetUser.permissions || []);
  const [loading, setLoading] = useState(false);

  const allAvailableAtoms: PermissionAtom[] = [
    { id: 'view_dashboard', label: 'Dashboard Access' },
    { id: 'manage_users', label: 'User Management' },
    { id: 'view_leads', label: 'Leads Access' },
    { id: 'manage_tasks', label: 'Tasks Management' },
    { id: 'view_reports', label: 'Reports Access' },
    { id: 'view_audit', label: 'Audit Logs' },
  ];

  const handleToggle = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter((id: string) => id !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const savePermissions = async () => {
    setLoading(true);
    try {
      const currentPerms = targetUser.permissions || [];
      const toRevoke = currentPerms.filter(id => !selectedPermissions.includes(id));
      const toGrant = selectedPermissions.filter((id: string) => !currentPerms.includes(id));

      for (const perm of toRevoke) {
        await api.delete(`/permissions/revoke-user/${targetUser.id}/${perm}`);
      }
      for (const perm of toGrant) {
        await api.post('/permissions/grant-user', {
          targetUserId: targetUser.id,
          permissionName: perm
        });
      }
      
      alert('Permissions updated successfully!');
      onUpdate();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        Manage Permissions for {targetUser.email}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {allAvailableAtoms.map((atom) => {
          const isDisabled = !currentUserPermissions.includes(atom.id);
          
          return (
            <div key={atom.id} className={`flex items-center justify-between p-3 rounded-xl border ${isDisabled ? 'bg-gray-50 opacity-50' : 'bg-white'}`}>
              <span className="text-sm font-medium text-gray-700">{atom.label}</span>
              <input
                type="checkbox"
                disabled={isDisabled}
                checked={selectedPermissions.includes(atom.id)}
                onChange={() => handleToggle(atom.id)}
                className="w-5 h-5 accent-[#FF6B3D] cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={savePermissions}
        disabled={loading}
        className="w-full py-3 bg-[#FF6B3D] text-white rounded-xl font-bold hover:bg-[#F28C5F] transition-all disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Update Permissions'}
      </button>
      
      {!currentUserPermissions.includes('manage_users') && (
        <p className="text-xs text-red-500 mt-2 italic">* You can only grant permissions that you currently hold.</p>
      )}
    </div>
  );
}