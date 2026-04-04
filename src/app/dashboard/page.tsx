import { redirect } from 'next/navigation';
import { DashboardContent } from '@/components/dashboard-content';
import { getUser, getProfile, getLocations, getWasteEntries, getMonthlyEntryCount } from '@/lib/queries';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  // cache() garantiza que estas llamadas NO re-fetchean — reusan lo del layout
  const [profile, locations] = await Promise.all([
    getProfile(),
    getLocations(),
  ]);

  const isPaid = profile?.plan !== 'free';

  // Solo las queries específicas de esta página, en paralelo
  const [weekEntries, monthlyEntryCount] = await Promise.all([
    getWasteEntries(isPaid ? 30 : 7),
    isPaid ? Promise.resolve(0) : getMonthlyEntryCount(),
  ]);

  return (
    <DashboardContent
      profile={profile!}
      locations={locations}
      weekEntries={weekEntries}
      monthlyEntryCount={monthlyEntryCount}
    />
  );
}
