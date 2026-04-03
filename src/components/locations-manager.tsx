'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  type Location,
  type LocationType,
  type UserProfile,
  LOCATION_TYPE_LABELS,
  PLAN_LOCATION_LIMITS,
} from '@/lib/types';

export function LocationsManager({
  initialLocations,
  profile,
}: {
  initialLocations: Location[];
  profile: UserProfile;
}) {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<LocationType>('restaurant');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = PLAN_LOCATION_LIMITS[profile.plan];
  const canAdd = locations.length < limit;

  async function reloadLocations() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: locs } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', user.id)
      .order('name');
    setLocations((locs ?? []) as Location[]);
  }

  function startEdit(loc: Location) {
    setEditingId(loc.id);
    setName(loc.name);
    setAddress(loc.address);
    setType(loc.type);
    setShowForm(true);
  }

  function startCreate() {
    setEditingId(null);
    setName('');
    setAddress('');
    setType('restaurant');
    setShowForm(true);
  }

  async function handleSave() {
    if (!name.trim() || !address.trim()) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingId) {
      const { error: err } = await supabase
        .from('locations')
        .update({ name: name.trim(), address: address.trim(), type })
        .eq('id', editingId);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase
        .from('locations')
        .insert({ user_id: user.id, name: name.trim(), address: address.trim(), type });
      if (err) { setError(err.message); setSaving(false); return; }
    }

    setShowForm(false);
    setSaving(false);
    await reloadLocations();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Seguro que quieres eliminar este local? Se perderan todos los registros asociados.')) return;

    const supabase = createClient();
    await supabase.from('locations').delete().eq('id', id);
    await reloadLocations();
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Locales</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {locations.length} de {limit === Infinity ? 'ilimitados' : limit} local{limit !== 1 ? 'es' : ''}
          </p>
        </div>
        {canAdd ? (
          <button
            onClick={startCreate}
            className="focus-ring rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Anadir local
          </button>
        ) : (
          <a
            href="/dashboard/upgrade"
            className="rounded-lg bg-primary-50 dark:bg-primary-950 px-4 py-2 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
          >
            Mejorar plan para mas locales
          </a>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {editingId ? 'Editar local' : 'Nuevo local'}
          </h2>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
              placeholder="Restaurante Centro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Direccion</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="touch-input focus-ring w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)]"
              placeholder="Calle Mayor 1, Madrid"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(LOCATION_TYPE_LABELS) as [LocationType, string][]).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`focus-ring rounded-lg border-2 py-2 text-sm font-medium transition-all ${
                    type === t
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-primary-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="focus-ring flex-1 rounded-lg border border-[var(--border-color)] py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim() || !address.trim()}
              className="focus-ring flex-1 rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Locations list */}
      <div className="space-y-3">
        {locations.length === 0 ? (
          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-[var(--text-muted)] mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-sm text-[var(--text-muted)]">No tienes locales registrados</p>
            <button
              onClick={startCreate}
              className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              Anadir tu primer local
            </button>
          </div>
        ) : (
          locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 text-lg">
                  🏪
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{loc.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{loc.address}</p>
                  <span className="mt-1 inline-block rounded-full bg-[var(--bg-tertiary)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                    {LOCATION_TYPE_LABELS[loc.type]}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(loc)}
                  className="focus-ring rounded-lg p-2 text-[var(--text-muted)] hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                  aria-label="Editar"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="focus-ring rounded-lg p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  aria-label="Eliminar"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
