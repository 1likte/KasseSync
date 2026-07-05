import { NextResponse } from 'next/server';
import { createAdminClient, isConfigured } from '@/lib/supabase-server';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!isConfigured()) {
    return NextResponse.json({ success: false, error: 'Supabase yapılandırması eksik' }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.categoryId !== undefined) updates.category_id = body.categoryId;
    if (body.description !== undefined) updates.description = body.description?.trim() || null;
    if (body.imageUrl !== undefined) updates.image_url = body.imageUrl?.trim() || null;
    if (body.isAvailable !== undefined) updates.is_available = Boolean(body.isAvailable);
    if (body.isShowcase !== undefined) updates.is_showcase = Boolean(body.isShowcase);

    const admin = createAdminClient();

    const { data, error } = await admin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('id, category_id, name, price, is_available, description, image_url, is_showcase')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      product: { ...data, price: Number(data.price) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Ürün güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isConfigured()) {
    return NextResponse.json({ success: false, error: 'Supabase yapılandırması eksik' }, { status: 503 });
  }

  try {
    const { id } = await context.params;
    const admin = createAdminClient();

    const { error } = await admin.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Ürün silinemedi' },
      { status: 500 }
    );
  }
}
