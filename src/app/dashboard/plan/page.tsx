import { redirect } from 'next/navigation';
import { getUser, getLocations, getLatestPlan } from '@/lib/queries';
import PlanForm from '@/components/plan-form';
import type { LocationType } from '@/lib/types';

export default async function PlanPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  // getLocations y getLatestPlan — ya en caché si el layout los llamó antes
  const [locations, plan] = await Promise.all([
    getLocations(),
    getLatestPlan(),
  ]);

  const firstLocation = locations[0] ?? null;

  return (
    <PlanForm
      initialLocationId={firstLocation?.id ?? null}
      initialLocationType={(firstLocation?.type as LocationType) ?? null}
      initialPlanId={plan?.id ?? null}
    />
  );
}
