'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/theme-provider';
import type { UserProfile, Location } from '@/lib/types';
import { PLAN_TIER_LABELS, formatKg } from '@/lib/types';

interface DashboardShellProps {
  profile: UserProfile;
  locations: Location[];
  recentWasteCount: number;
  totalWeekKg: number;
  donatedKg: number;
  children: React.ReactNode;
}

export function DashboardShell({
  profile,
  locations,
  recentWasteCount,
  totalWeekKg,
  donatedKg,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const navItems = [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/dashboard/locations', label: 'Locales' },
    { href: '/dashboard/plan', label: 'Plan prevencion' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 border-b border-[var(--border-color)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-primary-600">
              <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="#059669" opacity="0.15" />
                <path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 8v6M13 11l3-3 3 3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">MermaLegal</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Plan badge */}
            {profile.plan === 'free' ? (
              <Link
                href="/dashboard/upgrade"
                className="hidden sm:flex items-center gap-1 rounded-full bg-primary-50 dark:bg-primary-950 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Mejorar plan
              </Link>
            ) : (
              <span className="hidden sm:flex items-center rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                {PLAN_TIER_LABELS[profile.plan]}
              </span>
            )}

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="focus-ring relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notificaciones"
              >
                <svg className="h-5 w-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {recentWasteCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {recentWasteCount > 99 ? '99' : recentWasteCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg p-4 z-50">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Resumen semanal</h3>
                  <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Registros esta semana</span>
                      <span className="font-medium text-[var(--text-primary)]">{recentWasteCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total merma</span>
                      <span className="font-medium text-[var(--text-primary)]">{formatKg(totalWeekKg)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Donado</span>
                      <span className="font-medium text-primary-600">{formatKg(donatedKg)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />

            {/* Settings / User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="focus-ring flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-bold">
                  {(profile.company_name ?? profile.email)?.[0]?.toUpperCase() ?? 'U'}
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-[var(--border-color)]">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {profile.company_name ?? 'Mi empresa'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{profile.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configuracion
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden overflow-x-auto border-t border-[var(--border-color)] px-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
