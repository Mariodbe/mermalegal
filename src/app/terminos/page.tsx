import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones · MermaLegal',
  description: 'Términos y condiciones de uso del servicio MermaLegal.',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-primary-600">
            <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#059669" opacity="0.15" />
              <path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 8v6M13 11l3-3 3 3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            MermaLegal
          </Link>
          <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-primary-600 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 md:p-12 shadow-sm">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Términos y Condiciones</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">Última actualización: abril de 2025</p>

          <div className="prose prose-sm max-w-none text-[var(--text-secondary)] space-y-8">

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">1. Objeto y aceptación</h2>
              <p>
                Los presentes Términos y Condiciones (en adelante, «Términos») regulan el acceso y uso del servicio MermaLegal (en adelante, «el Servicio»), una plataforma de software como servicio (SaaS) que facilita a los operadores de establecimientos de hostelería y alimentación la generación de documentación de apoyo y el registro de mermas conforme a la Ley 1/2025, de 2 de enero, de prevención de las pérdidas y el desperdicio alimentario.
              </p>
              <p className="mt-3">
                Al registrarse o utilizar el Servicio, usted (en adelante, «el Usuario») acepta estos Términos en su totalidad. Si no está de acuerdo, no utilice el Servicio.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">2. Descripción del servicio</h2>
              <p>MermaLegal ofrece las siguientes funcionalidades principales:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Generación automatizada del Plan de Prevención de Pérdidas y Desperdicio Alimentario previsto en el Art. 5 de la Ley 1/2025.</li>
                <li>Registro digital de mermas por establecimiento, categoría de alimento y destino.</li>
                <li>Panel de control con métricas de merma e historial de registros.</li>
                <li>Almacenamiento y descarga de la documentación generada.</li>
              </ul>
              <p className="mt-3">
                <strong>Limitación importante:</strong> MermaLegal es una herramienta de apoyo documental. El cumplimiento efectivo de la Ley 1/2025 exige la implantación real de las medidas recogidas en el Plan de Prevención. MermaLegal <strong>no presta asesoramiento jurídico</strong> ni garantiza la exención de sanciones administrativas. En caso de duda legal, consulte con un asesor jurídico especializado.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">3. Registro y cuenta de usuario</h2>
              <p>
                Para acceder al Servicio es necesario crear una cuenta con una dirección de correo electrónico válida y una contraseña. El Usuario es responsable de:
              </p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                <li>Notificar a MermaLegal de inmediato cualquier uso no autorizado de su cuenta.</li>
                <li>Facilitar información veraz, actualizada y completa durante el registro y el uso del Servicio.</li>
              </ul>
              <p className="mt-3">
                MermaLegal no será responsable de los daños derivados del incumplimiento de estas obligaciones por parte del Usuario.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">4. Planes y facturación</h2>
              <p>El Servicio se ofrece en dos modalidades:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>
                  <strong>Plan Gratuito:</strong> acceso limitado a 1 establecimiento y hasta 10 registros de merma mensuales. No requiere pago.
                </li>
                <li>
                  <strong>Plan Pro (39 €/mes + IVA):</strong> establecimientos ilimitados, registros ilimitados y acceso completo a todas las funcionalidades. La suscripción se renueva automáticamente cada mes hasta su cancelación.
                </li>
              </ul>
              <p className="mt-3">
                Los precios incluyen el IVA aplicable. MermaLegal se reserva el derecho a modificar los precios con un preaviso de 30 días comunicado por correo electrónico. Si no acepta la modificación, puede cancelar su suscripción antes de que entre en vigor.
              </p>
              <p className="mt-3">
                El pago se gestiona a través de Stripe, Inc. Al introducir sus datos de pago acepta además las condiciones de uso de Stripe (<a href="https://stripe.com/es/legal" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">stripe.com/es/legal</a>).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">5. Cancelación y reembolsos</h2>
              <p>
                El Usuario puede cancelar su suscripción en cualquier momento desde el panel de control. La cancelación tendrá efecto al final del período de facturación en curso; no se realizarán reembolsos por el período no consumido.
              </p>
              <p className="mt-3">
                En caso de error de facturación imputable a MermaLegal, se procederá al reembolso íntegro del importe cobrado incorrectamente. Para solicitarlo, contacte con <strong>soporte@mermalegal.com</strong> en un plazo de 14 días desde el cargo.
              </p>
              <p className="mt-3">
                Conforme al Art. 103.a) del Real Decreto Legislativo 1/2007 (TRLGDCU), queda excluido el derecho de desistimiento respecto de contratos de prestación de servicios digitales cuya ejecución haya comenzado con el consentimiento previo del consumidor.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">6. Propiedad intelectual</h2>
              <p>
                MermaLegal y sus componentes (código fuente, diseño, marca, logotipo y contenidos propios) son propiedad exclusiva de MermaLegal y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.
              </p>
              <p className="mt-3">
                Los documentos generados por el Servicio a partir de los datos del Usuario (Plan de Prevención, informes de merma) pertenecen al Usuario. MermaLegal no reclama derechos sobre dichos documentos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">7. Uso aceptable</h2>
              <p>El Usuario se compromete a no:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Usar el Servicio para fines ilícitos o contrarios a la normativa vigente.</li>
                <li>Intentar acceder sin autorización a sistemas o datos de otros usuarios.</li>
                <li>Realizar ingeniería inversa, descompilar o modificar el software del Servicio.</li>
                <li>Transmitir virus, malware o cualquier código dañino.</li>
                <li>Revender o sublicenciar el acceso al Servicio a terceros sin autorización expresa por escrito.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">8. Disponibilidad y modificaciones del servicio</h2>
              <p>
                MermaLegal se esfuerza por mantener el Servicio disponible de forma continua, pero no garantiza una disponibilidad del 100%. Pueden producirse interrupciones por mantenimiento, actualizaciones o causas ajenas a nuestro control.
              </p>
              <p className="mt-3">
                MermaLegal se reserva el derecho a modificar, suspender o discontinuar cualquier funcionalidad del Servicio, notificándolo con antelación razonable cuando sea posible.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">9. Limitación de responsabilidad</h2>
              <p>
                En la máxima medida permitida por la ley, MermaLegal no será responsable de:
              </p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Daños indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso del Servicio.</li>
                <li>Sanciones administrativas impuestas por las autoridades competentes, independientemente del uso del Servicio.</li>
                <li>La inexactitud de los datos introducidos por el Usuario y sus consecuencias.</li>
                <li>Interrupciones del servicio causadas por terceros (proveedores de infraestructura, cortes de Internet, etc.).</li>
              </ul>
              <p className="mt-3">
                La responsabilidad total de MermaLegal frente al Usuario no superará, en ningún caso, el importe abonado por el Usuario en los 12 meses anteriores al hecho generador del daño.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">10. Protección de datos</h2>
              <p>
                El tratamiento de datos personales se rige por nuestra{' '}
                <Link href="/privacidad" className="text-primary-600 hover:underline">Política de Privacidad</Link>,
                que forma parte integrante de estos Términos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">11. Legislación aplicable y jurisdicción</h2>
              <p>
                Estos Términos se rigen por la legislación española. Para la resolución de conflictos derivados de su interpretación o aplicación, las partes se someten, con renuncia expresa a cualquier otro fuero, a los juzgados y tribunales de España.
              </p>
              <p className="mt-3">
                Si el Usuario tiene la condición de consumidor conforme al TRLGDCU, podrá acudir también a la plataforma de resolución de litigios en línea de la Comisión Europea:{' '}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">ec.europa.eu/consumers/odr</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">12. Contacto</h2>
              <p>
                Para cualquier consulta relacionada con estos Términos puede contactarnos en:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> soporte@mermalegal.com
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} MermaLegal ·{' '}
          <Link href="/privacidad" className="hover:text-primary-600">Privacidad</Link>
          {' · '}
          <Link href="/terminos" className="hover:text-primary-600">Términos</Link>
        </p>
      </footer>
    </div>
  );
}
