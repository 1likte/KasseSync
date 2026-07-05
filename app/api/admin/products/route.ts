import { NextResponse } from 'next/server';
import { createAdminClient, isConfigured } from '@/lib/supabase-server';

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ success: false, error: 'Supabase yapılandırması eksik' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { restaurantId, categoryId, name, price, description, imageUrl, isShowcase } = body;

    if (!restaurantId || !categoryId || !name || price === undefined) {
      return NextResponse.json({ success: false, error: 'Eksik alanlar var' }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data, error } = await admin
      .from('products')
      .insert({
        restaurant_id: restaurantId,
        category_id: categoryId,
        name: name.trim(),
        price: Number(price),
        description: description?.trim() || null,
        image_url: imageUrl?.trim() || null,
        is_available: true,
        is_showcase: !!isShowcase,
      })
      .select('id, category_id, name, price, is_available, description, image_url, is_showcase')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      product: { ...data, price: Number(data.price) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Ürün eklenemedi' },
      { status: 500 }
    );
  }
}
