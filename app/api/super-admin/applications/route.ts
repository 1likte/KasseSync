import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: applications, error } = await supabase
      .from('partner_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json(
      { success: false, error: 'Başvurular getirilemedi' },
      { status: 500 }
    );
  }
}
