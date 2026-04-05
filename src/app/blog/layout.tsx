import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
            <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#059669" opacity="0.15" />
              <path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 8v6M13 11l3-3 3 3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            MermaLegal
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-[var(--text-secondary)] hover:text-primary-600 transition-colors hidden sm:block">
              Guía Legal
            </Link>
            <Link href="/calculadora-desperdicio-restaurantes" className="text-sm text-[var(--text-secondary)] hover:text-primary-600 transition-colors hidden sm:block">
              Calculadora
            </Link>
            <Link
              href={user ? '/dashboard' : '/auth/register'}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              {user ? 'Dashboard' : 'Empezar gratis'}
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-[var(--border-color)] py-8 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)]">
          <p>&copy; {new Date().getFullYear()} MermaLegal · Herramienta de apoyo a la Ley 1/2025</p>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-primary-500 transition-colors">Blog</Link>
            <Link href="/privacidad" className="hover:text-primary-500 transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-primary-500 transition-colors">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
