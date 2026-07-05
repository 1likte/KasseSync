import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Supabase configuration is missing' }, { status: 503 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre zorunludur' }, { status: 400 });
    }

    // Harcoded super-admin check fallback logic if db fetch fails or just directly check db
    const { data: user, error } = await supabaseAdmin
      .from('system_users')
      .select('*, restaurants(name)')
      .eq('username', username)
      .single();

    if (error || !user) {
      // Hardcoded fallback logic
      if (username === 'yunuskalkande' && password === 'Bxq912qizky.') {
        // Create fallback token
        const cookieStore = await cookies();
        cookieStore.set('admin_token', JSON.stringify({ role: 'super-admin', username }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
        
        cookieStore.set('admin_role', 'super-admin', {
          httpOnly: false,
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        return NextResponse.json({ success: true, role: 'super-admin' });
      }

      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 });
    }

    // Veritabanı kontrolü (Düz metin karşılaştırma - basitlik için)
    if (user.password_hash !== password) {
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 });
    }

    // Token oluştur
    const cookieStore = await cookies();
    cookieStore.set('admin_token', JSON.stringify({ 
      id: user.id,
      role: user.role, 
      restaurant_id: user.restaurant_id,
      username: user.username 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    cookieStore.set('admin_role', user.role, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ 
      success: true, 
      role: user.role,
      restaurantId: user.restaurant_id,
      restaurantSlug: user.restaurants?.name ? user.restaurants.name.toLowerCase().replace(/[^a-z0-9]+/g, '') : undefined
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu' }, { status: 500 });
  }
}
