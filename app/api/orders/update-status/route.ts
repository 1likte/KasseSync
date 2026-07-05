import { createAdminClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'Eksik bilgi' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update status error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
