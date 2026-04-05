import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guía Ley 1/2025 para Hostelería — Multas, Plan de Prevención y Registro de Mermas',
  description:
    'Todo lo que necesita saber el sector hostelero sobre la Ley 1/2025 de prevención del desperdicio alimentario: multas, plan de prevención, registro de trazabilidad y qué establecimientos tienen que cumplirla.',
  alternates: { canonical: 'https://mermalegal.com/blog' },
  openGraph: {
    title: 'Guía Ley 1/2025 — Multas y Plan Prevención Desperdicio Alimentario Hostelería',
    description: 'Artículos y guías prácticas sobre la Ley 1/2025 para restaurantes, hoteles y bares.',
    url: 'https://mermalegal.com/blog',
    type: 'website',
  },
};

const articles = [
  {
    slug: 'ley-1-2025-restaurantes-hoteles',
    title: 'Guía definitiva sobre la Ley 1/2025 para restaurantes y hoteles',
    description:
      'Todo lo que debes saber: qué establecimientos tienen que cumplirla, qué obliga a hacer, qué multas contempla y cómo prepararse antes de que llegue una inspección.',
    tag: 'Guía completa',
    tagColor: 'text-primary-400 bg-primary-950/50 border-primary-800/50',
    readTime: '12 min',
    featured: true,
  },
  {
    slug: 'plan-prevencion-desperdicio-alimentario-articulo-5',
    title: '¿Qué es el plan de prevención del desperdicio alimentario? (Artículo 5)',
    description:
      'La Ley 1/2025 obliga a los establecimientos de hostelería a elaborar un plan de prevención. Te explicamos exactamente qué tiene que incluir, cómo redactarlo y qué pasa si no lo tienes.',
    tag: 'Plan de prevención',
    tagColor: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50',
    readTime: '9 min',
    featured: false,
  },
  {
    slug: 'locales-afectados-ley-1-2025',
    title: '¿Qué establecimientos tienen que cumplir la Ley 1/2025?',
    description:
      'Restaurantes, bares, hoteles, caterings, comedores de empresa... ¿a quién afecta exactamente la ley? Analizamos cada tipo de establecimiento y sus obligaciones específicas.',
    tag: 'Ámbito de aplicación',
    tagColor: 'text-amber-400 bg-amber-950/50 border-amber-800/50',
    readTime: '7 min',
    featured: false,
  },
  {
    slug: 'diferencias-donacion-registro-mermas',
    title: 'Diferencias entre donar comida y registrar mermas: lo que la ley exige realmente',
    description:
      'Muchos hosteleros creen que con donar comida cumplen la ley. No es así. Te explicamos qué es el registro de trazabilidad de mermas, por qué es obligatorio y cómo funciona.',
    tag: 'Registro de mermas',
    tagColor: 'text-blue-400 bg-blue-950/50 border-blue-800/50',
    readTime: '8 min',
    featured: false,
  },
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
          Guía legal para hostelería
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight mb-5">
          Ley 1/2025: Todo lo que necesitas saber
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Guías prácticas sobre la Ley de Prevención del Desperdicio Alimentario para restaurantes,
          hoteles y bares. Sin jerga legal.
        </p>
      </div>

      {/* Alert */}
      <div className="rounded-2xl bg-red-950/30 border border-red-800/40 p-6 mb-12 flex items-start gap-4">
        <span className="text-2xl">🔴</span>
        <div>
          <p className="font-bold text-white mb-1">La Ley 1/2025 está en vigor desde el 2 de abril de 2026</p>
          <p className="text-red-200 text-sm">
            Las inspecciones ya pueden iniciarse. Multas desde 2.000€ hasta 500.000€ para establecimientos
            que no cuenten con el plan de prevención y el registro de mermas.{' '}
            <Link href="/auth/register" className="underline hover:no-underline font-semibold">
              Genera tu plan gratis en 2 minutos →
            </Link>
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className={`block rounded-2xl border bg-[var(--bg-card)] p-8 hover:border-primary-600/50 transition-all group ${
              article.featured ? 'border-primary-800/50 ring-1 ring-primary-800/30' : 'border-[var(--border-color)]'
            }`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${article.tagColor}`}>
                {article.tag}
              </span>
              <span className="text-xs text-[var(--text-muted)]">{article.readTime} de lectura</span>
            </div>
            <h2 className={`font-bold text-[var(--text-primary)] mb-3 group-hover:text-primary-400 transition-colors ${article.featured ? 'text-2xl' : 'text-xl'}`}>
              {article.title}
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {article.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-primary-500 group-hover:text-primary-400 transition-colors">
              Leer artículo →
            </p>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-primary-600 p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          ¿No quieres complicarte con todo esto?
        </h2>
        <p className="text-primary-100 mb-6 max-w-lg mx-auto">
          MermaLegal genera tu plan de prevención del artículo 5 y tu registro de trazabilidad en menos de 2 minutos.
          Cero burocracia. Cero abogados.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary-700 hover:bg-primary-50 transition-colors shadow-lg"
        >
          Generar mi plan legal gratis →
        </Link>
        <p className="mt-3 text-sm text-primary-200">Sin tarjeta de crédito</p>
      </div>
    </main>
  );
}
