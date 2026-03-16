'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, ClipboardList, Calendar, 
  FileText, Settings, MessageSquare, ChevronLeft, 
  ChevronRight, HelpCircle, BarChart3, LogOut
} from "lucide-react";

// Helper components for cleaner code
interface User {
  id: number;
  name: string;
  email: string;
  role?: {
    name: string;
  };
  permissions?: string[];
}

const NavItem = ({ item, active, open }: { item: any, active: boolean, open: boolean }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
        ${active ? "bg-white text-orange-600 shadow-sm font-medium" : "text-gray-600 hover:bg-white/50 hover:text-gray-900"}`}
    >
      <Icon size={18} className={active ? "text-orange-600" : "text-gray-400 group-hover:text-gray-600"} />
      {open && <span>{item.name}</span>}
    </Link>
  );
};

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('userData');
      // Redirect to login
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <aside className={`${open ? "w-64" : "w-20"} h-screen bg-gradient-to-b from-[#F6E7DA] to-[#F3E1CF] border-r border-[#ead7c7] flex flex-col transition-all duration-300 relative`}>
      
      {/* Toggle Button - Fixed to right edge */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-8 bg-white border border-[#ead7c7] rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
      >
        {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Workspace Header */}
      <div className="p-4 mt-2">
        <div className={`flex items-center gap-3 bg-white/50 p-2.5 rounded-xl border border-white/50 ${!open && 'justify-center'}`}>
          <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          {open && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">
                {user?.name ? `${user.name}'s workspace` : "User's workspace"}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                {user?.role?.name ? `${user.role.name}` : 'User'} #WID{user?.id || 'N/A'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Container */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto scrollbar-hide">
        
        {/* Main Section */}
        <div className="space-y-1">
          {[
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Leads", href: "/leads", icon: Users },
            { name: "Opportunities", href: "/opportunities", icon: FileText },
            { name: "Tasks", href: "/tasks", icon: ClipboardList },
          ].map((item) => (
            <NavItem key={item.name} item={item} active={pathname === item.href} open={open} />
          ))}
        </div>

        {/* Tasks Section */}
        {open && <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-2">Tasks</p>}
        <div className="space-y-1">
          {[
            { name: "Assignments", href: "/assignments", icon: ClipboardList },
            { name: "Calendar", href: "/calendar", icon: Calendar },
            { name: "Reminders", href: "/reminders", icon: Calendar },
            { name: "Reports", href: "/reports", icon: BarChart3 },
          ].map((item) => (
            <NavItem key={item.name} item={item} active={pathname === item.href} open={open} />
          ))}
        </div>
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-black/5 space-y-1">
        <NavItem item={{ name: "Help center", href: "/help-center", icon: HelpCircle }} active={pathname === "/help-center"} open={open} />
        <NavItem item={{ name: "Settings", href: "/settings", icon: Settings }} active={pathname === "/settings"} open={open} />
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-red-600 hover:bg-red-50 ${open ? '' : 'justify-center'}`}
        >
          <LogOut size={18} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}