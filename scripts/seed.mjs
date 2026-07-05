import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase keys in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Veritabanına örnek veriler ekleniyor...');

  try {
    // 1. Restoran Ekle
    const { data: restaurant, error: rError } = await supabase
      .from('restaurants')
      .insert({
        name: 'GastroSync Demo Restoran',
        address: 'Berlin, Almanya',
        subscription_status: 'active'
      })
      .select()
      .single();

    if (rError) throw rError;
    console.log('Restoran eklendi:', restaurant.name);

    // 2. Kategoriler Ekle
    const { data: categories, error: cError } = await supabase
      .from('categories')
      .insert([
        { restaurant_id: restaurant.id, name: 'İçecekler', sort_order: 1 },
        { restaurant_id: restaurant.id, name: 'Sıcak İçecekler', sort_order: 2 },
        { restaurant_id: restaurant.id, name: 'Tatlılar', sort_order: 3 }
      ])
      .select();

    if (cError) throw cError;
    console.log('Kategoriler eklendi:', categories.length);

    // 3. Ürünler Ekle
    const drinksCat = categories.find(c => c.name === 'İçecekler');
    const hotDrinksCat = categories.find(c => c.name === 'Sıcak İçecekler');
    const dessertsCat = categories.find(c => c.name === 'Tatlılar');

    const { error: pError } = await supabase
      .from('products')
      .insert([
        { restaurant_id: restaurant.id, category_id: drinksCat.id, name: 'Kola', price: 4.50, is_available: true, image_url: '🥤' },
        { restaurant_id: restaurant.id, category_id: drinksCat.id, name: 'Ayran', price: 3.00, is_available: true, image_url: '🥛' },
        { restaurant_id: restaurant.id, category_id: drinksCat.id, name: 'Su', price: 2.00, is_available: true, image_url: '💧' },
        { restaurant_id: restaurant.id, category_id: hotDrinksCat.id, name: 'Çay', price: 2.50, is_available: true, image_url: '☕' },
        { restaurant_id: restaurant.id, category_id: hotDrinksCat.id, name: 'Filtre Kahve', price: 4.00, is_available: true, image_url: '☕' },
        { restaurant_id: restaurant.id, category_id: dessertsCat.id, name: 'Sütlaç', price: 6.50, is_available: true, image_url: '🍮' },
        { restaurant_id: restaurant.id, category_id: dessertsCat.id, name: 'Baklava', price: 8.00, is_available: true, image_url: '🍯' }
      ]);

    if (pError) throw pError;
    console.log('Ürünler eklendi.');

    // 4. Masalar Ekle
    const { error: tError } = await supabase
      .from('tables')
      .insert([
        { restaurant_id: restaurant.id, table_number: '1' },
        { restaurant_id: restaurant.id, table_number: '2' },
        { restaurant_id: restaurant.id, table_number: '3' },
        { restaurant_id: restaurant.id, table_number: '4' }
      ]);

    if (tError) throw tError;
    console.log('Masalar eklendi.');

    console.log('✅ İşlem Başarılı! Ekranda test edebilirsiniz.');
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
}

seed();
