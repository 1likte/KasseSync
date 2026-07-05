import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, isConfigured } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ success: false, error: 'Supabase yapılandırması eksik' }, { status: 503 });
  }

  try {
    const admin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const slug = searchParams.get('slug');

    let restaurant = null;

    if (restaurantId) {
      const { data, error } = await admin
        .from('restaurants')
        .select('id, name')
        .eq('id', restaurantId)
        .maybeSingle();
      if (!error && data) {
        restaurant = data;
      }
    }

    if (!restaurant && slug) {
      const { data: allRestaurants, error } = await admin
        .from('restaurants')
        .select('id, name');
      
      if (!error && allRestaurants) {
        restaurant = allRestaurants.find(r => r.name.toLowerCase().replace(/[^a-z0-9]+/g, '') === slug) || null;
      }
    }

    if (!restaurant) {
      const { data: restaurants, error: restaurantError } = await admin
        .from('restaurants')
        .select('id, name')
        .limit(1);

      if (restaurantError) throw new Error(restaurantError.message);
      restaurant = restaurants?.[0];
    }

    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restoran bulunamadı' }, { status: 404 });
    }

    const [categoriesRes, productsRes] = await Promise.all([
      admin
        .from('categories')
        .select('id, name, sort_order')
        .eq('restaurant_id', restaurant.id)
        .order('sort_order'),
      admin
        .from('products')
        .select('id, category_id, name, price, is_available, description, image_url')
        .eq('restaurant_id', restaurant.id)
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
      { success: false, error: error instanceof Error ? error.message : 'Veriler yüklenemedi' },
      { status: 500 }
    );
  }
}
