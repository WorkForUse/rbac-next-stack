'use client';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  role: { name: string } | null;
  status: 'active' | 'suspended' | 'banned';
  permissions?: string[];
}

interface CurrentUserPermissions {
  permissions: Array<{ name: string }>;
}
import PermissionEditor from '@/components/PermissionEditor';
import UserForm from '@/components/UserForm';
import api from '@/lib/axios';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUserPerms, setCurrentUserPerms] = useState<string[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, permsRes] = await Promise.all([
        api.get<User[]>('/users'),
        api.get('/auth/me')
      ]);
      setUsers(usersRes.data);
      // Map backend {name: string}[] to string[]
      const userPerms = (permsRes.data.permissions || []).map((p: {name: string}) => p.name);
      setCurrentUserPerms(userPerms);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to load users';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;

  return (
    <div className="flex gap-6">
      {/* Left: Users Table */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <button
            onClick={() => setShowUserForm(true)}
            className="px-6 py-3 bg-[#FF6B3D] text-white rounded-xl font-bold hover:bg-[#F28C5F] transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create User
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No users found.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-left text-sm">
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 font-medium">{user.role?.name || "N/A"}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingUser(user);
                            setShowUserForm(true);
                          }}
                          className="text-blue-600 hover:underline text-sm font-medium"
                          title="Edit User"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            setUserToDelete(user.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:underline text-sm font-medium"
                          title="Delete User"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="text-[#FF6B3D] hover:underline font-medium"
                        >
                          Permissions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Right: Permission Editor Modal/Panel */}
      {selectedUser && (
        <div className="w-96 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border">
          <PermissionEditor 
            targetUser={{...selectedUser, id: selectedUser.id.toString(), permissions: selectedUser.permissions || []}} 
            currentUserPermissions={currentUserPerms}
            onUpdate={() => {
              setSelectedUser(null);
              fetchData();
            }}
          />
        </div>
      )}

      {/* User Form Modal */}
      <UserForm
        user={editingUser || undefined}
        isOpen={showUserForm}
        onClose={() => {
          setShowUserForm(false);
          setEditingUser(null);
        }}
        onSuccess={fetchData}
        mode={editingUser ? 'edit' : 'create'}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Delete User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    await api.delete(`/users/${userToDelete}`);
                    setMessage({
                      type: 'success',
                      text: 'User deleted successfully!'
                    });
                    fetchData();
                  } catch (error: any) {
                    setMessage({
                      type: 'error',
                      text: error.response?.data?.message || 'Delete failed'
                    });
                  } finally {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                disabled={loading}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-md mx-4 ${
          message.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="absolute top-3 right-3 text-white/80 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}