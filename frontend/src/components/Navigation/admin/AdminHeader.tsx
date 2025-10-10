import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function AdminHeader() {
  const { logout, token, isAuthenticated } = useAuth();

  return (
    <header className="w-full bg-gradient-to-r from-green-700 via-green-800 to-gray-900 text-white py-4 px-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        {/* ...Logo und Titel... */}
        
           <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="14" fill="#22c55e"/>
            <text x="7" y="19" fontSize="12" fill="#fff" fontFamily="sans-serif">GF</text>
          </svg>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition font-semibold flex items-center gap-2"
          title="Zur Webseite"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <path d="M7 11l5-5M12 6H7V1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Webseite
        </a>
        {isAuthenticated ? (
          <button
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition font-semibold"
            onClick={logout}
          >
            Logout
          </button>
        ): (
          <Link
            href="/admin/login"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
