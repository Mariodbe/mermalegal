import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ctaHref = user ? '/dashboard' : '/auth/register';
  const ctaLabel = user ? 'Ir al dashboard' : 'Empieza gratis';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
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
            <a href="#funciones" className="hover:text-primary-600 transition-colors">Funciones</a>
            <a href="#precios" className="hover:text-primary-600 transition-colors">Precios</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-primary-600 transition-colors"
                >
                  Iniciar sesion
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary-500/10 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950 px-4 py-1.5 text-sm font-medium text-primary-700 dark:text-primary-300 mb-6">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Cumple la Ley 1/2025
              </span>
            </div>
            <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] max-w-4xl mx-auto leading-tight">
              Gestion de mermas alimentarias{' '}
              <span className="text-primary-600">simple y legal</span>
            </h1>
            <p className="animate-fade-in-up delay-200 mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Registra, analiza y reduce el desperdicio alimentario de tu restaurante.
              Genera planes de prevencion conformes a la Ley 1/2025 en minutos.
            </p>
            <div className="animate-fade-in-up delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={ctaHref}
                className="w-full sm:w-auto rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all"
              >
                {ctaLabel}
              </Link>
              <a
                href="#funciones"
                className="w-full sm:w-auto rounded-xl border border-[var(--border-color)] px-8 py-4 text-lg font-semibold text-[var(--text-secondary)] hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                Ver funciones
              </a>
            </div>
            <p className="animate-fade-in-up delay-400 mt-4 text-sm text-[var(--text-muted)]">
              Sin tarjeta de credito. 1 local gratis para siempre.
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="funciones" className="py-20 bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="animate-fade-in-up text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                Todo lo que necesitas para cumplir la ley
              </h2>
              <p className="animate-fade-in-up delay-100 mt-4 text-lg text-[var(--text-secondary)]">
                Disenado para el ritmo de una cocina profesional
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="animate-fade-in-up delay-200 card-hover rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-600 mb-5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Registro rapido tactil</h3>
                <p className="text-[var(--text-secondary)]">
                  Botones grandes pensados para usar con guantes o manos mojadas.
                  Registra una merma en menos de 10 segundos.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="animate-fade-in-up delay-300 card-hover rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-600 mb-5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Plan de prevencion PDF</h3>
                <p className="text-[var(--text-secondary)]">
                  Genera tu plan de prevencion conforme a la Ley 1/2025 de forma guiada.
                  Descargalo en PDF listo para presentar.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="animate-fade-in-up delay-400 card-hover rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-600 mb-5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Dashboard de mermas</h3>
                <p className="text-[var(--text-secondary)]">
                  Visualiza tendencias, compara periodos y encuentra oportunidades
                  para reducir el desperdicio alimentario.
                </p>
              </div>
            </div>

            {/* Extra features */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '🌙', title: 'Modo oscuro', desc: 'Ideal para cocinas con poca luz' },
                { icon: '📊', title: 'Exportar datos', desc: 'CSV y PDF para auditorias' },
                { icon: '🏪', title: 'Multi-local', desc: 'Gestiona todos tus establecimientos' },
                { icon: '🔔', title: 'Alertas', desc: 'Notificaciones de merma elevada' },
              ].map((f) => (
                <div key={f.title} className="animate-fade-in-up delay-500 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 text-center">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h4 className="font-semibold text-[var(--text-primary)] text-sm">{f.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="precios" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="animate-fade-in-up text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                Precios simples y transparentes
              </h2>
              <p className="animate-fade-in-up delay-100 mt-4 text-lg text-[var(--text-secondary)]">
                Empieza gratis. Escala cuando lo necesites.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free */}
              <div className="animate-fade-in-up delay-200 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Gratis</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">0&euro;</span>
                  <span className="text-[var(--text-muted)]">/mes</span>
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Para un solo local</p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>1 local</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Registro de mermas ilimitado</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Dashboard basico</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Plan de prevencion</li>
                </ul>
                <Link
                  href="/auth/register"
                  className="mt-8 block w-full rounded-lg border border-primary-600 py-3 text-center text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                >
                  Empezar gratis
                </Link>
              </div>

              {/* Pro */}
              <div className="animate-fade-in-up delay-300 relative rounded-2xl border-2 border-primary-600 bg-[var(--bg-card)] p-8 shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-bold text-white">
                  POPULAR
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">39&euro;</span>
                  <span className="text-[var(--text-muted)]">/mes</span>
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Hasta 5 locales</p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Hasta 5 locales</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Todo lo del plan Gratis</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Exportar CSV/PDF</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Alertas por email</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Soporte prioritario</li>
                </ul>
                <Link
                  href="/dashboard/upgrade"
                  className="mt-8 block w-full rounded-lg bg-primary-600 py-3 text-center text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  Empezar con Pro
                </Link>
              </div>

              {/* Enterprise */}
              <div className="animate-fade-in-up delay-400 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Enterprise</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">149&euro;</span>
                  <span className="text-[var(--text-muted)]">/mes</span>
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Locales ilimitados</p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Locales ilimitados</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Todo lo del plan Pro</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>API de integracion</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Soporte dedicado</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>SLA 99.9%</li>
                </ul>
                <Link
                  href="/dashboard/upgrade"
                  className="mt-8 block w-full rounded-lg border border-primary-600 py-3 text-center text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                >
                  Contactar ventas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-primary-600">
              <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="#059669" opacity="0.15" />
                <path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 8v6M13 11l3-3 3 3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              MermaLegal
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} MermaLegal. Cumplimiento Ley 1/2025 de prevencion de perdidas y desperdicio alimentario.
            </p>
            <div className="flex gap-6 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terminos</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
