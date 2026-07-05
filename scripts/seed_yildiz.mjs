import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase keys');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Yıldız Restaurant ekleniyor...');

  try {
    // 1. Restoran Ekle
    const { data: restaurant, error: rError } = await supabase
      .from('restaurants')
      .insert({
        name: 'Yıldız Restaurant',
        address: 'İstanbul',
        subscription_status: 'active'
      })
      .select()
      .single();

    if (rError) throw rError;
    console.log('Restoran eklendi:', restaurant.name);

    // 2. Kullanıcı Ekle
    const { data: user, error: uError } = await supabase
      .from('system_users')
      .insert({
        username: 'yıldızrestaurant',
        password_hash: '194637890', // Düz metin (login apimiz böyle kontrol ediyor)
        role: 'restaurant-admin',
        restaurant_id: restaurant.id
      })
      .select()
      .single();

    if (uError) throw uError;
    console.log('Kullanıcı eklendi:', user.username);

    console.log('✅ İşlem Başarılı!');
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
}

seed();
