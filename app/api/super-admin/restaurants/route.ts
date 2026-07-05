import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Tüm restoranları getir
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });

    if (restaurantsError) throw restaurantsError;

    // Her restoran için sipariş istatistiklerini hesapla
    const restaurantStats = await Promise.all(
      (restaurants || []).map(async (restaurant) => {
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount, payment_method, created_at')
          .eq('restaurant_id', restaurant.id)
          .eq('status', 'paid');

        const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
        const totalOrders = orders?.length || 0;
        
        // Bu ayın cirosu
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthOrders = orders?.filter(o => new Date(o.created_at) >= firstDayOfMonth) || [];
        const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

        // Son aktivite
        const lastOrder = orders?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        const lastActivity = lastOrder ? new Date(lastOrder.created_at) : null;

        return {
          ...restaurant,
          stats: {
            totalRevenue,
            totalOrders,
            thisMonthRevenue,
            lastActivity,
          },
        };
      })
    );

    return NextResponse.json({ success: true, restaurants: restaurantStats });
  } catch (error) {
    console.error('Super admin error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Restoranlar yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const body = await request.json();
    const { name, address, cuisine_type, description } = body;
    
    const { data, error } = await supabase
      .from('restaurants')
      .insert([{ name, address, cuisine_type, description }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, restaurant: data });
  } catch (error) {
    console.error('Super admin add restaurant error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Restoran eklenemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const body = await request.json();
    const { id, name, address, cuisine_type, description } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Restoran ID gerekli' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('restaurants')
      .update({ name, address, cuisine_type, description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, restaurant: data });
  } catch (error) {
    console.error('Super admin update restaurant error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Restoran güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Restoran ID gerekli' }, { status: 400 });
    }

    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Super admin delete restaurant error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Restoran silinemedi' },
      { status: 500 }
    );
  }
}

