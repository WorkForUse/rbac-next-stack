'use client';
import { useEffect, useState } from 'react';
import { Settings, Shield, KeySquare } from 'lucide-react';
import api from '@/lib/axios';
import PermissionEditor from '@/components/PermissionEditor';

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
}

interface Permission {
  id: number;
  name: string;
  description?: string;
  resource: string;
}

export default function SettingsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          api.get('/roles'),
          api.get('/permissions')
        ]);
        setRoles(rolesRes.data);
        setPermissions(permsRes.data);
        setLoading(false);
      } catch (_err) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditRole = (role: Role) => {
    setActiveRole(role);
    setSelectedPermissions(role.permissions || []);
  };

  const handleSavePermissions = () => {
    setActiveRole(null);
    setSelectedPermissions([]);
  };

  if (loading) return <div className="text-center py-12">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FF6B3D]/10 rounded-xl">
            <Settings className="w-6 h-6 text-[#FF6B3D]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500">Manage roles and permissions</p>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FF6B3D]" />
            Roles
          </h2>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description || 'No description'}</p>
                  <p className="text-xs text-gray-400">{role.permissions?.length || 0} permissions</p>
                </div>
                <button
                  onClick={() => handleEditRole(role)}
                  className="px-4 py-2 bg-[#FF6B3D] text-white rounded-lg hover:bg-orange-500 text-sm transition"
                >
                  Edit Permissions
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <KeySquare className="w-5 h-5 text-[#FF6B3D]" />
            Permissions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {permissions.map((perm) => (
              <div key={perm.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">{perm.name}</h4>
                <p className="text-xs text-gray-500">{perm.resource}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Permission Editor Modal */}
      {activeRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit {activeRole.name} Permissions</h3>
              <button
                onClick={() => {setActiveRole(null); setSelectedPermissions([]);}}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <PermissionEditor
              targetUser={{ id: activeRole.id.toString(), email: activeRole.name, permissions: selectedPermissions }}
              currentUserPermissions={permissions.map(p => p.name)}
              onUpdate={handleSavePermissions}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSavePermissions}
                className="flex-1 bg-[#FF6B3D] text-white py-3 px-6 rounded-xl hover:bg-orange-500 font-medium transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {setActiveRole(null); setSelectedPermissions([]);}}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
