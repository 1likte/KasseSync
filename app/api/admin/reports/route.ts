import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!restaurantId) {
    return NextResponse.json({ success: false, error: 'Restaurant ID gerekli' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Siparişleri getir
    let ordersQuery = supabase
      .from('orders')
      .select('id, total_amount, payment_method, created_at')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'paid');

    if (startDate && endDate) {
      ordersQuery = ordersQuery.gte('created_at', startDate).lte('created_at', endDate);
    }

    const { data: orders, error: ordersError } = await ordersQuery.order('created_at', { ascending: true });

    if (ordersError) throw ordersError;

    // Sipariş kalemlerini getir (ürün bazlı satış)
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('quantity, unit_price, total_price, products!inner(name, category_id)')
      .in('order_id', orders?.map((o) => o.id) || []);

    if (itemsError) throw itemsError;

    // Giderleri getir
    let expensesQuery = supabase
      .from('expenses')
      .select('*')
      .eq('restaurant_id', restaurantId);

    if (startDate && endDate) {
      expensesQuery = expensesQuery.gte('expense_date', startDate).lte('expense_date', endDate);
    }

    const { data: expenses, error: expensesError } = await expensesQuery.order('expense_date', { ascending: true });

    if (expensesError) throw expensesError;

    // Gelir kaynaklarını getir
    let incomeQuery = supabase
      .from('income_sources')
      .select('*')
      .eq('restaurant_id', restaurantId);

    if (startDate && endDate) {
      incomeQuery = incomeQuery.gte('income_date', startDate).lte('income_date', endDate);
    }

    const { data: incomeSources, error: incomeError } = await incomeQuery.order('income_date', { ascending: true });

    if (incomeError) throw incomeError;

    // Hesaplamalar
    const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
    const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const totalOtherIncome = incomeSources?.reduce((sum, i) => sum + Number(i.amount), 0) || 0;

    const cashRevenue = orders?.filter(o => o.payment_method === 'cash').reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
    const cardRevenue = orders?.filter(o => o.payment_method === 'card').reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

    const grossProfit = totalRevenue + totalOtherIncome - totalExpenses;

    // KDV hesapla (Almanya'da genelde %19)
    const taxRate = 0.19;
    const netRevenue = totalRevenue / (1 + taxRate);
    const totalTax = totalRevenue - netRevenue;

    // Ürün bazlı satış raporu
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    orderItems?.forEach((item: any) => {
      const productName = item.products?.name || 'Bilinmeyen';
      const existing = productSales.get(productName) || { name: productName, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += Number(item.total_price);
      productSales.set(productName, existing);
    });

    // Günlük bazlı rapor
    const dailyStats = new Map<string, { revenue: number; orders: number }>();
    orders?.forEach((order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      const existing = dailyStats.get(date) || { revenue: 0, orders: 0 };
      existing.revenue += Number(order.total_amount);
      existing.orders += 1;
      dailyStats.set(date, existing);
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalExpenses,
          totalOtherIncome,
          grossProfit,
          cashRevenue,
          cardRevenue,
          totalTax,
          netRevenue,
          totalOrders: orders?.length || 0,
        },
        productSales: Array.from(productSales.values()).sort((a, b) => b.revenue - a.revenue),
        dailyStats: Array.from(dailyStats.entries())
          .map(([date, stats]) => ({ date, ...stats }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        expenses: expenses || [],
        incomeSources: incomeSources || [],
      },
    });
  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Rapor alınamadı' },
      { status: 500 }
    );
  }
}
