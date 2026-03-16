'use client';
import { useEffect, useState } from 'react';
import { Settings, Shield, KeySquare, Loader2, Save, X } from 'lucide-react';
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          api.get('/roles'),
          api.get('/permissions')
        ]);
        setRoles(rolesRes.data);
        setPermissions(permsRes.data);
      } catch (err) {
        console.error("Failed to load RBAC data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSavePermissions = async () => {
    if (!activeRole) return;
    setSaving(true);
    try {
      await api.patch(`/roles/${activeRole.id}/permissions`, { 
        permissions: activeRole.permissions 
      });
      alert("Permissions updated successfully!");
      setActiveRole(null);
    } catch (err) {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin w-10 h-10 mx-auto text-[#FF6B3D]" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-orange-50 rounded-2xl">
          <Settings className="w-8 h-8 text-[#FF6B3D]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500">Configure roles and granular access permissions.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Roles List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FF6B3D]" /> Roles
          </h2>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#FF6B3D]/30 transition-all">
                <div>
                  <h3 className="font-bold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
                <button
                  onClick={() => setActiveRole(role)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-[#FF6B3D] hover:text-white transition-colors text-sm font-bold"
                >
                  Configure
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Inventory */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <KeySquare className="w-5 h-5 text-[#FF6B3D]" /> Available Permissions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {permissions.map((perm) => (
              <div key={perm.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-bold text-xs uppercase text-gray-700">{perm.name}</h4>
                <p className="text-[10px] text-gray-400 mt-1">{perm.resource}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Permission Editor Modal - FULLY IMPLEMENTED */}
      {activeRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit {activeRole.name} Permissions</h3>
              <button onClick={() => setActiveRole(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <PermissionEditor
              targetUser={{ 
                id: activeRole.id.toString(), 
                email: activeRole.name, 
                permissions: activeRole.permissions 
              }}
              currentUserPermissions={permissions.map(p => p.name)}
              onUpdate={(updatedPerms: any) => setActiveRole({ ...activeRole, permissions: updatedPerms })}
            />

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B3D] text-white py-3 px-6 rounded-xl hover:bg-orange-500 font-bold transition disabled:opacity-70"
              >
                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setActiveRole(null)}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold transition"
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