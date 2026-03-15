'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedUsers } from '@/lib/seedData';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Static authentication with seed data
    const user = seedUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setError('Invalid email or password');
      return;
    }
    
    // Create mock JWT token and store in cookie
    const mockToken = btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role, permissions: user.permissions }));
    document.cookie = `accessToken=${mockToken}; path=/`;
    document.cookie = `refreshToken=${mockToken}; path=/`;
    
    // Store user data in localStorage for sidebar
    localStorage.setItem('userData', JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      name: user.name
    }));
    
    router.push('/dashboard');
  };

  return (
    // Figma background color (Soft White/Light Gray)
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Login</h2>
        <p className="text-gray-500 mb-8 text-sm text-center">Enter your details to continue</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
          />
          <input 
            type="password" placeholder="Enter your password" 
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B3D]" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
          />
          
          {error && <p className="text-red-500 text-xs">{error}</p>}
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Remember me
            </label>
            <Link href="/forgot" className="text-[#FF6B3D]">Forgot password?</Link>
          </div>

          <button type="submit" className="w-full py-3 bg-[#FF6B3D] text-white rounded-lg font-bold hover:bg-[#e85a2d] transition-all">
            Log in
          </button>
        </form>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Admin: admin@example.com / Admin@123</p>
          <p className="text-xs text-gray-600">Manager: manager@example.com / Manager@123</p>
          <p className="text-xs text-gray-600">Agent: agent@example.com / Agent@123</p>
        </div>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don&apos;t have an account? <Link href="/signup" className="text-[#FF6B3D] font-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}