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

interface DashboardContentProps {
  profile: UserProfile;
  locations: Location[];
  weekEntries: WasteEntry[];
}

export function DashboardContent({ profile, locations, weekEntries }: DashboardContentProps) {
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
        <WasteFormTrigger locations={locations} />
      </div>

      {/* Free plan progress bar */}
      {profile.plan === 'free' && (
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--text-secondary)]">
              Plan Gratis: {locationCount} de {locationLimit} local{locationLimit !== 1 ? 'es' : ''}
            </span>
            <a
              href="/dashboard/upgrade"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              Mejorar plan
            </a>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--bg-tertiary)]">
            <div
              className="h-2 rounded-full bg-primary-600 transition-all"
              style={{ width: `${Math.min((locationCount / locationLimit) * 100, 100)}%` }}
            />
          </div>
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

      {/* Chart */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Merma ultimos 7 dias</h2>
          {locations.length > 1 && selectedLocationId !== 'all' && (
            <span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-950 px-3 py-1 rounded-full">
              🏪 {selectedLocationName}
            </span>
          )}
        </div>
        <WasteChart data={chartData} />
      </div>

      {/* Recent entries */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Registros recientes</h2>
        <WasteTable entries={filteredEntries.slice(0, 20)} />
      </div>
    </div>
  );
}
