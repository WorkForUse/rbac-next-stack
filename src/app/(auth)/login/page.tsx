'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedUsers } from '@/lib/seedData';
import api from '@/lib/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Try Dynamic API Login first
      const response = await api.post('/auth/login', { email, password });
      
      // Backend returns { user, accessToken, message }
      const { user, accessToken } = response.data;
      
      if (user && accessToken) {
        // Store user data with token
        localStorage.setItem('userData', JSON.stringify({ ...user, accessToken }));
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (apiError: any) {
      console.log("API failed, checking seed data...");

      // 2. Fallback to Seed Data
      const staticUser = seedUsers.find(u => u.email === email && u.password === password);
      
      if (staticUser) {
        const mockToken = btoa(JSON.stringify({ 
          sub: staticUser.id, 
          email: staticUser.email,
          role: staticUser.role, 
          permissions: staticUser.permissions 
        }));
        
        localStorage.setItem('userData', JSON.stringify({ ...staticUser, accessToken: mockToken }));
        router.push('/dashboard');
      } else {
        setError(apiError.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 font-sans">
      <div className="bg-white p-10 rounded-[24px] shadow-xl shadow-black/5 border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">Please enter your credentials</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Email Address</label>
            <input 
              type="email" required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B3D] focus:bg-white transition-all outline-none" 
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Password</label>
            <input 
              type="password" required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B3D] focus:bg-white transition-all outline-none" 
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
            />
          </div>
          
          {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 font-medium">{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#FF6B3D] text-white rounded-xl font-bold shadow-lg shadow-[#FF6B3D]/30 hover:bg-[#e85a2d] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-center text-sm text-gray-600">
            New here? <Link href="/signup" className="text-[#FF6B3D] font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}