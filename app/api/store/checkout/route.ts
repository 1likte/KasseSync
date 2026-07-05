import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Supabase configuration is missing' }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    const body = await req.json();
    const { restaurantId, items, customerDetails } = body;

    if (!restaurantId || !items || items.length === 0 || !customerDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // 1. Insert Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          restaurant_id: restaurantId,
          order_type: 'delivery',
          status: 'pending',
          total_amount: totalAmount,
          customer_name: customerDetails.name,
          customer_phone: customerDetails.phone,
          delivery_address: customerDetails.address,
          delivery_notes: customerDetails.notes,
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert Order Items
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
