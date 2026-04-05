import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guía definitiva sobre la Ley 1/2025 para restaurantes y hoteles',
  description:
    'Todo lo que necesita saber el sector hostelero sobre la Ley 1/2025 de prevención del desperdicio alimentario: qué establecimientos tienen que cumplirla, qué obliga a hacer, qué multas contempla y cómo prepararse.',
  alternates: { canonical: 'https://mermalegal.com/blog/ley-1-2025-restaurantes-hoteles' },
  openGraph: {
    title: 'Guía definitiva Ley 1/2025 — Restaurantes, Hoteles y Bares',
    description: 'Qué establecimientos tienen que cumplir la ley, qué obliga a hacer, qué multas contempla y cómo prepararse antes de una inspección.',
    url: 'https://mermalegal.com/blog/ley-1-2025-restaurantes-hoteles',
    type: 'article',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Guía definitiva sobre la Ley 1/2025 para restaurantes y hoteles',
  description:
    'Todo lo que necesita saber el sector hostelero sobre la Ley 1/2025: qué establecimientos tienen que cumplirla, qué multas contempla y cómo prepararse.',
  url: 'https://mermalegal.com/blog/ley-1-2025-restaurantes-hoteles',
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
      { '@type': 'ListItem', position: 2, name: 'Guía Ley 1/2025', item: 'https://mermalegal.com/blog/ley-1-2025-restaurantes-hoteles' },
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
          <li aria-current="page">Guía Ley 1/2025</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-semibold text-primary-400 bg-primary-950/50 border border-primary-800/50 px-3 py-1 rounded-full">
          Guía completa · 12 min de lectura
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight">
          Guía definitiva sobre la Ley 1/2025 para restaurantes y hoteles
        </h1>
        <p className="mt-5 text-xl text-[var(--text-secondary)] leading-relaxed">
          La Ley 1/2025 de prevención de pérdidas y desperdicio alimentario lleva en vigor desde el
          2 de abril de 2026. Si tienes un restaurante, hotel, bar o cualquier negocio de hostelería,
          esto te afecta directamente. Te lo explicamos todo sin jerga legal.
        </p>
      </div>

      {/* Alert */}
      <div className="rounded-xl bg-red-950/30 border border-red-800/40 p-5 mb-10">
        <p className="text-red-200 text-sm">
          <strong className="text-white">En vigor desde el 2 de abril de 2026.</strong>{' '}
          Las inspecciones pueden iniciarse en cualquier momento. No tener el plan de prevención documentado
          es motivo de sanción aunque nunca hayas recibido un aviso previo.
        </p>
      </div>

      {/* Prose content */}
      <div className="prose-custom">

        <h2>¿Qué es la Ley 1/2025 y por qué existe?</h2>
        <p>
          La <strong>Ley 1/2025, de 22 de enero, de prevención de las pérdidas y el desperdicio alimentario</strong> es
          la norma española que transpone las obligaciones europeas en materia de reducción del desperdicio de alimentos.
          Su objetivo es reducir el despilfarro en toda la cadena alimentaria, desde la producción agrícola hasta el
          consumidor final, pasando por la distribución y, muy especialmente, la restauración y hostelería.
        </p>
        <p>
          El sector hostelero es uno de los que más desperdicio genera. Según los datos manejados durante la tramitación
          de la ley, en España se desperdician alrededor de <strong>7,7 millones de toneladas de alimentos al año</strong>,
          y la restauración y el canal HORECA (Hoteles, Restaurantes y Cafeterías) representan una parte significativa
          de esa cifra.
        </p>

        <h2>¿A quién afecta la Ley 1/2025?</h2>
        <p>
          La ley afecta a todos los eslabones de la cadena alimentaria, pero en el ámbito de la hostelería y restauración
          el impacto es especialmente relevante. Están obligados a cumplir sus disposiciones:
        </p>
        <ul>
          <li><strong>Restaurantes de todo tipo</strong> (cocina tradicional, menús de empresa, fine dining, comida rápida)</li>
          <li><strong>Bares, cafeterías y tabernas</strong> que sirvan alimentos</li>
          <li><strong>Hoteles y establecimientos de alojamiento</strong> con servicio de restauración</li>
          <li><strong>Empresas de catering</strong> y servicios de restauración colectiva</li>
          <li><strong>Comedores de empresa, escuelas y hospitales</strong></li>
          <li><strong>Food trucks</strong> y otros formatos de restauración móvil</li>
        </ul>
        <p>
          La ley no distingue por tamaño. Un restaurante de dos empleados tiene las mismas obligaciones básicas que una
          cadena de cincuenta locales.
        </p>

        <h2>¿Qué obliga a hacer la Ley 1/2025 a los establecimientos hosteleros?</h2>
        <p>
          Las obligaciones se articulan en torno a tres ejes principales:
        </p>

        <h3>1. Plan de prevención del desperdicio alimentario (Artículo 5)</h3>
        <p>
          Todo establecimiento debe elaborar y aplicar un <strong>plan de prevención del desperdicio alimentario</strong>.
          Este documento tiene que recoger:
        </p>
        <ul>
          <li>Un diagnóstico de las principales causas de desperdicio en el establecimiento</li>
          <li>Los objetivos de reducción y el horizonte temporal para alcanzarlos</li>
          <li>Las medidas concretas que se van a adoptar (gestión de compras, control de inventario, aprovechamiento de excedentes, etc.)</li>
          <li>La persona responsable de su seguimiento</li>
          <li>Los indicadores para medir los avances</li>
        </ul>
        <p>
          El plan no tiene que ser un documento de cien páginas. La ley exige que sea proporcional al tamaño y
          actividad del establecimiento. Un pequeño bar puede tener un plan de tres folios que sea completamente válido.
          Lo importante es que exista, esté firmado y esté disponible ante una inspección.
        </p>

        <h3>2. Registro de trazabilidad de mermas</h3>
        <p>
          Además del plan, la ley exige llevar un <strong>registro de las mermas y pérdidas alimentarias</strong> con
          datos de trazabilidad: qué producto se ha desperdiciado, en qué cantidad, cuándo y cuál ha sido su destino
          (destrucción, compostaje, donación, alimentación animal, etc.).
        </p>
        <p>
          Este registro debe mantenerse actualizado y estar disponible para los organismos de inspección. La frecuencia
          mínima de registro no está fijada en la ley con exactitud, pero el criterio general es que debe ser suficientemente
          detallado para demostrar que el establecimiento está midiendo y controlando activamente su desperdicio.
        </p>

        <h3>3. Facilitación de opciones para los clientes</h3>
        <p>
          La ley también obliga a los establecimientos de restauración a ofrecer a sus clientes la opción de llevarse
          los alimentos no consumidos (el conocido como "doggy bag" o "bolsa para llevar"). Negarse a facilitarlo cuando
          el cliente lo solicite puede considerarse infracción.
        </p>

        <h2>¿Qué multas contempla la Ley 1/2025?</h2>
        <p>
          El régimen sancionador de la ley es progresivo y puede resultar muy costoso:
        </p>
        <ul>
          <li><strong>Infracciones leves:</strong> Multas de hasta 2.000€. Incluyen incumplimientos menores como no ofrecer bolsa para llevar o tener el plan de prevención desactualizado.</li>
          <li><strong>Infracciones graves:</strong> Multas de hasta 60.000€. Incluyen no disponer del plan de prevención o del registro de mermas, o tenerlos de forma ficticia sin aplicarlos realmente.</li>
          <li><strong>Infracciones muy graves:</strong> Multas de hasta 500.000€. Reservadas para incumplimientos reiterados o casos de gran impacto.</li>
        </ul>
        <p>
          Además de la multa económica, la ley prevé sanciones accesorias como la publicación del nombre del establecimiento
          infractor (lo que se conoce como "naming and shaming"), lo que puede tener un impacto reputacional significativo.
        </p>

        <h2>¿Cómo prepararse para cumplir la ley?</h2>
        <p>
          Prepararse para la Ley 1/2025 no requiere contratar un abogado ni pasar semanas redactando documentos. Los pasos
          prácticos son:
        </p>
        <ol>
          <li><strong>Elaborar el plan de prevención:</strong> Identifica los puntos donde más desperdicias (compras excesivas, platos que se devuelven, gestión del inventario) y documenta qué vas a hacer para reducirlos.</li>
          <li><strong>Implementar el registro de mermas:</strong> Cada vez que tires comida o la derives a otro destino, anótalo. Fecha, producto, cantidad y destino. Puede ser en papel, en un Excel o en una aplicación.</li>
          <li><strong>Designar un responsable:</strong> La ley exige que haya una persona en el establecimiento responsable del seguimiento del plan.</li>
          <li><strong>Revisar el plan periódicamente:</strong> El plan no es un documento que se hace una vez y se olvida. Tiene que actualizarse cuando cambien las circunstancias del establecimiento.</li>
        </ol>

        <h2>¿Cuánto tiempo lleva cumplir con la ley?</h2>
        <p>
          Si lo haces manualmente, redactar un plan de prevención básico puede llevar entre dos y cuatro horas para
          un establecimiento pequeño. Si usas una herramienta específica, el tiempo se reduce drásticamente.
        </p>
        <p>
          El registro de mermas, si se hace correctamente, añade entre dos y cinco minutos al día al trabajo del equipo,
          dependiendo del volumen del establecimiento.
        </p>

      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-primary-600 p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          ¿No quieres complicarte? Genera tu plan en 2 minutos
        </h2>
        <p className="text-primary-100 mb-6 max-w-lg mx-auto">
          MermaLegal crea automáticamente el plan de prevención del artículo 5 y tu registro de trazabilidad
          de mermas. Sin burocracia, sin abogados, sin conocimientos técnicos.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary-700 hover:bg-primary-50 transition-colors shadow-lg"
        >
          Generar mi plan legal gratis →
        </Link>
        <p className="mt-3 text-sm text-primary-200">Sin tarjeta de crédito · Listo en 2 minutos</p>
      </div>

      {/* Related */}
      <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Artículos relacionados</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: '/blog/plan-prevencion-desperdicio-alimentario-articulo-5', title: '¿Qué debe incluir exactamente el plan de prevención del artículo 5?' },
            { href: '/blog/locales-afectados-ley-1-2025', title: '¿Qué establecimientos tienen que cumplir la Ley 1/2025?' },
            { href: '/blog/diferencias-donacion-registro-mermas', title: 'Diferencias entre donar comida y registrar mermas' },
            { href: '/calculadora-desperdicio-restaurantes', title: 'Calculadora: ¿cuánto pierdes al año en desperdicio alimentario?' },
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
