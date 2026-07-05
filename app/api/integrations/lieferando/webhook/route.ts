import { createAdminClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Lieferando webhook payload yapısı geldiğinde burada parse edilecek
    // Şimdilik sahte/test (mock) verisi simülasyonu yapıyoruz.
    const { 
      restaurantId, 
      customerName, 
      customerPhone, 
      deliveryAddress, 
      items, 
      totalAmount 
    } = payload;

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: 'Restaurant ID gerekli' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Siparişi veritabanına "pending" (beklemede) olarak ekle
    const { data: order, error } = await admin
      .from('orders')
      .insert({
        restaurant_id: restaurantId,
        order_type: 'delivery',
        status: 'pending',
        customer_name: customerName || 'Lieferando Müşterisi',
        customer_phone: customerPhone || '-',
        delivery_address: deliveryAddress || 'Lieferando Üzerinden Teslimat',
        total_amount: totalAmount || 0,
        payment_method: 'card',
        // items array'ini JSON formatında saklıyoruz (eğer tabloda jsonb alanınız varsa, yoksa order_items'a eklenmeli)
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Gerçek bir senaryoda order_items tablosuna da sipariş edilen ürünler insert edilmeli.
    // Şimdilik sadece ana order'ı oluşturduk ki POS ekranına alarm düşsün.

    return NextResponse.json({ success: true, orderId: order.id, message: 'Lieferando siparişi sisteme düştü' });
  } catch (error: any) {
    console.error('Lieferando Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
