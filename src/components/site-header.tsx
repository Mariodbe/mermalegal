import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function SiteHeader() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // No env vars in local dev — default to logged-out state
  }

  return (
    <header className="glass-header sticky top-0 z-50 border-b border-[var(--border-color)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
          <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#059669" opacity="0.15" />
            <path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 8v6M13 11l3-3 3 3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          MermaLegal
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          <Link href="/#como-funciona" className="hover:text-primary-600 transition-colors">Cómo funciona</Link>
          <Link href="/calculadora-desperdicio-restaurantes" className="hover:text-primary-600 transition-colors">Calculadora</Link>
          <Link href="/blog" className="hover:text-primary-600 transition-colors">Guía Ley 1/2025</Link>
          <Link href="/#precios" className="hover:text-primary-600 transition-colors">Precios</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:block rounded-lg px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-primary-600 transition-colors">
                Entrar
              </Link>
              <Link href="/auth/register" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                Empezar gratis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
