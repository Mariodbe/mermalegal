import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LocationsManager } from '@/components/locations-manager';
import type { Location, UserProfile } from '@/lib/types';

export default async function LocationsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
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

  return (
    <LocationsManager
      initialLocations={(locations ?? []) as Location[]}
      profile={profile as UserProfile}
    />
  );
}
