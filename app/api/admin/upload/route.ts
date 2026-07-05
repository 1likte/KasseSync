import { NextResponse } from 'next/server';
import { createAdminClient, isConfigured } from '@/lib/supabase-server';

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ success: false, error: 'Supabase yapılandırması eksik' }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Dosya bulunamadı' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Sadece resim dosyası yüklenebilir' }, { status: 400 });
    }

    const admin = createAdminClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from('product-images')
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = admin.storage.from('product-images').getPublicUrl(path);

    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Yükleme başarısız' },
      { status: 500 }
    );
  }
}
