import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '¿Qué establecimientos tienen que cumplir la Ley 1/2025 de desperdicio alimentario?',
  description:
    'Restaurantes, bares, hoteles, caterings, comedores de empresa... ¿a quién afecta la Ley 1/2025? Analizamos cada tipo de establecimiento hostelero y sus obligaciones específicas según la ley.',
  alternates: { canonical: 'https://mermalegal.com/blog/locales-afectados-ley-1-2025' },
  openGraph: {
    title: '¿A qué establecimientos afecta la Ley 1/2025 de desperdicio alimentario?',
    description: 'Guía completa por tipo de negocio: restaurantes, bares, hoteles, caterings y comedores colectivos.',
    url: 'https://mermalegal.com/blog/locales-afectados-ley-1-2025',
    type: 'article',
  },
};

const tipos = [
  {
    icono: '🍽️',
    tipo: 'Restaurantes',
    afectado: true,
    detalle: 'Todos los restaurantes, independientemente de su tamaño o categoría, están obligados a disponer del plan de prevención y el registro de mermas. Esto incluye restaurantes de menú, de carta, de cocina de autor y de comida rápida con servicio en mesa.',
  },
  {
    icono: '☕',
    tipo: 'Bares y cafeterías',
    afectado: true,
    detalle: 'Los bares que sirvan alimentos están incluidos. Un bar que solo sirva café y bollería puede tener un plan más sencillo, pero sigue siendo obligatorio. Si prepara bocadillos, raciones o platos, las obligaciones son equivalentes a las de un restaurante.',
  },
  {
    icono: '🏨',
    tipo: 'Hoteles con restauración',
    afectado: true,
    detalle: 'Los hoteles que ofrezcan desayunos, media pensión o pensión completa tienen que cumplir la ley para toda su actividad de restauración. En muchos casos, el volumen de desperdicio en el buffet de desayuno es especialmente elevado.',
  },
  {
    icono: '🚚',
    tipo: 'Empresas de catering',
    afectado: true,
    detalle: 'Las empresas de catering están sujetas a las mismas obligaciones. Dado que trabajan con grandes volúmenes y que la producción no siempre coincide exactamente con el consumo final, el registro de mermas es especialmente importante en este sector.',
  },
  {
    icono: '🏫',
    tipo: 'Comedores escolares',
    afectado: true,
    detalle: 'Los comedores escolares gestionados tanto por el propio centro como por empresas de restauración colectiva tienen que cumplir la ley. Dado su carácter público y educativo, son uno de los sectores donde la administración pondrá mayor atención.',
  },
  {
    icono: '🏥',
    tipo: 'Comedores hospitalarios y residencias',
    afectado: true,
    detalle: 'Los hospitales, clínicas y residencias de mayores con servicio de comidas están incluidos. En estos casos, las obligaciones se aplican al gestor del servicio de restauración, ya sea interno o externalizado.',
  },
  {
    icono: '🏢',
    tipo: 'Comedores de empresa',
    afectado: true,
    detalle: 'Los comedores de empresa que sirven comidas a sus empleados también están obligados. Tanto si la gestión es directa como si se subcontrata a una empresa de restauración colectiva.',
  },
  {
    icono: '🛒',
    tipo: 'Supermercados con zona de restauración',
    afectado: true,
    detalle: 'Los supermercados que dispongan de una zona de restauración o que preparen alimentos para consumo inmediato (barras de ensaladas, platos preparados calientes, etc.) también entran en el ámbito de la ley.',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '¿Qué establecimientos tienen que cumplir la Ley 1/2025 de desperdicio alimentario?',
  description:
    'Restaurantes, bares, hoteles, caterings, comedores de empresa... Analizamos cada tipo de establecimiento hostelero y sus obligaciones según la Ley 1/2025.',
  url: 'https://mermalegal.com/blog/locales-afectados-ley-1-2025',
  datePublished: '2026-04-02',
  dateModified: '2026-04-02',
  author: { '@type': 'Organization', name: 'MermaLegal', url: 'https://mermalegal.com' },
  publisher: {
    '@type': 'Organization',
    name: 'MermaLegal',
    logo: { '@type': 'ImageObject', url: 'https://mermalegal.com/og-image.png' },
  },
  image: 'https://mermalegal.com/og-image.png',
  inLanguage: 'es-ES',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://mermalegal.com/blog' },
      { '@type': 'ListItem', position: 2, name: 'Locales afectados Ley 1/2025', item: 'https://mermalegal.com/blog/locales-afectados-ley-1-2025' },
    ],
  },
};

export default function ArticlePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <nav aria-label="Ruta de navegación" className="text-sm text-[var(--text-muted)] mb-8">
        <ol className="flex items-center gap-1 list-none p-0 m-0">
          <li><Link href="/blog" className="hover:text-primary-500">Blog</Link></li>
          <li aria-hidden="true" className="mx-1">›</li>
          <li aria-current="page">Locales afectados Ley 1/2025</li>
        </ol>
      </nav>

      <div className="mb-10">
        <span className="text-xs font-semibold text-amber-400 bg-amber-950/50 border border-amber-800/50 px-3 py-1 rounded-full">
          Ámbito de aplicación · 7 min de lectura
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight">
          ¿Qué establecimientos tienen que cumplir la Ley 1/2025?
        </h1>
        <p className="mt-5 text-xl text-[var(--text-secondary)] leading-relaxed">
          La Ley 1/2025 de prevención del desperdicio alimentario afecta a un abanico amplio de negocios
          hosteleros. Si preparas o sirves alimentos al público, es muy probable que estés obligado. Te
          lo explicamos por tipo de establecimiento.
        </p>
      </div>

      <div className="prose-custom">

        <h2>El criterio general: si sirves alimentos, te afecta</h2>
        <p>
          La ley no establece un umbral de tamaño mínimo (en facturación, en metros cuadrados o en número de
          empleados) por debajo del cual los establecimientos queden exentos. El criterio es funcional: si tu
          actividad consiste en preparar y servir alimentos a clientes o usuarios, debes cumplir con las obligaciones
          del artículo 5 (plan de prevención) y el registro de trazabilidad de mermas.
        </p>
        <p>
          Esto significa que <strong>un bar de barrio con dos empleados tiene las mismas obligaciones básicas que
          una cadena de restaurantes con cincuenta locales</strong>. La diferencia está en el nivel de detalle
          exigible: la ley aplica el principio de proporcionalidad, de modo que un pequeño establecimiento puede
          cumplir con un plan más sencillo que uno de gran volumen.
        </p>

        <h2>Establecimientos afectados por tipo</h2>

      </div>

      {/* Types grid */}
      <div className="space-y-4 my-8">
        {tipos.map(({ icono, tipo, afectado, detalle }) => (
          <div key={tipo} className={`rounded-xl border p-6 ${afectado ? 'border-[var(--border-color)] bg-[var(--bg-card)]' : 'border-gray-700/30 bg-gray-900/20'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{icono}</span>
              <h3 className="font-bold text-[var(--text-primary)]">{tipo}</h3>
              <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${afectado ? 'bg-red-900/50 text-red-300 border border-red-800' : 'bg-gray-800 text-gray-400'}`}>
                {afectado ? '✓ Obligado' : '— Exento'}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{detalle}</p>
          </div>
        ))}
      </div>

      <div className="prose-custom">

        <h2>¿Y los establecimientos sin servicio de mesa?</h2>
        <p>
          La ley se aplica a los establecimientos donde se preparan alimentos para consumo, no únicamente a los
          restaurantes con servicio de mesa. Un obrador de panadería que vende al público, una pastelería que
          prepara tartas bajo pedido o una empresa que fabrica platos preparados también están sujetos a determinadas
          obligaciones, aunque en un ámbito diferente al de la restauración directa.
        </p>
        <p>
          En el caso específico de la hostelería, la línea que delimita quién está obligado es clara: si el establecimiento
          prepara o sirve alimentos para consumo inmediato, está dentro del ámbito de la ley.
        </p>

        <h2>¿Qué pasa con los locales que acaban de abrir?</h2>
        <p>
          Los nuevos establecimientos deben cumplir la ley desde el primer día de actividad. No existe un periodo
          de adaptación para los negocios que abran después de la entrada en vigor de la norma (2 de abril de 2026).
          Esto significa que si estás pensando en abrir un restaurante, el plan de prevención tiene que estar listo
          antes de comenzar a operar.
        </p>

        <h2>¿Cómo saber si estoy obligado?</h2>
        <p>
          Si tienes dudas sobre si tu negocio concreto está obligado, la respuesta más sencilla es asumir que sí y
          preparar el plan de prevención. El coste de tenerlo (prácticamente nulo si se hace con la herramienta adecuada)
          es infinitamente menor que el riesgo de una multa de entre 2.000€ y 60.000€.
        </p>

      </div>

      <div className="mt-12 rounded-2xl bg-primary-600 p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Cumple la ley hoy mismo — gratis
        </h2>
        <p className="text-primary-100 mb-6 max-w-lg mx-auto">
          Sea cual sea el tamaño de tu establecimiento, MermaLegal genera el plan de prevención del
          artículo 5 adaptado a tu negocio en menos de 2 minutos.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary-700 hover:bg-primary-50 transition-colors shadow-lg"
        >
          Generar mi plan legal gratis →
        </Link>
        <p className="mt-3 text-sm text-primary-200">Sin tarjeta de crédito · Sin conocimientos técnicos</p>
      </div>

      <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Artículos relacionados</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: '/blog/ley-1-2025-restaurantes-hoteles', title: 'Guía definitiva sobre la Ley 1/2025' },
            { href: '/blog/plan-prevencion-desperdicio-alimentario-articulo-5', title: '¿Qué debe incluir el plan de prevención del artículo 5?' },
            { href: '/blog/diferencias-donacion-registro-mermas', title: 'Diferencias entre donar comida y registrar mermas' },
            { href: '/calculadora-desperdicio-restaurantes', title: 'Calcula cuánto pierdes en desperdicio alimentario' },
          ].map(({ href, title }) => (
            <Link key={href} href={href} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 hover:border-primary-600/50 transition-colors group">
              <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{title} →</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
