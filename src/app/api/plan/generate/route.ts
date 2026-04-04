import { NextResponse } from 'next/server';
import {
  WASTE_CATEGORY_LABELS,
  LOCATION_TYPE_LABELS,
  type WasteCategory,
  type LocationType,
} from '@/lib/types';

// ─── Coste estimado por kg (precio de compra) ─────────────────────────────────

const COST_PER_KG: Record<string, number> = {
  produce: 3.0,
  bakery: 2.0,
  protein: 8.0,
  dairy: 4.0,
  prepared: 5.0,
  other: 3.0,
};

// ─── Causa principal por categoría ───────────────────────────────────────────

const CAT_CAUSE: Record<string, string> = {
  produce: 'Sobrecompra + deterioro por temperatura',
  bakery: 'Sobreproducción diaria',
  protein: 'Mermas en preparación y sobrecocción',
  dairy: 'Caducidades por rotación deficiente',
  prepared: 'Sobreproducción y baja ocupación no prevista',
  other: 'Variabilidad operativa diversa',
};

const CAT_LABEL_ES: Record<string, string> = {
  produce: 'Verdura',
  bakery: 'Panadería',
  protein: 'Proteína',
  dairy: 'Lácteos',
  prepared: 'Preparados',
  other: 'Otros',
};

// ─── Medidas enriquecidas ─────────────────────────────────────────────────────

type MeasureCategory = 'reduccion' | 'redistribucion' | 'valorizacion' | 'formacion';

interface MeasureDetail {
  category: MeasureCategory;
  responsable: string;
  frecuencia: string;
  buildProcedure: (topCat: string, topPct: number) => string[];
  indicador: string;
  buildObjetivo: (topCat: string, topPct: number) => string;
}

function reductionPct(pct: number) {
  return Math.min(15, Math.max(5, Math.round(pct * 0.35)));
}

const MEASURE_DETAILS: Record<string, MeasureDetail> = {
  'Ajuste de pedidos segun prevision de demanda': {
    category: 'reduccion',
    responsable: 'Jefe/a de cocina o encargado/a de compras',
    frecuencia: 'Lunes y jueves',
    buildProcedure: (topCat, topPct) => {
      const pct = reductionPct(topPct);
      const catName = CAT_LABEL_ES[topCat] ?? 'producto principal';
      return [
        `Revisar el registro de ventas de los últimos 14 días por categoría de producto`,
        `Comparar con el stock disponible en cámaras y almacén`,
        `Reducir los pedidos de ${catName.toLowerCase()} en un ${pct}% para los productos con baja rotación detectada`,
        `Documentar el ajuste y el motivo en el sistema MermaLegal`,
      ];
    },
    indicador: '% de producto caducado sobre total comprado',
    buildObjetivo: () => '< 5% de producto caducado por semana',
  },
  'Rotacion FIFO (primero en entrar, primero en salir)': {
    category: 'reduccion',
    responsable: 'Personal de almacén y cocineros/as',
    frecuencia: 'En cada recepción y revisión diaria',
    buildProcedure: () => [
      'Colocar el género nuevo detrás del stock existente al recibir pedidos',
      'Etiquetar con fecha de entrada todo producto sin fecha visible de caducidad',
      'Verificar diariamente que el orden de consumo respeta las fechas de entrada',
      'Apartar y gestionar con prioridad los productos próximos a caducar (< 3 días)',
    ],
    indicador: 'Incidencias FIFO detectadas por semana',
    buildObjetivo: () => '0 incidencias FIFO semanales',
  },
  'Uso de formatos mas pequenos en buffet': {
    category: 'reduccion',
    responsable: 'Jefe/a de sala o responsable de buffet',
    frecuencia: 'En cada servicio de buffet',
    buildProcedure: (topCat) => {
      const catName = CAT_LABEL_ES[topCat] ?? 'alimentos';
      return [
        `Presentar ${catName.toLowerCase()} y otros productos en bandejas de menor capacidad`,
        'Reponer con mayor frecuencia en lugar de servir grandes cantidades iniciales',
        'Registrar la cantidad inicial y final servida en cada servicio',
        'Ajustar cantidades según histórico de consumo por día y franja horaria',
      ];
    },
    indicador: 'kg retirados sin consumir / kg totales servidos × 100',
    buildObjetivo: () => '< 15% de los alimentos servidos retirados sin consumir',
  },
  'Donacion de excedentes a bancos de alimentos': {
    category: 'redistribucion',
    responsable: 'Responsable designado / Gerencia',
    frecuencia: 'Mínimo mensual (según disponibilidad)',
    buildProcedure: () => [
      'Identificar excedentes aptos para donación con al menos 24 horas de antelación',
      'Contactar con el banco de alimentos u entidad colaboradora para coordinar la recogida',
      'Registrar la cantidad donada y la fecha en el sistema MermaLegal',
      'Conservar el albarán de donación como documentación de cumplimiento',
    ],
    indicador: 'kg donados / kg totales desperdiciados × 100',
    buildObjetivo: () => '> 20% de excedentes redistribuidos mediante donación',
  },
  'Compostaje de residuos organicos': {
    category: 'valorizacion',
    responsable: 'Encargado/a de residuos o personal de limpieza',
    frecuencia: 'Diariamente',
    buildProcedure: () => [
      'Separar los residuos orgánicos en el contenedor específico identificado',
      'No mezclar con residuos no orgánicos (plásticos, papel, aceites)',
      'Coordinar la recogida con empresa autorizada o punto de compostaje municipal',
      'Registrar los kg de residuo orgánico gestionados en MermaLegal',
    ],
    indicador: '% residuos orgánicos gestionados vía compostaje',
    buildObjetivo: () => '100% de residuos orgánicos no aptos para donación valorizados',
  },
  'Formacion del personal en reduccion de mermas': {
    category: 'formacion',
    responsable: 'Responsable designado / Dirección',
    frecuencia: 'Sesión trimestral + briefing mensual (10 min)',
    buildProcedure: (topCat) => {
      const catName = CAT_LABEL_ES[topCat] ?? 'categorías principales';
      return [
        `Organizar sesión formativa trimestral con foco en ${catName.toLowerCase()}, la categoría crítica`,
        'Compartir datos de merma del periodo anterior en el briefing mensual de equipo',
        'Incluir buenas prácticas anti-merma en el protocolo de incorporación de nuevo personal',
        'Documentar asistencia y fecha de cada formación como registro de cumplimiento',
      ];
    },
    indicador: '% del personal con formación verificada en el año en curso',
    buildObjetivo: () => '100% del personal formado anualmente',
  },
  'Revision semanal de stock y caducidades': {
    category: 'reduccion',
    responsable: 'Jefe/a de cocina o responsable de almacén',
    frecuencia: 'Semanal (cada lunes antes del servicio)',
    buildProcedure: (topCat) => {
      const catName = CAT_LABEL_ES[topCat] ?? 'producto';
      return [
        `Revisar todas las fechas de caducidad y consumo preferente, priorizando ${catName.toLowerCase()}`,
        'Identificar productos próximos a caducar (menos de 3 días) y priorizar su uso',
        'Registrar los productos caducados con peso y categoría en MermaLegal',
        'Proponer elaboraciones del día que utilicen los productos de mayor urgencia',
      ];
    },
    indicador: 'kg de producto caducado por semana / total stock × 100',
    buildObjetivo: () => '< 3% de producto caducado sobre el stock semanal',
  },
  'Aprovechamiento de subproductos en nuevas elaboraciones': {
    category: 'valorizacion',
    responsable: 'Jefe/a de cocina',
    frecuencia: 'En cada planificación de menú (mín. 2 veces/semana)',
    buildProcedure: (topCat) => {
      const catName = CAT_LABEL_ES[topCat] ?? 'subproductos';
      return [
        `Identificar recortes, fondos y residuos aprovechables de ${catName.toLowerCase()} durante la mise en place`,
        'Planificar elaboraciones que integren estos subproductos (caldos, salsas, guarniciones)',
        'Registrar los kg de subproducto aprovechado frente a los generados',
        'Valorar el ahorro económico generado por reducción en coste de materia prima',
      ];
    },
    indicador: 'kg subproductos aprovechados / kg subproductos generados × 100',
    buildObjetivo: () => '> 60% de los subproductos aprovechados en nuevas elaboraciones',
  },
  'Control de temperatura en camaras frigorificas': {
    category: 'reduccion',
    responsable: 'Encargado/a de turno o personal de mantenimiento',
    frecuencia: '2 veces al día (apertura y cierre)',
    buildProcedure: (topCat) => {
      const catName = CAT_LABEL_ES[topCat] ?? 'producto';
      return [
        `Registrar temperatura de cada cámara al inicio y final de la jornada (clave para ${catName.toLowerCase()})`,
        'Verificar rangos: 0–4 °C en refrigeración, ≤ −18 °C en congelación',
        'Ante desviación, reportar de inmediato y evaluar el estado de los alimentos afectados',
        'Revisar sellos y cierres de puertas mensualmente como mantenimiento preventivo',
      ];
    },
    indicador: 'Desviaciones de temperatura no corregidas en < 2 horas',
    buildObjetivo: () => '0 desviaciones sin corrección en menos de 2 horas',
  },
  'Menu adaptable segun existencias': {
    category: 'reduccion',
    responsable: 'Jefe/a de cocina',
    frecuencia: 'Diariamente (planificación de víspera o en el día)',
    buildProcedure: (topCat, topPct) => {
      const pct = Math.min(80, Math.max(50, Math.round(topPct * 2)));
      const catName = CAT_LABEL_ES[topCat] ?? 'producto prioritario';
      return [
        `Revisar stock de ${catName.toLowerCase()} y otros productos con mayor urgencia de uso antes de planificar el menú`,
        'Incluir como plato del día o especial los productos con fecha de caducidad más próxima',
        'Comunicar al personal de sala las sugerencias para orientar las ventas',
        `Objetivo: que el ${pct}% de los platos del día incorporen producto de rotación prioritaria`,
      ];
    },
    indicador: '% de platos del día elaborados con productos de rotación prioritaria',
    buildObjetivo: (_: string, topPct: number) => {
      const t = Math.min(80, Math.max(50, Math.round(topPct * 2)));
      return `> ${t}% de platos del día con producto prioritario`;
    },
  },
  'Ajuste de produccion segun demanda real': {
    category: 'reduccion',
    responsable: 'Jefe/a de cocina',
    frecuencia: 'Diaria',
    buildProcedure: () => [
      'Revisar reservas y previsión de ocupación del día antes de la mise en place',
      'Ajustar las cantidades de producción en función de la demanda esperada',
      'Reducir producción en días de baja ocupación o servicios cancelados',
      'Registrar desviaciones entre producción prevista y consumo real en MermaLegal',
    ],
    indicador: 'kg producido no consumido / kg total producido × 100',
    buildObjetivo: () => '< 10% de producción no consumida',
  },
};

// ─── Nombres con tilde para mostrar en el documento ──────────────────────────

const MEASURE_DISPLAY: Record<string, string> = {
  'Ajuste de pedidos segun prevision de demanda':    'Ajuste de pedidos según previsión de demanda',
  'Rotacion FIFO (primero en entrar, primero en salir)': 'Rotación FIFO (primero en entrar, primero en salir)',
  'Uso de formatos mas pequenos en buffet':          'Uso de formatos más pequeños en buffet',
  'Donacion de excedentes a bancos de alimentos':    'Donación de excedentes a bancos de alimentos',
  'Compostaje de residuos organicos':                'Compostaje de residuos orgánicos',
  'Formacion del personal en reduccion de mermas':   'Formación del personal en reducción de mermas',
  'Revision semanal de stock y caducidades':         'Revisión semanal de stock y caducidades',
  'Aprovechamiento de subproductos en nuevas elaboraciones': 'Aprovechamiento de subproductos en nuevas elaboraciones',
  'Control de temperatura en camaras frigorificas':  'Control de temperatura en cámaras frigoríficas',
  'Menu adaptable segun existencias':                'Menú adaptable según existencias',
  'Ajuste de produccion segun demanda real':         'Ajuste de producción según demanda real',
};

const CATEGORY_ORDER: MeasureCategory[] = ['reduccion', 'redistribucion', 'valorizacion', 'formacion'];

const PRIORITY_COLORS: Record<string, string> = {
  ALTA: '#dc2626',
  MEDIA: '#d97706',
  BAJA: '#16a34a',
};

// ─── Benchmarks sectoriales (coste anual de desperdicio típico) ───────────────

const SECTOR_ANNUAL_WASTE_COST: Record<string, [number, number]> = {
  restaurant: [1200, 4000],
  hotel:      [4000, 12000],
  catering:   [2000, 7000],
  bar:        [400,  1200],
};

// ─── Helpers de formato ───────────────────────────────────────────────────────

/** Evita rangos tipo "1–1" o "52–52": usa ≈X cuando los extremos son iguales o casi iguales */
function fmtRange(low: number, high: number, suffix = ''): string {
  if (low === high || Math.abs(high - low) <= 1) return `≈${Math.round((low + high) / 2)}${suffix}`;
  return `${low}–${high}${suffix}`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const company = searchParams.get('company') ?? 'Empresa sin nombre';
  const responsibleName = searchParams.get('responsible_name') ?? '';
  const responsibleRole = searchParams.get('responsible_role') ?? '';
  const wasteTypesStr = searchParams.get('waste_types') ?? '';

  // ── Nuevos parámetros del wizard ──────────────────────────────────────────
  const serviceType   = searchParams.get('service_type') ?? '';
  const clientesDay   = parseInt(searchParams.get('clientes_day') ?? '0');
  const ticketMedio   = parseFloat(searchParams.get('ticket_medio') ?? '0');
  const wasteCauses   = (searchParams.get('waste_causes') ?? '').split(',').filter(Boolean);
  const controlStock  = searchParams.get('control_stock')  !== 'no';
  const ajustePedidos = searchParams.get('ajuste_pedidos') !== 'no';
  const registroActual = searchParams.get('registro_actual') !== 'no';
  const measuresStr = searchParams.get('measures') ?? '';
  const locationType = (searchParams.get('location_type') ?? 'restaurant') as LocationType;
  const entriesDataStr = searchParams.get('entries_data') ?? '';
  const daysTracked = Math.max(7, parseInt(searchParams.get('days_tracked') ?? '0'));

  const wasteTypes = wasteTypesStr.split(',').filter(Boolean) as WasteCategory[];
  const selectedMeasures = measuresStr.split('|||').filter(Boolean);

  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  // ── Parse waste data ────────────────────────────────────────────────────────

  const catKg: Record<string, number> = {};
  if (entriesDataStr) {
    for (const part of entriesDataStr.split(',')) {
      const [cat, kg] = part.split(':');
      if (cat && kg) catKg[cat] = parseFloat(kg);
    }
  }
  const hasRealData = Object.keys(catKg).length > 0;

  // Total and weekly
  const totalKg = Object.values(catKg).reduce((a, b) => a + b, 0);
  const weeksTracked = daysTracked / 7;
  const weeklyKgReal = hasRealData ? totalKg / weeksTracked : 0;

  // Estimated weekly if no data (based on selected categories × typical restaurant per-cat)
  const defaultWeeklyPerCat: Record<string, number> = {
    produce: 18, bakery: 10, protein: 6, dairy: 5, prepared: 8, other: 4,
  };
  const estimatedWeekly = hasRealData
    ? weeklyKgReal
    : wasteTypes.reduce((s, c) => s + (defaultWeeklyPerCat[c] ?? 5), 0);

  const weeklyLow = Math.round(estimatedWeekly * 0.9);
  const weeklyHigh = Math.round(estimatedWeekly * 1.1);

  // Weekly cost
  const weeklyCost = hasRealData
    ? Object.entries(catKg).reduce((s, [cat, kg]) => s + (kg / weeksTracked) * (COST_PER_KG[cat] ?? 3), 0)
    : wasteTypes.reduce((s, c) => s + (defaultWeeklyPerCat[c] ?? 5) * (COST_PER_KG[c] ?? 3), 0);
  const costLow = Math.round(weeklyCost * 0.85);
  const costHigh = Math.round(weeklyCost * 1.15);

  // Category percentages (sorted desc)
  let catEntries: { cat: string; kg: number; pct: number }[];
  if (hasRealData) {
    catEntries = Object.entries(catKg)
      .map(([cat, kg]) => ({ cat, kg, pct: Math.round((kg / totalKg) * 100) }))
      .sort((a, b) => b.pct - a.pct);
  } else {
    // Build estimated distribution from selected waste types
    const totalEst = wasteTypes.reduce((s, c) => s + (defaultWeeklyPerCat[c] ?? 5), 0);
    catEntries = wasteTypes
      .map((c) => ({ cat: c, kg: defaultWeeklyPerCat[c] ?? 5, pct: Math.round(((defaultWeeklyPerCat[c] ?? 5) / totalEst) * 100) }))
      .sort((a, b) => b.pct - a.pct);
  }

  const topCat = catEntries[0]?.cat ?? wasteTypes[0] ?? 'produce';
  const topPct = catEntries[0]?.pct ?? 30;

  // ── Cálculo basado en facturación (más preciso que estimación por kg) ───────
  const WASTE_RATE: Record<string, number> = {
    restaurant: 0.065,
    hotel:      0.09,
    catering:   0.07,
    bar:        0.05,
  };
  const wasteRate = WASTE_RATE[locationType] ?? 0.065;
  const useRevenueBased = clientesDay > 0 && ticketMedio > 0;
  const annualRevenue = useRevenueBased ? clientesDay * ticketMedio * 365 : 0;
  const revenueAnnualWasteCost = useRevenueBased ? Math.round(annualRevenue * wasteRate) : 0;

  // ── Detección de muestra insuficiente ─────────────────────────────────────
  const isPreliminary = daysTracked < 30;
  // Si el coste semanal calculado es < 30 € los números son ridículos → benchmark
  const useBenchmark = !useRevenueBased && hasRealData && weeklyCost < 30;

  // Savings — prioridad: 1) datos reales de facturación, 2) datos de registro, 3) benchmark
  const [benchAnnualLow, benchAnnualHigh] = SECTOR_ANNUAL_WASTE_COST[locationType] ?? [1200, 4000];

  let finalAnnualWasteLow: number;
  let finalAnnualWasteHigh: number;
  let annualWasteSource: string;

  if (useRevenueBased) {
    finalAnnualWasteLow  = Math.round(revenueAnnualWasteCost * 0.85);
    finalAnnualWasteHigh = Math.round(revenueAnnualWasteCost * 1.15);
    annualWasteSource = `Estimado sobre facturación (${clientesDay} clientes/día × ${ticketMedio}€ ticket)`;
  } else if (useBenchmark) {
    finalAnnualWasteLow  = benchAnnualLow;
    finalAnnualWasteHigh = benchAnnualHigh;
    annualWasteSource = `Benchmark sector (${LOCATION_TYPE_LABELS[locationType]})`;
  } else {
    finalAnnualWasteLow  = Math.round(weeklyCost * 52 * 0.85);
    finalAnnualWasteHigh = Math.round(weeklyCost * 52 * 1.15);
    annualWasteSource = 'Basado en datos de registro MermaLegal';
  }

  // Proyecciones para mostrar escala temporal
  const weeklyKgAvg  = Math.round((weeklyLow + weeklyHigh) / 2);
  const monthlyKgEst = weeklyKgAvg * 4;
  const annualKgEst  = weeklyKgAvg * 52;

  const annualLow  = Math.round(finalAnnualWasteLow  * 0.20);
  const annualHigh = Math.round(finalAnnualWasteHigh * 0.30);
  const savingsLow  = Math.round(annualLow  / 52);
  const savingsHigh = Math.round(annualHigh / 52);

  // Priority assignment
  function getPriority(pct: number): { label: string; color: string } {
    if (pct >= 25) return { label: 'ALTA', color: PRIORITY_COLORS.ALTA };
    if (pct >= 12) return { label: 'MEDIA', color: PRIORITY_COLORS.MEDIA };
    return { label: 'BAJA', color: PRIORITY_COLORS.BAJA };
  }

  function getImpactBadge(pct: number): string {
    if (pct >= 30) return '🔴 Alto';
    if (pct >= 15) return '🟠 Medio';
    if (pct >= 10) return '🟡 Medio-bajo';
    return '🟢 Bajo';
  }

  // ── Quick wins: primeras acciones (semana 1) ─────────────────────────────────

  const topCatName = CAT_LABEL_ES[topCat] ?? topCat;
  const reductionPctQW = reductionPct(topPct);

  const QUICK_WINS: { badge: string; badgeColor: string; title: string; actions: string[]; impact: string }[] = [];

  if (!controlStock) {
    QUICK_WINS.push({
      badge: 'Hoy',
      badgeColor: '#dc2626',
      title: 'Revisión de stock y caducidades',
      actions: [
        `Revisar cámaras y almacén → apartar géneros con < 3 días`,
        'Registrar todo lo que encuentres en MermaLegal',
      ],
      impact: 'Impacto inmediato: evitar caducidades esta semana',
    });
  }

  if (!ajustePedidos) {
    QUICK_WINS.push({
      badge: 'Día 1',
      badgeColor: '#d97706',
      title: `Reducir pedido de ${topCatName.toLowerCase()} ${reductionPctQW}%`,
      actions: [
        `Revisar ventas de los últimos 7 días en ${topCatName.toLowerCase()}`,
        `Reducir próximo pedido en ${reductionPctQW}% respecto al habitual`,
      ],
      impact: `Ahorro directo en compras desde la primera semana`,
    });
  }

  QUICK_WINS.push({
    badge: 'Semana 1',
    badgeColor: '#059669',
    title: 'FIFO en cámaras',
    actions: [
      'Mover stock antiguo al frente en todas las cámaras',
      'Etiquetar con fecha de entrada todo producto sin fecha visible',
    ],
    impact: '−10 a −15% de caducidades en 2 semanas',
  });

  if (wasteTypes.includes('protein') || wasteTypes.includes('produce')) {
    QUICK_WINS.push({
      badge: 'Semana 1',
      badgeColor: '#6366f1',
      title: 'Control de temperatura',
      actions: [
        'Verificar temperaturas 2 veces/día (apertura y cierre)',
        'Anotar desviaciones y actuar en < 2 horas',
      ],
      impact: 'Reducir mermas por deterioro prematuro',
    });
  }

  if (!registroActual) {
    QUICK_WINS.push({
      badge: 'Esta semana',
      badgeColor: '#0891b2',
      title: 'Iniciar registro en MermaLegal',
      actions: [
        'Registrar desperdicio al final de cada servicio (< 2 min)',
        'En 7 días tendrás tu primer diagnóstico real',
      ],
      impact: 'Sin registro no hay cumplimiento legal demostrable',
    });
  }

  const quickWinsHtml = QUICK_WINS.slice(0, 4).map((qw) => `
    <div class="qw-card">
      <div class="qw-badge" style="background:${qw.badgeColor}20;color:${qw.badgeColor};">${qw.badge}</div>
      <div class="qw-title">${qw.title}</div>
      ${qw.actions.map((a) => `<div class="qw-action">• ${a}</div>`).join('')}
      <div class="qw-impact">→ ${qw.impact}</div>
    </div>`).join('');

  // ── Detect under-registration ──────────────────────────────────────────────

  const isUnderRegistered =
    hasRealData &&
    (useRevenueBased || useBenchmark) &&
    weeklyCost < (finalAnnualWasteLow / 52) * 0.3;

  // ── Build measure cards ─────────────────────────────────────────────────────

  const measuresWithDetail = selectedMeasures.map((m) => ({
    measure: m,
    detail: MEASURE_DETAILS[m] ?? null,
  }));

  // Group by category
  const grouped = CATEGORY_ORDER.reduce<Record<MeasureCategory, typeof measuresWithDetail>>(
    (acc, cat) => {
      acc[cat] = measuresWithDetail.filter((x) => x.detail?.category === cat);
      return acc;
    },
    { reduccion: [], redistribucion: [], valorizacion: [], formacion: [] }
  );

  // Priorities section: list measures with their priority based on topCat alignment
  const measurePriorities = measuresWithDetail.map(({ measure, detail }) => {
    if (!detail) return { measure, priority: { label: 'BAJA', color: PRIORITY_COLORS.BAJA } };
    const relevantCatPct = detail.category === 'reduccion' ? topPct : (catEntries[1]?.pct ?? 10);
    return { measure, priority: getPriority(detail.category === 'formacion' ? 5 : relevantCatPct) };
  });

  const highPrio = measurePriorities.filter((x) => x.priority.label === 'ALTA');
  const medPrio  = measurePriorities.filter((x) => x.priority.label === 'MEDIA');
  const lowPrio  = measurePriorities.filter((x) => x.priority.label === 'BAJA');

  // Measure counter for numbering
  let measureIdx = 0;
  function nextMeasureLabel() {
    measureIdx++;
    return `4.${measureIdx}`;
  }

  function renderMeasureCard(measure: string, detail: MeasureDetail): string {
    const label = nextMeasureLabel();
    const displayName = MEASURE_DISPLAY[measure] ?? measure;
    const procedure = detail.buildProcedure(topCat, topPct);
    const objetivo = detail.buildObjetivo(topCat, topPct);
    const steps = procedure.map((s, i) => `
      <div class="step"><span class="step-num">${i + 1}</span><span>${s}</span></div>`).join('');
    return `
    <div class="measure-card">
      <div class="measure-title">${label} ${displayName}</div>
      <div class="measure-meta">
        <div class="meta-item"><span class="meta-label">Responsable</span><span class="meta-val">${detail.responsable}</span></div>
        <div class="meta-item"><span class="meta-label">Frecuencia</span><span class="meta-val">${detail.frecuencia}</span></div>
      </div>
      <div class="proc-title">Procedimiento</div>
      <div class="steps">${steps}</div>
      <div class="kpi-row">
        <div class="kpi-box"><span class="kpi-lbl">KPI</span><span class="kpi-val">${detail.indicador}</span></div>
        <div class="kpi-box kpi-green"><span class="kpi-lbl">Objetivo</span><span class="kpi-val">${objetivo}</span></div>
      </div>
    </div>`;
  }

  const catSectionLabels: Record<MeasureCategory, string> = {
    reduccion: 'Reducción en origen',
    redistribucion: 'Redistribución y donación',
    valorizacion: 'Valorización',
    formacion: 'Formación y sensibilización',
  };

  const measuresSectionsHtml = CATEGORY_ORDER.flatMap((cat) => {
    const items = grouped[cat];
    if (!items.length) return [];
    return [`<div class="cat-label">${catSectionLabels[cat]}</div>`,
      ...items.map(({ measure, detail }) => detail
        ? renderMeasureCard(measure, detail)
        : `<div class="measure-card"><div class="measure-title">${nextMeasureLabel()} ${MEASURE_DISPLAY[measure] ?? measure}</div></div>`)
    ];
  }).join('');

  // ── Diagnosis table rows ────────────────────────────────────────────────────

  const diagRows = catEntries.map(({ cat, pct }) => `
    <tr>
      <td class="td-cat">${CAT_LABEL_ES[cat] ?? WASTE_CATEGORY_LABELS[cat as WasteCategory] ?? cat}</td>
      <td class="td-pct"><strong>${pct}%</strong></td>
      <td>${CAT_CAUSE[cat] ?? '–'}</td>
      <td>${getImpactBadge(pct)}</td>
    </tr>`).join('');

  // ── KPI table rows ──────────────────────────────────────────────────────────

  const kpiRows = [
    ['% producto caducado', '< 5%', 'Semanal', 'Cocina'],
    ['Kg desperdicio total semanal', '−20% en 4 sem · −30% en 8 sem', 'Semanal', 'Gerente'],
    ['% desperdicio sobre compras', '< 8%', 'Mensual', 'Dirección'],
    ['% valorización residuos orgánicos', '100%', 'Diario', 'Limpieza'],
  ].map(([ind, obj, freq, resp]) => `
    <tr>
      <td>${ind}</td><td class="kpi-target">${obj}</td><td>${freq}</td><td>${resp}</td>
    </tr>`).join('');

  // ── Critical points ─────────────────────────────────────────────────────────

  const criticalPoints: string[] = [];
  if (catEntries[0]) criticalPoints.push(`Alta generación de desperdicio en ${CAT_LABEL_ES[catEntries[0].cat] ?? catEntries[0].cat} (${catEntries[0].pct}% del total)`);
  if (catEntries[1]) criticalPoints.push(`Contribución significativa de ${CAT_LABEL_ES[catEntries[1].cat] ?? catEntries[1].cat} (${catEntries[1].pct}%)`);
  if (!controlStock)   criticalPoints.push('Sin revisión sistemática de stock ni caducidades');
  if (!ajustePedidos)  criticalPoints.push('Pedidos no ajustados según previsión de demanda real → riesgo de sobrecompra');
  if (!registroActual) criticalPoints.push('Ausencia de registro activo de desperdicio → sin trazabilidad ni evidencia de cumplimiento');
  if (wasteCauses.includes('sobrecompra'))  criticalPoints.push('Sobrecompra identificada por el equipo como causa principal');
  if (wasteCauses.includes('prevision'))    criticalPoints.push('Mala previsión de demanda → producción desajustada respecto a ventas reales');
  if (serviceType === 'buffet') criticalPoints.push('Formato buffet: alto riesgo estructural de sobreproducción y desperdicios en línea');
  if (!hasRealData && registroActual) criticalPoints.push('Medición sistemática iniciada — continuar registrando para afinar el diagnóstico');

  // ── HTML ────────────────────────────────────────────────────────────────────

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plan de Prevención - ${company}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; line-height: 1.6; padding: 36px; max-width: 960px; margin: 0 auto; font-size: 13.5px; }

    /* Header */
    .doc-header { border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 28px; }
    .doc-header h1 { font-size: 22px; color: #059669; margin-bottom: 6px; }
    .doc-header .meta { font-size: 13px; color: #555; }
    .legal-ref { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 28px; font-size: 12.5px; color: #166534; }

    /* Sections */
    .section { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: 700; color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 14px; }
    .subsection-title { font-size: 13px; font-weight: 700; color: #374151; margin: 14px 0 8px 0; }

    /* Executive summary box */
    .exec-box { background: #f0fdf4; border: 2px solid #059669; border-radius: 10px; padding: 18px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .exec-item { }
    .exec-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    .exec-value { font-size: 15px; font-weight: 700; color: #059669; }
    .exec-objective { grid-column: 1 / -1; background: #065f46; color: #d1fae5; border-radius: 6px; padding: 10px 14px; margin-top: 6px; font-size: 13px; }
    .exec-objective strong { color: white; }
    .data-note { font-size: 11px; color: #9ca3af; margin-top: 8px; grid-column: 1 / -1; }

    /* Diagnosis table */
    .diag-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 14px; }
    .diag-table th { background: #059669; color: white; padding: 8px 10px; text-align: left; font-size: 12px; }
    .diag-table td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
    .diag-table tr:nth-child(even) td { background: #f9fafb; }
    .td-cat { font-weight: 700; color: #065f46; }
    .td-pct { font-size: 15px; }

    /* Priority boxes */
    .priority-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 6px; }
    .priority-box { border-radius: 8px; padding: 12px; }
    .priority-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .priority-item { font-size: 12px; color: #374151; padding: 2px 0; }

    /* Critical points */
    .critical-list { list-style: none; padding: 0; }
    .critical-list li { padding: 4px 0 4px 18px; position: relative; font-size: 13px; color: #374151; }
    .critical-list li::before { content: '⚠'; position: absolute; left: 0; font-size: 11px; }

    /* Measure cards */
    .cat-label { font-size: 12px; font-weight: 700; color: #059669; background: #f0fdf4; border-left: 3px solid #059669; padding: 5px 10px; margin: 16px 0 8px 0; border-radius: 0 4px 4px 0; text-transform: uppercase; letter-spacing: 0.04em; }
    .measure-card { border: 1px solid #d1fae5; border-radius: 10px; padding: 15px; margin-bottom: 12px; background: #fafafa; page-break-inside: avoid; }
    .measure-title { font-weight: 700; font-size: 14px; color: #065f46; margin-bottom: 10px; }
    .measure-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
    .meta-item { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 7px 10px; }
    .meta-label { display: block; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; }
    .meta-val { font-size: 12.5px; color: #1f2937; }
    .proc-title { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 5px; }
    .steps { margin-bottom: 10px; }
    .step { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 4px; font-size: 12.5px; color: #374151; }
    .step-num { flex-shrink: 0; width: 18px; height: 18px; background: #059669; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
    .kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .kpi-box { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 7px 10px; }
    .kpi-green { background: #f0fdf4; border-color: #bbf7d0; }
    .kpi-lbl { display: block; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px; }
    .kpi-val { font-size: 12px; color: #1f2937; font-weight: 600; }

    /* KPI dashboard table */
    .kpi-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .kpi-table th { background: #059669; color: white; padding: 8px 10px; text-align: left; font-size: 12px; }
    .kpi-table td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
    .kpi-table tr:nth-child(even) td { background: #f9fafb; }
    .kpi-target { font-weight: 700; color: #059669; }

    /* Economic impact */
    .econ-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .econ-card { border-radius: 8px; padding: 14px; text-align: center; }
    .econ-label { font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
    .econ-value { font-size: 22px; font-weight: 800; }
    .econ-sub { font-size: 11px; color: #6b7280; margin-top: 2px; }

    /* Split exec box (datos reales vs estimación) */
    .exec-split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .exec-split-block { border-radius: 8px; padding: 14px; }
    .exec-split-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
    .exec-split-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; font-size: 12.5px; }
    .exec-split-key { color: #6b7280; }
    .exec-split-val { font-weight: 700; }

    /* Quick wins */
    .qw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
    .qw-card { border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb; background: #fafafa; }
    .qw-badge { display: inline-block; font-size: 10px; font-weight: 700; border-radius: 20px; padding: 1px 8px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
    .qw-title { font-size: 12.5px; font-weight: 700; color: #065f46; margin-bottom: 4px; }
    .qw-action { font-size: 12px; color: #374151; padding: 2px 0; }
    .qw-impact { font-size: 11px; color: #059669; font-weight: 600; margin-top: 6px; }

    /* Signatures */
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; }
    .sig-box { border-top: 1px solid #374151; padding-top: 8px; font-size: 12.5px; }

    /* Footer */
    .footer { margin-top: 36px; padding-top: 16px; border-top: 2px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }

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

  <!-- HEADER -->
  <div class="doc-header">
    <h1>PLAN DE PREVENCIÓN DE PÉRDIDAS Y DESPERDICIO ALIMENTARIO</h1>
    <div class="meta">
      <strong>${company}</strong> · ${LOCATION_TYPE_LABELS[locationType] ?? locationType} · Fecha: ${today}
    </div>
  </div>

  <div class="legal-ref">
    <strong>Base legal:</strong> Art. 5 de la Ley 1/2025, de 20 de febrero (BOE núm. 45). Responsable designado: <strong>${responsibleName}${responsibleRole ? ` — ${responsibleRole}` : ''}</strong>
  </div>

  <!-- 1. RESUMEN EJECUTIVO -->
  <div class="section">
    <div class="section-title">1. Resumen ejecutivo</div>

    ${isUnderRegistered ? `
    <!-- Split view: datos reales vs estimación sectorial -->
    <div class="exec-split">
      <div class="exec-split-block" style="background:#f0fdf4;border:1px solid #bbf7d0;">
        <div class="exec-split-title" style="color:#059669;">📊 Datos registrados (${daysTracked} días)</div>
        <div class="exec-split-row">
          <span class="exec-split-key">Desperdicio real</span>
          <span class="exec-split-val" style="color:#059669;">${fmtRange(weeklyLow, weeklyHigh, ' kg/sem')}</span>
        </div>
        <div class="exec-split-row">
          <span class="exec-split-key">Coste registrado</span>
          <span class="exec-split-val" style="color:#059669;">${fmtRange(costLow, costHigh, ' €/sem')}</span>
        </div>
        <div style="font-size:11px;color:#6b7280;margin-top:6px;">
          ⚠ Registro iniciado hace ${daysTracked} días — muestra parcial
        </div>
      </div>
      <div class="exec-split-block" style="background:#fff7ed;border:1px solid #fed7aa;">
        <div class="exec-split-title" style="color:#ea580c;">📈 Estimación sectorial ${useRevenueBased ? '(facturación)' : '(benchmark)'}</div>
        <div class="exec-split-row">
          <span class="exec-split-key">Desperdicio esperado</span>
          <span class="exec-split-val" style="color:#ea580c;">${fmtRange(finalAnnualWasteLow, finalAnnualWasteHigh, ' €/año')}</span>
        </div>
        <div class="exec-split-row">
          <span class="exec-split-key">Ahorro potencial</span>
          <span class="exec-split-val" style="color:#ea580c;">${annualLow.toLocaleString('es-ES')}–${annualHigh.toLocaleString('es-ES')} €/año</span>
        </div>
        <div style="font-size:11px;color:#6b7280;margin-top:6px;">
          ${useRevenueBased ? `Base: ${clientesDay} clientes/día × ${ticketMedio}€ × 365 días` : `Base: benchmark ${LOCATION_TYPE_LABELS[locationType].toLowerCase()}`}
        </div>
      </div>
    </div>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12.5px;color:#92400e;">
      <strong>⚠ Diferencia entre datos registrados y estimación:</strong>
      El volumen registrado es significativamente inferior al esperado para un negocio de este tamaño.
      Esto indica que actualmente <strong>no se está registrando la totalidad del desperdicio generado</strong>,
      lo que limita la capacidad de control y evidencia de cumplimiento legal.
    </div>` : `
    <!-- Standard exec box -->
    ${isPreliminary && hasRealData ? `
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12.5px;color:#92400e;">
      <strong>⚠ Datos preliminares (${daysTracked} días de registro).</strong>
      Se recomienda continuar registrando durante al menos 30 días para obtener estimaciones más representativas.
    </div>` : ''}
    <div class="exec-box">
      <div class="exec-item">
        <div class="exec-label">Desperdicio ${hasRealData ? 'registrado' : 'estimado'}</div>
        <div class="exec-value">${fmtRange(weeklyLow, weeklyHigh, ' kg/sem')}</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px;">
          Proyección: ${monthlyKgEst} kg/mes · ${annualKgEst} kg/año
        </div>
      </div>
      <div class="exec-item">
        <div class="exec-label">Coste estimado</div>
        <div class="exec-value">${fmtRange(costLow, costHigh, ' €/sem')}</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px;">
          Proyección: ${fmtRange(Math.round(costLow * 4), Math.round(costHigh * 4), ' €/mes')}
        </div>
      </div>
      <div class="exec-item">
        <div class="exec-label">Categoría crítica</div>
        <div class="exec-value">${CAT_LABEL_ES[topCat] ?? topCat} (≈${topPct}%)</div>
      </div>
      <div class="exec-item">
        <div class="exec-label">Ahorro potencial anual</div>
        <div class="exec-value">${annualLow.toLocaleString('es-ES')}–${annualHigh.toLocaleString('es-ES')} €</div>
        <div style="font-size:10px;color:#9ca3af;margin-top:2px;">
          ${useRevenueBased ? 'Calculado sobre facturación' : useBenchmark ? 'Benchmark sectorial' : 'Reducción 20–30%'}
        </div>
      </div>
      <div class="exec-objective">
        👉 <strong>Objetivo del plan:</strong> Reducir el desperdicio total por debajo del <strong>8% sobre compras</strong> en un plazo de 2 meses.
        Ahorro anual estimado: <strong>${annualLow.toLocaleString('es-ES')}–${annualHigh.toLocaleString('es-ES')} €</strong>
      </div>
      <div class="data-note">
        ${useRevenueBased
          ? `* Impacto económico calculado sobre facturación estimada (${clientesDay} clientes/día × ${ticketMedio}€ × 365 días).${hasRealData ? ` Residuos registrados: ${totalKg.toFixed(1)} kg en ${daysTracked} días.` : ''}`
          : !hasRealData
            ? '* Valores estimados según categorías seleccionadas y tipo de establecimiento. Con datos registrados en MermaLegal, las cifras serán exactas.'
            : useBenchmark
              ? `* Registrado: ${totalKg.toFixed(1)} kg en ${daysTracked} días. Proyección económica basada en benchmark del sector (${LOCATION_TYPE_LABELS[locationType]}).`
              : `* Basado en ${totalKg.toFixed(1)} kg registrados durante ${daysTracked} días en MermaLegal.`
        }
      </div>
    </div>`}

  </div>

  <!-- 2. DIAGNÓSTICO OPERATIVO -->
  <div class="section">
    <div class="section-title">2. Diagnóstico operativo</div>

    <div class="subsection-title">Distribución del desperdicio por categoría</div>
    <table class="diag-table">
      <thead>
        <tr>
          <th>Categoría</th>
          <th>% del total</th>
          <th>Causa principal</th>
          <th>Impacto</th>
        </tr>
      </thead>
      <tbody>${diagRows}</tbody>
    </table>

    <div class="subsection-title">Puntos críticos detectados</div>
    <ul class="critical-list">
      ${criticalPoints.map((p) => `<li>${p}</li>`).join('')}
    </ul>

    ${isUnderRegistered ? `
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-top:14px;font-size:12.5px;color:#92400e;">
      <strong>💡 Insight clave — Infra-registro detectado:</strong>
      El volumen de desperdicio registrado (<strong>${fmtRange(weeklyLow, weeklyHigh, ' kg/semana')}</strong>)
      es significativamente inferior al esperado para un ${LOCATION_TYPE_LABELS[locationType].toLowerCase()} de este tamaño.
      Esto indica que actualmente no se está registrando la totalidad del desperdicio generado.
      Implantar un sistema de registro completo puede revelar pérdidas ocultas relevantes,
      potencialmente superiores a <strong>${benchAnnualLow.toLocaleString('es-ES')}–${Math.round(benchAnnualHigh * 0.75).toLocaleString('es-ES')} €/año</strong>
      en negocios de este tamaño y tipo.
    </div>` : `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;margin-top:14px;font-size:12.5px;color:#1e40af;">
      <strong>💡 Insight:</strong>
      La concentración del <strong>${topPct}%</strong> del desperdicio en <strong>${CAT_LABEL_ES[topCat] ?? topCat}</strong>
      indica una oportunidad de mejora inmediata. Reduciendo un 25% esta categoría, el impacto directo sería de
      <strong>≈${Math.round(topPct * 0.25)}% sobre el desperdicio total</strong>.
      ${catEntries.length > 1 ? `Combinado con una reducción en ${CAT_LABEL_ES[catEntries[1].cat] ?? catEntries[1].cat} (${catEntries[1].pct}%), el efecto acumulado superaría el ${Math.round((topPct + catEntries[1].pct) * 0.25)}%.` : ''}
      ${useRevenueBased ? `Con una facturación estimada de <strong>${Math.round(annualRevenue / 1000)}k€/año</strong>, reducir el desperdicio un 25% equivale a <strong>${(Math.round(finalAnnualWasteLow * 0.25 / 100) * 100).toLocaleString('es-ES')}–${(Math.round(finalAnnualWasteHigh * 0.25 / 100) * 100).toLocaleString('es-ES')} €/año</strong>.` : ''}
    </div>`}

    ${!registroActual ? `
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin-top:10px;font-size:12.5px;color:#991b1b;">
      <strong>⚠ Sin registro activo de desperdicio</strong> — No existe sistema de medición en este establecimiento.
      Esto impide identificar patrones, tomar decisiones de compra informadas y demostrar cumplimiento ante una inspección.
      <strong>La plataforma MermaLegal queda designada como sistema oficial de registro y trazabilidad.</strong>
    </div>` : ''}

    <!-- Nivel de madurez -->
    <div style="margin-top:14px;">
      <div class="subsection-title">Nivel de control actual</div>
      ${(() => {
        const rawScore = (controlStock ? 1 : 0) + (ajustePedidos ? 1 : 0) + (registroActual ? 1 : 0) + (hasRealData ? 1 : 0);
        // Infra-registro detectado → no puede ser más que "Medio"
        const score = isUnderRegistered ? Math.min(rawScore, 2) : rawScore;
        const level = score <= 1 ? { label: 'Bajo', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
          : score <= 2 ? { label: 'Medio-bajo', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
          : score <= 3 ? { label: 'Medio', color: '#0891b2', bg: '#eff6ff', border: '#bfdbfe' }
          : { label: 'Avanzado', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' };
        const reasons = [
          !registroActual && 'Ausencia de registro sistemático del desperdicio',
          isUnderRegistered && `Registro iniciado recientemente (${daysTracked} días) — cobertura parcial del desperdicio real`,
          isUnderRegistered && 'Falta de trazabilidad completa hasta consolidar el registro',
          !controlStock && 'Sin revisión periódica de stock y caducidades',
          !ajustePedidos && 'Pedidos no ajustados según previsión de demanda real',
        ].filter(Boolean) as string[];
        return `
        <div style="background:${level.bg};border:1px solid ${level.border};border-radius:8px;padding:14px 16px;font-size:12.5px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <span style="font-size:18px;font-weight:800;color:${level.color};">${level.label}</span>
            <div style="flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
              <div style="height:100%;width:${Math.round(score / 4 * 100)}%;background:${level.color};border-radius:4px;"></div>
            </div>
            <span style="font-size:11px;color:#9ca3af;">${score}/4</span>
          </div>
          ${reasons.length ? `
          <div style="font-size:12px;color:#374151;margin-bottom:8px;">
            ${reasons.map((r) => `<div style="padding:2px 0;">• ${r}</div>`).join('')}
          </div>` : ''}
          <div style="font-size:11.5px;color:${level.color};font-weight:600;">
            Recomendación: ${isUnderRegistered
              ? `Consolidar el sistema de registro en las próximas 2–4 semanas para obtener datos completos y alcanzar nivel avanzado.`
              : score <= 1 ? 'Implantar sistema de registro y revisión de stock en las próximas 2–4 semanas.'
              : score <= 2 ? 'Activar ajuste de pedidos y completar el registro de desperdicio.'
              : score <= 3 ? 'Completar el ciclo con medición sistemática de todas las categorías.'
              : 'Mantener y optimizar — buen nivel de control operativo.'}
          </div>
        </div>`;
      })()}
    </div>
  </div>

  <!-- 3. PRIORIDADES -->
  <div class="section">
    <div class="section-title">3. Prioridades de actuación</div>
    <div class="priority-grid">
      <div class="priority-box" style="background:#fef2f2;border:1px solid #fecaca;">
        <div class="priority-label" style="color:#dc2626;">🔴 Prioridad alta</div>
        ${highPrio.length ? highPrio.map((x) => `<div class="priority-item">· ${MEASURE_DISPLAY[x.measure] ?? x.measure}</div>`).join('') : '<div class="priority-item" style="color:#9ca3af;">—</div>'}
      </div>
      <div class="priority-box" style="background:#fffbeb;border:1px solid #fde68a;">
        <div class="priority-label" style="color:#d97706;">🟠 Prioridad media</div>
        ${medPrio.length ? medPrio.map((x) => `<div class="priority-item">· ${MEASURE_DISPLAY[x.measure] ?? x.measure}</div>`).join('') : '<div class="priority-item" style="color:#9ca3af;">—</div>'}
      </div>
      <div class="priority-box" style="background:#f0fdf4;border:1px solid #bbf7d0;">
        <div class="priority-label" style="color:#16a34a;">🟢 Prioridad baja</div>
        ${lowPrio.length ? lowPrio.map((x) => `<div class="priority-item">· ${MEASURE_DISPLAY[x.measure] ?? x.measure}</div>`).join('') : '<div class="priority-item" style="color:#9ca3af;">—</div>'}
      </div>
    </div>
  </div>

  <!-- 3.5 QUICK WINS -->
  <div class="section">
    <div class="section-title" style="color:#d97706;border-color:#fde68a;">⚡ Acciones de impacto inmediato (primeros 7 días)</div>
    <p style="font-size:12px;color:#6b7280;margin-bottom:12px;">
      Estas acciones no requieren inversión y pueden reducir el desperdicio un 10–15% en la primera semana.
    </p>
    <div class="qw-grid">
      ${quickWinsHtml}
    </div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 14px;font-size:12px;color:#065f46;">
      <strong>Impacto estimado semana 1:</strong> reducción del 10–15% del desperdicio semanal ·
      Ahorro directo: ${fmtRange(savingsLow, savingsHigh, ' €/semana')}
    </div>
  </div>

  <!-- 4. MEDIDAS OPERATIVAS -->
  <div class="section">
    <div class="section-title">4. Medidas operativas</div>
    <p style="font-size:12.5px;color:#6b7280;margin-bottom:14px;">
      Cada medida incluye responsable, frecuencia, procedimiento paso a paso, indicador de control y objetivo numérico.
      Conforme al Art. 5.1.b) y Art. 4 de la Ley 1/2025.
    </p>
    ${measuresSectionsHtml}
  </div>

  <!-- 5. CUADRO DE MANDO -->
  <div class="section">
    <div class="section-title">5. Cuadro de mando — KPIs</div>
    <table class="kpi-table">
      <thead>
        <tr><th>Indicador</th><th>Objetivo</th><th>Frecuencia</th><th>Responsable</th></tr>
      </thead>
      <tbody>${kpiRows}</tbody>
    </table>
  </div>

  <!-- 6. IMPACTO ECONÓMICO -->
  <div class="section">
    <div class="section-title">6. Impacto económico estimado</div>
    <div class="econ-grid">
      <div class="econ-card" style="background:#fef2f2;border:1px solid #fecaca;">
        <div class="econ-label">Coste desperdicio/año</div>
        <div class="econ-value" style="color:#dc2626;">
          ${fmtRange(finalAnnualWasteLow, finalAnnualWasteHigh, ' €')}
        </div>
        <div class="econ-sub">${annualWasteSource}</div>
      </div>
      <div class="econ-card" style="background:#fffbeb;border:1px solid #fde68a;">
        <div class="econ-label">Ahorro potencial/semana</div>
        <div class="econ-value" style="color:#d97706;">${fmtRange(savingsLow, savingsHigh, ' €')}</div>
        <div class="econ-sub">Reducción del 20–30%</div>
        ${isUnderRegistered ? `<div style="font-size:10px;color:#9ca3af;margin-top:4px;">Basado en desperdicio esperado (facturación), no en el actualmente registrado</div>` : ''}
      </div>
      <div class="econ-card" style="background:#f0fdf4;border:1px solid #bbf7d0;">
        <div class="econ-label">Ahorro potencial anual</div>
        <div class="econ-value" style="color:#059669;">${annualLow.toLocaleString('es-ES')}–${annualHigh.toLocaleString('es-ES')} €</div>
        <div class="econ-sub">Retorno estimado en 2–3 meses según nivel de implementación</div>
      </div>
    </div>
    ${(useBenchmark || useRevenueBased) ? `
    <p style="font-size:11.5px;color:#6b7280;margin-top:10px;">
      ${useRevenueBased
        ? `* Cálculo basado en facturación estimada (${clientesDay} clientes/día × ${ticketMedio}€ × 365 días = ${Math.round(annualRevenue / 1000)}k€/año). Tasa de desperdicio típica para ${LOCATION_TYPE_LABELS[locationType].toLowerCase()}: ${(wasteRate * 100).toFixed(0)}–${((wasteRate * 1.3) * 100).toFixed(0)}%.`
        : `* El coste anual se basa en benchmarks del sector hostelero español para ${LOCATION_TYPE_LABELS[locationType].toLowerCase()}. Con más datos registrados en MermaLegal, estas cifras se ajustarán a tu operación real.`
      }
    </p>` : ''}
  </div>

  <!-- 7. SISTEMA DE REGISTRO -->
  <div class="section">
    <div class="section-title">7. Sistema de registro y medición</div>
    <p style="font-size:12.5px;color:#4b5563;margin-bottom:8px;">
      Conforme al Art. 5.1.c) de la Ley 1/2025. El establecimiento utiliza la plataforma digital MermaLegal para:
    </p>
    <ul style="padding-left:18px;font-size:12.5px;color:#374151;">
      <li style="margin-bottom:4px;">Registro diario de mermas por categoría y destino (donación, compost, pienso, destrucción)</li>
      <li style="margin-bottom:4px;">Seguimiento automático de los KPIs definidos en el cuadro de mando</li>
      <li style="margin-bottom:4px;">Generación de informes periódicos para evaluación de la eficacia</li>
      <li style="margin-bottom:4px;">Trazabilidad completa con almacenamiento conforme a plazos legales</li>
    </ul>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-top:12px;font-size:12px;color:#065f46;">
      <strong>Recomendación operativa:</strong>
      Para garantizar la trazabilidad y el cumplimiento continuo, se recomienda el uso de un sistema digital de registro diario que permita:
      <ul style="padding-left:16px;margin-top:6px;space-y:2px;">
        <li>Detectar desviaciones en tiempo real y actuar antes de que se conviertan en pérdidas</li>
        <li>Automatizar el seguimiento de KPIs sin carga administrativa adicional</li>
        <li>Generar evidencias documentales en caso de inspección o auditoría</li>
      </ul>
    </div>
  </div>

  <!-- 8. REVISIÓN -->
  <div class="section">
    <div class="section-title">8. Revisión del plan</div>
    <p style="font-size:12.5px;color:#4b5563;">
      Conforme al Art. 5.3 de la Ley 1/2025: <strong>revisión mensual operativa</strong> (seguimiento de KPIs y desviaciones)
      y <strong>revisión anual legal</strong> (actualización completa del plan). Próxima revisión operativa:
      <strong>${new Date(Date.now() + 30 * 86400000).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</strong>.
    </p>
  </div>

  <!-- 9. RESPONSABLES -->
  <div class="section">
    <div class="section-title">9. Responsables</div>
    <div style="font-size:12.5px;color:#374151;">
      <div style="margin-bottom:6px;"><strong>Responsable del plan:</strong> ${responsibleName}${responsibleRole ? ` (${responsibleRole})` : ''}</div>
      <div><strong>Equipo operativo:</strong> Cocina, sala y encargados de turno</div>
    </div>
  </div>

  <!-- FIRMAS -->
  <div class="signatures">
    <div class="sig-box">
      <p><strong>Responsable designado</strong></p>
      <p style="margin-top:6px;">${responsibleName}</p>
      <p>${responsibleRole}</p>
      <p style="margin-top:4px;font-size:11px;color:#9ca3af;">Firma y fecha</p>
    </div>
    <div class="sig-box">
      <p><strong>Representante legal</strong></p>
      <p style="margin-top:6px;">${company}</p>
      <p style="font-size:11px;color:#9ca3af;margin-top:4px;">Fecha: ${today}</p>
    </div>
  </div>

  <div class="footer">
    <p><strong>Documento generado por MermaLegal — Plataforma de apoyo al cumplimiento de la Ley 1/2025</strong></p>
    <p style="margin-top:6px;">Este documento ha sido elaborado conforme a los requisitos del Artículo 5 de la Ley 1/2025 y está diseñado para servir como base operativa en caso de inspección.</p>
    <p style="margin-top:4px;">La responsabilidad del cumplimiento normativo recae en el titular del establecimiento, quien deberá asegurar la correcta implementación y seguimiento de las medidas descritas.</p>
    <p style="margin-top:4px;">Se recomienda la validación por un asesor legal para garantizar su adecuación a las circunstancias específicas de la actividad.</p>
  </div>

</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
