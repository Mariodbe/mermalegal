'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/lib/types';
import { PLAN_TIER_LABELS } from '@/lib/types';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [openingCancel, setOpeningCancel] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data as UserProfile);
        setCompanyName(data.company_name ?? '');
      }
    }
    load();
  }, []);

  async function handleSaveProfile() {
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ company_name: companyName.trim() })
      .eq('id', profile.id);

    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleOpenPortal() {
    setOpeningPortal(true);
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const body = await res.json();
    if (body.url) {
      window.location.href = body.url;
    } else {
      setOpeningPortal(false);
    }
  }

  async function handleCancelSubscription() {
    setOpeningCancel(true);
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const body = await res.json();
    if (body.url) {
      window.location.href = body.url;
    } else {
      setOpeningCancel(false);
    }
  }

  async function handleChangePassword() {
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('La contrasena debe tener al menos 6 caracteres');
      return;
    }
    setChangingPassword(true);
    setPasswordError(null);
    setPasswordSaved(false);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
      setChangingPassword(false);
      return;
    }

    setChangingPassword(false);
    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSaved(false), 3000);
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Configuracion</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Gestiona tu perfil y cuenta</p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Perfil</h2>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Correo electronico
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="touch-input w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-3 text-[var(--text-muted)] cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Plan actual
          </label>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-sm font-semibold text-primary-700 dark:text-primary-300">
              {PLAN_TIER_LABELS[profile.plan]}
            </span>
            {profile.plan === 'free' && (
              <a
                href="/dashboard/upgrade"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Mejorar plan
              </a>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Nombre de la empresa
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="focus-ring rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && (
            <span className="text-sm text-primary-600 font-medium animate-fade-in">
              Guardado correctamente
            </span>
          )}
        </div>
      </div>

      {/* Subscription */}
      {profile.plan !== 'free' && (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Suscripción</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Gestiona tu plan, método de pago y cancela cuando quieras desde el portal de facturación.
          </p>
          <button
            onClick={handleOpenPortal}
            disabled={openingPortal}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            {openingPortal ? 'Abriendo...' : 'Gestionar suscripción'}
          </button>
        </div>
      )}

      {/* Cancel subscription */}
      {profile.plan !== 'free' && (
        <div className="rounded-2xl border border-red-800/40 bg-red-950/10 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-red-400">Cancelar suscripción</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Al cancelar perderás el acceso a las funciones de pago al final del período de facturación actual. Tus datos se conservarán pero pasarás al plan Gratis.
            </p>
          </div>

          {!cancelConfirm ? (
            <button
              onClick={() => setCancelConfirm(true)}
              className="focus-ring rounded-lg border border-red-700 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
            >
              Cancelar suscripción
            </button>
          ) : (
            <div className="rounded-xl border border-red-800/60 bg-red-950/30 p-4 space-y-3">
              <p className="text-sm font-semibold text-red-300">
                ¿Seguro que quieres cancelar?
              </p>
              <p className="text-xs text-red-400/80">
                Serás redirigido al portal de Stripe donde podrás confirmar la cancelación. El acceso Pro se mantiene hasta el final del ciclo actual.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={openingCancel}
                  className="focus-ring rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {openingCancel ? 'Redirigiendo...' : 'Sí, cancelar'}
                </button>
                <button
                  onClick={() => setCancelConfirm(false)}
                  disabled={openingCancel}
                  className="focus-ring rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Change password */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cambiar contrasena</h2>

        {passwordError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
            {passwordError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            Nueva contrasena
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
            placeholder="Minimo 6 caracteres"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleChangePassword}
            disabled={changingPassword || !newPassword}
            className="focus-ring rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {changingPassword ? 'Cambiando...' : 'Cambiar contrasena'}
          </button>
          {passwordSaved && (
            <span className="text-sm text-primary-600 font-medium animate-fade-in">
              Contrasena actualizada
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
