import { NextResponse } from 'next/server';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createAdminClient } from '@/lib/supabase-server';

async function seedDatabase(admin: ReturnType<typeof createAdminClient>) {
  const { count } = await admin.from('products').select('*', { count: 'exact', head: true });

  if (count && count > 0) {
    return { alreadySeeded: true, productCount: count };
  }

  const { data: restaurant, error: restaurantError } = await admin
    .from('restaurants')
    .insert({ name: 'KasseSync Test Restaurant', address: 'Berlin' })
    .select('id, name')
    .single();

  if (restaurantError || !restaurant) {
    throw new Error(restaurantError?.message ?? 'Restoran oluşturulamadı');
  }

  const { data: categories, error: categoriesError } = await admin
    .from('categories')
    .insert([
      { restaurant_id: restaurant.id, name: 'Burger', sort_order: 1 },
      { restaurant_id: restaurant.id, name: 'İçecekler', sort_order: 2 },
      { restaurant_id: restaurant.id, name: 'Tatlılar', sort_order: 3 },
    ])
    .select('id, name');

  if (categoriesError || !categories) {
    throw new Error(categoriesError?.message ?? 'Kategoriler oluşturulamadı');
  }

  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  const productRows = [
    { restaurant_id: restaurant.id, category_id: categoryMap['Burger'], name: 'Classic Burger', price: 8.5 },
    { restaurant_id: restaurant.id, category_id: categoryMap['Burger'], name: 'Cheeseburger', price: 9.5 },
    { restaurant_id: restaurant.id, category_id: categoryMap['Burger'], name: 'BBQ Bacon Burger', price: 11.5 },
    { restaurant_id: restaurant.id, category_id: categoryMap['İçecekler'], name: 'Kola', price: 2.5 },
    { restaurant_id: restaurant.id, category_id: categoryMap['İçecekler'], name: 'Ayran', price: 2.0 },
    { restaurant_id: restaurant.id, category_id: categoryMap['İçecekler'], name: 'Su', price: 1.5 },
  ];

  const { error: productsError } = await admin.from('products').insert(productRows);
  if (productsError) throw new Error(productsError.message);

  return { alreadySeeded: false, productCount: productRows.length };
}

function saveServiceRoleKey(key: string) {
  const envPath = join(process.cwd(), '.env.local');
  const line = `SUPABASE_SERVICE_ROLE_KEY=${key}`;

  if (!existsSync(envPath)) {
    appendFileSync(envPath, `${line}\n`);
    return;
  }

  const content = readFileSync(envPath, 'utf8');
  if (content.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
    const updated = content.replace(/^SUPABASE_SERVICE_ROLE_KEY=.*$/m, line);
    writeFileSync(envPath, updated);
  } else {
    appendFileSync(envPath, `\n${line}\n`);
  }
}

function validateServiceRoleKey(key: string) {
  const trimmed = key.trim();

  if (!trimmed) {
    throw new Error('Anahtar boş. service_role secret key yapıştır.');
  }

  if (trimmed.startsWith('sb_publishable_')) {
    throw new Error(
      'Bu publishable (anon) anahtar. service_role veya sb_secret_ ile başlayan gizli anahtar lazım.'
    );
  }

  if (trimmed.includes('supabase.co')) {
    throw new Error('Bu bir URL. Anahtar (key) yapıştır, adres değil.');
  }

  if (trimmed === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Bu anon anahtar. service_role secret key lazım.');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const serviceRoleKey = body.serviceRoleKey as string | undefined;

    if (!serviceRoleKey) {
      throw new Error('service_role secret key gerekli.');
    }

    validateServiceRoleKey(serviceRoleKey);

    const admin = createAdminClient(serviceRoleKey.trim());

    const result = await seedDatabase(admin);
    saveServiceRoleKey(serviceRoleKey.trim());

    return NextResponse.json({
      success: true,
      message: result.alreadySeeded ? 'Zaten kurulu' : 'Kurulum tamamlandı',
      productCount: result.productCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Kurulum başarısız';
    const needsKey = message.includes('yapılandırması eksik') || message.includes('row-level security');

    return NextResponse.json(
      { success: false, error: message, needsKey },
      { status: needsKey ? 400 : 500 }
    );
  }
}
