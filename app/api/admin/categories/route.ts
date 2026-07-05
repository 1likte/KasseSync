import { NextResponse } from 'next/server';
import { createAdminClient, isConfigured } from '@/lib/supabase-server';

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ success: false, error: 'Supabase yapılandırması eksik' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { restaurantId, name, sortOrder } = body;

    if (!restaurantId || !name) {
      return NextResponse.json({ success: false, error: 'Kategori adı gerekli' }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data, error } = await admin
      .from('categories')
      .insert({
        restaurant_id: restaurantId,
        name: name.trim(),
        sort_order: sortOrder ?? 0,
      })
      .select('id, name, sort_order')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, category: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Kategori eklenemedi' },
      { status: 500 }
    );
  }
}
