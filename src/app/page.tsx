import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-2xl px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Secure <span className="text-[#FF6B3D]">RBAC</span> Platform
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Dynamic permission management made simple. Control exactly what your 
          team sees and does with our atom-by-atom access control system.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <Link 
            href="/login" 
            className="px-8 py-4 bg-[#FF6B3D] text-white font-bold rounded-2xl hover:bg-[#F28C5F] transition-all shadow-lg hover:shadow-orange-200"
          >
            Get Started
          </Link>
          <Link 
            href="/about" 
            className="px-8 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all"
          >
            Learn More
          </Link>
          <p>this learn more button not link any other page...</p>
        </div>
      </div>

      {/* Footer / Branding */}
      <div className="absolute bottom-10 text-gray-400 text-sm">
        © 2026 RBAC Dynamic Permissions System
      </div>
    </div>
  );
}