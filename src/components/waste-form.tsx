'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  type WasteCategory,
  type WasteDestination,
  type Location,
  WASTE_CATEGORY_LABELS,
  DESTINATION_LABELS,
  getWasteColor,
  getDestinationColor,
} from '@/lib/types';

// ── Colors for category tiles ──
const CATEGORY_BG: Record<WasteCategory, string> = {
  bakery: 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700',
  protein: 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700',
  dairy: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700',
  produce: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700',
  prepared: 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700',
  other: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
};

const CATEGORY_ICONS: Record<WasteCategory, string> = {
  bakery: '🍞',
  protein: '🥩',
  dairy: '🧀',
  produce: '🥦',
  prepared: '🍲',
  other: '📦',
};

const DESTINATION_BG: Record<WasteDestination, string> = {
  donation: 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700',
  compost: 'bg-lime-100 dark:bg-lime-900 border-lime-300 dark:border-lime-700',
  animal_feed: 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700',
  destruction: 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700',
};

const DESTINATION_ICONS: Record<WasteDestination, string> = {
  donation: '❤️',
  compost: '🌱',
  animal_feed: '🐄',
  destruction: '🗑️',
};

// ── Trigger button (exported for use in dashboard page) ──
export function WasteFormTrigger({ locations }: { locations: Location[] }) {
  const [isOpen, setIsOpen] = useState(false);

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

      {isOpen && (
        <WasteFormModal
          locations={locations}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// ── Steps ──
type Step = 'location' | 'category' | 'weight' | 'destination' | 'notes';

function WasteFormModal({
  locations,
  onClose,
}: {
  locations: Location[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(locations.length > 1 ? 'location' : 'category');
  const [locationId, setLocationId] = useState(locations.length === 1 ? locations[0]?.id ?? '' : '');
  const [category, setCategory] = useState<WasteCategory | null>(null);
  const [weight, setWeight] = useState(0);
  const [destination, setDestination] = useState<WasteDestination | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addWeight = useCallback((delta: number) => {
    setWeight((prev) => Math.max(0, +(prev + delta).toFixed(1)));
  }, []);

  async function handleSave() {
    if (!locationId || !category || !destination || weight <= 0) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from('waste_entries').insert({
      location_id: locationId,
      category,
      weight_kg: weight,
      destination,
      notes: notes.trim() || null,
      recorded_by: user?.email ?? 'unknown',
      recorded_at: new Date().toISOString(),
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.refresh();
    onClose();
  }

  const stepOrder: Step[] = locations.length > 1
    ? ['location', 'category', 'weight', 'destination', 'notes']
    : ['category', 'weight', 'destination', 'notes'];

  const currentIdx = stepOrder.indexOf(step);
  const canGoBack = currentIdx > 0;

  function goBack() {
    if (canGoBack) setStep(stepOrder[currentIdx - 1]);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl p-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {canGoBack && (
              <button
                onClick={goBack}
                className="focus-ring flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] active:scale-95 transition-transform"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Registrar merma</h2>
          </div>
          <button
            onClick={onClose}
            className="focus-ring flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] active:scale-95 transition-transform"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {stepOrder.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= currentIdx ? 'bg-primary-600' : 'bg-[var(--bg-tertiary)]'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* ── STEP: Location ── */}
        {step === 'location' && (
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Selecciona el local</p>
            <div className="grid grid-cols-1 gap-3">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setLocationId(loc.id);
                    setStep('category');
                  }}
                  className={`focus-ring flex items-center gap-3 rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98] ${
                    locationId === loc.id
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950'
                      : 'border-[var(--border-color)] hover:border-primary-300'
                  }`}
                  style={{ minHeight: '64px' }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900 text-xl">
                    🏪
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{loc.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{loc.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: Category ── */}
        {step === 'category' && (
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Tipo de alimento</p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(WASTE_CATEGORY_LABELS) as WasteCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setStep('weight');
                  }}
                  className={`focus-ring flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all active:scale-[0.96] ${
                    category === cat
                      ? 'border-primary-600 ring-2 ring-primary-600/30'
                      : 'border-transparent'
                  } ${CATEGORY_BG[cat]}`}
                  style={{ minHeight: '100px' }}
                >
                  <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {WASTE_CATEGORY_LABELS[cat]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: Weight ── */}
        {step === 'weight' && (
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Peso (kg)</p>

            {/* Big display */}
            <div className="mb-6 flex items-center justify-center rounded-2xl bg-[var(--bg-tertiary)] p-6">
              <span className="text-5xl font-bold text-[var(--text-primary)] tabular-nums">
                {weight.toFixed(1)}
              </span>
              <span className="ml-2 text-2xl text-[var(--text-muted)]">kg</span>
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[0.5, 1, 2, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setWeight(v)}
                  className={`focus-ring rounded-xl border-2 py-4 text-lg font-bold transition-all active:scale-95 ${
                    weight === v
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-primary-300'
                  }`}
                  style={{ minHeight: '56px' }}
                >
                  {v} kg
                </button>
              ))}
            </div>

            {/* +/- controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => addWeight(-1)}
                className="focus-ring flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-2xl font-bold active:scale-90 transition-transform"
              >
                -1
              </button>
              <button
                onClick={() => addWeight(-0.5)}
                className="focus-ring flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950 text-red-500 dark:text-red-400 text-xl font-bold active:scale-90 transition-transform"
              >
                -0.5
              </button>
              <button
                onClick={() => addWeight(0.5)}
                className="focus-ring flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950 text-green-500 dark:text-green-400 text-xl font-bold active:scale-90 transition-transform"
              >
                +0.5
              </button>
              <button
                onClick={() => addWeight(1)}
                className="focus-ring flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-2xl font-bold active:scale-90 transition-transform"
              >
                +1
              </button>
            </div>

            <button
              onClick={() => weight > 0 && setStep('destination')}
              disabled={weight <= 0}
              className="focus-ring w-full rounded-xl bg-primary-600 py-4 text-lg font-bold text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              style={{ minHeight: '56px' }}
            >
              Siguiente
            </button>
          </div>
        )}

        {/* ── STEP: Destination ── */}
        {step === 'destination' && (
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Destino de la merma</p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(DESTINATION_LABELS) as WasteDestination[]).map((dest) => (
                <button
                  key={dest}
                  onClick={() => {
                    setDestination(dest);
                    setStep('notes');
                  }}
                  className={`focus-ring flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all active:scale-[0.96] ${
                    destination === dest
                      ? 'border-primary-600 ring-2 ring-primary-600/30'
                      : 'border-transparent'
                  } ${DESTINATION_BG[dest]}`}
                  style={{ minHeight: '100px' }}
                >
                  <span className="text-3xl">{DESTINATION_ICONS[dest]}</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {DESTINATION_LABELS[dest]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: Notes + Save ── */}
        {step === 'notes' && (
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">Notas (opcional)</p>

            {/* Summary */}
            <div className="mb-4 rounded-xl bg-[var(--bg-tertiary)] p-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Categoria</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {category ? `${CATEGORY_ICONS[category]} ${WASTE_CATEGORY_LABELS[category]}` : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Peso</span>
                <span className="font-medium text-[var(--text-primary)]">{weight.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Destino</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {destination ? `${DESTINATION_ICONS[destination]} ${DESTINATION_LABELS[destination]}` : ''}
                </span>
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sobras del servicio de mediodia..."
              rows={3}
              className="touch-input focus-ring w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-4"
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="focus-ring w-full rounded-xl bg-primary-600 py-5 text-xl font-bold text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg"
              style={{ minHeight: '64px' }}
            >
              {saving ? 'Guardando...' : 'Guardar registro'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
