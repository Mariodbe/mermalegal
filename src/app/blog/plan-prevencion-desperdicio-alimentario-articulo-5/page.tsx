import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '¿Qué es el plan de prevención del desperdicio alimentario? (Artículo 5 Ley 1/2025)',
  description:
    'La Ley 1/2025 obliga a todos los establecimientos hosteleros a elaborar un plan de prevención del desperdicio alimentario. Te explicamos qué tiene que incluir, cómo redactarlo y qué pasa si no lo tienes.',
  alternates: { canonical: 'https://mermalegal.com/blog/plan-prevencion-desperdicio-alimentario-articulo-5' },
  openGraph: {
    title: 'Plan de Prevención del Desperdicio Alimentario: Qué es y Cómo Hacerlo (Artículo 5)',
    description: 'Guía práctica para redactar el plan de prevención obligatorio por la Ley 1/2025. Qué tiene que incluir, ejemplos reales y qué pasa si no lo tienes.',
    url: 'https://mermalegal.com/blog/plan-prevencion-desperdicio-alimentario-articulo-5',
    type: 'article',
  },
};

export default function ArticlePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <nav className="text-sm text-[var(--text-muted)] mb-8">
        <Link href="/blog" className="hover:text-primary-500">Blog</Link>
        <span className="mx-2">›</span>
        <span>Plan de prevención artículo 5</span>
      </nav>

      <div className="mb-10">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1 rounded-full">
          Plan de prevención · 9 min de lectura
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight">
          ¿Qué es el plan de prevención del desperdicio alimentario?
        </h1>
        <p className="mt-5 text-xl text-[var(--text-secondary)] leading-relaxed">
          El artículo 5 de la Ley 1/2025 obliga a todos los establecimientos hosteleros a elaborar un
          plan de prevención del desperdicio alimentario. Te explicamos exactamente qué tiene que incluir,
          cómo redactarlo y qué ocurre si no lo tienes cuando llega una inspección.
        </p>
      </div>

      <div className="prose-custom">

        <h2>¿Qué es el plan de prevención del desperdicio alimentario?</h2>
        <p>
          El plan de prevención del desperdicio alimentario es un documento que cada establecimiento hostelero
          debe elaborar, mantener actualizado y tener disponible para los inspectores. Su objetivo es demostrar
          que el negocio tiene una estrategia activa para reducir el desperdicio de alimentos, no solo buenas intenciones.
        </p>
        <p>
          El <strong>artículo 5 de la Ley 1/2025</strong> lo define como un instrumento de gestión interna que debe
          recoger el diagnóstico de la situación actual del establecimiento, los objetivos de reducción y las medidas
          concretas para alcanzarlos. No es un trámite burocrático que se hace una vez y se archiva: debe ser un
          documento vivo que se revisa y actualiza.
        </p>

        <h2>¿Qué tiene que incluir exactamente el plan de prevención?</h2>
        <p>
          Aunque la ley deja cierta flexibilidad en el formato, el contenido mínimo exigible es el siguiente:
        </p>

        <h3>1. Diagnóstico: ¿dónde y por qué se desperdicia?</h3>
        <p>
          El punto de partida es identificar en qué fases del proceso se generan más pérdidas. En un restaurante
          típico, los principales focos de desperdicio son:
        </p>
        <ul>
          <li><strong>Compras excesivas:</strong> Se compra más de lo que se va a usar porque no hay un sistema de previsión de demanda.</li>
          <li><strong>Almacenamiento incorrecto:</strong> Productos que caducan por una mala rotación del inventario.</li>
          <li><strong>Producción sobredimensionada:</strong> Se prepara más cantidad de la que se sirve.</li>
          <li><strong>Devoluciones de platos:</strong> Platos que los clientes no terminan y que no se pueden reutilizar.</li>
          <li><strong>Gestión de excedentes:</strong> No hay un protocolo para aprovechar los excedentes del día anterior.</li>
        </ul>

        <h3>2. Objetivos de reducción</h3>
        <p>
          El plan debe fijar metas cuantificables. Por ejemplo: reducir el desperdicio en la partida de verduras en un
          20% en 12 meses, o pasar de tirar 15 kg de pan al día a 10 kg en seis meses. Los objetivos tienen que ser
          realistas y medibles, no declaraciones de intenciones genéricas.
        </p>

        <h3>3. Medidas concretas de prevención</h3>
        <p>
          Esta es la parte más importante del plan. Las medidas deben ser específicas y referirse a acciones reales
          que el establecimiento va a implementar:
        </p>
        <ul>
          <li>Implementar un sistema de pedidos ajustado a la demanda prevista</li>
          <li>Establecer un control FIFO (primero en entrar, primero en salir) en el almacén y la cámara</li>
          <li>Diseñar menús del día que aprovechen los excedentes de la semana</li>
          <li>Ofrecer raciones más pequeñas a precio reducido</li>
          <li>Establecer acuerdos con bancos de alimentos para donaciones regulares</li>
          <li>Formar al personal en gestión responsable de existencias</li>
        </ul>

        <h3>4. Responsable del plan</h3>
        <p>
          La ley exige designar a una persona responsable del seguimiento del plan. En un restaurante familiar puede ser
          el propio dueño. En establecimientos más grandes, puede ser el jefe de cocina o el responsable de compras.
          Lo importante es que quede documentado quién es y cuáles son sus responsabilidades.
        </p>

        <h3>5. Indicadores de seguimiento</h3>
        <p>
          El plan tiene que incluir los indicadores que se usarán para medir el progreso. Los más habituales son:
        </p>
        <ul>
          <li>Kilogramos de desperdicio por servicio</li>
          <li>Porcentaje de mermas sobre el total de compras</li>
          <li>Evolución mensual del desperdicio por categoría (carnes, verduras, productos de panadería, etc.)</li>
          <li>Cantidad destinada a donación frente a la destinada a destrucción</li>
        </ul>

        <h2>¿Cuánto tiene que ser de detallado el plan?</h2>
        <p>
          La ley establece el principio de proporcionalidad: el nivel de detalle del plan debe ser adecuado al
          tamaño y tipo de establecimiento. Un bar con cuatro empleados no necesita el mismo plan que un hotel
          con dos restaurantes y trescientas habitaciones.
        </p>
        <p>
          Para un pequeño establecimiento, un plan de prevención sólido puede tener entre tres y ocho páginas.
          Lo que importa es que sea concreto, aplicable y que se pueda demostrar que se está siguiendo.
        </p>

        <h2>¿Qué pasa si no tengo el plan de prevención?</h2>
        <p>
          No tener el plan de prevención elaborado, o tenerlo pero no aplicarlo en la práctica, es una
          <strong> infracción grave</strong> que puede acarrear multas de hasta 60.000€. Además, en caso de
          reincidencia o incumplimiento persistente, las sanciones pueden agravarse hasta los 500.000€.
        </p>
        <p>
          Pero más allá de la multa, hay otro riesgo que muchos hosteleros no tienen en cuenta: la <strong>publicación
          del nombre del establecimiento</strong> como infractor. La Ley 1/2025 contempla la divulgación pública de
          las sanciones graves, lo que puede tener un impacto reputacional considerable.
        </p>

        <h2>¿Cuándo debe estar listo el plan?</h2>
        <p>
          La ley entró en vigor el 2 de abril de 2026. Desde esa fecha, los establecimientos deben tener el plan
          disponible. No existe un periodo de gracia adicional: si una inspección se presenta en tu local hoy y
          pide el plan de prevención, tienes que poder mostrarlo.
        </p>

        <h2>¿Puedo redactar el plan yo mismo?</h2>
        <p>
          Sí, y en muchos casos es la opción más práctica. No necesitas contratar a un consultor ni a un abogado
          para cumplir con esta obligación. La ley no exige un formato específico, solo que el contenido sea correcto.
        </p>
        <p>
          Lo que sí te recomendamos es usar una estructura clara y que el documento quede fechado y firmado, para
          que quede constancia de cuándo se elaboró y quién es el responsable.
        </p>

      </div>

      <div className="mt-12 rounded-2xl bg-primary-600 p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Genera tu plan de prevención en 2 minutos
        </h2>
        <p className="text-primary-100 mb-6 max-w-lg mx-auto">
          MermaLegal crea automáticamente el plan de prevención del artículo 5 personalizado para tu
          establecimiento. Solo tienes que responder unas preguntas básicas.
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
            { href: '/blog/ley-1-2025-restaurantes-hoteles', title: 'Guía definitiva sobre la Ley 1/2025 para restaurantes y hoteles' },
            { href: '/blog/diferencias-donacion-registro-mermas', title: 'Diferencias entre donar comida y registrar mermas' },
            { href: '/blog/locales-afectados-ley-1-2025', title: '¿Qué establecimientos tienen que cumplir la Ley 1/2025?' },
            { href: '/calculadora-desperdicio-restaurantes', title: 'Calculadora: ¿cuánto pierdes al año en desperdicio?' },
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
