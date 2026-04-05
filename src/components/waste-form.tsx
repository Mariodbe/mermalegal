'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  type WasteCategory,
  type WasteDestination,
  type Location,
  WASTE_CATEGORY_LABELS,
  DESTINATION_LABELS,
} from '@/lib/types';

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES: {
  id: WasteCategory;
  icon: string;
  iconBg: string;       // circle behind emoji (light + dark)
  selBg: string;        // card bg when selected
  selBorder: string;    // card border when selected
}[] = [
  { id: 'produce',  icon: '🥦', iconBg: 'bg-green-100  dark:bg-green-900',  selBg: 'bg-green-50  dark:bg-green-950',  selBorder: 'border-green-500'  },
  { id: 'protein',  icon: '🥩', iconBg: 'bg-red-100    dark:bg-red-900',    selBg: 'bg-red-50    dark:bg-red-950',    selBorder: 'border-red-500'    },
  { id: 'bakery',   icon: '🍞', iconBg: 'bg-amber-100  dark:bg-amber-900',  selBg: 'bg-amber-50  dark:bg-amber-950',  selBorder: 'border-amber-500'  },
  { id: 'dairy',    icon: '🧀', iconBg: 'bg-blue-100   dark:bg-blue-900',   selBg: 'bg-blue-50   dark:bg-blue-950',   selBorder: 'border-blue-500'   },
  { id: 'prepared', icon: '🍲', iconBg: 'bg-purple-100 dark:bg-purple-900', selBg: 'bg-purple-50 dark:bg-purple-950', selBorder: 'border-purple-500' },
  { id: 'other',    icon: '📦', iconBg: 'bg-gray-100   dark:bg-gray-700',   selBg: 'bg-gray-50   dark:bg-gray-800',   selBorder: 'border-gray-500'   },
];

const DESTINATIONS: {
  id: WasteDestination;
  icon: string;
  label: string;
  desc: string;
  iconBg: string;
  selBg: string;
  selBorder: string;
}[] = [
  { id: 'donation',    icon: '❤️',  label: 'Donación',    desc: 'Banco de alimentos', iconBg: 'bg-emerald-100 dark:bg-emerald-900', selBg: 'bg-emerald-50 dark:bg-emerald-950', selBorder: 'border-emerald-500' },
  { id: 'compost',     icon: '🌱',  label: 'Compost',      desc: 'Residuo orgánico',   iconBg: 'bg-lime-100    dark:bg-lime-900',    selBg: 'bg-lime-50    dark:bg-lime-950',    selBorder: 'border-lime-500'    },
  { id: 'animal_feed', icon: '🐄',  label: 'Pienso',       desc: 'Alimentación animal',iconBg: 'bg-orange-100  dark:bg-orange-900',  selBg: 'bg-orange-50  dark:bg-orange-950',  selBorder: 'border-orange-500'  },
  { id: 'destruction', icon: '🗑️', label: 'Destrucción',  desc: 'Residuo no apto',    iconBg: 'bg-red-100     dark:bg-red-900',     selBg: 'bg-red-50     dark:bg-red-950',     selBorder: 'border-red-500'     },
];

// ── Trigger ───────────────────────────────────────────────────────────────────
export function WasteFormTrigger({ locations }: { locations: Location[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (locations.length === 0) {
    return (
      <a
        href="/dashboard/locations"
        className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-primary-700 active:scale-95 transition-all sm:px-8"
        style={{ minHeight: '56px' }}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Añadir local para empezar
      </a>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-primary-700 active:scale-95 transition-all sm:px-8"
        style={{ minHeight: '56px' }}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Registrar merma
      </button>
      {isOpen && <WasteFormModal locations={locations} onClose={() => setIsOpen(false)} />}
    </>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
type Step = 'location' | 'category' | 'weight' | 'destination' | 'notes';

function WasteFormModal({ locations, onClose }: { locations: Location[]; onClose: () => void }) {
  const router = useRouter();
  const [step,        setStep]        = useState<Step>(locations.length > 1 ? 'location' : 'category');
  const [locationId,  setLocationId]  = useState(locations.length === 1 ? locations[0]?.id ?? '' : '');
  const [category,    setCategory]    = useState<WasteCategory | null>(null);
  const [weight,      setWeight]      = useState(0);
  const [destination, setDestination] = useState<WasteDestination | null>(null);
  const [notes,       setNotes]       = useState('');
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const addWeight = useCallback((delta: number) => {
    setWeight((prev) => Math.max(0, +(prev + delta).toFixed(1)));
  }, []);

  async function handleSave() {
    if (!locationId) {
      setError('No hay ningún local seleccionado. Ve a Locales y añade uno primero.');
      return;
    }
    if (!category || !destination || weight <= 0) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/waste-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_id: locationId,
          category,
          weight_kg: weight,
          destination,
          notes: notes.trim() || null,
          recorded_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setError(body.error ?? 'Has alcanzado el límite del plan gratuito. Actualiza a Pro para continuar.');
        } else {
          setError(body.error ?? 'Error al guardar el registro.');
        }
        setSaving(false);
        return;
      }
      setSaving(false);
      router.refresh();
      onClose();
    } catch {
      setError('Error de conexión. Por favor, inténtalo de nuevo.');
      setSaving(false);
    }
  }

  const stepOrder: Step[] = locations.length > 1
    ? ['location', 'category', 'weight', 'destination', 'notes']
    : ['category', 'weight', 'destination', 'notes'];
  const currentIdx = stepOrder.indexOf(step);

  const catCfg  = CATEGORIES.find((c) => c.id === category);
  const destCfg = DESTINATIONS.find((d) => d.id === destination);

  // Shared icon button style for back / close
  const iconBtn = 'flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95 shadow-sm';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#1e293b] shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">


        <div className="p-5">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              {currentIdx > 0 && (
                <button onClick={() => setStep(stepOrder[currentIdx - 1])} className={iconBtn}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">Registrar merma</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Paso {currentIdx + 1} de {stepOrder.length}</p>
              </div>
            </div>
            <button onClick={onClose} className={iconBtn}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Progress ── */}
          <div className="flex gap-1 mb-5">
            {stepOrder.map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < currentIdx   ? 'bg-primary-300 dark:bg-primary-700' :
                i === currentIdx ? 'bg-primary-600' :
                'bg-gray-100 dark:bg-gray-700'
              }`} />
            ))}
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* ── LOCATION ── */}
          {step === 'location' && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">¿En qué local?</p>
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => { setLocationId(loc.id); setStep('category'); }}
                  className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                    locationId === loc.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 text-xl">🏪</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{loc.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{loc.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── CATEGORY ── */}
          {step === 'category' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">¿Qué tipo de alimento?</p>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map(({ id, icon, iconBg, selBg, selBorder }) => {
                  const sel = category === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setCategory(id); setStep('weight'); }}
                      className={`focus-ring flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 p-4 transition-all active:scale-[0.96] hover:shadow-sm ${
                        sel
                          ? `${selBorder} ${selBg}`
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      style={{ minHeight: '88px' }}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${sel ? iconBg : iconBg}`}>
                        {icon}
                      </div>
                      <span className={`text-xs font-bold ${sel ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                        {WASTE_CATEGORY_LABELS[id]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── WEIGHT ── */}
          {step === 'weight' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">¿Cuánto pesa?</p>

              {/* Big display */}
              <div className="flex items-baseline justify-center gap-2 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-5 px-4 mb-4">
                <span className="text-6xl font-black tabular-nums text-gray-900 dark:text-gray-100 leading-none">
                  {weight.toFixed(1)}
                </span>
                <span className="text-xl font-semibold text-gray-400 dark:text-gray-500 mb-1">kg</span>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[0.5, 1, 2, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setWeight(v)}
                    className={`focus-ring rounded-xl py-3 text-sm font-bold transition-all active:scale-95 ${
                      weight === v
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {v} kg
                  </button>
                ))}
              </div>

              {/* +/- controls */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {([
                  { delta: -1,   label: '−1',   cls: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900'     },
                  { delta: -0.5, label: '−½',   cls: 'bg-red-50  dark:bg-red-950/40 text-red-500 dark:text-red-500 border border-red-100 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-950'     },
                  { delta: +0.5, label: '+½',   cls: 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-950' },
                  { delta: +1,   label: '+1',   cls: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900' },
                ] as const).map(({ delta, label, cls }) => (
                  <button
                    key={delta}
                    onClick={() => addWeight(delta)}
                    className={`focus-ring rounded-xl py-3 text-sm font-bold transition-all active:scale-90 ${cls}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => weight > 0 && setStep('destination')}
                disabled={weight <= 0}
                className="focus-ring w-full rounded-xl bg-primary-600 py-3.5 text-base font-bold text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* ── DESTINATION ── */}
          {step === 'destination' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">¿A dónde va?</p>
              <div className="grid grid-cols-2 gap-2.5">
                {DESTINATIONS.map(({ id, icon, label, desc, iconBg, selBg, selBorder }) => {
                  const sel = destination === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setDestination(id); setStep('notes'); }}
                      className={`focus-ring flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all active:scale-[0.96] hover:shadow-sm ${
                        sel
                          ? `${selBorder} ${selBg}`
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      style={{ minHeight: '96px' }}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${iconBg}`}>
                        {icon}
                      </div>
                      <span className={`text-xs font-bold ${sel ? 'text-gray-800 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                        {label}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight text-center">
                        {desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── NOTES + SAVE ── */}
          {step === 'notes' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Confirmar y guardar</p>

              {/* Summary */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden mb-4">
                {[
                  { label: 'Tipo',    value: catCfg  ? `${catCfg.icon}  ${WASTE_CATEGORY_LABELS[catCfg.id]}`   : '—' },
                  { label: 'Peso',    value: `${weight.toFixed(1)} kg` },
                  { label: 'Destino', value: destCfg ? `${destCfg.icon} ${destCfg.label}` : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-400 dark:text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
                  </div>
                ))}
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas opcionales — ej: sobras del servicio de mediodía..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4 resize-none"
              />

              <button
                onClick={handleSave}
                disabled={saving}
                className="focus-ring w-full rounded-xl bg-primary-600 py-4 text-lg font-bold text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm"
                style={{ minHeight: '56px' }}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Guardando...
                  </span>
                ) : '✓ Guardar registro'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
