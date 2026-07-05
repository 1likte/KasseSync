import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurant_name, owner_name, email, phone, address } = body;

    if (!restaurant_name || !owner_name || !email || !phone || !address) {
      return NextResponse.json({ success: false, error: 'Lütfen tüm alanları doldurun.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Insert the partner application
    const { data, error } = await supabase
      .from('partner_applications')
      .insert({
        restaurant_name,
        owner_name,
        email,
        phone,
        address,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Partner application DB error:', error);
      throw new Error('Başvuru kaydedilemedi.');
    }

    // Optional: We could also automatically insert a message to the super-admin here
    // But since the super-admin dashboard will read from `partner_applications` directly,
    // we don't strictly need a duplicate row in the `messages` table.
    
    return NextResponse.json({ success: true, application: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Başvuru sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
