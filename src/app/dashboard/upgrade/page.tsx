'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/lib/types';

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: '39',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '',
    features: [
      'Hasta 5 locales',
      'Registro de mermas ilimitado',
      'Dashboard completo',
      'Plan de prevencion',
      'Exportar CSV/PDF',
      'Alertas por email',
      'Soporte prioritario',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '149',
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID ?? '',
    features: [
      'Locales ilimitados',
      'Todo lo del plan Pro',
      'API de integracion',
      'Soporte dedicado',
      'SLA 99.9%',
      'Onboarding personalizado',
    ],
  },
];

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data as UserProfile);
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
    setLoadingPlan(planId);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { url, error } = await res.json();
      if (error) {
        alert(error);
        setLoadingPlan(null);
        return;
      }

      window.location.href = url;
    } catch {
      alert('Error al conectar con Stripe');
      setLoadingPlan(null);
    }
  }

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
                backgroundColor: ['#059669', '#f59e0b', '#3b82f6', '#ef4444', '#a855f7'][
                  Math.floor(Math.random() * 5)
                ],
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
            Bienvenido al plan {profile?.plan === 'pro' ? 'Pro' : 'Enterprise'}!
          </h2>
          <p className="text-primary-600 dark:text-primary-400">
            Tu cuenta ha sido actualizada correctamente. Ya puedes disfrutar de todas las funciones.
          </p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Mejorar plan</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Desbloquea mas funciones para tu negocio
        </p>
      </div>

      {/* Current plan */}
      {profile && (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 flex items-center gap-3">
          <span className="rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-sm font-semibold text-primary-700 dark:text-primary-300">
            Tu plan actual: {profile.plan === 'free' ? 'Gratis' : profile.plan === 'pro' ? 'Pro' : 'Enterprise'}
          </span>
        </div>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = profile?.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl border-2 p-8 ${
                plan.id === 'pro'
                  ? 'border-primary-600 shadow-lg'
                  : 'border-[var(--border-color)]'
              } bg-[var(--bg-card)]`}
            >
              {plan.id === 'pro' && (
                <span className="inline-block rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white mb-4">
                  RECOMENDADO
                </span>
              )}
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[var(--text-primary)]">{plan.price}&euro;</span>
                <span className="text-[var(--text-muted)]">/mes</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isCurrent && handleCheckout(plan.priceId, plan.id)}
                disabled={isCurrent || loadingPlan === plan.id}
                className={`focus-ring mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
                }`}
              >
                {isCurrent
                  ? 'Plan actual'
                  : loadingPlan === plan.id
                  ? 'Redirigiendo a Stripe...'
                  : `Contratar ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
