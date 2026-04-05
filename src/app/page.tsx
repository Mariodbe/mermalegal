import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  LossCalculator,
  AnimatedCounter,
  PDFMock,
  FadeInOnScroll,
} from '@/components/landing-interactive';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Evita Multas Ley 1/2025 — Plan Prevención Desperdicio Alimentario Gratis',
  description:
    'Genera tu plan de prevención de desperdicio alimentario obligatorio por la Ley 1/2025. Evita multas de hasta 500.000€ en restaurantes, hoteles y bares. Gratis en 2 minutos.',
  alternates: { canonical: 'https://mermalegal.com' },
  openGraph: {
    title: 'Evita multas de hasta 500.000€ — Plan Prevención Ley 1/2025',
    description:
      'Genera tu plan de prevención de desperdicio alimentario en 2 minutos. Obligatorio para restaurantes, hoteles y bares desde abril 2026.',
    url: 'https://mermalegal.com',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MermaLegal — Evita multas Ley 1/2025' }],
  },
};

export default async function HomePage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // No env vars in local dev — default to logged-out state
  }

  const ctaHref  = user ? '/dashboard' : '/auth/register';
  const ctaLabel = user ? 'Ir al dashboard' : 'Descubrir cuánto pierdo — gratis';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">

      {/* ─── TOP BANNER ────────────────────────────────────────────────── */}
      <div className="bg-red-600 py-2 px-4 text-center">
        <p className="text-sm font-semibold text-white">
          🔴 Ley 1/2025 en vigor desde el 2 de abril de 2026 — Multas desde 2.000€ hasta 500.000€
          <Link href={ctaHref} className="ml-2 underline underline-offset-2 hover:no-underline">
            Protégete ahora →
          </Link>
        </p>
      </div>

      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <SiteHeader />

      <main className="flex-1">

        {/* ═══════════════════════════════════════════════════════════════
            HERO — La pregunta que duele
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-red-500/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary-500/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left: copy */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-800 bg-red-950 px-4 py-1.5 text-sm font-medium text-red-300 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                  </span>
                  Ley 1/2025 — Obligatorio desde abril 2026
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
                  ¿Cuánto dinero estás{' '}
                  <span className="text-red-500">tirando a la basura</span>{' '}
                  cada mes?
                </h1>

                <p className="mt-5 text-xl text-[var(--text-secondary)] max-w-xl leading-relaxed">
                  El restaurante medio pierde entre <strong className="text-[var(--text-primary)]">20.000€ y 30.000€ al año</strong> en desperdicio alimentario.
                  Y desde abril de 2026, no tener el plan de prevención documentado <strong className="text-red-400">puede ser motivo de sanción</strong>.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Calcular mis pérdidas gratis
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Sin tarjeta de crédito
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Plan legal incluido
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Listo en 2 minutos
                  </span>
                </div>
              </div>

              {/* Right: calculator */}
              <div>
                <LossCalculator ctaHref={ctaHref} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            TRUST STRIP — Números que impactan
        ═══════════════════════════════════════════════════════════════ */}
        <section className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <AnimatedCounter target={300000} suffix="+" />
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Restaurantes obligados por la ley</p>
              </div>
              <div>
                <AnimatedCounter target={30000} suffix="€" />
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Pérdida media anual por local</p>
              </div>
              <div>
                <AnimatedCounter target={500000} suffix="€" />
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Multa máxima por incumplimiento</p>
              </div>
              <div>
                <AnimatedCounter target={2} suffix=" min" />
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">Para tener tu plan listo</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PROBLEMA — El dinero que se va sin que lo veas
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">El problema real</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Tu restaurante tiene dos problemas.<br className="hidden sm:block" /> Y seguramente no has resuelto ninguno.
                </h2>
              </div>
            </FadeInOnScroll>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Problema 1: dinero */}
              <FadeInOnScroll delay={0}>
                <div className="rounded-2xl border-2 border-red-800/40 bg-red-950/30 p-8 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-900 text-2xl mb-5">💸</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Estás tirando dinero literal
                  </h3>
                  <p className="text-red-200 leading-relaxed mb-4">
                    Entre el 5% y el 9% de tu facturación se va en comida que no sirves. En un restaurante con 80 clientes al día a 22€ de ticket, eso son <strong className="text-white">más de 10.000€ al año</strong> perdidos sin que nadie los controle.
                  </p>
                  <div className="rounded-xl bg-red-900/50 border border-red-800 p-4 text-sm">
                    <p className="text-red-300 font-semibold mb-2">Ejemplo real:</p>
                    <ul className="space-y-1 text-red-200">
                      <li>• Martes: 3 kg de verdura caducada → <strong>18€</strong></li>
                      <li>• Jueves: sobras de servicio sin reutilizar → <strong>41€</strong></li>
                      <li>• Fin de semana: sobreproducción no registrada → <strong>67€</strong></li>
                    </ul>
                    <p className="mt-2 text-red-400 text-xs">Solo en una semana: 126€. Al año: más de 6.500€.</p>
                  </div>
                </div>
              </FadeInOnScroll>

              {/* Problema 2: legal */}
              <FadeInOnScroll delay={150}>
                <div className="rounded-2xl border-2 border-amber-800/40 bg-amber-950/30 p-8 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-900 text-2xl mb-5">⚠️</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    La ley ya está en vigor. Sin excusas.
                  </h3>
                  <p className="text-amber-200 leading-relaxed mb-4">
                    La Ley 1/2025 obliga a todos los establecimientos de hostelería a tener un <strong className="text-white">Plan de Prevención de Desperdicio Alimentario</strong> documentado. Sin él, puedes recibir una multa en cualquier inspección.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-amber-900/50 border border-amber-800 p-3">
                      <p className="font-bold text-white">2.000€</p>
                      <p className="text-amber-400 text-[11px] mt-0.5">Multa mínima</p>
                    </div>
                    <div className="rounded-lg bg-orange-900/50 border border-orange-800 p-3">
                      <p className="font-bold text-white">60.000€</p>
                      <p className="text-orange-400 text-[11px] mt-0.5">Infracción grave</p>
                    </div>
                    <div className="rounded-lg bg-red-900/50 border border-red-800 p-3">
                      <p className="font-bold text-white">500.000€</p>
                      <p className="text-red-400 text-[11px] mt-0.5">Muy grave</p>
                    </div>
                  </div>
                  <p className="mt-4 text-amber-400 text-sm">
                    ¿Tienes el documento listo para enseñar si vienen mañana?
                  </p>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            IMPACTO ECONÓMICO — Hazlo concreto y doloroso
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">Impacto económico</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  La merma no registrada es dinero invisible.<br className="hidden sm:block" /> Hasta que lo cuentas.
                </h2>
                <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                  El 80% de los restaurantes infra-registra sus pérdidas. No porque no existan, sino porque nadie las mide.
                </p>
              </div>
            </FadeInOnScroll>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  emoji: '🍽️',
                  title: 'Restaurante carta',
                  clientes: '60–80 clientes',
                  ticket: '22€ ticket medio',
                  loss: '~9.000–14.000€/año',
                  saving: '~2.000–4.000€ recuperables',
                  color: 'border-red-800/30 bg-red-950/20',
                },
                {
                  emoji: '🥗',
                  title: 'Restaurante menú del día',
                  clientes: '100–150 comensales',
                  ticket: '12€ ticket medio',
                  loss: '~6.000–10.000€/año',
                  saving: '~1.500–3.000€ recuperables',
                  color: 'border-orange-800/30 bg-orange-950/20',
                },
                {
                  emoji: '🏨',
                  title: 'Hotel con buffet',
                  clientes: '200+ desayunos',
                  ticket: '15€ por servicio',
                  loss: '~20.000–35.000€/año',
                  saving: '~5.000–10.000€ recuperables',
                  color: 'border-amber-800/30 bg-amber-950/20',
                },
              ].map((ex, i) => (
                <FadeInOnScroll key={ex.title} delay={i * 120}>
                  <div className={`rounded-2xl border-2 p-7 ${ex.color}`}>
                    <div className="text-4xl mb-4">{ex.emoji}</div>
                    <h3 className="font-bold text-[var(--text-primary)] text-lg mb-3">{ex.title}</h3>
                    <div className="space-y-1 text-sm text-[var(--text-secondary)] mb-4">
                      <p>📊 {ex.clientes}</p>
                      <p>🏷️ {ex.ticket}</p>
                    </div>
                    <div className="h-px bg-[var(--border-color)] mb-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Pérdida estimada</span>
                        <span className="font-bold text-red-400">{ex.loss}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Con MermaLegal</span>
                        <span className="font-bold text-primary-400">{ex.saving}</span>
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            <FadeInOnScroll delay={300}>
              <div className="mt-10 rounded-2xl bg-primary-950 border border-primary-800 p-8 text-center max-w-3xl mx-auto">
                <p className="text-primary-300 text-lg">
                  El plan <strong className="text-white">Pro (39€/mes)</strong> cuesta menos que{' '}
                  <strong className="text-white">2 días de merma</strong> en la mayoría de restaurantes.
                </p>
                <p className="text-primary-400 text-sm mt-2">
                  ROI típico: 10x en los primeros 3 meses.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SOLUCIÓN — 3 pasos, 2 minutos
        ═══════════════════════════════════════════════════════════════ */}
        <section id="como-funciona" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">La solución</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Cómo crear tu plan de prevención de desperdicio alimentario en 3 pasos
                </h2>
                <p className="mt-4 text-lg text-[var(--text-secondary)]">
                  Sin formularios interminables. Sin abogados. Sin conocimientos técnicos.
                </p>
              </div>
            </FadeInOnScroll>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  step: '1',
                  time: '30 seg',
                  icon: '🏪',
                  title: 'Registra tu local',
                  desc: 'Nombre, tipo de restaurante, número de comensales. Un formulario de 3 preguntas.',
                  detail: 'Sin tecnicismos. Sin burocracia.',
                },
                {
                  step: '2',
                  time: '10 seg/día',
                  icon: '📱',
                  title: 'Apunta las mermas',
                  desc: 'Tu cocinero toca 3 botones: qué, cuánto y dónde va. Se registra con trazabilidad legal.',
                  detail: 'Funciona con guantes mojados.',
                },
                {
                  step: '3',
                  time: '90 seg',
                  icon: '📋',
                  title: 'Genera el plan legal',
                  desc: 'MermaLegal crea automáticamente tu Plan de Prevención conforme al Art. 5 de la Ley 1/2025.',
                  detail: 'Listo para mostrar en inspecciones.',
                },
              ].map((item, i) => (
                <FadeInOnScroll key={item.step} delay={i * 120}>
                  <div className="relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 hover:border-primary-500/50 hover:shadow-lg transition-all">
                    <div className="absolute -top-4 left-6 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-bold shadow-lg">
                        {item.step}
                      </div>
                      <span className="rounded-full bg-primary-950 border border-primary-800 px-2.5 py-0.5 text-xs font-semibold text-primary-400">
                        {item.time}
                      </span>
                    </div>
                    <div className="text-4xl mt-2 mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                    <p className="text-[var(--text-secondary)] mb-3">{item.desc}</p>
                    <p className="text-sm text-primary-400 font-medium">{item.detail}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            <FadeInOnScroll delay={300}>
              <div className="text-center mt-10">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Empezar ahora — es gratis
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <p className="mt-3 text-sm text-[var(--text-muted)]">Tu primer local, gratis para siempre.</p>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            OUTPUT — El documento que exige la ley (Art. 5)
        ═══════════════════════════════════════════════════════════════ */}
        <section id="el-documento" className="py-20 bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">

              {/* Left: PDF mock */}
              <FadeInOnScroll>
                <PDFMock />
              </FadeInOnScroll>

              {/* Right: copy */}
              <FadeInOnScroll delay={150}>
                <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">El documento que exige la ley</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-5">
                  Si mañana viene una inspección,<br className="hidden sm:block" />
                  <span className="text-primary-500">¿qué les enseñas?</span>
                </h2>
                <p className="text-lg text-[var(--text-secondary)] mb-8">
                  MermaLegal genera automáticamente tu Plan de Prevención en PDF, listo para imprimir o enviar al inspector. Incluye todo lo que exige la ley, sin que tengas que saber qué es eso.
                </p>

                <ul className="space-y-4 mb-8">
                  {[
                    {
                      icon: '📊',
                      title: 'KPIs de desperdicio',
                      desc: 'Kilos por semana, coste económico real, porcentaje sobre facturación.',
                    },
                    {
                      icon: '✅',
                      title: 'Medidas de prevención activas',
                      desc: 'FIFO, ajuste de pedidos, donación a bancos de alimentos. Generadas automáticamente según tu operativa.',
                    },
                    {
                      icon: '🔗',
                      title: 'Trazabilidad completa',
                      desc: 'Cada registro con fecha, categoría, peso y destino. Auditable en cualquier momento.',
                    },
                    {
                      icon: '⚖️',
                      title: 'Conforme a Ley 1/2025',
                      desc: 'Cumple con los artículos 4 y 5. Responsable designado. Firma y fecha.',
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-950 border border-primary-800 text-lg">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-4 font-bold text-white shadow-md hover:bg-primary-700 hover:-translate-y-0.5 transition-all"
                >
                  Generar mi plan legal ahora
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BENEFICIOS — Resultados, no funciones
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">Qué consigues</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  No es un software. Es un seguro<br className="hidden sm:block" /> para tu negocio.
                </h2>
              </div>
            </FadeInOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '💶',
                  title: 'Recuperas dinero real',
                  desc: 'Sabes exactamente qué se pierde, cuándo y por qué. El control genera ahorro automáticamente.',
                  highlight: '200–800€/mes',
                  hlabel: 'ahorro típico',
                  color: 'primary',
                },
                {
                  icon: '🛡️',
                  title: 'Reduces el riesgo legal',
                  desc: 'Tienes el plan documentado que exige el Art. 5. Demuestras diligencia activa ante cualquier inspección.',
                  highlight: 'Art. 5',
                  hlabel: 'Ley 1/2025 cubierto',
                  color: 'emerald',
                },
                {
                  icon: '📈',
                  title: 'Controlas tu negocio',
                  desc: 'Ves en tiempo real qué local pierde más, qué categoría y qué días. Información que antes no tenías.',
                  highlight: '100%',
                  hlabel: 'visibilidad',
                  color: 'blue',
                },
                {
                  icon: '😌',
                  title: 'Tranquilidad total',
                  desc: 'No dependes de abogados, ni de consultores, ni de Excel. Todo automático y siempre actualizado.',
                  highlight: '2 min',
                  hlabel: 'al día máximo',
                  color: 'violet',
                },
              ].map((b, i) => (
                <FadeInOnScroll key={b.title} delay={i * 100}>
                  <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-7 hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col">
                    <div className="text-4xl mb-4">{b.icon}</div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{b.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm flex-1 mb-5">{b.desc}</p>
                    <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
                      <p className="text-2xl font-bold text-primary-500">{b.highlight}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{b.hlabel}</p>
                    </div>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PRUEBA SOCIAL — Resultados creíbles
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">Resultados reales</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Lo que consiguen los restaurantes<br className="hidden sm:block" /> que miden sus mermas
                </h2>
              </div>
            </FadeInOnScroll>

            {/* Big stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-14">
              {[
                { val: '20–30%', label: 'Reducción media de mermas en los primeros 90 días' },
                { val: '5.000€', label: 'Ahorro medio anual por local tras el primer año' },
                { val: 'Art. 5', label: 'El artículo que exige el plan documentado. MermaLegal lo genera automáticamente.' },
              ].map((s, i) => (
                <FadeInOnScroll key={s.label} delay={i * 100}>
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-extrabold text-primary-500 mb-2">{s.val}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{s.label}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: 'La primera semana ya vi que estaba perdiendo 340€ en proteína. Solo con eso el plan se paga solo.',
                  name: 'Carlos M.',
                  role: 'Propietario, restaurante de carta · Madrid',
                  saving: 'Ahorra ~4.100€/año',
                },
                {
                  quote: 'Me vino una inspección de Sanidad y pude enseñar el plan en el móvil. El inspector vio que teníamos todo documentado y la gestión activa. Sin MermaLegal no hubiera tenido nada que enseñar.',
                  name: 'Laura P.',
                  role: 'Gerente, hotel con restaurante · Valencia',
                  saving: 'Inspección con documentación completa',
                },
                {
                  quote: 'Antes pensaba que el desperdicio era inevitable. Ahora mis cocineros compiten por reducirlo. Ha cambiado la cultura.',
                  name: 'Antonio R.',
                  role: 'Chef-propietario, 2 locales · Barcelona',
                  saving: 'Ahorra ~7.800€/año',
                },
              ].map((t, i) => (
                <FadeInOnScroll key={t.name} delay={i * 120}>
                  <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-7 flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, s) => (
                        <svg key={s} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[var(--text-secondary)] italic flex-1 mb-5">"{t.quote}"</p>
                    <div className="pt-4 border-t border-[var(--border-color)]">
                      <p className="font-semibold text-[var(--text-primary)]">{t.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                      <span className="mt-2 inline-block rounded-full bg-primary-950 border border-primary-800 px-3 py-1 text-xs font-semibold text-primary-400">
                        {t.saving}
                      </span>
                    </div>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PRICING — ROI primero, precio después
        ═══════════════════════════════════════════════════════════════ */}
        <section id="precios" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">Precios</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  Cumple la Ley 1/2025 sin complicaciones.<br className="hidden sm:block" /> Menos que una cena de empresa.
                </h2>
                <p className="mt-4 text-[var(--text-secondary)]">Sin permanencia. Cancela cuando quieras.</p>
              </div>
            </FadeInOnScroll>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Gratis */}
              <FadeInOnScroll delay={0}>
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 flex flex-col h-full">
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Para empezar</p>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Gratis</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[var(--text-primary)]">0€</span>
                    <span className="text-[var(--text-muted)] text-sm">/mes</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Sin tarjeta. Sin compromiso.</p>

                  <ul className="mt-6 space-y-3 text-sm flex-1">
                    {[
                      { ok: true,  text: '1 local' },
                      { ok: true,  text: 'Cálculo de pérdidas económicas' },
                      { ok: true,  text: 'Plan de prevención legal (PDF)' },
                      { ok: false, text: 'Registro diario de mermas' },
                      { ok: false, text: 'KPIs y seguimiento continuo' },
                      { ok: false, text: 'Alertas de desviación' },
                    ].map(({ text, ok }) => (
                      <li key={text} className={`flex items-center gap-2 ${ok ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)] opacity-50'}`}>
                        {ok
                          ? <svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          : <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        }
                        {text}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-xs text-[var(--text-muted)] italic">Descubre cuánto estás perdiendo antes de comprometerte</p>
                  <Link href="/auth/register" className="mt-5 block w-full rounded-lg border border-primary-600 py-3 text-center text-sm font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
                    Empezar gratis
                  </Link>
                </div>
              </FadeInOnScroll>

              {/* Pro */}
              <FadeInOnScroll delay={150}>
                <div className="relative rounded-2xl border-2 border-primary-600 bg-[var(--bg-card)] p-8 shadow-xl flex flex-col h-full">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-5 py-1.5 text-xs font-black text-white uppercase tracking-wide whitespace-nowrap">
                    Más elegido
                  </div>
                  <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">Para controlar y ahorrar</p>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Pro</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[var(--text-primary)]">39€</span>
                    <span className="text-[var(--text-muted)] text-sm">/mes</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Hasta 5 locales</p>
                  <div className="mt-3 rounded-xl bg-primary-950 border border-primary-800 px-4 py-3">
                    <p className="text-sm font-bold text-primary-300">💶 Ahorro típico: 200–800€/mes</p>
                    <p className="text-xs text-primary-500 mt-0.5">El plan se paga solo con 1–2 días de merma evitada</p>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm flex-1">
                    {[
                      'Todo lo del plan Gratis',
                      'Registro diario sin límite',
                      'KPIs automáticos semana a semana',
                      'Informes listos para inspección',
                      'Alertas de merma elevada',
                      'Hasta 5 locales',
                      'Soporte prioritario',
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[var(--text-secondary)]">
                        <svg className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register" className="mt-6 block w-full rounded-lg bg-primary-600 py-3.5 text-center text-sm font-bold text-white hover:bg-primary-700 transition-colors">
                    Empezar con Pro — 39€/mes
                  </Link>
                </div>
              </FadeInOnScroll>

              {/* Business */}
              <FadeInOnScroll delay={300}>
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 flex flex-col h-full">
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Para cadenas y grupos</p>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Business</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[var(--text-primary)]">99€</span>
                    <span className="text-[var(--text-muted)] text-sm">/mes</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Locales ilimitados</p>
                  <ul className="mt-6 space-y-3 text-sm flex-1">
                    {[
                      'Todo lo del plan Pro',
                      'Locales ilimitados',
                      'Benchmarking entre locales',
                      'Alertas automáticas de desviación',
                      'Historial sin límite',
                      'API e integraciones',
                      'Soporte dedicado',
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[var(--text-secondary)]">
                        <svg className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register" className="mt-6 block w-full rounded-lg border border-primary-600 py-3.5 text-center text-sm font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
                    Hablar con ventas
                  </Link>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FINAL CTA — El cierre más directo posible
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-primary-950 relative overflow-hidden">
          <div className="absolute inset-0 -z-0">
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-red-500/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <FadeInOnScroll>
              <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">Última llamada</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
                Cada día sin medir es dinero<br className="hidden sm:block" /> que ya no volverá.
              </h2>
              <p className="text-xl text-gray-300 mb-3">
                <strong className="text-white">2 minutos.</strong> Gratis. Sin tarjeta. Sin compromiso.
              </p>
              <p className="text-gray-400 mb-10">
                Más de <strong className="text-white">300.000 restaurantes</strong> en España están obligados a cumplir la ley.
                La mayoría no tiene el plan. Tú puedes tenerlo hoy.
              </p>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-3 rounded-2xl bg-primary-600 px-12 py-5 text-xl font-black text-white shadow-2xl hover:bg-primary-500 hover:shadow-primary-600/30 hover:-translate-y-1 transition-all"
              >
                {ctaLabel}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Sin tarjeta de crédito
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Plan legal incluido gratis
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Sin permanencia
                </span>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-lg font-bold text-primary-600">
              <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="14" fill="#059669" opacity="0.15" />
                <path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 8v6M13 11l3-3 3 3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              MermaLegal
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} MermaLegal · Herramienta de apoyo a la Ley 1/2025
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
              <Link href="/blog" className="hover:text-primary-600 transition-colors">Guía Ley 1/2025</Link>
              <Link href="/calculadora-desperdicio-restaurantes" className="hover:text-primary-600 transition-colors">Calculadora</Link>
              <a href="/privacidad" className="hover:text-primary-600 transition-colors">Privacidad</a>
              <a href="/terminos" className="hover:text-primary-600 transition-colors">Términos</a>
            </div>
          </div>
          {/* Aviso legal */}
          <p className="text-xs text-[var(--text-muted)] text-center border-t border-[var(--border-color)] pt-5 max-w-4xl mx-auto">
            MermaLegal es una herramienta de apoyo a la documentación y registro exigidos por la Ley 1/2025 de prevención del desperdicio alimentario.
            Genera el Plan de Prevención previsto en el Art. 5 y facilita el registro de trazabilidad.
            El cumplimiento efectivo de la ley depende de la implantación real de las medidas por parte de cada establecimiento.
            MermaLegal no presta asesoramiento jurídico ni garantiza la exención de sanciones administrativas.
            Ante dudas legales específicas, consulte con un profesional cualificado.
          </p>
        </div>
      </footer>
    </div>
  );
}
