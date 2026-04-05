import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Diferencias entre donar comida y registrar mermas: lo que exige la Ley 1/2025',
  description:
    'Muchos hosteleros creen que con donar comida ya cumplen la Ley 1/2025. No es así. Te explicamos qué es el registro de trazabilidad de mermas, por qué es obligatorio aunque dones, y cómo funciona.',
  alternates: { canonical: 'https://mermalegal.com/blog/diferencias-donacion-registro-mermas' },
  openGraph: {
    title: 'Donar comida vs Registrar mermas: diferencias clave según la Ley 1/2025',
    description: 'La donación de alimentos es positiva pero no sustituye al registro de trazabilidad. Te explicamos la diferencia y qué obliga realmente la ley.',
    url: 'https://mermalegal.com/blog/diferencias-donacion-registro-mermas',
    type: 'article',
  },
};

export default function ArticlePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <nav className="text-sm text-[var(--text-muted)] mb-8">
        <Link href="/blog" className="hover:text-primary-500">Blog</Link>
        <span className="mx-2">›</span>
        <span>Donación vs registro de mermas</span>
      </nav>

      <div className="mb-10">
        <span className="text-xs font-semibold text-blue-400 bg-blue-950/50 border border-blue-800/50 px-3 py-1 rounded-full">
          Registro de mermas · 8 min de lectura
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight">
          Diferencias entre donar comida y registrar mermas: lo que la ley exige realmente
        </h1>
        <p className="mt-5 text-xl text-[var(--text-secondary)] leading-relaxed">
          Una de las confusiones más frecuentes entre los hosteleros es pensar que donar comida a un banco
          de alimentos es suficiente para cumplir la Ley 1/2025. La donación es una buena práctica, pero
          la ley exige algo más: el registro de trazabilidad de mermas. Te explicamos la diferencia.
        </p>
      </div>

      <div className="prose-custom">

        <h2>El malentendido más común</h2>
        <p>
          Cuando la Ley 1/2025 empezó a conocerse en el sector hostelero, muchos propietarios de restaurantes
          reaccionaron del mismo modo: "yo ya dono lo que me sobra al banco de alimentos, así que estoy cubierto".
          Es una reacción comprensible, pero incorrecta.
        </p>
        <p>
          La donación de alimentos es una práctica excelente, que la ley fomenta y que tiene ventajas fiscales
          (las donaciones a entidades sin ánimo de lucro pueden desgravarse). Pero la donación no sustituye al
          <strong> registro de trazabilidad de mermas</strong>, que es una obligación independiente y adicional.
        </p>

        <h2>¿Qué es el registro de trazabilidad de mermas?</h2>
        <p>
          El registro de trazabilidad de mermas es un documento (físico o digital) donde el establecimiento
          anota, de forma sistemática, todos los alimentos que salen de la cadena de consumo. Esto incluye:
        </p>
        <ul>
          <li>Alimentos que se tiran (destrucción)</li>
          <li>Alimentos que se donan</li>
          <li>Alimentos destinados a compostaje</li>
          <li>Alimentos destinados a alimentación animal</li>
          <li>Alimentos que se devuelven al proveedor</li>
        </ul>
        <p>
          Para cada registro, la ley exige que conste, como mínimo: la fecha, el tipo de alimento, la cantidad
          (en kilogramos o en unidades) y el destino final. Si hay una persona o entidad receptora (un banco de
          alimentos, una empresa de compostaje, etc.), también debe quedar identificada.
        </p>

        <h2>¿Por qué no basta con donar?</h2>
        <p>
          Imagina que un inspector llega a tu restaurante y te pide el registro de mermas. Si solo tienes un
          recibo de que has donado algo al banco de alimentos de vez en cuando, no es suficiente. El inspector
          necesita ver:
        </p>
        <ol>
          <li>Que tienes un sistema de registro activo y al día</li>
          <li>Que registras <em>todas</em> las mermas, no solo las que donas</li>
          <li>Que puedes demostrar la evolución de tu desperdicio a lo largo del tiempo</li>
          <li>Que el registro está vinculado a tu plan de prevención</li>
        </ol>
        <p>
          La donación puede aparecer en tu registro como una de las vías de destino de los alimentos excedentes,
          lo cual es positivo. Pero el registro tiene que existir de forma independiente y recoger todo el
          desperdicio, con independencia de si se dona, se tira o se destina a otros usos.
        </p>

        <h2>¿Cómo funciona la trazabilidad en la práctica?</h2>
        <p>
          La trazabilidad en el contexto del desperdicio alimentario significa poder seguir el recorrido de un
          alimento desde el momento en que se detecta que no va a ser consumido hasta su destino final.
        </p>
        <p>
          En la práctica, para un restaurante esto implica:
        </p>

        <h3>Ejemplo de registro correcto</h3>
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 my-6">
          <p className="text-xs font-mono text-[var(--text-muted)] mb-4">— Ejemplo de entrada en el registro de mermas —</p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-[var(--text-muted)]">Fecha</span>
              <span className="col-span-2 text-[var(--text-primary)] font-medium">15 de abril de 2026</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-[var(--text-muted)]">Categoría</span>
              <span className="col-span-2 text-[var(--text-primary)] font-medium">Verduras y hortalizas (produce)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-[var(--text-muted)]">Cantidad</span>
              <span className="col-span-2 text-[var(--text-primary)] font-medium">3,5 kg</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-[var(--text-muted)]">Destino</span>
              <span className="col-span-2 text-[var(--text-primary)] font-medium">Donación — Banco de Alimentos de Madrid</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-[var(--text-muted)]">Motivo</span>
              <span className="col-span-2 text-[var(--text-primary)] font-medium">Excedente del servicio de mediodía</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-[var(--text-muted)]">Registrado por</span>
              <span className="col-span-2 text-[var(--text-primary)] font-medium">Carlos R. (jefe de cocina)</span>
            </div>
          </div>
        </div>

        <p>
          Este tipo de anotación, hecha de forma sistemática para cada incidencia de merma o excedente, es lo
          que constituye un registro de trazabilidad válido. Un simple recibo de donación no proporciona esta
          información de forma estructurada.
        </p>

        <h2>¿Cada cuánto hay que registrar las mermas?</h2>
        <p>
          La ley no especifica una frecuencia exacta, pero el criterio de proporcionalidad y el objetivo de
          trazabilidad real implican que el registro debe hacerse con la frecuencia suficiente para dar una
          imagen fiel de la situación del establecimiento. En la práctica:
        </p>
        <ul>
          <li><strong>Restaurantes con mermas diarias:</strong> registro diario o por servicio</li>
          <li><strong>Establecimientos con mermas puntuales:</strong> registro cada vez que se produce una merma significativa</li>
          <li><strong>Caterings y grandes comedores:</strong> registro por evento o por servicio</li>
        </ul>

        <h2>¿Puede ser el registro en papel?</h2>
        <p>
          Sí, la ley no obliga a usar un sistema digital. Un libro de registro en papel, correctamente
          mantenido, puede ser válido. Sin embargo, los registros digitales tienen varias ventajas prácticas:
          son más fáciles de ordenar, de buscar, de presentar ante una inspección y de analizar para mejorar
          el plan de prevención.
        </p>

        <h2>¿La donación tiene alguna ventaja específica según la ley?</h2>
        <p>
          Sí. La Ley 1/2025 establece una jerarquía de destinos para los alimentos excedentes. En orden de
          preferencia:
        </p>
        <ol>
          <li>Redistribución para consumo humano (donación a bancos de alimentos, comedores sociales, etc.)</li>
          <li>Alimentación animal</li>
          <li>Valorización en forma de compost u otros aprovechamientos</li>
          <li>Destrucción (el último recurso)</li>
        </ol>
        <p>
          Por tanto, la donación es la opción más valorada por la ley y contribuye positivamente a la imagen
          del establecimiento ante una inspección. Pero, insistimos, tiene que ir acompañada del registro.
        </p>

      </div>

      <div className="mt-12 rounded-2xl bg-primary-600 p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Registra tus mermas correctamente desde hoy
        </h2>
        <p className="text-primary-100 mb-6 max-w-lg mx-auto">
          MermaLegal te permite registrar cada merma en segundos y genera automáticamente el historial
          de trazabilidad que la ley exige. Con categorías, destinos y exportación incluida.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary-700 hover:bg-primary-50 transition-colors shadow-lg"
        >
          Empezar a registrar gratis →
        </Link>
        <p className="mt-3 text-sm text-primary-200">Sin tarjeta de crédito · Sin conocimientos técnicos</p>
      </div>

      <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Artículos relacionados</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: '/blog/ley-1-2025-restaurantes-hoteles', title: 'Guía definitiva sobre la Ley 1/2025' },
            { href: '/blog/plan-prevencion-desperdicio-alimentario-articulo-5', title: '¿Qué debe incluir el plan de prevención del artículo 5?' },
            { href: '/blog/locales-afectados-ley-1-2025', title: '¿Qué establecimientos tienen que cumplir la ley?' },
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
