import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Search products by name (ILIKE equivalent in Supabase is .ilike())
    // Also fetch the restaurant details for that product
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_url,
        description,
        restaurant_id,
        restaurants (
          id,
          name,
          rating,
          is_featured
        )
      `)
      .ilike('name', `%${q}%`);

    if (error) {
      throw error;
    }

    // If we have actual products, return them formatted
    if (products && products.length > 0) {
      const formatted = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image_url || '🍔',
        restaurant: p.restaurants?.name || 'Bilinmeyen Restoran',
        restaurantId: p.restaurant_id,
        rating: p.restaurants?.rating || 5.0
      }));
      return NextResponse.json({ results: formatted });
    }

    // Fallback Mock Data for demo purposes if DB is empty
    return NextResponse.json({ results: [] });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
