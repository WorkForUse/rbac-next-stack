'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedUsers } from '@/lib/seedData';
import api from '@/lib/axios';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
  
  const roles = ['Admin', 'Manager', 'Agent', 'User', 'Customer'] as const;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Backend signup with role
      const response = await api.post('/auth/signup', formData);
      const { user, accessToken } = response.data;
      
      if (user && accessToken) {
        localStorage.setItem('userData', JSON.stringify({ ...user, accessToken }));
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (apiError: any) {
      // No fallback - trust backend
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-500 mb-8 text-sm">Join us and start managing permissions.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            value={formData.name}
          />
          <input 
            type="email" placeholder="Email" required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            value={formData.email}
          />
          <input 
            type="password" placeholder="Create a password" required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            value={formData.password}
          />

          <select 
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            required
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === 'Admin' && 'Admin (Full Access)'}
                {role === 'Manager' && 'Manager (Team Management)'}
                {role === 'Agent' && 'Agent (Lead Assignment)'}
                {role === 'User' && 'User (Basic Access)'}
                {role === 'Customer' && 'Customer (View Only)'}
              </option>
            ))}
          </select>

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