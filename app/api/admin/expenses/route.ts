import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  if (!restaurantId) {
    return NextResponse.json({ success: false, error: 'Restaurant ID gerekli' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('expense_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Giderler yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, category, description, amount, taxRate, expenseDate, receiptUrl } = body;

    if (!restaurantId || !category || !amount || !expenseDate) {
      return NextResponse.json({ success: false, error: 'Eksik bilgi' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.from('expenses').insert({
      restaurant_id: restaurantId,
      category,
      description,
      amount,
      tax_rate: taxRate || 19.00,
      expense_date: expenseDate,
      receipt_url: receiptUrl,
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, expense: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Gider eklenemedi' },
      { status: 500 }
    );
  }
}
