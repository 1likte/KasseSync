import { NextResponse } from 'next/server';
import { createAdminClient, isConfigured } from '@/lib/supabase-server';

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ success: false, needsSetup: true }, { status: 503 });
  }

  try {
    const admin = createAdminClient();

    const { data: restaurants, error: restaurantError } = await admin
      .from('restaurants')
      .select('id, name')
      .limit(1);

    if (restaurantError) throw new Error(restaurantError.message);

    const restaurant = restaurants?.[0];
    if (!restaurant) {
      return NextResponse.json({ success: true, needsSeed: true, restaurant: null, categories: [], products: [] });
    }

    const [categoriesRes, productsRes] = await Promise.all([
      admin
        .from('categories')
        .select('id, name, sort_order')
        .eq('restaurant_id', restaurant.id)
        .order('sort_order'),
      admin
        .from('products')
        .select('id, category_id, name, price, is_available, image_url')
        .eq('restaurant_id', restaurant.id)
        .eq('is_available', true)
        .order('name'),
    ]);

    if (categoriesRes.error) throw new Error(categoriesRes.error.message);
    if (productsRes.error) throw new Error(productsRes.error.message);

    return NextResponse.json({
      success: true,
      restaurant,
      categories: categoriesRes.data ?? [],
      products: (productsRes.data ?? []).map((p) => ({ ...p, price: Number(p.price) })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Menü yüklenemedi' },
      { status: 500 }
    );
  }
}
