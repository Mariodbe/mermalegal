'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  type WasteCategory,
  type LocationType,
  WASTE_CATEGORY_LABELS,
  LOCATION_TYPE_LABELS,
} from '@/lib/types';

type PlanStep = 'info' | 'location_type' | 'waste_types' | 'measures' | 'responsible' | 'review';

const PREVENTION_MEASURES = [
  'Ajuste de pedidos segun prevision de demanda',
  'Rotacion FIFO (primero en entrar, primero en salir)',
  'Uso de formatos mas pequenos en buffet',
  'Donacion de excedentes a bancos de alimentos',
  'Compostaje de residuos organicos',
  'Formacion del personal en reduccion de mermas',
  'Revision semanal de stock y caducidades',
  'Aprovechamiento de subproductos en nuevas elaboraciones',
  'Control de temperatura en camaras frigorificas',
  'Menu adaptable segun existencias',
];

export default function PlanPage() {
  const router = useRouter();
  const [step, setStep] = useState<PlanStep>('info');
  const [companyName, setCompanyName] = useState('');
  const [locationType, setLocationType] = useState<LocationType | null>(null);
  const [wasteTypes, setWasteTypes] = useState<WasteCategory[]>([]);
  const [measures, setMeasures] = useState<string[]>([]);
  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleRole, setResponsibleRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [locationId, setLocationId] = useState<string | null>(null);

  // Load existing data
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', user.id)
        .single();
      if (profile?.company_name) setCompanyName(profile.company_name);

      const { data: locations } = await supabase
        .from('locations')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      if (locations?.[0]) setLocationId(locations[0].id);

      // Load existing plan
      if (locations?.[0]) {
        const { data: plan } = await supabase
          .from('prevention_plans')
          .select('*')
          .eq('location_id', locations[0].id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (plan) {
          setPlanId(plan.id);
          setCompanyName(plan.company_name ?? '');
          setResponsibleName(plan.responsible_name ?? '');
          setResponsibleRole(plan.responsible_role ?? '');
          setWasteTypes(plan.waste_types ?? []);
          setMeasures(plan.measures ?? []);
        }
      }
    }
    load();
  }, []);

  function toggleWasteType(cat: WasteCategory) {
    setWasteTypes((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleMeasure(m: string) {
    setMeasures((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  async function handleSave() {
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

  async function handleGeneratePDF() {
    setGenerating(true);
    await handleSave();

    // Open generated plan in new tab
    const params = new URLSearchParams({
      company: companyName,
      responsible_name: responsibleName,
      responsible_role: responsibleRole,
      waste_types: wasteTypes.join(','),
      measures: measures.join('|||'),
      location_type: locationType ?? 'restaurant',
    });

    window.open(`/api/plan/generate?${params.toString()}`, '_blank');
    setGenerating(false);
  }

  const steps: PlanStep[] = ['info', 'location_type', 'waste_types', 'measures', 'responsible', 'review'];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Plan de prevencion</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Genera tu plan conforme al Art. 5 de la Ley 1/2025
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentIdx ? 'bg-primary-600' : 'bg-[var(--bg-tertiary)]'
            }`}
          />
        ))}
      </div>

      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm">
        {/* Step: Company info */}
        {step === 'info' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Datos de la empresa</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Nombre de la empresa
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
                placeholder="Restaurante El Buen Sabor S.L."
              />
            </div>
            <button
              onClick={() => companyName.trim() && setStep('location_type')}
              disabled={!companyName.trim()}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Step: Location type */}
        {step === 'location_type' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tipo de establecimiento</h2>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(LOCATION_TYPE_LABELS) as [LocationType, string][]).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => {
                    setLocationType(type);
                    setStep('waste_types');
                  }}
                  className={`focus-ring rounded-xl border-2 p-4 text-center font-medium transition-all active:scale-[0.98] ${
                    locationType === type
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-primary-300'
                  }`}
                  style={{ minHeight: '56px' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Waste types */}
        {step === 'waste_types' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Tipos de residuos alimentarios generados
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">Selecciona todos los que apliquen</p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(WASTE_CATEGORY_LABELS) as [WasteCategory, string][]).map(([cat, label]) => (
                <button
                  key={cat}
                  onClick={() => toggleWasteType(cat)}
                  className={`focus-ring rounded-xl border-2 p-4 text-center font-medium transition-all active:scale-[0.98] ${
                    wasteTypes.includes(cat)
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-primary-300'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => wasteTypes.length > 0 && setStep('measures')}
              disabled={wasteTypes.length === 0}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Step: Prevention measures */}
        {step === 'measures' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Medidas de prevencion</h2>
            <p className="text-sm text-[var(--text-secondary)]">Selecciona las medidas que aplicas o planeas aplicar</p>
            <div className="space-y-2">
              {PREVENTION_MEASURES.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleMeasure(m)}
                  className={`focus-ring flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                    measures.includes(m)
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-primary-300'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      measures.includes(m)
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-[var(--border-color)]'
                    }`}
                  >
                    {measures.includes(m) && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={() => measures.length > 0 && setStep('responsible')}
              disabled={measures.length === 0}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Step: Responsible person */}
        {step === 'responsible' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Persona responsable</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Segun el Art. 5.2 de la Ley 1/2025, debe designarse un responsable
            </p>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Nombre completo
              </label>
              <input
                type="text"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
                placeholder="Juan Garcia Lopez"
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
            <button
              onClick={() => responsibleName.trim() && setStep('review')}
              disabled={!responsibleName.trim()}
              className="focus-ring w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
            >
              Revisar plan
            </button>
          </div>
        )}

        {/* Step: Review */}
        {step === 'review' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Resumen del plan</h2>

            <div className="space-y-4 text-sm">
              <div className="rounded-lg bg-[var(--bg-tertiary)] p-4 space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">Empresa</p>
                <p className="text-[var(--text-secondary)]">{companyName}</p>
              </div>
              <div className="rounded-lg bg-[var(--bg-tertiary)] p-4 space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">Tipo de establecimiento</p>
                <p className="text-[var(--text-secondary)]">
                  {locationType ? LOCATION_TYPE_LABELS[locationType] : 'No seleccionado'}
                </p>
              </div>
              <div className="rounded-lg bg-[var(--bg-tertiary)] p-4 space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">Tipos de residuos</p>
                <div className="flex flex-wrap gap-2">
                  {wasteTypes.map((cat) => (
                    <span key={cat} className="rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300">
                      {WASTE_CATEGORY_LABELS[cat]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-[var(--bg-tertiary)] p-4 space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">Medidas de prevencion ({measures.length})</p>
                <ul className="list-disc pl-5 text-[var(--text-secondary)] space-y-1">
                  {measures.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-[var(--bg-tertiary)] p-4 space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">Responsable</p>
                <p className="text-[var(--text-secondary)]">{responsibleName} - {responsibleRole}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="focus-ring flex-1 rounded-lg border border-primary-600 py-3 font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Guardando...' : 'Guardar borrador'}
              </button>
              <button
                onClick={handleGeneratePDF}
                disabled={generating}
                className="focus-ring flex-1 rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {generating ? 'Generando...' : 'Descargar PDF'}
              </button>
            </div>
          </div>
        )}

        {/* Navigation back */}
        {currentIdx > 0 && step !== 'review' && (
          <button
            onClick={() => setStep(steps[currentIdx - 1])}
            className="mt-4 w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            Volver al paso anterior
          </button>
        )}
        {step === 'review' && (
          <button
            onClick={() => setStep('responsible')}
            className="mt-4 w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            Volver a editar
          </button>
        )}
      </div>
    </div>
  );
}
