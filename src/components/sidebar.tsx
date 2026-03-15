'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, ClipboardList, BarChart3, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, perm: 'view_dashboard' },
  { name: 'Users', href: '/users', icon: Users, perm: 'manage_users' },
  { name: 'Leads', href: '/leads', icon: BookOpen, perm: 'view_leads' },
  { name: 'Tasks', href: '/tasks', icon: ClipboardList, perm: 'manage_tasks' },
  { name: 'Reports', href: '/reports', icon: BarChart3, perm: 'view_reports' },
  { name: 'Audit Log', href: '/audit', icon: FileText, perm: 'view_audit' },
];

export default function Sidebar() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const pathname = usePathname();

  const fetchUserData = useCallback(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setPermissions(user.permissions || []);
        setUserRole(user.role || '');
        setUserName(user.name || '');
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <aside className="w-64 bg-gradient-to-b from-[#FF7A50] to-[#FF6B3D] h-screen flex flex-col p-0 shadow-xl">
      {/* Logo Section */}
      <div className="bg-white/10 backdrop-blur-sm px-6 py-8 border-b border-white/20">
        <div className="text-white font-bold text-2xl">RBAC</div>
        <p className="text-white/70 text-xs mt-1">Digital Pylot</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          if (!permissions.includes(item.perm)) return null;

          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-[#FF6B3D] shadow-lg font-semibold' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-white/20 px-4 py-6">
        {userName && (
          <div className="mb-4 px-2 py-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-white/60 text-xs uppercase tracking-wider">User</p>
            <p className="text-white font-semibold text-sm mt-1">{userName}</p>
            <p className="text-white/80 text-xs mt-1 inline-block px-2 py-1 bg-white/20 rounded mt-2">
              {userRole}
            </p>
          </div>
        )}
        <button 
          onClick={() => {
            document.cookie = 'accessToken=; path=/';
            document.cookie = 'refreshToken=; path=/';
            localStorage.removeItem('userData');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
