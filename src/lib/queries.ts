import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { UserProfile, Location, WasteEntry } from '@/lib/types';

// cache() de React deduplica llamadas idénticas dentro del mismo render tree.
// Un solo createClient() por request → un solo await cookies().

const getSupabase = cache(async () => createClient());

export const getUser = cache(async () => {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
});

export const getProfile = cache(async () => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return (data as UserProfile) ?? null;
});

export const getLocations = cache(async () => {
  const user = await getUser();
  if (!user) return [] as Location[];
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', user.id)
    .order('name');
  return (data ?? []) as Location[];
});

export const getWasteEntries = cache(async (days: number) => {
  const locations = await getLocations();
  if (!locations.length) return [] as WasteEntry[];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('waste_entries')
    .select('*')
    .in('location_id', locations.map((l) => l.id))
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: false });
  return (data ?? []) as WasteEntry[];
});

export const getMonthlyEntryCount = cache(async () => {
  const locations = await getLocations();
  if (!locations.length) return 0;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const supabase = await getSupabase();
  const { count } = await supabase
    .from('waste_entries')
    .select('id', { count: 'exact', head: true })
    .in('location_id', locations.map((l) => l.id))
    .gte('recorded_at', monthStart.toISOString());
  return count ?? 0;
});

export const getLatestPlan = cache(async () => {
  const locations = await getLocations();
  if (!locations.length) return null;
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('prevention_plans')
    .select('*')
    .eq('location_id', locations[0].id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data ?? null;
});
