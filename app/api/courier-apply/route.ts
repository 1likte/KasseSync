import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, phone, email, city, vehicle_type, has_license, notes } = body;

    if (!full_name || !phone || !email || !city || !vehicle_type) {
      return NextResponse.json({ success: false, error: 'Lütfen tüm zorunlu alanları doldurun.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Insert the courier application
    const { data, error } = await supabase
      .from('courier_applications')
      .insert({
        full_name,
        phone,
        email,
        city,
        vehicle_type,
        has_license: !!has_license,
        notes: notes || '',
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Courier application DB error:', error);
      throw new Error('Başvuru kaydedilemedi.');
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Başvuru sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
