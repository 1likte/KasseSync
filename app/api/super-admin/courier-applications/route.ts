import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: applications, error } = await supabase
      .from('courier_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error('Fetch courier applications error:', error);
    return NextResponse.json(
      { success: false, error: 'Kurye başvuruları getirilemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { status } = body;

    if (!id || !status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Eksik veya geçersiz parametreler' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('courier_applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error) {
    console.error('Update courier application error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Kurye başvurusu güncellenemedi' },
      { status: 500 }
    );
  }
}
