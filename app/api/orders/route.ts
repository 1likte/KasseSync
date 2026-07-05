import { NextResponse } from 'next/server';
import { createAdminClient, isConfigured } from '@/lib/supabase-server';
import type { CartItem } from '@/lib/types';

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ success: false, needsSetup: true }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { restaurantId, items, total, method, fiskalyTransactionId, tableNumber, waiterName } = body as {
      restaurantId: string;
      items: CartItem[];
      total: number;
      method: 'cash' | 'card';
      fiskalyTransactionId: string;
      tableNumber?: string;
      waiterName?: string;
    };

    const admin = createAdminClient();

    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        restaurant_id: restaurantId,
        status: 'paid',
        total_amount: total,
        payment_method: method,
        fiskaly_transaction_id: fiskalyTransactionId,
        table_number: tableNumber?.trim() || null,
        waiter_name: waiterName?.trim() || null,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message ?? 'Sipariş kaydedilemedi');
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await admin.from('order_items').insert(orderItems);
    if (itemsError) throw new Error(itemsError.message);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Sipariş kaydedilemedi' },
      { status: 500 }
    );
  }
}
