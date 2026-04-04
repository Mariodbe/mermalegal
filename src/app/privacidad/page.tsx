import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad · MermaLegal',
  description: 'Política de privacidad y protección de datos de MermaLegal conforme al RGPD y la LOPDGDD.',
};

export default function PrivacidadPage() {
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Política de Privacidad</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">Última actualización: abril de 2025</p>

          <div className="prose prose-sm max-w-none text-[var(--text-secondary)] space-y-8">

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">1. Responsable del tratamiento</h2>
              <p>
                En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), le informamos de que el responsable del tratamiento de sus datos personales es:
              </p>
              <ul className="mt-3 space-y-1 list-none pl-0">
                <li><strong>Denominación:</strong> MermaLegal</li>
                <li><strong>Correo de contacto:</strong> privacidad@mermalegal.com</li>
                <li><strong>Actividad:</strong> Plataforma de gestión de mermas alimentarias y generación de documentación para el cumplimiento de la Ley 1/2025</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">2. Datos que recogemos</h2>
              <p>Recogemos los siguientes datos personales:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li><strong>Datos de cuenta:</strong> dirección de correo electrónico y contraseña cifrada, necesarios para autenticarle en el servicio.</li>
                <li><strong>Datos del establecimiento:</strong> nombre del local, dirección, tipo de establecimiento y número de empleados, que usted introduce voluntariamente para generar el Plan de Prevención.</li>
                <li><strong>Registros de merma:</strong> categoría del alimento, peso, destino y notas opcionales que usted registra durante el uso del servicio.</li>
                <li><strong>Datos de pago:</strong> procesados directamente por Stripe, Inc. MermaLegal no almacena en sus sistemas datos de tarjetas de crédito ni cuentas bancarias.</li>
                <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador y registros de acceso, recogidos automáticamente por razones de seguridad y diagnóstico.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">3. Finalidades y base jurídica del tratamiento</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)]">
                      <th className="text-left py-2 pr-4 font-semibold text-[var(--text-primary)]">Finalidad</th>
                      <th className="text-left py-2 font-semibold text-[var(--text-primary)]">Base jurídica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {[
                      ['Prestación del servicio (cuenta, registros, documentos)', 'Ejecución de contrato (Art. 6.1.b RGPD)'],
                      ['Gestión de suscripciones y facturación', 'Ejecución de contrato (Art. 6.1.b RGPD)'],
                      ['Comunicaciones de soporte y transaccionales', 'Ejecución de contrato (Art. 6.1.b RGPD)'],
                      ['Seguridad, prevención del fraude y registros técnicos', 'Interés legítimo (Art. 6.1.f RGPD)'],
                      ['Comunicaciones comerciales sobre mejoras del servicio', 'Consentimiento (Art. 6.1.a RGPD)'],
                      ['Cumplimiento de obligaciones legales', 'Obligación legal (Art. 6.1.c RGPD)'],
                    ].map(([fin, base]) => (
                      <tr key={fin}>
                        <td className="py-2 pr-4">{fin}</td>
                        <td className="py-2">{base}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">4. Conservación de los datos</h2>
              <p>
                Sus datos de cuenta y registros de merma se conservarán mientras mantenga una cuenta activa en MermaLegal.
                Tras la baja, los datos se eliminarán en un plazo máximo de <strong>30 días</strong>, salvo que exista obligación legal de conservarlos por un período mayor (por ejemplo, datos de facturación que deben conservarse durante 5 años conforme a la legislación tributaria española).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">5. Destinatarios y transferencias internacionales</h2>
              <p>Sus datos pueden ser compartidos con los siguientes proveedores de servicios, que actúan como encargados del tratamiento:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li><strong>Supabase, Inc.</strong> — infraestructura de base de datos y autenticación. Datos almacenados en servidores de la UE (Frankfurt).</li>
                <li><strong>Stripe, Inc.</strong> — procesamiento de pagos. Adherido al marco de privacidad UE-EE.UU. (Data Privacy Framework).</li>
                <li><strong>Vercel, Inc.</strong> — alojamiento de la aplicación. Transferencia cubierta por cláusulas contractuales estándar de la CE.</li>
              </ul>
              <p className="mt-3">
                MermaLegal no vende ni cede sus datos personales a terceros con fines publicitarios o comerciales.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">6. Sus derechos</h2>
              <p>
                En virtud de la normativa aplicable, usted tiene los siguientes derechos respecto de sus datos personales:
              </p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li><strong>Acceso:</strong> obtener confirmación sobre si tratamos sus datos y acceder a ellos.</li>
                <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
                <li><strong>Supresión ("derecho al olvido"):</strong> solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
                <li><strong>Limitación del tratamiento:</strong> solicitar que suspendamos el uso de sus datos en determinadas circunstancias.</li>
                <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado y legible por máquina.</li>
                <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo.</li>
                <li><strong>Retirada del consentimiento:</strong> en cualquier momento, sin que ello afecte a la licitud del tratamiento previo.</li>
              </ul>
              <p className="mt-3">
                Para ejercer sus derechos, envíe un correo a <strong>privacidad@mermalegal.com</strong> indicando el derecho que desea ejercitar y adjuntando copia de su documento de identidad.
                Responderemos en el plazo máximo de <strong>30 días</strong>.
              </p>
              <p className="mt-3">
                Si considera que el tratamiento de sus datos no es conforme a la normativa, puede presentar una reclamación ante la
                <strong> Agencia Española de Protección de Datos (AEPD)</strong> en{' '}
                <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">www.aepd.es</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">7. Seguridad</h2>
              <p>
                Aplicamos medidas técnicas y organizativas adecuadas para proteger sus datos personales frente al acceso no autorizado, la pérdida, la destrucción o la alteración. Entre otras medidas, utilizamos cifrado TLS en las comunicaciones, almacenamiento cifrado de contraseñas (bcrypt) y control de acceso basado en roles.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">8. Cookies</h2>
              <p>
                MermaLegal utiliza únicamente cookies técnicas estrictamente necesarias para el funcionamiento del servicio (gestión de sesión de usuario). No utilizamos cookies de rastreo, publicidad o análisis de terceros. No se requiere consentimiento para estas cookies conforme al Art. 22.2 de la LSSI.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">9. Menores de edad</h2>
              <p>
                El servicio no está dirigido a menores de 14 años. Si detectamos que hemos recogido datos de un menor sin el consentimiento de sus tutores legales, procederemos a eliminarlos de inmediato.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">10. Cambios en esta política</h2>
              <p>
                Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos los cambios sustanciales mediante correo electrónico o mediante un aviso destacado en la aplicación. La fecha de la última actualización aparece al inicio de este documento.
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
