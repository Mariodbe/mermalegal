// ── Tipos principales de MermaLegal ──

export type WasteCategory = 'bakery' | 'protein' | 'dairy' | 'produce' | 'prepared' | 'other';

export type WasteDestination = 'donation' | 'compost' | 'animal_feed' | 'destruction';

export type LocationType = 'restaurant' | 'hotel' | 'catering' | 'bar';

export type PlanStatus = 'draft' | 'complete';

export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface WasteEntry {
  id: string;
  location_id: string;
  category: WasteCategory;
  weight_kg: number;
  destination: WasteDestination;
  notes: string | null;
  recorded_by: string;
  recorded_at: string;
}

export interface Location {
  id: string;
  user_id: string;
  name: string;
  address: string;
  type: LocationType;
}

export interface UserProfile {
  id: string;
  email: string;
  plan: PlanTier;
  company_name: string | null;
  stripe_customer_id: string | null;
}

export interface PreventionPlan {
  id: string;
  location_id: string;
  status: PlanStatus;
  company_name: string | null;
  responsible_name: string | null;
  responsible_role: string | null;
  waste_types: WasteCategory[];
  measures: string[];
  created_at: string;
}

// ── Constantes ──

export const FREE_LOCATION_LIMIT = 1;

export const WASTE_CATEGORY_LABELS: Record<WasteCategory, string> = {
  bakery: 'Panaderia',
  protein: 'Proteina',
  dairy: 'Lacteos',
  produce: 'Verdura',
  prepared: 'Preparados',
  other: 'Otros',
};

export const DESTINATION_LABELS: Record<WasteDestination, string> = {
  donation: 'Donacion',
  compost: 'Compost',
  animal_feed: 'Pienso animal',
  destruction: 'Destruccion',
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  restaurant: 'Restaurante',
  hotel: 'Hotel',
  catering: 'Catering',
  bar: 'Bar',
};

export const PLAN_TIER_LABELS: Record<PlanTier, string> = {
  free: 'Gratis',
  pro: 'Pro',
  enterprise: 'Business',
};

export const PLAN_LOCATION_LIMITS: Record<PlanTier, number> = {
  free: 1,
  pro: 5,
  enterprise: Infinity,
};

// ── Colores por categoria ──

const WASTE_COLORS: Record<WasteCategory, string> = {
  bakery: '#f59e0b',    // amber
  protein: '#ef4444',   // red
  dairy: '#3b82f6',     // blue
  produce: '#22c55e',   // green
  prepared: '#a855f7',  // purple
  other: '#6b7280',     // gray
};

const DESTINATION_COLORS: Record<WasteDestination, string> = {
  donation: '#059669',
  compost: '#65a30d',
  animal_feed: '#d97706',
  destruction: '#dc2626',
};

export function getWasteColor(category: WasteCategory): string {
  return WASTE_COLORS[category];
}

export function getDestinationColor(destination: WasteDestination): string {
  return DESTINATION_COLORS[destination];
}

export function formatKg(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}
