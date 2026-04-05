import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LossCalculator } from '@/components/landing-interactive';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Calculadora Desperdicio Alimentario para Restaurantes — Ley 1/2025',
  description:
    'Calcula cuánto pierde tu restaurante, hotel o bar en desperdicio alimentario cada año y cuánto puedes recuperar cumpliendo la Ley 1/2025. Gratis e instantáneo.',
  alternates: { canonical: 'https://mermalegal.com/calculadora-desperdicio-restaurantes' },
  openGraph: {
    title: 'Calculadora de Pérdidas por Desperdicio Alimentario — Restaurantes y Hoteles',
    description:
      'Introduce el número de clientes y ticket medio. Descubre en segundos cuánto estás perdiendo por mermas y cuánto podrías recuperar.',
    url: 'https://mermalegal.com/calculadora-desperdicio-restaurantes',
    type: 'website',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Es obligatorio tener un plan de prevención del desperdicio alimentario?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. La Ley 1/2025, en vigor desde el 2 de abril de 2026, obliga a todos los establecimientos de hostelería y restauración a disponer de un plan de prevención documentado (artículo 5) y a registrar sus mermas con trazabilidad.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué establecimientos tienen que cumplir la Ley 1/2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Restaurantes, bares, cafeterías, hoteles con servicio de comidas, caterings, comedores colectivos y cualquier establecimiento que prepare o sirva alimentos al público. Afecta tanto a pequeños negocios como a grandes cadenas.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo se calcula el desperdicio alimentario de un restaurante?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La fórmula estándar es: (facturación anual × porcentaje de merma estimado). El porcentaje varía entre el 4% y el 12% según el tipo de establecimiento. La media del sector es el 7% según los datos empleados en la redacción de la Ley 1/2025.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Es suficiente con llevar un registro en papel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La ley exige que el registro de mermas sea verificable y con trazabilidad. Un Excel o registro en papel puede ser válido si está correctamente estructurado, pero es difícil de mantener y de presentar ante una inspección.',
      },
    },
  ],
};

export default async function CalculadoraPage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // No env vars in local dev — default to logged-out state
  }
  const ctaHref = user ? '/dashboard' : '/auth/register';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
            Ley 1/2025 — Obligatorio desde abril 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight mb-5">
            Calculadora de desperdicio<br className="hidden sm:block" /> alimentario para restaurantes
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Descubre cuánto dinero estás perdiendo cada año en mermas y cuánto podrías recuperar.
            El restaurante medio pierde entre el <strong className="text-[var(--text-primary)]">5% y el 9% de su facturación</strong> en comida que no llega al cliente.
          </p>
        </div>

        {/* Calculator */}
        <div className="max-w-lg mx-auto mb-16">
          <LossCalculator ctaHref={ctaHref} />
        </div>

        {/* Context section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              ¿Por qué el 7% de tu facturación?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              La cifra del 7% es la media del sector hostelero español según los estudios de referencia
              utilizados en la elaboración de la <strong className="text-[var(--text-primary)]">Ley 1/2025 de prevención de pérdidas y desperdicio alimentario</strong>.
              Dependiendo de tu tipo de negocio puede ser mayor o menor:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              {[
                ['Restaurante de cocina elaborada', '6–9%'],
                ['Bar o cafetería', '4–7%'],
                ['Hotel con restauración', '7–11%'],
                ['Catering y colectividades', '8–12%'],
              ].map(([tipo, rango]) => (
                <li key={tipo} className="flex justify-between items-center py-2 border-b border-[var(--border-color)] last:border-0">
                  <span>{tipo}</span>
                  <span className="font-semibold text-red-400">{rango}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Las multas de la Ley 1/2025 en hostelería
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              La Ley 1/2025 establece que todos los establecimientos de hostelería y restauración
              deben contar con un <strong className="text-[var(--text-primary)]">plan de prevención del desperdicio alimentario</strong> y
              un <strong className="text-[var(--text-primary)]">registro de trazabilidad de mermas</strong>. El incumplimiento puede suponer:
            </p>
            <div className="space-y-3">
              {[
                { nivel: 'Infracción leve', multa: 'Hasta 2.000€', color: 'text-yellow-400', bg: 'bg-yellow-950/30 border-yellow-800/40' },
                { nivel: 'Infracción grave', multa: 'Hasta 60.000€', color: 'text-orange-400', bg: 'bg-orange-950/30 border-orange-800/40' },
                { nivel: 'Infracción muy grave', multa: 'Hasta 500.000€', color: 'text-red-400', bg: 'bg-red-950/30 border-red-800/40' },
              ].map(({ nivel, multa, color, bg }) => (
                <div key={nivel} className={`rounded-xl border p-4 flex justify-between items-center ${bg}`}>
                  <span className="text-sm text-[var(--text-secondary)]">{nivel}</span>
                  <span className={`font-bold ${color}`}>{multa}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What to do section */}
        <div className="rounded-2xl bg-primary-950/30 border border-primary-800/40 p-8 mb-16 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            ¿Qué hago con estos datos?
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-6 leading-relaxed">
            El primer paso es conocer el problema. El segundo es documentarlo correctamente para cumplir la ley.
            MermaLegal te genera el <strong className="text-[var(--text-primary)]">plan de prevención del artículo 5</strong> y te permite
            registrar cada merma con trazabilidad completa — todo en menos de 2 minutos.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-lg font-bold text-white hover:bg-primary-700 transition-colors shadow-lg"
          >
            Generar mi plan de prevención gratis →
          </Link>
          <p className="mt-3 text-sm text-[var(--text-muted)]">Sin tarjeta de crédito. Listo en 2 minutos.</p>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center">
            Preguntas frecuentes sobre el desperdicio alimentario en hostelería
          </h2>
          <div className="space-y-6">
            {[
              {
                q: '¿Es obligatorio tener un plan de prevención del desperdicio alimentario?',
                a: 'Sí. La Ley 1/2025, en vigor desde el 2 de abril de 2026, obliga a todos los establecimientos de hostelería y restauración a disponer de un plan de prevención documentado (artículo 5) y a registrar sus mermas con trazabilidad.',
              },
              {
                q: '¿Qué establecimientos tienen que cumplir la Ley 1/2025?',
                a: 'Restaurantes, bares, cafeterías, hoteles con servicio de comidas, caterings, comedores colectivos y cualquier establecimiento que prepare o sirva alimentos al público. Afecta tanto a pequeños negocios como a grandes cadenas.',
              },
              {
                q: '¿Cómo se calcula el desperdicio alimentario de un restaurante?',
                a: 'La fórmula estándar es: (facturación anual × porcentaje de merma estimado). El porcentaje varía entre el 4% y el 12% según el tipo de establecimiento. La calculadora anterior usa el 7%, que es la media del sector según los datos empleados en la redacción de la Ley 1/2025.',
              },
              {
                q: '¿Es suficiente con llevar un registro en papel?',
                a: 'La ley exige que el registro de mermas sea verificable y con trazabilidad. Un Excel o registro en papel puede ser válido si está correctamente estructurado, pero es difícil de mantener y de presentar ante una inspección. MermaLegal genera registros digitales con todos los campos exigidos.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6">
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{q}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal links */}
        <div className="border-t border-[var(--border-color)] pt-8">
          <p className="text-sm text-[var(--text-muted)] mb-4">Saber más sobre la Ley 1/2025:</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/blog" className="text-sm text-primary-500 hover:text-primary-400 underline underline-offset-2">
              Guía completa Ley 1/2025 →
            </Link>
            <Link href="/blog/plan-prevencion-desperdicio-alimentario-articulo-5" className="text-sm text-primary-500 hover:text-primary-400 underline underline-offset-2">
              ¿Qué es el plan de prevención del artículo 5? →
            </Link>
            <Link href="/blog/locales-afectados-ley-1-2025" className="text-sm text-primary-500 hover:text-primary-400 underline underline-offset-2">
              ¿Qué locales tienen que cumplir la ley? →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--border-color)] py-8 text-center text-sm text-[var(--text-muted)]">
        <p>&copy; {new Date().getFullYear()} MermaLegal · <Link href="/" className="hover:text-primary-500">Inicio</Link> · <Link href="/blog" className="hover:text-primary-500">Blog</Link></p>
      </footer>
    </div>
  );
}
