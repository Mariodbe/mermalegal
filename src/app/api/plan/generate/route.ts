import { NextResponse } from 'next/server';
import {
  WASTE_CATEGORY_LABELS,
  LOCATION_TYPE_LABELS,
  type WasteCategory,
  type LocationType,
} from '@/lib/types';

// ─── Datos enriquecidos por medida ───────────────────────────────────────────

type MeasureCategory = 'reduccion' | 'redistribucion' | 'valorizacion' | 'formacion';

interface MeasureDetail {
  category: MeasureCategory;
  responsable: string;
  frecuencia: string;
  procedimiento: string[];
  indicador: string;
  objetivo: string;
}

const MEASURE_DETAILS: Record<string, MeasureDetail> = {
  'Ajuste de pedidos segun prevision de demanda': {
    category: 'reduccion',
    responsable: 'Jefe/a de cocina o encargado/a de compras',
    frecuencia: '2 veces por semana (lunes y jueves)',
    procedimiento: [
      'Revisar el registro de ventas de los últimos 14 días por categoría de producto',
      'Comparar ventas con stock disponible en cámaras y almacén',
      'Reducir en un 10–15% los pedidos de productos con baja rotación',
      'Documentar el ajuste y el motivo en el sistema MermaLegal',
    ],
    indicador: '% de producto caducado sobre total comprado',
    objetivo: '< 5% de producto caducado por semana',
  },
  'Rotacion FIFO (primero en entrar, primero en salir)': {
    category: 'reduccion',
    responsable: 'Personal de almacén y cocineros/as',
    frecuencia: 'En cada recepción de mercancía y revisión diaria',
    procedimiento: [
      'Colocar el género nuevo detrás del stock existente al recibir pedidos',
      'Etiquetar con fecha de entrada todo producto sin fecha visible de caducidad',
      'Verificar diariamente que el orden de consumo respeta las fechas de entrada',
      'Apartar y gestionar con prioridad los productos próximos a caducar (< 3 días)',
    ],
    indicador: 'Número de incidencias FIFO detectadas por semana',
    objetivo: '0 incidencias FIFO semanales',
  },
  'Uso de formatos mas pequenos en buffet': {
    category: 'reduccion',
    responsable: 'Jefe/a de sala o responsable de buffet',
    frecuencia: 'En cada servicio de buffet',
    procedimiento: [
      'Presentar los alimentos en bandejas o contenedores de menor capacidad',
      'Reponer con mayor frecuencia en lugar de servir grandes cantidades iniciales',
      'Registrar la cantidad inicial y final servida en cada servicio',
      'Ajustar las cantidades de cada producto según histórico de consumo por día y franja horaria',
    ],
    indicador: 'kg retirados sin consumir por servicio / kg totales servidos',
    objetivo: '< 15% de los alimentos servidos retirados sin consumir',
  },
  'Donacion de excedentes a bancos de alimentos': {
    category: 'redistribucion',
    responsable: 'Responsable designado / Gerencia',
    frecuencia: 'Según disponibilidad de excedentes (mínimo mensual si aplica)',
    procedimiento: [
      'Identificar excedentes aptos para donación con al menos 24 horas de antelación',
      'Contactar con el banco de alimentos u entidad colaboradora para coordinar la recogida',
      'Registrar la cantidad donada y la fecha en el sistema MermaLegal',
      'Conservar el albarán o justificante de donación como documentación de cumplimiento',
    ],
    indicador: 'kg donados / kg totales desperdiciados × 100',
    objetivo: '> 20% de excedentes redistribuidos mediante donación',
  },
  'Compostaje de residuos organicos': {
    category: 'valorizacion',
    responsable: 'Encargado/a de residuos o personal de limpieza',
    frecuencia: 'Diariamente',
    procedimiento: [
      'Separar los residuos orgánicos en el contenedor específico identificado para compostaje',
      'No mezclar con residuos no orgánicos (plásticos, papel, aceites, etc.)',
      'Coordinar la recogida con empresa autorizada o punto de compostaje municipal',
      'Registrar los kg de residuo orgánico gestionados mediante compostaje en MermaLegal',
    ],
    indicador: 'kg de residuo orgánico gestionados via compostaje / kg totales orgánicos',
    objetivo: '100% de residuos orgánicos no aptos para donación gestionados vía compostaje',
  },
  'Formacion del personal en reduccion de mermas': {
    category: 'formacion',
    responsable: 'Responsable designado / Dirección',
    frecuencia: 'Sesión formativa trimestral + briefing mensual de 10 minutos',
    procedimiento: [
      'Organizar sesión formativa trimestral sobre causas, costes e impacto del desperdicio alimentario',
      'Compartir los datos de merma del periodo anterior en el briefing mensual de equipo',
      'Incluir buenas prácticas anti-merma en el protocolo de incorporación de personal nuevo',
      'Documentar la asistencia y fecha de cada formación como registro de cumplimiento',
    ],
    indicador: '% del personal con formación verificada en el año en curso',
    objetivo: '100% del personal formado anualmente',
  },
  'Revision semanal de stock y caducidades': {
    category: 'reduccion',
    responsable: 'Jefe/a de cocina o responsable de almacén',
    frecuencia: 'Semanal (cada lunes antes del servicio)',
    procedimiento: [
      'Revisar todas las fechas de caducidad y consumo preferente en cámaras y almacén',
      'Identificar productos próximos a caducar (menos de 3 días) y priorizar su uso',
      'Registrar los productos caducados con peso y categoría en MermaLegal',
      'Proponer al equipo de cocina elaboraciones del día que utilicen los productos de mayor urgencia',
    ],
    indicador: 'kg de producto caducado por semana / total stock semanal × 100',
    objetivo: '< 3% de producto caducado sobre el stock semanal revisado',
  },
  'Aprovechamiento de subproductos en nuevas elaboraciones': {
    category: 'valorizacion',
    responsable: 'Jefe/a de cocina',
    frecuencia: 'En cada planificación de menú (mínimo 2 veces por semana)',
    procedimiento: [
      'Identificar recortes, fondos, huesos, pieles y subproductos aprovechables durante la mise en place',
      'Planificar elaboraciones que integren estos subproductos (caldos, salsas, guarniciones, platos del día)',
      'Registrar los kg de subproducto aprovechado frente a los generados',
      'Valorar el ahorro económico generado por reducción en coste de materia prima',
    ],
    indicador: 'kg de subproductos aprovechados / kg de subproductos generados × 100',
    objetivo: '> 60% de los subproductos generados aprovechados en nuevas elaboraciones',
  },
  'Control de temperatura en camaras frigorificas': {
    category: 'reduccion',
    responsable: 'Encargado/a de turno o personal de mantenimiento',
    frecuencia: '2 veces al día (apertura y cierre del establecimiento)',
    procedimiento: [
      'Registrar la temperatura de cada cámara al inicio y al final de la jornada',
      'Verificar que las temperaturas están en rango (0–4 °C refrigeración, ≤ −18 °C congelación)',
      'Ante cualquier desviación, reportar de inmediato y evaluar el estado de los alimentos afectados',
      'Revisar el estado de sellos y cierres de puertas mensualmente como mantenimiento preventivo',
    ],
    indicador: 'Número de desviaciones de temperatura no corregidas en < 2 horas',
    objetivo: '0 desviaciones sin corrección en menos de 2 horas',
  },
  'Menu adaptable segun existencias': {
    category: 'reduccion',
    responsable: 'Jefe/a de cocina',
    frecuencia: 'Diariamente (planificación de víspera o en el día)',
    procedimiento: [
      'Revisar el stock disponible y los productos con mayor urgencia de uso antes de planificar el menú',
      'Incluir como plato del día o especial del día los productos con fecha de caducidad más próxima',
      'Comunicar al personal de sala las sugerencias y la justificación para orientar las ventas',
      'Registrar el resultado en MermaLegal: % de plato del día elaborado con producto de urgencia',
    ],
    indicador: '% de platos del día elaborados con productos de rotación prioritaria',
    objetivo: '> 70% de los platos del día elaborados con producto prioritario',
  },
};

// ─── Diagnóstico por categoría de residuo ────────────────────────────────────

interface CategoryDiagnosis {
  causa: string;
  foco: string;
  accion: string;
}

const CATEGORY_DIAGNOSIS: Record<WasteCategory, CategoryDiagnosis> = {
  bakery: {
    causa: 'Sobreproducción o compra diaria superior a la demanda real',
    foco: 'Mayor generación en días laborables con baja afluencia',
    accion: 'Ajustar producción según histórico de ventas por día de la semana',
  },
  protein: {
    causa: 'Mermas en preparación (recortes, huesos) y sobrecocción',
    foco: 'Residuo concentrado en mise en place y ajuste de raciones',
    accion: 'Aprovechar subproductos en caldos y elaboraciones secundarias',
  },
  dairy: {
    causa: 'Caducidades por rotación deficiente y sobrecompra',
    foco: 'Productos con vida útil corta y alta variabilidad de uso',
    accion: 'Revisión FIFO estricta y ajuste de pedidos con mayor frecuencia',
  },
  produce: {
    causa: 'Sobrecompra y deterioro acelerado por temperatura o humedad',
    foco: 'Categoría con mayor volumen de desperdicio en hostelería',
    accion: 'Control de temperatura en cámaras y pedidos ajustados a demanda real',
  },
  prepared: {
    causa: 'Sobreproducción de elaboraciones y errores en previsión de servicio',
    foco: 'Mayor generación en servicios con baja ocupación no prevista',
    accion: 'Menú adaptable y registro de raciones sobrantes por servicio',
  },
  other: {
    causa: 'Residuos de origen diverso no clasificados en categorías principales',
    foco: 'Requiere análisis específico para identificar su origen',
    accion: 'Registrar con detalle para identificar patrón en los próximos 30 días',
  },
};

// ─── Etiquetas de categoría de medida ────────────────────────────────────────

const CATEGORY_LABELS: Record<MeasureCategory, string> = {
  reduccion: '3.1 Medidas de reducción en origen',
  redistribucion: '3.2 Medidas de redistribución y donación',
  valorizacion: '3.3 Medidas de valorización',
  formacion: '3.4 Formación y sensibilización',
};

const CATEGORY_ORDER: MeasureCategory[] = ['reduccion', 'redistribucion', 'valorizacion', 'formacion'];

// ─── Helpers de renderizado HTML ─────────────────────────────────────────────

function renderMeasureCard(measure: string, detail: MeasureDetail): string {
  const steps = detail.procedimiento
    .map((s, i) => `<div class="step"><span class="step-num">${i + 1}</span><span>${s}</span></div>`)
    .join('');

  return `
    <div class="measure-card">
      <div class="measure-title">${measure}</div>
      <div class="measure-meta">
        <div class="meta-item">
          <span class="meta-label">Responsable</span>
          <span class="meta-value">${detail.responsable}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Frecuencia</span>
          <span class="meta-value">${detail.frecuencia}</span>
        </div>
      </div>
      <div class="procedure-block">
        <div class="procedure-title">Procedimiento</div>
        ${steps}
      </div>
      <div class="kpi-block">
        <div class="kpi-item">
          <span class="kpi-label">Indicador de control</span>
          <span class="kpi-value">${detail.indicador}</span>
        </div>
        <div class="kpi-item">
          <span class="kpi-label">Objetivo</span>
          <span class="kpi-value kpi-target">${detail.objetivo}</span>
        </div>
      </div>
    </div>`;
}

function renderKpiRow(measure: string, detail: MeasureDetail): string {
  return `
    <tr>
      <td>${measure}</td>
      <td>${detail.indicador}</td>
      <td class="kpi-target-cell">${detail.objetivo}</td>
      <td>${detail.frecuencia.split(' ').slice(0, 3).join(' ')}</td>
      <td>${detail.responsable.split('/')[0].trim()}</td>
    </tr>`;
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const company = searchParams.get('company') ?? 'Empresa sin nombre';
  const responsibleName = searchParams.get('responsible_name') ?? '';
  const responsibleRole = searchParams.get('responsible_role') ?? '';
  const wasteTypesStr = searchParams.get('waste_types') ?? '';
  const measuresStr = searchParams.get('measures') ?? '';
  const locationType = (searchParams.get('location_type') ?? 'restaurant') as LocationType;

  const wasteTypes = wasteTypesStr.split(',').filter(Boolean) as WasteCategory[];
  const selectedMeasures = measuresStr.split('|||').filter(Boolean);

  const today = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Agrupar medidas por categoría
  const measuresWithDetails = selectedMeasures.map((m) => ({
    measure: m,
    detail: MEASURE_DETAILS[m] ?? null,
  }));

  const measuresGrouped = CATEGORY_ORDER.reduce<Record<MeasureCategory, typeof measuresWithDetails>>(
    (acc, cat) => {
      acc[cat] = measuresWithDetails.filter((m) => m.detail?.category === cat);
      return acc;
    },
    { reduccion: [], redistribucion: [], valorizacion: [], formacion: [] }
  );

  // Renderizar secciones de medidas
  const measuresSectionsHtml = CATEGORY_ORDER.map((cat) => {
    const items = measuresGrouped[cat];
    if (items.length === 0) return '';
    return `
      <h3 class="section-sub">${CATEGORY_LABELS[cat]}</h3>
      ${items.map(({ measure, detail }) => detail ? renderMeasureCard(measure, detail) : `<div class="measure-card"><div class="measure-title">${measure}</div></div>`).join('')}
    `;
  }).join('');

  // Renderizar diagnóstico por categorías
  const diagnosisHtml = wasteTypes.map((cat) => {
    const d = CATEGORY_DIAGNOSIS[cat];
    const label = WASTE_CATEGORY_LABELS[cat] ?? cat;
    if (!d) return `<div class="diag-item"><div class="diag-label">${label}</div></div>`;
    return `
      <div class="diag-item">
        <div class="diag-label">${label}</div>
        <div class="diag-grid">
          <span class="diag-key">Causa principal</span><span class="diag-val">${d.causa}</span>
          <span class="diag-key">Punto crítico</span><span class="diag-val">${d.foco}</span>
          <span class="diag-key">Acción prioritaria</span><span class="diag-val">${d.accion}</span>
        </div>
      </div>`;
  }).join('');

  // Renderizar tabla KPI
  const kpiRowsHtml = measuresWithDetails
    .filter((m) => m.detail !== null)
    .map(({ measure, detail }) => renderKpiRow(measure, detail!))
    .join('');

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
      max-width: 960px;
      margin: 0 auto;
      font-size: 14px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #059669;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .header h1 { font-size: 24px; color: #059669; margin-bottom: 8px; }
    .header .subtitle { font-size: 13px; color: #666; }
    .legal-ref {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 28px;
      font-size: 13px;
      color: #166534;
    }
    .section { margin-bottom: 32px; }
    .section h2 {
      font-size: 17px;
      color: #059669;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .section-sub {
      font-size: 14px;
      font-weight: 700;
      color: #374151;
      margin: 20px 0 10px 0;
      padding: 6px 10px;
      background: #f9fafb;
      border-left: 3px solid #059669;
      border-radius: 0 4px 4px 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 8px 16px;
    }
    .info-grid .label { font-weight: 600; color: #374151; }
    .info-grid .value { color: #4b5563; }

    /* Diagnóstico */
    .diag-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 10px;
    }
    .diag-label {
      font-weight: 700;
      font-size: 14px;
      color: #059669;
      margin-bottom: 8px;
    }
    .diag-grid {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 4px 12px;
      font-size: 13px;
    }
    .diag-key { font-weight: 600; color: #374151; padding: 2px 0; }
    .diag-val { color: #4b5563; padding: 2px 0; }

    /* Medida card */
    .measure-card {
      border: 1px solid #d1fae5;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 14px;
      background: #fafafa;
      page-break-inside: avoid;
    }
    .measure-title {
      font-weight: 700;
      font-size: 15px;
      color: #065f46;
      margin-bottom: 12px;
    }
    .measure-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    .meta-item { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; }
    .meta-label { display: block; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
    .meta-value { font-size: 13px; color: #1f2937; }

    /* Procedimiento */
    .procedure-block { margin-bottom: 12px; }
    .procedure-title { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .step { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 5px; font-size: 13px; color: #374151; }
    .step-num {
      flex-shrink: 0;
      width: 20px; height: 20px;
      background: #059669; color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700;
    }

    /* KPI dentro de la medida */
    .kpi-block { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .kpi-item { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 10px; }
    .kpi-label { display: block; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
    .kpi-value { font-size: 13px; color: #1f2937; }
    .kpi-target { font-weight: 700; color: #059669; }

    /* Tabla KPI cuadro de mando */
    .kpi-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .kpi-table th {
      background: #059669; color: white;
      padding: 9px 10px; text-align: left;
      font-size: 12px; font-weight: 600;
    }
    .kpi-table td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    .kpi-table tr:nth-child(even) td { background: #f9fafb; }
    .kpi-target-cell { font-weight: 700; color: #059669; }

    /* Sistema de registro */
    ul { padding-left: 22px; }
    li { margin-bottom: 5px; }

    /* Firmas */
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

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
    }

    @media print {
      body { padding: 20px; font-size: 12px; }
      .no-print { display: none; }
      .measure-card { page-break-inside: avoid; }
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
    <h1>PLAN DE PREVENCIÓN DE PÉRDIDAS Y DESPERDICIO ALIMENTARIO</h1>
    <p class="subtitle">Conforme a la Ley 1/2025, de 20 de febrero, de prevención de las pérdidas y el desperdicio alimentario</p>
  </div>

  <div class="legal-ref">
    <strong>Base legal:</strong> Este plan se elabora en cumplimiento del Artículo 5 de la Ley 1/2025, de 20 de febrero,
    de prevención de las pérdidas y el desperdicio alimentario (BOE núm. 45, de 21 de febrero de 2025).
    Los agentes de la cadena alimentaria están obligados a disponer de un plan de prevención que contemple
    las medidas que se comprometen a aplicar, con identificación de responsables y sistemas de seguimiento.
  </div>

  <!-- 1. Datos de la empresa -->
  <div class="section">
    <h2>1. Datos de la empresa</h2>
    <div class="info-grid">
      <span class="label">Razón social:</span>
      <span class="value">${company}</span>
      <span class="label">Tipo de establecimiento:</span>
      <span class="value">${LOCATION_TYPE_LABELS[locationType] ?? locationType}</span>
      <span class="label">Fecha de elaboración:</span>
      <span class="value">${today}</span>
      <span class="label">Responsable designado:</span>
      <span class="value">${responsibleName}${responsibleRole ? ` — ${responsibleRole}` : ''}</span>
    </div>
  </div>

  <!-- 2. Diagnóstico -->
  <div class="section">
    <h2>2. Diagnóstico de residuos alimentarios</h2>
    <p style="color:#4b5563;margin-bottom:14px;">
      Conforme al Art. 5.1.a) de la Ley 1/2025, se identifican los siguientes flujos de residuos alimentarios
      generados en el establecimiento, con sus causas principales y acciones prioritarias:
    </p>
    ${diagnosisHtml}
  </div>

  <!-- 3. Medidas de prevención -->
  <div class="section">
    <h2>3. Medidas de prevención</h2>
    <p style="color:#4b5563;margin-bottom:14px;">
      En cumplimiento del Art. 5.1.b) de la Ley 1/2025, se establecen las siguientes medidas de prevención
      ordenadas según la jerarquía de prioridades del Art. 4. Cada medida incluye el responsable de ejecución,
      la frecuencia de aplicación, el procedimiento detallado y el indicador de control con su objetivo.
    </p>
    ${measuresSectionsHtml}
  </div>

  <!-- 4. Cuadro de mando -->
  <div class="section">
    <h2>4. Cuadro de mando — Indicadores de control</h2>
    <p style="color:#4b5563;margin-bottom:14px;">
      Resumen de los indicadores clave de rendimiento (KPI) de las medidas adoptadas, para su seguimiento
      periódico y evaluación de la eficacia del plan:
    </p>
    <table class="kpi-table">
      <thead>
        <tr>
          <th>Medida</th>
          <th>Indicador</th>
          <th>Objetivo</th>
          <th>Frecuencia</th>
          <th>Responsable</th>
        </tr>
      </thead>
      <tbody>
        ${kpiRowsHtml}
      </tbody>
    </table>
  </div>

  <!-- 5. Sistema de registro -->
  <div class="section">
    <h2>5. Sistema de registro y medición</h2>
    <p style="color:#4b5563;">
      Conforme al Art. 5.1.c) de la Ley 1/2025, el establecimiento utiliza la plataforma digital MermaLegal
      para el registro sistemático de las pérdidas y desperdicio alimentario. El sistema permite:
    </p>
    <ul style="margin-top:10px;">
      <li>Registro diario de mermas por categoría y destino (donación, compost, pienso animal, destrucción)</li>
      <li>Cuantificación en kilogramos de cada tipo de residuo con trazabilidad completa</li>
      <li>Seguimiento de los indicadores de control definidos en el cuadro de mando</li>
      <li>Generación de informes periódicos para evaluación de la eficacia del plan</li>
      <li>Almacenamiento de datos conforme a los plazos de conservación establecidos por la ley</li>
    </ul>
  </div>

  <!-- 6. Revisión -->
  <div class="section">
    <h2>6. Revisión y actualización del plan</h2>
    <p style="color:#4b5563;">
      Este plan será revisado anualmente conforme al Art. 5.3 de la Ley 1/2025, o antes si se producen
      cambios significativos en la actividad del establecimiento. La revisión incluirá el análisis de los
      indicadores de control registrados, la evaluación de la eficacia de cada medida y la actualización
      de los objetivos en función de los resultados obtenidos.
    </p>
  </div>

  <div class="signatures">
    <div class="signature-box">
      <p><strong>Responsable designado</strong></p>
      <p style="margin-top:8px;">${responsibleName}</p>
      <p>${responsibleRole}</p>
      <p style="margin-top:4px;font-size:12px;color:#9ca3af;">Firma y fecha</p>
    </div>
    <div class="signature-box">
      <p><strong>Representante legal</strong></p>
      <p style="margin-top:8px;">${company}</p>
      <p style="margin-top:4px;font-size:12px;color:#9ca3af;">Fecha: ${today}</p>
    </div>
  </div>

  <div class="footer">
    <p>Documento generado por MermaLegal — Plataforma de cumplimiento Ley 1/2025</p>
    <p>Este documento tiene carácter informativo. Consulte con un asesor legal para validar el cumplimiento normativo específico de su actividad.</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
