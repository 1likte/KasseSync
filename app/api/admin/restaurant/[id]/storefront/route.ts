import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, is_marketplace_active, delivery_fee, minimum_order, banner_image_url } = body;

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .update({
        slug: slug || null,
        is_marketplace_active: is_marketplace_active || false,
        delivery_fee: delivery_fee || 0,
        minimum_order: minimum_order || 0,
        banner_image_url: banner_image_url || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // unique violation
        throw new Error('Bu Mağaza URL (Slug) zaten başka bir restoran tarafından kullanılıyor.');
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, restaurant });
  } catch (error: any) {
    console.error('Error updating storefront settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
