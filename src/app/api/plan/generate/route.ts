import { NextResponse } from 'next/server';
import {
  WASTE_CATEGORY_LABELS,
  LOCATION_TYPE_LABELS,
  type WasteCategory,
  type LocationType,
} from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const company = searchParams.get('company') ?? 'Empresa sin nombre';
  const responsibleName = searchParams.get('responsible_name') ?? '';
  const responsibleRole = searchParams.get('responsible_role') ?? '';
  const wasteTypesStr = searchParams.get('waste_types') ?? '';
  const measuresStr = searchParams.get('measures') ?? '';
  const locationType = (searchParams.get('location_type') ?? 'restaurant') as LocationType;

  const wasteTypes = wasteTypesStr.split(',').filter(Boolean) as WasteCategory[];
  const measures = measuresStr.split('|||').filter(Boolean);

  const today = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plan de Prevencion - ${company}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #059669;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 28px;
      color: #059669;
      margin-bottom: 8px;
    }
    .header .subtitle {
      font-size: 14px;
      color: #666;
    }
    .legal-ref {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #166534;
    }
    .section {
      margin-bottom: 28px;
    }
    .section h2 {
      font-size: 18px;
      color: #059669;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .section h3 {
      font-size: 15px;
      color: #374151;
      margin-bottom: 8px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 8px 16px;
      font-size: 14px;
    }
    .info-grid .label {
      font-weight: 600;
      color: #374151;
    }
    .info-grid .value {
      color: #4b5563;
    }
    ul { padding-left: 24px; }
    li { margin-bottom: 6px; font-size: 14px; }
    .badge {
      display: inline-block;
      background: #d1fae5;
      color: #065f46;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin: 2px 4px 2px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      font-size: 12px;
      color: #9ca3af;
      text-align: center;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 60px;
    }
    .signature-box {
      border-top: 1px solid #374151;
      padding-top: 8px;
      font-size: 13px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align:center;margin-bottom:20px;">
    <button onclick="window.print()" style="background:#059669;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:16px;cursor:pointer;font-weight:600;">
      Imprimir / Guardar PDF
    </button>
  </div>

  <div class="header">
    <h1>PLAN DE PREVENCION DE PERDIDAS Y DESPERDICIO ALIMENTARIO</h1>
    <p class="subtitle">Conforme a la Ley 1/2025, de 20 de febrero, de prevencion de las perdidas y el desperdicio alimentario</p>
  </div>

  <div class="legal-ref">
    <strong>Base legal:</strong> Este plan se elabora en cumplimiento del Articulo 5 de la Ley 1/2025, de 20 de febrero,
    de prevencion de las perdidas y el desperdicio alimentario (BOE num. 45, de 21 de febrero de 2025).
    Los agentes de la cadena alimentaria estan obligados a disponer de un plan de prevencion de perdidas
    y desperdicio alimentario que contemple las medidas que se comprometen a aplicar.
  </div>

  <div class="section">
    <h2>1. Datos de la empresa</h2>
    <div class="info-grid">
      <span class="label">Razon social:</span>
      <span class="value">${company}</span>
      <span class="label">Tipo de establecimiento:</span>
      <span class="value">${LOCATION_TYPE_LABELS[locationType] ?? locationType}</span>
      <span class="label">Fecha de elaboracion:</span>
      <span class="value">${today}</span>
      <span class="label">Responsable designado:</span>
      <span class="value">${responsibleName}${responsibleRole ? ` (${responsibleRole})` : ''}</span>
    </div>
  </div>

  <div class="section">
    <h2>2. Diagnostico de residuos alimentarios</h2>
    <p style="font-size:14px;color:#4b5563;margin-bottom:12px;">
      Conforme al Art. 5.1.a) de la Ley 1/2025, se identifican los siguientes tipos de residuos alimentarios generados en el establecimiento:
    </p>
    <div>
      ${wasteTypes.map((cat) => `<span class="badge">${WASTE_CATEGORY_LABELS[cat] ?? cat}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <h2>3. Medidas de prevencion</h2>
    <p style="font-size:14px;color:#4b5563;margin-bottom:12px;">
      En cumplimiento del Art. 5.1.b) de la Ley 1/2025, se establecen las siguientes medidas de prevencion,
      ordenadas segun la jerarquia de prioridades del Art. 4:
    </p>

    <h3>3.1 Medidas de reduccion en origen</h3>
    <ul>
      ${measures
        .filter((m) => m.includes('pedido') || m.includes('stock') || m.includes('FIFO') || m.includes('temperatura') || m.includes('Menu'))
        .map((m) => `<li>${m}</li>`)
        .join('') || '<li>No se han definido medidas especificas en esta categoria</li>'}
    </ul>

    <h3>3.2 Medidas de redistribucion y donacion</h3>
    <ul>
      ${measures
        .filter((m) => m.includes('Donacion') || m.includes('banco'))
        .map((m) => `<li>${m}</li>`)
        .join('') || '<li>No se han definido medidas especificas en esta categoria</li>'}
    </ul>

    <h3>3.3 Medidas de valorizacion</h3>
    <ul>
      ${measures
        .filter((m) => m.includes('Compost') || m.includes('subproducto') || m.includes('Aprovechamiento'))
        .map((m) => `<li>${m}</li>`)
        .join('') || '<li>No se han definido medidas especificas en esta categoria</li>'}
    </ul>

    <h3>3.4 Medidas de formacion y sensibilizacion</h3>
    <ul>
      ${measures
        .filter((m) => m.includes('Formacion') || m.includes('formacion'))
        .map((m) => `<li>${m}</li>`)
        .join('') || '<li>No se han definido medidas especificas en esta categoria</li>'}
    </ul>

    <h3>3.5 Otras medidas</h3>
    <ul>
      ${measures
        .filter((m) =>
          !m.includes('pedido') && !m.includes('stock') && !m.includes('FIFO') &&
          !m.includes('temperatura') && !m.includes('Menu') && !m.includes('Donacion') &&
          !m.includes('banco') && !m.includes('Compost') && !m.includes('subproducto') &&
          !m.includes('Aprovechamiento') && !m.includes('Formacion') && !m.includes('formacion')
        )
        .map((m) => `<li>${m}</li>`)
        .join('') || '<li>No se han definido medidas adicionales</li>'}
    </ul>
  </div>

  <div class="section">
    <h2>4. Sistema de registro y medicion</h2>
    <p style="font-size:14px;color:#4b5563;">
      Conforme al Art. 5.1.c) de la Ley 1/2025, el establecimiento utilizara la plataforma digital MermaLegal
      para el registro sistematico de las perdidas y desperdicio alimentario. El sistema permite:
    </p>
    <ul style="margin-top:8px;">
      <li>Registro diario de mermas por categoria y destino</li>
      <li>Cuantificacion en kilogramos de cada tipo de residuo</li>
      <li>Trazabilidad del destino (donacion, compost, pienso animal, destruccion)</li>
      <li>Generacion de informes periodicos para evaluacion</li>
      <li>Almacenamiento de datos conforme a los plazos legales establecidos</li>
    </ul>
  </div>

  <div class="section">
    <h2>5. Revision y actualizacion</h2>
    <p style="font-size:14px;color:#4b5563;">
      Este plan sera revisado anualmente conforme al Art. 5.3 de la Ley 1/2025, o antes si se producen
      cambios significativos en la actividad del establecimiento. La revision incluira el analisis de los
      datos registrados y la evaluacion de la eficacia de las medidas adoptadas.
    </p>
  </div>

  <div class="signatures">
    <div class="signature-box">
      <p><strong>Responsable designado</strong></p>
      <p>${responsibleName}</p>
      <p>${responsibleRole}</p>
    </div>
    <div class="signature-box">
      <p><strong>Representante legal</strong></p>
      <p>${company}</p>
      <p>Fecha: ${today}</p>
    </div>
  </div>

  <div class="footer">
    <p>Documento generado por MermaLegal - Plataforma de cumplimiento Ley 1/2025</p>
    <p>Este documento tiene caracter informativo. Consulte con un asesor legal para validar el cumplimiento normativo.</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
