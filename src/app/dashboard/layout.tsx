import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { getUser, getProfile, getLocations } from '@/lib/queries';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  // Solo las dos queries que necesita el shell — en paralelo
  const [profile, locations] = await Promise.all([
    getProfile(),
    getLocations(),
  ]);

  return (
    <DashboardShell
      profile={profile!}
      locations={locations}
    >
      {children}
    </DashboardShell>
  );
}
