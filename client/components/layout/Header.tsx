'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

const navLinks = [
  { href: '/explore', label: 'Explore' },
  { href: '/my-trip', label: 'My Trip' },
  { href: '/trips', label: 'Trips' },
];

export default function Header() {
  const { user, logout, loadUser } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => { loadUser(); }, []);

  return (
    <header className="bg-[#FDFCFB] border-b border-stone-200 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-h1 italic text-stone-900 tracking-widest uppercase">
          Kemet Travel
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`transition-all duration-300 font-body-md pb-1 ${
                  isActive
                    ? 'text-[#C5A059] font-semibold border-b-2 border-[#C5A059]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center space-x-6">
          <button className="text-stone-800 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">travel_explore</span>
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <div className="flex items-center space-x-2 bg-surface-container rounded-full px-4 py-2 cursor-pointer hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-primary">account_circle</span>
                  <span className="text-stone-800 font-medium text-sm">{user.name}</span>
                </div>
              </Link>
              <button onClick={logout} className="text-xs text-stone-500 hover:text-primary transition-colors uppercase tracking-widest font-label-caps">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <div className="flex items-center space-x-2 bg-surface-container rounded-full px-4 py-2 cursor-pointer hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-primary">account_circle</span>
                <span className="text-stone-800 font-medium text-sm">User Area</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}