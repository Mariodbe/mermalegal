'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/lib/types';
import { LOCATION_TYPE_LABELS, type LocationType } from '@/lib/types';

// ─── ROI calculation ──────────────────────────────────────────────────────────

interface BusinessProfile {
  locationType: LocationType;
  numLocales: number;
}

// Benchmarks conservadores basados en datos sectoriales reales (€/año por local)
const SECTOR_WASTE_COST: Record<string, [number, number]> = {
  restaurant: [1200, 4000],
  hotel:      [4000, 12000],
  catering:   [2000, 7000],
  bar:        [400,  1200],
};

function calcROI(profile: BusinessProfile) {
  const [baseLow, baseHigh] = SECTOR_WASTE_COST[profile.locationType] ?? [1200, 4000];
  const annualWasteLow  = baseLow  * profile.numLocales;
  const annualWasteHigh = baseHigh * profile.numLocales;
  const annualSavingsLow  = Math.round(annualWasteLow  * 0.20);
  const annualSavingsHigh = Math.round(annualWasteHigh * 0.30);
  const monthlySavingsLow  = Math.round(annualSavingsLow  / 12);
  const monthlySavingsHigh = Math.round(annualSavingsHigh / 12);
  const avgMonthlySavings = (monthlySavingsLow + monthlySavingsHigh) / 2;
  const roiMonths = avgMonthlySavings > 0 ? Math.round((39 / avgMonthlySavings) * 10) / 10 : 3;

  return {
    annualWasteLow,
    annualWasteHigh,
    annualSavingsLow,
    annualSavingsHigh,
    monthlySavingsLow,
    monthlySavingsHigh,
    roiMonths,
  };
}

function fmt(n: number) {
  return n.toLocaleString('es-ES');
}

// ─── Plan data (static) ───────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'pro',
    dbPlan: 'pro' as const,
    name: 'Pro',
    price: 39,
    badge: 'MÁS RENTABLE',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_CORE_PRICE_ID ?? '',
    cta: 'Empezar con Pro',
  },
  {
    id: 'business',
    dbPlan: 'enterprise' as const,
    name: 'Business',
    price: 99,
    badge: null,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID ?? '',
    cta: 'Empezar con Business',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  const [profile,     setProfile]     = useState<UserProfile | null>(null);
  const [bizProfile,  setBizProfile]  = useState<BusinessProfile>({ locationType: 'restaurant', numLocales: 1 });
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data as UserProfile);

      const { data: locs } = await supabase
        .from('locations')
        .select('id, type')
        .eq('user_id', user.id);

      if (locs && locs.length > 0) {
        setBizProfile({
          locationType: (locs[0].type as LocationType) ?? 'restaurant',
          numLocales: locs.length,
        });
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (success === 'true') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [success]);

  async function handleCheckout(priceId: string, planId: string) {
    if (!priceId) return;
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const { url, error } = await res.json();
      if (error) { alert(error); setLoadingPlan(null); return; }
      window.location.href = url;
    } catch {
      alert('Error al conectar con Stripe');
      setLoadingPlan(null);
    }
  }

  const roi = calcROI(bizProfile);
  const locLabel = LOCATION_TYPE_LABELS[bizProfile.locationType] ?? 'tu negocio';

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[200]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#059669','#f59e0b','#3b82f6','#ef4444','#a855f7'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {success === 'true' && (
        <div className="rounded-2xl bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 p-6 text-center">
          <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-2">
            ¡Bienvenido al plan {profile?.plan === 'pro' ? 'Pro' : 'Business'}!
          </h2>
          <p className="text-primary-600 dark:text-primary-400">
            Tu cuenta ha sido actualizada. Ya puedes empezar a recuperar dinero.
          </p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Elige tu plan</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          MermaLegal puede reducir entre un 20 y un 30% el desperdicio alimentario de tu negocio.
        </p>
      </div>

      {/* Shock box */}
      <div className="rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
              Estimación de coste de desperdicio para {bizProfile.numLocales > 1 ? `${bizProfile.numLocales} locales` : 'tu tipo de negocio'} ({locLabel})
            </p>
            <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
              Entre <strong>{fmt(roi.annualWasteLow)}–{fmt(roi.annualWasteHigh)} €/año</strong>{' '}
              en pérdidas por desperdicio alimentario sin control activo.
            </p>
            <p className="text-amber-600 dark:text-amber-500 text-xs mt-1">
              Basado en benchmarks sectoriales (hostelería española) · Tus datos reales pueden variar.
            </p>
          </div>
        </div>
      </div>

      {profile && profile.plan !== 'free' && (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4">
          <span className="rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-sm font-semibold text-primary-700 dark:text-primary-300">
            Plan actual: {profile.plan === 'pro' ? 'Pro' : 'Business'}
          </span>
        </div>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* FREE (always shown for context) */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex flex-col">
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Para descubrir tus pérdidas</div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Gratis</h3>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-[var(--text-primary)]">0€</span>
            <span className="text-[var(--text-muted)] text-sm">/mes</span>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">Sin tarjeta. Sin compromiso.</p>

          <ul className="mt-5 space-y-2 text-sm flex-1">
            {[
              { text: '1 local', ok: true },
              { text: 'Diagnóstico de desperdicio con estimación (€)', ok: true },
              { text: 'Plan de prevención personalizado', ok: true },
              { text: `Descubre cuánto pierde tu ${locLabel.toLowerCase()}`, ok: true },
              { text: 'Registro y seguimiento continuo', ok: false },
              { text: 'Alertas de desviación en tiempo real', ok: false },
            ].map(({ text, ok }) => (
              <li key={text} className={`flex items-start gap-2 ${ok ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                {ok
                  ? <svg className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  : <svg className="h-4 w-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                }
                <span className={ok ? '' : 'line-through opacity-60'}>{text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[var(--text-muted)] italic">
            👉 Ideal para entender el problema. El control real empieza con Pro.
          </p>
          <div className="mt-4 w-full rounded-lg border border-[var(--border-color)] py-3 text-center text-sm font-semibold text-[var(--text-muted)] cursor-not-allowed">
            {profile?.plan === 'free' ? 'Tu plan actual' : 'Plan incluido'}
          </div>
        </div>

        {/* PAID PLANS */}
        <div className="flex flex-col gap-5">
          {PLANS.map((plan) => {
            const isCurrent = profile?.plan === plan.dbPlan;
            const isCore = plan.id === 'pro';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  isCore
                    ? 'border-2 border-primary-600 shadow-lg bg-[var(--bg-card)]'
                    : 'border border-[var(--border-color)] bg-[var(--bg-card)]'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-6 rounded-full bg-primary-600 px-4 py-1 text-xs font-bold text-white">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                      {isCore ? 'Para recuperar dinero y cumplir la ley' : 'Para cadenas y operaciones avanzadas'}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{plan.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-bold text-[var(--text-primary)]">{plan.price}€</span>
                    <span className="text-[var(--text-muted)] text-sm">/mes</span>
                  </div>
                </div>

                {isCore && (
                  <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5">
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      💰 Ahorro estimado para tu negocio: {fmt(roi.monthlySavingsLow)}–{fmt(roi.monthlySavingsHigh)} €/mes
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                      El plan se paga solo en menos de {roi.roiMonths < 1 ? 'días' : `${roi.roiMonths} meses`} · ROI estimado: {Math.round(roi.annualSavingsLow / (plan.price * 12))}x–{Math.round(roi.annualSavingsHigh / (plan.price * 12))}x
                    </p>
                  </div>
                )}

                <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                  {isCore ? [
                    'Registro diario de mermas — sin cálculos manuales',
                    'KPIs automáticos: detecta dónde pierdes dinero semana a semana',
                    'Informes mensuales listos para inspección',
                    'Alertas para actuar antes de que se produzca la pérdida',
                    'Hasta 5 locales · Soporte prioritario',
                  ] : [
                    'Todo lo del plan Pro',
                    'Locales ilimitados — escala sin coste adicional',
                    'Benchmarking vs. restaurantes similares del sector',
                    'Alertas automáticas de desviación por local',
                    'API, integraciones y soporte dedicado',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-xs text-[var(--text-muted)] italic">
                  {isCore
                    ? `👉 El plan que convierte el diagnóstico en ${fmt(roi.annualSavingsLow)}–${fmt(roi.annualSavingsHigh)} €/año recuperados.`
                    : '👉 Para grupos que necesitan control total a escala.'}
                </p>

                <button
                  onClick={() => !isCurrent && plan.priceId && handleCheckout(plan.priceId, plan.id)}
                  disabled={isCurrent || loadingPlan === plan.id || !plan.priceId}
                  className={`focus-ring mt-4 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
                    isCurrent
                      ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                      : isCore
                      ? 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
                      : 'border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 disabled:opacity-50'
                  }`}
                >
                  {isCurrent ? 'Plan actual' : loadingPlan === plan.id ? 'Redirigiendo...' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Garantía */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-center space-y-1">
        <p className="text-sm text-[var(--text-secondary)]">
          La mayoría de restaurantes recuperan entre{' '}
          <strong>3 y 10 veces el coste del plan</strong> en los primeros 3 meses.
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          Sin permanencia · Cancela cuando quieras · IVA no incluido
        </p>
      </div>
    </div>
  );
}
