'use client';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center transform scale-100 hover:scale-[1.02] transition-all duration-300">
        <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          403
        </h1>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Forbidden
        </h2>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-sm mx-auto">
          Sorry, you don&apos;t have permission to access this page. 
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 bg-[#FF6B3D] hover:bg-orange-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl w-full justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          
          <Link
            href="/login"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 font-medium px-8 py-4 border border-gray-200 rounded-2xl transition-all duration-300 hover:bg-gray-50 w-full justify-center"
          >
            <LogIn className="w-5 h-5" />
            Sign in with different account
          </Link>
        </div>
        
        <p className="text-xs text-gray-400 mt-8">
          Error 403 | Insufficient permissions
        </p>
      </div>
    </div>
  );
}
