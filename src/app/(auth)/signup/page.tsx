'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedUsers } from '@/lib/seedData';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if email already exists
    if (seedUsers.some(u => u.email === formData.email)) {
      setError('Email already registered');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Add new user to seed data (in-memory, will reset on page reload)
    const newUser = {
      id: Math.max(...seedUsers.map(u => u.id)) + 1,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'Agent',
      status: 'active',
      permissions: [
        'view_dashboard',
        'view_leads',
        'view_tasks',
        'view_reports',
        'view_profile',
        'manage_self'
      ]
    };
    
    seedUsers.push(newUser);
    
    // Auto-login after signup
    setTimeout(() => {
      const mockToken = btoa(JSON.stringify({ sub: newUser.id, email: newUser.email, role: newUser.role, permissions: newUser.permissions }));
      document.cookie = `accessToken=${mockToken}; path=/`;
      document.cookie = `refreshToken=${mockToken}; path=/`;
      
      localStorage.setItem('userData', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
        name: newUser.name
      }));
      
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-500 mb-8 text-sm">Join us and start managing permissions.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            value={formData.name}
          />
          <input 
            type="email" placeholder="Email"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            value={formData.email}
          />
          <input 
            type="password" placeholder="Create a password"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            value={formData.password}
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full py-3 bg-[#FF6B3D] text-white rounded-lg font-bold hover:bg-[#e85a2d] transition-all"
          >
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account? <Link href="/login" className="text-[#FF6B3D] font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}