import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const FREE_MONTHLY_LIMIT = 10;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar plan del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const isPaid = profile?.plan !== 'free';

    // Validación server-side del límite del plan gratuito
    if (!isPaid) {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      // Obtener los locales del usuario para filtrar entradas
      const { data: locations } = await supabase
        .from('locations')
        .select('id')
        .eq('user_id', user.id);

      const locationIds = (locations ?? []).map((l) => l.id);

      const { count } = await supabase
        .from('waste_entries')
        .select('id', { count: 'exact', head: true })
        .in('location_id', locationIds)
        .gte('recorded_at', monthStart.toISOString());

      if ((count ?? 0) >= FREE_MONTHLY_LIMIT) {
        return NextResponse.json(
          { error: `Límite del plan gratuito alcanzado (${FREE_MONTHLY_LIMIT} registros/mes). Actualiza tu plan para continuar.` },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { location_id, category, weight_kg, destination, notes } = body;

    if (!location_id || !category || !weight_kg || !destination) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Verificar que el local pertenece al usuario
    const { data: location } = await supabase
      .from('locations')
      .select('id')
      .eq('id', location_id)
      .eq('user_id', user.id)
      .single();

    if (!location) {
      return NextResponse.json({ error: 'Local no encontrado' }, { status: 403 });
    }

    const { error: insertError } = await supabase.from('waste_entries').insert({
      location_id,
      category,
      weight_kg,
      destination,
      notes: notes?.trim() || null,
      recorded_by: user.email ?? 'unknown',
      recorded_at: new Date().toISOString(),
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('waste-entries POST error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
