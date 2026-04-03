import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardContent } from '@/components/dashboard-content';
import type { WasteEntry, Location, UserProfile } from '@/lib/types';

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

  const locationIds = allLocations.map((l) => l.id);

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

  const weekEntries = (weekWaste ?? []) as WasteEntry[];

  return (
    <DashboardContent
      profile={currentProfile}
      locations={allLocations}
      weekEntries={weekEntries}
    />
  );
}
