'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-white to-white -z-10" />

      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-3xl px-6">

        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
          Secure <span className="text-[#FF6B3D]">RBAC</span> for <br /> Modern Teams
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
          Control exactly what your team sees and does with our granular, 
          atom-by-atom access control system.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <Link 
            href="/login" 
            className="px-10 py-4 bg-[#FF6B3D] text-white font-bold rounded-2xl hover:bg-[#FF8C66] transition-all shadow-xl shadow-orange-200 hover:-translate-y-1"
          >
            Get Started
          </Link>
          <button 
            onClick={() => alert("Learn more section coming soon!")}
            className="px-10 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="absolute bottom-10 text-gray-400 text-sm flex flex-col items-center gap-1">
        <p>© 2026 RBAC Dynamic Permissions System</p>
      </footer>
    </div>
  );
}