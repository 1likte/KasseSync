import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const user = JSON.parse(token);
    
    // Alınan ve gönderilen mesajları çek
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:sender_id(username, role), receiver:receiver_id(username, role)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    console.error('Fetch messages error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    const user = JSON.parse(token);
    const { receiverId, content } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: user.id,
        receiver_id: receiverId,
        content
      }])
      .select('*, sender:sender_id(username, role), receiver:receiver_id(username, role)')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    console.error('Send message error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
