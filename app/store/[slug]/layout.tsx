import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import StoreSidebar from '@/components/storefront/StoreSidebar';
import StoreHeader from '@/components/storefront/StoreHeader';
import CartSidebar from '@/components/storefront/CartSidebar';
import { StoreCartProvider } from '@/lib/contexts/StoreCartContext';
import { ReactNode } from 'react';

export const revalidate = 60;

export default async function StoreLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return notFound();
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (!restaurant) {
    notFound();
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order', { ascending: true });

  return (
    <StoreCartProvider>
      <div className="min-h-screen bg-[#0f1115] text-gray-100 font-sans">
        <StoreSidebar categories={categories || []} slug={slug} />
        <StoreHeader restaurantName={restaurant.name} />
        <CartSidebar restaurantId={restaurant.id} />
        
        <main className="md:ml-64 pt-16 min-h-screen">
          {children}
        </main>
      </div>
    </StoreCartProvider>
  );
}
