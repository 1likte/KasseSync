import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Başvuru ID eksik' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Başvuruyu çek
    const { data: app, error: fetchError } = await supabase
      .from('partner_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !app) {
      throw new Error('Başvuru bulunamadı.');
    }

    if (app.status === 'approved') {
      return NextResponse.json({ success: false, error: 'Bu başvuru zaten onaylanmış.' }, { status: 400 });
    }

    // 2. Restoranı oluştur
    const { data: newRestaurant, error: rError } = await supabase
      .from('restaurants')
      .insert({
        name: app.restaurant_name,
        address: app.address,
        subscription_status: 'trialing'
      })
      .select()
      .single();

    if (rError) throw rError;

    // 3. Kullanıcıyı oluştur (Kullanıcı adı emailden oluşturulabilir veya düz restoran adından)
    const username = app.restaurant_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const password = Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli rastgele şifre

    const { data: newUser, error: uError } = await supabase
      .from('system_users')
      .insert({
        username,
        password_hash: password, // In production, this should be hashed
        role: 'restaurant-admin',
        restaurant_id: newRestaurant.id
      })
      .select()
      .single();

    if (uError) throw uError;

    // 4. Başvuruyu güncelle
    const { error: updateError } = await supabase
      .from('partner_applications')
      .update({ status: 'approved' })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      restaurant: newRestaurant,
      user: {
        username: newUser.username,
        password: password // Return plain password once so admin can see it
      }
    });

  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Onay işlemi başarısız' },
      { status: 500 }
    );
  }
}
