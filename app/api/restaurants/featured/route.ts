import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('id, name, address, created_at')
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, restaurants: data });
  } catch (error: any) {
    console.error('Featured restaurants fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
