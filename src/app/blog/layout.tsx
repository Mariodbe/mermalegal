import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SiteHeader />

      {children}

      <footer aria-label="Pie de página" className="border-t border-[var(--border-color)] py-8 mt-16">
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
