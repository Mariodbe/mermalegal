import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
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

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  const allLocations = (locations ?? []) as Location[];
  const currentProfile = profile as UserProfile;

  // Waste today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const locationIds = allLocations.map((l) => l.id);

  const { data: todayWaste } = locationIds.length
    ? await supabase
        .from('waste_entries')
        .select('*')
        .in('location_id', locationIds)
        .gte('recorded_at', todayStart.toISOString())
        .order('recorded_at', { ascending: false })
    : { data: [] };

  // Waste this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const { data: weekWaste } = locationIds.length
    ? await supabase
        .from('waste_entries')
        .select('*')
        .in('location_id', locationIds)
        .gte('recorded_at', weekStart.toISOString())
        .order('recorded_at', { ascending: false })
    : { data: [] };

  const todayEntries = (todayWaste ?? []) as WasteEntry[];
  const weekEntries = (weekWaste ?? []) as WasteEntry[];

  const totalToday = todayEntries.reduce((s, e) => s + e.weight_kg, 0);
  const totalWeek = weekEntries.reduce((s, e) => s + e.weight_kg, 0);
  const donatedWeek = weekEntries
    .filter((e) => e.destination === 'donation')
    .reduce((s, e) => s + e.weight_kg, 0);
  const pctDonated = totalWeek > 0 ? Math.round((donatedWeek / totalWeek) * 100) : 0;

  // Main destination this week
  const destCounts: Record<string, number> = {};
  weekEntries.forEach((e) => {
    destCounts[e.destination] = (destCounts[e.destination] ?? 0) + e.weight_kg;
  });
  const mainDest = Object.entries(destCounts).sort((a, b) => b[1] - a[1])[0];
  const mainDestLabel = mainDest
    ? DESTINATION_LABELS[mainDest[0] as WasteDestination]
    : 'Sin datos';

  // Free plan progress
  const locationLimit = PLAN_LOCATION_LIMITS[currentProfile.plan];
  const locationCount = allLocations.length;

  // Chart data: daily waste for last 7 days
  const chartData: { date: string; kg: number; donation: number; compost: number; animal_feed: number; destruction: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const dayEntries = weekEntries.filter(
      (e) => e.recorded_at.split('T')[0] === dateStr
    );
    chartData.push({
      date: dayLabel,
      kg: dayEntries.reduce((s, e) => s + e.weight_kg, 0),
      donation: dayEntries.filter((e) => e.destination === 'donation').reduce((s, e) => s + e.weight_kg, 0),
      compost: dayEntries.filter((e) => e.destination === 'compost').reduce((s, e) => s + e.weight_kg, 0),
      animal_feed: dayEntries.filter((e) => e.destination === 'animal_feed').reduce((s, e) => s + e.weight_kg, 0),
      destruction: dayEntries.filter((e) => e.destination === 'destruction').reduce((s, e) => s + e.weight_kg, 0),
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Hola, {currentProfile.company_name ?? 'bienvenido'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Resumen de mermas de tus establecimientos
          </p>
        </div>
        <WasteFormTrigger locations={allLocations} />
      </div>

      {/* Free plan progress bar */}
      {currentProfile.plan === 'free' && (
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
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Merma ultimos 7 dias</h2>
        <WasteChart data={chartData} />
      </div>

      {/* Recent entries */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Registros recientes</h2>
        <WasteTable entries={weekEntries.slice(0, 20)} />
      </div>
    </div>
  );
}
