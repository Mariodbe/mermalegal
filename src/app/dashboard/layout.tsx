import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard-shell';
import type { UserProfile, Location } from '@/lib/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch locations
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  // Count waste entries from the last 7 days for notification badge
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentWasteCount } = await supabase
    .from('waste_entries')
    .select('*', { count: 'exact', head: true })
    .in(
      'location_id',
      (locations ?? []).map((l) => l.id)
    )
    .gte('recorded_at', sevenDaysAgo.toISOString());

  // Get total kg this week
  const { data: weekWaste } = await supabase
    .from('waste_entries')
    .select('weight_kg, destination')
    .in(
      'location_id',
      (locations ?? []).map((l) => l.id)
    )
    .gte('recorded_at', sevenDaysAgo.toISOString());

  const totalWeekKg = (weekWaste ?? []).reduce((sum, w) => sum + w.weight_kg, 0);
  const donatedKg = (weekWaste ?? []).filter((w) => w.destination === 'donation').reduce((sum, w) => sum + w.weight_kg, 0);

  return (
    <DashboardShell
      profile={profile as UserProfile}
      locations={(locations ?? []) as Location[]}
      recentWasteCount={recentWasteCount ?? 0}
      totalWeekKg={totalWeekKg}
      donatedKg={donatedKg}
    >
      {children}
    </DashboardShell>
  );
}
