import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  AnimatedCounter,
  UrgencyBanner,
  DemoPreview,
  FadeInOnScroll,
} from '@/components/landing-interactive';

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
            <a href="#como-funciona" className="hover:text-primary-600 transition-colors">Como funciona</a>
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
        {/* Hero with demo */}
        <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-500/5 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: text */}
              <div>
                <div className="animate-fade-in-up">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950 px-4 py-1.5 text-sm font-medium text-primary-700 dark:text-primary-300 mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                    </span>
                    Ley 1/2025 en vigor desde el 2 abril 2026
                  </span>
                </div>
                <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                  Gestion de mermas alimentarias{' '}
                  <span className="text-primary-600">simple y legal</span>
                </h1>
                <p className="animate-fade-in-up mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-xl">
                  Registra el desperdicio alimentario de tu restaurante en segundos.
                  Genera planes de prevencion conformes a la ley en minutos.
                </p>
                <div className="animate-fade-in-up mt-8 flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href={ctaHref}
                    className="w-full sm:w-auto rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    {ctaLabel}
                  </Link>
                  <a
                    href="#como-funciona"
                    className="w-full sm:w-auto rounded-xl border border-[var(--border-color)] px-8 py-4 text-lg font-semibold text-[var(--text-secondary)] hover:border-primary-300 hover:text-primary-600 transition-all"
                  >
                    Ver demo
                  </a>
                </div>
                <p className="animate-fade-in-up mt-4 text-sm text-[var(--text-muted)]">
                  Sin tarjeta de credito. 1 local gratis para siempre.
                </p>
              </div>

              {/* Right: interactive demo */}
              <div className="animate-fade-in-up hidden lg:block">
                <DemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="py-12 bg-[var(--bg-secondary)] border-y border-[var(--border-color)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <AnimatedCounter target={300000} suffix="+" />
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Restaurantes obligados en Espana</p>
              </div>
              <div>
                <AnimatedCounter target={1400} suffix="M kg" />
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Desperdicio alimentario anual</p>
              </div>
              <div>
                <AnimatedCounter target={500000} suffix="€" />
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Multa maxima por incumplimiento</p>
              </div>
              <div>
                <AnimatedCounter target={10} suffix=" seg" />
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Tiempo medio para registrar merma</p>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <UrgencyBanner />
            </FadeInOnScroll>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="py-20 bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <FadeInOnScroll>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Asi de facil es cumplir la ley
                </h2>
                <p className="mt-4 text-lg text-[var(--text-secondary)]">
                  3 pasos. Menos de un minuto.
                </p>
              </FadeInOnScroll>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  icon: '🏪',
                  title: 'Registra tu local',
                  desc: 'Anade tu restaurante, bar o hotel. Nombre, direccion y tipo. En 30 segundos.',
                },
                {
                  step: '2',
                  icon: '📱',
                  title: 'Apunta las mermas',
                  desc: 'Tu cocinero toca 3 botones: tipo, peso y destino. Hecho. Sin escribir nada.',
                },
                {
                  step: '3',
                  icon: '📋',
                  title: 'Genera tu plan',
                  desc: 'Un formulario guiado genera tu Plan de Prevencion conforme al Art. 5 de la ley.',
                },
              ].map((item, i) => (
                <FadeInOnScroll key={item.step} delay={i * 150}>
                  <div className="relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="absolute -top-4 -left-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white text-lg font-bold shadow-lg">
                      {item.step}
                    </div>
                    <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                    <p className="text-[var(--text-secondary)]">{item.desc}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="funciones" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <FadeInOnScroll>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Disenado para la cocina
                </h2>
                <p className="mt-4 text-lg text-[var(--text-secondary)]">
                  Cada detalle pensado para el dia a dia de la hosteleria
                </p>
              </FadeInOnScroll>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FadeInOnScroll delay={0}>
                <div className="group rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900 text-primary-600 mb-5 group-hover:scale-110 transition-transform">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Registro rapido tactil</h3>
                  <p className="text-[var(--text-secondary)]">
                    Botones de 48px minimo pensados para guantes de cocina y manos mojadas.
                    Registro completo en menos de 10 segundos.
                  </p>
                </div>
              </FadeInOnScroll>

              <FadeInOnScroll delay={150}>
                <div className="group rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900 text-primary-600 mb-5 group-hover:scale-110 transition-transform">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Plan de Prevencion legal</h3>
                  <p className="text-[var(--text-secondary)]">
                    Genera tu plan conforme a los articulos 4 y 5 de la Ley 1/2025.
                    Formulario guiado paso a paso. Descarga en PDF.
                  </p>
                </div>
              </FadeInOnScroll>

              <FadeInOnScroll delay={300}>
                <div className="group rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900 text-primary-600 mb-5 group-hover:scale-110 transition-transform">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Dashboard por local</h3>
                  <p className="text-[var(--text-secondary)]">
                    Visualiza mermas por local, por categoria y por destino.
                    Compara periodos y encuentra donde ahorrar.
                  </p>
                </div>
              </FadeInOnScroll>
            </div>

            {/* Extra features grid */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🌙', title: 'Modo oscuro', desc: 'Ideal para cocinas con poca luz' },
                { icon: '📊', title: 'Exportar datos', desc: 'CSV y PDF para auditorias' },
                { icon: '🏪', title: 'Multi-local', desc: 'Gestiona todos tus establecimientos' },
                { icon: '🔔', title: 'Alertas', desc: 'Notificaciones de merma elevada' },
              ].map((f, i) => (
                <FadeInOnScroll key={f.title} delay={i * 100}>
                  <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <h4 className="font-semibold text-[var(--text-primary)] text-sm">{f.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{f.desc}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Who is it for */}
        <section className="py-20 bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Para quien es MermaLegal
                </h2>
              </div>
            </FadeInOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { emoji: '🍽️', type: 'Restaurantes', desc: 'Obligados a registrar mermas y ofrecer envases para llevar' },
                { emoji: '🏨', type: 'Hoteles', desc: 'Buffets y restaurantes de hotel con grandes volumenes de merma' },
                { emoji: '🍺', type: 'Bares', desc: 'Aunque son pequenos, deben cumplir articulos 8 y 12 de la ley' },
                { emoji: '🍳', type: 'Catering', desc: 'Comedores de empresa, colegios y hospitales' },
              ].map((item, i) => (
                <FadeInOnScroll key={item.type} delay={i * 100}>
                  <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="text-5xl mb-4">{item.emoji}</div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{item.type}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="precios" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Precios simples y transparentes
                </h2>
                <p className="mt-4 text-lg text-[var(--text-secondary)]">
                  Empieza gratis. Escala cuando lo necesites.
                </p>
              </div>
            </FadeInOnScroll>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free */}
              <FadeInOnScroll delay={0}>
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Gratis</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[var(--text-primary)]">0&euro;</span>
                    <span className="text-[var(--text-muted)]">/mes</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Para un solo local</p>
                  <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)] flex-1">
                    {['1 local', 'Registro de mermas ilimitado', 'Dashboard basico', 'Plan de prevencion'].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/register"
                    className="mt-8 block w-full rounded-lg border border-primary-600 py-3 text-center text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                  >
                    Empezar gratis
                  </Link>
                </div>
              </FadeInOnScroll>

              {/* Pro */}
              <FadeInOnScroll delay={150}>
                <div className="relative rounded-2xl border-2 border-primary-600 bg-[var(--bg-card)] p-8 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-bold text-white">
                    POPULAR
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Pro</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[var(--text-primary)]">39&euro;</span>
                    <span className="text-[var(--text-muted)]">/mes</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Hasta 5 locales</p>
                  <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)] flex-1">
                    {['Hasta 5 locales', 'Todo lo del plan Gratis', 'Exportar CSV/PDF', 'Alertas por email', 'Soporte prioritario'].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard/upgrade"
                    className="mt-8 block w-full rounded-lg bg-primary-600 py-3 text-center text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    Empezar con Pro
                  </Link>
                </div>
              </FadeInOnScroll>

              {/* Enterprise */}
              <FadeInOnScroll delay={300}>
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Enterprise</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[var(--text-primary)]">149&euro;</span>
                    <span className="text-[var(--text-muted)]">/mes</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Locales ilimitados</p>
                  <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)] flex-1">
                    {['Locales ilimitados', 'Todo lo del plan Pro', 'API de integracion', 'Soporte dedicado', 'SLA 99.9%'].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard/upgrade"
                    className="mt-8 block w-full rounded-lg border border-primary-600 py-3 text-center text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                  >
                    Contactar ventas
                  </Link>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <FadeInOnScroll>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                No esperes a la primera inspeccion
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8">
                Registrate en 30 segundos. Tu primer local es gratis para siempre.
                Sin tarjeta de credito.
              </p>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-10 py-5 text-xl font-bold text-white shadow-lg hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                {ctaLabel}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] py-12">
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
              &copy; {new Date().getFullYear()} MermaLegal. Cumplimiento Ley 1/2025 contra el desperdicio alimentario.
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
