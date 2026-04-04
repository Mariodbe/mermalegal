'use client';

import { useState, useMemo } from 'react';
import { WasteTable } from '@/components/waste-table';
import { WasteChart } from '@/components/waste-chart';
import { WasteFormTrigger } from '@/components/waste-form';
import {
  formatKg,
  DESTINATION_LABELS,
  PLAN_LOCATION_LIMITS,
  type WasteEntry,
  type Location,
  type UserProfile,
  type WasteDestination,
} from '@/lib/types';

const FREE_MONTHLY_ENTRY_LIMIT = 10;

interface DashboardContentProps {
  profile: UserProfile;
  locations: Location[];
  weekEntries: WasteEntry[];
  monthlyEntryCount?: number;
}

export function DashboardContent({ profile, locations, weekEntries, monthlyEntryCount = 0 }: DashboardContentProps) {
  const isFree = profile.plan === 'free';
  const monthlyLimitReached = isFree && monthlyEntryCount >= FREE_MONTHLY_ENTRY_LIMIT;
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');

  // Filter entries by selected location
  const filteredEntries = useMemo(() => {
    if (selectedLocationId === 'all') return weekEntries;
    return weekEntries.filter((e) => e.location_id === selectedLocationId);
  }, [weekEntries, selectedLocationId]);

  // Today entries
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntries = filteredEntries.filter((e) => e.recorded_at.split('T')[0] === todayStr);

  const totalToday = todayEntries.reduce((s, e) => s + e.weight_kg, 0);
  const totalWeek = filteredEntries.reduce((s, e) => s + e.weight_kg, 0);
  const donatedWeek = filteredEntries
    .filter((e) => e.destination === 'donation')
    .reduce((s, e) => s + e.weight_kg, 0);
  const pctDonated = totalWeek > 0 ? Math.round((donatedWeek / totalWeek) * 100) : 0;

  // Main destination
  const destCounts: Record<string, number> = {};
  filteredEntries.forEach((e) => {
    destCounts[e.destination] = (destCounts[e.destination] ?? 0) + e.weight_kg;
  });
  const mainDest = Object.entries(destCounts).sort((a, b) => b[1] - a[1])[0];
  const mainDestLabel = mainDest
    ? DESTINATION_LABELS[mainDest[0] as WasteDestination]
    : 'Sin datos';

  // Chart data
  const chartData = useMemo(() => {
    const result: { date: string; kg: number; donation: number; compost: number; animal_feed: number; destruction: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayEntries = filteredEntries.filter(
        (e) => e.recorded_at.split('T')[0] === dateStr
      );
      result.push({
        date: dayLabel,
        kg: dayEntries.reduce((s, e) => s + e.weight_kg, 0),
        donation: dayEntries.filter((e) => e.destination === 'donation').reduce((s, e) => s + e.weight_kg, 0),
        compost: dayEntries.filter((e) => e.destination === 'compost').reduce((s, e) => s + e.weight_kg, 0),
        animal_feed: dayEntries.filter((e) => e.destination === 'animal_feed').reduce((s, e) => s + e.weight_kg, 0),
        destruction: dayEntries.filter((e) => e.destination === 'destruction').reduce((s, e) => s + e.weight_kg, 0),
      });
    }
    return result;
  }, [filteredEntries]);

  const locationLimit = PLAN_LOCATION_LIMITS[profile.plan];
  const locationCount = locations.length;
  const selectedLocationName = selectedLocationId === 'all'
    ? 'Todos los locales'
    : locations.find((l) => l.id === selectedLocationId)?.name ?? '';

  return (
    <div className="space-y-6">
      {/* Welcome + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Hola, {profile.company_name ?? 'bienvenido'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Resumen de mermas de tus establecimientos
          </p>
        </div>
        {monthlyLimitReached ? (
          <a
            href="/dashboard/upgrade"
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-amber-600 transition-all"
          >
            🔒 Límite alcanzado — Mejorar plan
          </a>
        ) : (
          <WasteFormTrigger locations={locations} />
        )}
      </div>

      {/* Free plan limits banner */}
      {isFree && (
        <div className={`rounded-xl border p-4 ${monthlyLimitReached ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700' : 'bg-[var(--bg-card)] border-[var(--border-color)]'}`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Plan Gratis — {locationCount}/{locationLimit} local
                </span>
                <span className={`text-sm font-medium ${monthlyLimitReached ? 'text-amber-700 dark:text-amber-400' : 'text-[var(--text-secondary)]'}`}>
                  {monthlyEntryCount}/{FREE_MONTHLY_ENTRY_LIMIT} registros este mes
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Solo últimos 7 días · Sin gráficos
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--bg-tertiary)]">
                <div
                  className={`h-1.5 rounded-full transition-all ${monthlyLimitReached ? 'bg-amber-500' : 'bg-primary-600'}`}
                  style={{ width: `${Math.min((monthlyEntryCount / FREE_MONTHLY_ENTRY_LIMIT) * 100, 100)}%` }}
                />
              </div>
            </div>
            <a
              href="/dashboard/upgrade"
              className="shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 transition-colors whitespace-nowrap"
            >
              {monthlyLimitReached ? '⚠ Límite alcanzado — Desbloquear' : 'Ver planes →'}
            </a>
          </div>
          {monthlyLimitReached && (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
              Has alcanzado el límite de {FREE_MONTHLY_ENTRY_LIMIT} registros mensuales del plan gratuito. Actualiza a Core para registros ilimitados.
            </p>
          )}
        </div>
      )}

      {/* Location filter */}
      {locations.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedLocationId('all')}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedLocationId === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-primary-400'
            }`}
          >
            Todos
          </button>
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedLocationId === loc.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-primary-400'
              }`}
            >
              🏪 {loc.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Merma hoy</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{formatKg(totalToday)}</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Merma semana</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{formatKg(totalWeek)}</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">% Donado</p>
          <p className="mt-2 text-2xl font-bold text-primary-600">{pctDonated}%</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Destino principal</p>
          <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">{mainDestLabel}</p>
        </div>
      </div>

      {/* Chart — locked for free */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Merma últimos {isFree ? '7' : '30'} días
          </h2>
          {locations.length > 1 && selectedLocationId !== 'all' && (
            <span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-950 px-3 py-1 rounded-full">
              🏪 {selectedLocationName}
            </span>
          )}
        </div>
        {isFree ? (
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none opacity-40">
              <WasteChart data={chartData} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--bg-card)]/60 rounded-lg">
              <span className="text-3xl">🔒</span>
              <p className="text-sm font-semibold text-[var(--text-primary)] text-center">
                Gráficos disponibles en plan Pro
              </p>
              <p className="text-xs text-[var(--text-muted)] text-center max-w-xs">
                Visualiza tendencias de 30 días, detecta patrones y actúa antes de que se produzcan las pérdidas.
              </p>
              <a
                href="/dashboard/upgrade"
                className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-bold text-white hover:bg-primary-700 transition-colors"
              >
                Desbloquear gráficos →
              </a>
            </div>
          </div>
        ) : (
          <WasteChart data={chartData} />
        )}
      </div>

      {/* Recent entries — limited to 5 for free */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Registros recientes
            {isFree && filteredEntries.length > 5 && (
              <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">(mostrando 5 de {filteredEntries.length})</span>
            )}
          </h2>
        </div>
        <WasteTable entries={isFree ? filteredEntries.slice(0, 5) : filteredEntries.slice(0, 50)} />
        {isFree && filteredEntries.length > 5 && (
          <a
            href="/dashboard/upgrade"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-primary-600 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
          >
            🔒 Ver historial completo — Plan Core
          </a>
        )}
      </div>
    </div>
  );
}
