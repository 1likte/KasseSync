import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const admin = JSON.parse(token);
    if (admin.role !== 'super-admin') return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });

    const { data: users, error } = await supabase
      .from('system_users')
      .select('*, restaurants(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error('Fetch users error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const admin = JSON.parse(token);
    if (admin.role !== 'super-admin') return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });

    const { username, password, restaurantName, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    let restaurant_id = null;

    if (role === 'restaurant-admin' && restaurantName) {
      // Restoran oluştur
      const { data: restaurant, error: restError } = await supabase
        .from('restaurants')
        .insert([{ name: restaurantName }])
        .select()
        .single();
        
      if (restError) throw restError;
      restaurant_id = restaurant.id;
    }

    // Kullanıcı oluştur
    const { data: user, error: userError } = await supabase
      .from('system_users')
      .insert([{
        username,
        password_hash: password, // basitlik için plain text
        role,
        restaurant_id
      }])
      .select('*, restaurants(name)')
      .single();

    if (userError) throw userError;

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error('Create user error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const admin = JSON.parse(token);
    if (admin.role !== 'super-admin') return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const restaurantId = searchParams.get('restaurantId');

    if (!userId) return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });

    // Önce kullanıcıyı sil
    const { error: userError } = await supabase
      .from('system_users')
      .delete()
      .eq('id', userId);

    if (userError) throw userError;

    // Eğer restoranı da silmek istersek (kullanıcıya bağlı olarak opsiyonel yapılabilir)
    if (restaurantId && restaurantId !== 'null') {
      await supabase.from('restaurants').delete().eq('id', restaurantId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete user error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const admin = JSON.parse(token);
    if (admin.role !== 'super-admin') return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });

    const { restaurant_id, username, password } = await request.json();

    if (!restaurant_id || !username || !password) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    // Check if user already exists for this restaurant
    const { data: existingUser, error: findError } = await supabase
      .from('system_users')
      .select('*')
      .eq('restaurant_id', restaurant_id)
      .eq('role', 'restaurant-admin')
      .maybeSingle();

    if (findError) throw findError;

    if (existingUser) {
      // Update
      const { data: updatedUser, error: updateError } = await supabase
        .from('system_users')
        .update({
          username,
          password_hash: password
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return NextResponse.json({ success: true, user: updatedUser });
    } else {
      // Create new user for restaurant
      const { data: newUser, error: insertError } = await supabase
        .from('system_users')
        .insert([{
          username,
          password_hash: password,
          role: 'restaurant-admin',
          restaurant_id
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      return NextResponse.json({ success: true, user: newUser });
    }
  } catch (err: any) {
    console.error('Update credentials error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
