'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  type WasteCategory,
  type LocationType,
  LOCATION_TYPE_LABELS,
} from '@/lib/types';

interface PlanFormProps {
  initialLocationId:   string | null;
  initialLocationType: LocationType | null;
  initialPlanId:       string | null;
}

// ─── Auto-selección de medidas ────────────────────────────────────────────────

function autoSelectMeasures(
  locationType: LocationType,
  serviceType: string,
  wasteTypes: WasteCategory[],
  wasteCauses: string[],
  controlStock: boolean,
  ajustePedidos: boolean,
): string[] {
  const m = new Set<string>();

  // Siempre incluidas
  m.add('Compostaje de residuos organicos');
  m.add('Formacion del personal en reduccion de mermas');
  m.add('Donacion de excedentes a bancos de alimentos');
  m.add('Rotacion FIFO (primero en entrar, primero en salir)');

  // Sin control de stock → revisión urgente
  if (!controlStock) {
    m.add('Revision semanal de stock y caducidades');
    m.add('Control de temperatura en camaras frigorificas');
  }

  // Sin ajuste de pedidos → medida clave
  if (!ajustePedidos) {
    m.add('Ajuste de pedidos segun prevision de demanda');
  }

  // Buffet o hotel
  if (serviceType === 'buffet' || locationType === 'hotel') {
    m.add('Uso de formatos mas pequenos en buffet');
  }

  // Temperatura (produce / dairy)
  if (wasteTypes.includes('produce') || wasteTypes.includes('dairy')) {
    m.add('Control de temperatura en camaras frigorificas');
  }

  // Sobreproducción detectada
  if (
    wasteCauses.includes('sobrecompra') ||
    wasteCauses.includes('prevision') ||
    wasteCauses.includes('sobras')
  ) {
    m.add('Ajuste de produccion segun demanda real');
    m.add('Menu adaptable segun existencias');
  }

  // Subproductos
  if (wasteTypes.includes('protein') || wasteTypes.includes('produce')) {
    m.add('Aprovechamiento de subproductos en nuevas elaboraciones');
  }

  return [...m];
}

// ─── Constantes UI ────────────────────────────────────────────────────────────

type PlanStep = 'info' | 'volume' | 'waste' | 'controls' | 'responsible';

const SERVICE_TYPES = [
  { id: 'carta',    label: 'Carta' },
  { id: 'menu_dia', label: 'Menú del día' },
  { id: 'buffet',   label: 'Buffet' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'mixto',    label: 'Mixto' },
];

const WASTE_CAT_OPTIONS: { id: WasteCategory; label: string; emoji: string }[] = [
  { id: 'produce',  label: 'Verdura',    emoji: '🥦' },
  { id: 'bakery',   label: 'Panadería',  emoji: '🍞' },
  { id: 'protein',  label: 'Proteína',   emoji: '🥩' },
  { id: 'dairy',    label: 'Lácteos',    emoji: '🧀' },
  { id: 'prepared', label: 'Preparados', emoji: '🍲' },
  { id: 'other',    label: 'Otros',      emoji: '📦' },
];

const WASTE_CAUSE_OPTIONS = [
  { id: 'sobrecompra', label: 'Sobrecompra' },
  { id: 'prevision',   label: 'Mala previsión de demanda' },
  { id: 'caducidades', label: 'Caducidades' },
  { id: 'sobras',      label: 'Sobras de cocina' },
  { id: 'buffet',      label: 'Buffet / autoservicio' },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function PlanForm({ initialLocationId, initialLocationType, initialPlanId }: PlanFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<PlanStep>('info');

  // Paso 1
  const [companyName, setCompanyName]   = useState('');
  const [locationType, setLocationType] = useState<LocationType | null>(initialLocationType);
  const [serviceType, setServiceType]   = useState('');

  // Paso 2
  const [clientesDay, setClientesDay] = useState('');
  const [ticketMedio, setTicketMedio] = useState('');

  // Paso 3
  const [wasteTypes,  setWasteTypes]  = useState<WasteCategory[]>([]);
  const [wasteCauses, setWasteCauses] = useState<string[]>([]);

  // Paso 4
  const [controlStock,   setControlStock]   = useState<boolean | null>(null);
  const [ajustePedidos,  setAjustePedidos]  = useState<boolean | null>(null);
  const [registroActual, setRegistroActual] = useState<boolean | null>(null);

  // Paso 5
  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleRole, setResponsibleRole] = useState('');

  // Meta — datos ya pre-cargados server-side, sin useEffect
  const [saving,     setSaving]     = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planId,     setPlanId]     = useState<string | null>(initialPlanId);
  const [locationId]                = useState<string | null>(initialLocationId);

  async function handleSave(measures: string[]) {
    if (!locationId) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      location_id: locationId,
      status: 'complete' as const,
      company_name: companyName,
      responsible_name: responsibleName,
      responsible_role: responsibleRole,
      waste_types: wasteTypes,
      measures,
    };
    if (planId) {
      await supabase.from('prevention_plans').update(payload).eq('id', planId);
    } else {
      const { data } = await supabase.from('prevention_plans').insert(payload).select('id').single();
      if (data) setPlanId(data.id);
    }
    setSaving(false);
    router.refresh();
  }

  async function handleGenerate() {
    setGenerating(true);

    const measures = autoSelectMeasures(
      locationType ?? 'restaurant',
      serviceType,
      wasteTypes,
      wasteCauses,
      controlStock ?? true,
      ajustePedidos ?? true,
    );

    await handleSave(measures);

    const supabase = createClient();
    const params = new URLSearchParams({
      company:          companyName,
      responsible_name: responsibleName,
      responsible_role: responsibleRole,
      waste_types:      wasteTypes.join(','),
      measures:         measures.join('|||'),
      location_type:    locationType ?? 'restaurant',
      service_type:     serviceType,
      clientes_day:     clientesDay,
      ticket_medio:     ticketMedio,
      waste_causes:     wasteCauses.join(','),
      control_stock:    controlStock  === false ? 'no' : 'si',
      ajuste_pedidos:   ajustePedidos === false ? 'no' : 'si',
      registro_actual:  registroActual === false ? 'no' : 'si',
    });

    if (locationId) {
      const { data: entries } = await supabase
        .from('waste_entries')
        .select('category, weight_kg, recorded_at')
        .eq('location_id', locationId)
        .order('recorded_at', { ascending: true })
        .limit(1000);

      if (entries && entries.length > 0) {
        const catTotals: Record<string, number> = {};
        for (const e of entries) {
          catTotals[e.category] = (catTotals[e.category] ?? 0) + e.weight_kg;
        }
        const first = new Date(entries[0].recorded_at);
        const last  = new Date(entries[entries.length - 1].recorded_at);
        const daysTracked = Math.max(7, Math.ceil((last.getTime() - first.getTime()) / 86400000) + 1);
        params.set(
          'entries_data',
          Object.entries(catTotals).map(([c, k]) => `${c}:${k.toFixed(1)}`).join(',')
        );
        params.set('days_tracked', String(daysTracked));
      }
    }

    window.open(`/api/plan/generate?${params.toString()}`, '_blank');
    setGenerating(false);
  }

  const steps: PlanStep[] = ['info', 'volume', 'waste', 'controls', 'responsible'];
  const currentIdx = steps.indexOf(step);

  const computedMeasures = autoSelectMeasures(
    locationType ?? 'restaurant',
    serviceType,
    wasteTypes,
    wasteCauses,
    controlStock ?? true,
    ajustePedidos ?? true,
  );

  // ── Sub-componente Yes/No ─────────────────────────────────────────────────
  function YesNo({
    value,
    onChange,
  }: {
    value: boolean | null;
    onChange: (v: boolean) => void;
  }) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {([true, false] as const).map((v) => (
          <button
            key={String(v)}
            onClick={() => onChange(v)}
            className={`focus-ring rounded-xl border-2 py-3 font-semibold text-sm transition-all ${
              value === v
                ? v
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-red-400 bg-red-400 text-white'
                : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-primary-300'
            }`}
          >
            {v ? 'Sí' : 'No'}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Plan de prevención</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Art. 5 de la Ley 1/2025 · Paso {currentIdx + 1} de {steps.length}
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= currentIdx ? 'bg-primary-600' : 'bg-[var(--bg-tertiary)]'
            }`}
          />
        ))}
      </div>

      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm">

        {/* ── PASO 1: PERFIL ─────────────────────────────────────────────── */}
        {step === 'info' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">¿Cómo se llama tu negocio?</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Aparecerá en el plan legal</p>
            </div>

            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
              placeholder="Restaurante El Buen Sabor S.L."
              autoFocus
            />

            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Tipo de establecimiento
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(LOCATION_TYPE_LABELS) as [LocationType, string][]).map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => setLocationType(type)}
                    className={`focus-ring rounded-xl border-2 p-3 text-center text-sm font-medium transition-all ${
                      locationType === type
                        ? 'border-primary-500 bg-primary-600 text-white'
                        : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-primary-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Tipo de servicio
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SERVICE_TYPES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setServiceType(id)}
                    className={`focus-ring rounded-xl border-2 p-2.5 text-center text-xs font-medium transition-all ${
                      serviceType === id
                        ? 'border-primary-500 bg-primary-600 text-white'
                        : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-primary-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => companyName.trim() && locationType && setStep('volume')}
              disabled={!companyName.trim() || !locationType}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* ── PASO 2: VOLUMEN ─────────────────────────────────────────────── */}
        {step === 'volume' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">¿Cuánto mueve tu negocio?</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Calculamos el impacto económico real del desperdicio
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Clientes por día (aprox.)
                </label>
                <input
                  type="number"
                  value={clientesDay}
                  onChange={(e) => setClientesDay(e.target.value)}
                  className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
                  placeholder="80"
                  min="1"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">En un día normal de servicio</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Ticket medio (€)
                </label>
                <input
                  type="number"
                  value={ticketMedio}
                  onChange={(e) => setTicketMedio(e.target.value)}
                  className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
                  placeholder="18"
                  min="1"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Precio medio por cubierto o consumición</p>
              </div>

              {clientesDay && ticketMedio && (
                <div className="rounded-lg bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 p-3 text-sm text-primary-800 dark:text-primary-300">
                  💡 Facturación estimada:{' '}
                  <strong>
                    {Math.round(parseFloat(clientesDay) * parseFloat(ticketMedio) * 365 / 1000)}k€/año
                  </strong>{' '}
                  — el desperdicio alimentario consume un 5–9% de eso.
                </div>
              )}
            </div>

            <button
              onClick={() => setStep('waste')}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              Siguiente →
            </button>
            <p className="text-center text-xs text-[var(--text-muted)]">
              Puedes dejarlo en blanco y usar benchmark sectorial
            </p>
          </div>
        )}

        {/* ── PASO 3: DESPERDICIO ─────────────────────────────────────────── */}
        {step === 'waste' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                ¿Dónde se pierde más comida?
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Selecciona todo lo que aplique</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Categorías principales
              </p>
              <div className="grid grid-cols-3 gap-2">
                {WASTE_CAT_OPTIONS.map(({ id, label, emoji }) => {
                  const sel = wasteTypes.includes(id);
                  return (
                  <button
                    key={id}
                    onClick={() =>
                      setWasteTypes((prev) =>
                        prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
                      )
                    }
                    className={`focus-ring relative rounded-xl border-2 p-3 text-center transition-all ${
                      sel
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-primary-300'
                    }`}
                  >
                    {sel && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600">
                        <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    <div className="text-xl">{emoji}</div>
                    <div className={`text-xs font-medium mt-1 ${sel ? 'text-primary-700 dark:text-primary-300' : 'text-[var(--text-primary)]'}`}>{label}</div>
                  </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                ¿Por qué ocurre? (percepción)
              </p>
              <div className="flex flex-wrap gap-2">
                {WASTE_CAUSE_OPTIONS.map(({ id, label }) => {
                  const sel = wasteCauses.includes(id);
                  return (
                  <button
                    key={id}
                    onClick={() =>
                      setWasteCauses((prev) =>
                        prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
                      )
                    }
                    className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      sel
                        ? 'border-primary-500 bg-primary-600 text-white'
                        : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    {sel && (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {label}
                  </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => wasteTypes.length > 0 && setStep('controls')}
              disabled={wasteTypes.length === 0}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* ── PASO 4: OPERATIVA ───────────────────────────────────────────── */}
        {step === 'controls' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">¿Cómo funciona tu operativa?</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Esto personaliza las medidas del plan</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  ¿Revisáis el stock regularmente?
                </p>
                <YesNo value={controlStock} onChange={setControlStock} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  ¿Ajustáis pedidos según las ventas reales?
                </p>
                <YesNo value={ajustePedidos} onChange={setAjustePedidos} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  ¿Registráis el desperdicio actualmente?
                </p>
                <YesNo value={registroActual} onChange={setRegistroActual} />
              </div>
            </div>

            {registroActual === false && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-300">
                <strong>⚠ Sin registro activo</strong> — Sin medición sistemática es imposible demostrar
                cumplimiento ante una inspección. El plan incluirá MermaLegal como sistema oficial de
                trazabilidad.
              </div>
            )}

            <button
              onClick={() =>
                controlStock !== null && ajustePedidos !== null && registroActual !== null && setStep('responsible')
              }
              disabled={controlStock === null || ajustePedidos === null || registroActual === null}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* ── PASO 5: RESPONSABLE + GENERAR ──────────────────────────────── */}
        {step === 'responsible' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Responsable del plan</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Art. 5.2 Ley 1/2025 — obligatorio designar un responsable
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
                  placeholder="Juan García López"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Cargo
                </label>
                <input
                  type="text"
                  value={responsibleRole}
                  onChange={(e) => setResponsibleRole(e.target.value)}
                  className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
                  placeholder="Director/a de operaciones"
                />
              </div>
            </div>

            {/* Preview medidas auto-seleccionadas */}
            {computedMeasures.length > 0 && (
              <div className="rounded-lg bg-[var(--bg-tertiary)] p-3">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  {computedMeasures.length} medidas incluidas automáticamente
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {computedMeasures.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-primary-100 dark:bg-primary-900 px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                    >
                      {m.split(' ').slice(0, 3).join(' ')}…
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => responsibleName.trim() && handleGenerate()}
              disabled={!responsibleName.trim() || generating}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generando plan...
                </>
              ) : (
                '📄 Generar Plan Legal'
              )}
            </button>
            {saving && <p className="text-center text-xs text-[var(--text-muted)]">Guardando...</p>}
          </div>
        )}

        {/* Navegación atrás */}
        {currentIdx > 0 && (
          <button
            onClick={() => setStep(steps[currentIdx - 1])}
            className="mt-4 w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ← Volver
          </button>
        )}
      </div>
    </div>
  );
}
