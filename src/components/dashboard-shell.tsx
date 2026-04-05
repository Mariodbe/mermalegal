'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile, Location, WasteEntry } from '@/lib/types';
import { PLAN_TIER_LABELS, formatKg } from '@/lib/types';

interface DashboardShellProps {
  profile: UserProfile;
  locations: Location[];
  children: React.ReactNode;
}

interface WeekStats {
  count: number;
  totalKg: number;
  donatedKg: number;
}

export function DashboardShell({
  profile,
  locations,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const notifRef    = useRef<HTMLDivElement>(null);
  const menuRef     = useRef<HTMLDivElement>(null);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef  = useRef<HTMLButtonElement>(null);
  const [notifPos, setNotifPos] = useState({ top: 68, right: 16 });
  const [menuPos,  setMenuPos]  = useState({ top: 68, right: 16 });

  // Estadísticas del panel — se cargan lazily solo al abrir el panel
  const [stats, setStats]           = useState<WeekStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadStats = useCallback(async () => {
    if (stats || statsLoading) return;
    setStatsLoading(true);
    try {
      const supabase = createClient();
      const locIds = locations.map((l) => l.id);
      if (!locIds.length) { setStats({ count: 0, totalKg: 0, donatedKg: 0 }); return; }
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const { data } = await supabase
        .from('waste_entries')
        .select('weight_kg, destination')
        .in('location_id', locIds)
        .gte('recorded_at', since.toISOString());
      const entries = (data ?? []) as Pick<WasteEntry, 'weight_kg' | 'destination'>[];
      setStats({
        count:     entries.length,
        totalKg:   entries.reduce((s, e) => s + e.weight_kg, 0),
        donatedKg: entries.filter((e) => e.destination === 'donation').reduce((s, e) => s + e.weight_kg, 0),
      });
    } finally {
      setStatsLoading(false);
    }
  }, [stats, statsLoading, locations]);

  const openNotif = useCallback(() => {
    if (notifBtnRef.current) {
      const r = notifBtnRef.current.getBoundingClientRect();
      setNotifPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setMenuOpen(false);
    const next = !notifOpen;
    setNotifOpen(next);
    if (next) loadStats();
  }, [notifOpen, loadStats]);

  const openMenu = useCallback(() => {
    if (menuBtnRef.current) {
      const r = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setNotifOpen(false);
    setMenuOpen((v) => !v);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node) &&
          notifBtnRef.current && !notifBtnRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          menuBtnRef.current && !menuBtnRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
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
    { href: '/dashboard',           label: 'Inicio' },
    { href: '/dashboard/locations', label: 'Locales' },
    { href: '/dashboard/plan',      label: 'Plan prevencion' },
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
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors border-l border-[var(--border-color)] ml-2 pl-4"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Web
              </Link>
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
            ) : profile.plan === 'pro' ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="flex items-center rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                  Pro
                </span>
                <Link
                  href="/dashboard/upgrade"
                  className="flex items-center gap-1 rounded-full border border-primary-600 px-3 py-1 text-xs font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Business
                </Link>
              </div>
            ) : (
              <span className="hidden sm:flex items-center rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                {PLAN_TIER_LABELS[profile.plan]}
              </span>
            )}

            {/* Notifications */}
            <div>
              <button
                ref={notifBtnRef}
                onClick={openNotif}
                className="focus-ring relative rounded-lg p-2 hover:bg-[var(--bg-tertiary)] transition-colors"
                aria-label="Notificaciones"
              >
                <svg className="h-5 w-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Badge — solo se muestra si ya cargamos y hay datos */}
                {stats && stats.count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {stats.count > 99 ? '99' : stats.count}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div
                  ref={notifRef}
                  style={{ position: 'fixed', top: notifPos.top, right: notifPos.right, zIndex: 9999 }}
                  className="w-72 rounded-xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] shadow-2xl p-4"
                >
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Resumen semanal</h3>
                  {statsLoading || !stats ? (
                    <div className="space-y-2.5 animate-pulse">
                      {[0,1,2].map((i) => (
                        <div key={i} className="flex justify-between">
                          <div className="h-3.5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                          <div className="h-3.5 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Registros esta semana</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{stats.count}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total merma</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{formatKg(stats.totalKg)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">Donado</span>
                        <span className="font-bold text-primary-600">{formatKg(stats.donatedKg)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings / User menu */}
            <div>
              <button
                ref={menuBtnRef}
                onClick={openMenu}
                className="focus-ring flex items-center gap-2 rounded-lg p-2 hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-bold">
                  {(profile.company_name ?? profile.email)?.[0]?.toUpperCase() ?? 'U'}
                </div>
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 9999 }}
                  className="w-56 rounded-xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] shadow-2xl py-2"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {profile.company_name ?? 'Mi empresa'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{profile.email}</p>
                  </div>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Ir al inicio
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
