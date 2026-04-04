import { redirect } from 'next/navigation';
import { LocationsManager } from '@/components/locations-manager';
import { getUser, getProfile, getLocations } from '@/lib/queries';

export default async function LocationsPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  // Ambas ya están en caché del layout — coste cero
  const [profile, locations] = await Promise.all([
    getProfile(),
    getLocations(),
  ]);

  return (
    <LocationsManager
      initialLocations={locations}
      profile={profile!}
    />
  );
}
