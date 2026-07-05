import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/storefront/ProductCard';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 60;

export default async function StoreCategoryPage({
  params,
}: {
  params: Promise<{ slug: string; categoryId: string }>;
}) {
  const { slug, categoryId } = await params;

  // Fetch restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('slug', slug)
    .single();

  if (!restaurant) {
    notFound();
  }

  // Fetch category info
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', categoryId)
    .single();

  if (!category) {
    notFound();
  }

  // Fetch products in this category
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('category_id', categoryId);

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-[#e31837] selection:text-white pb-24 pt-12 md:pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="mb-12 relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#e31837] rounded-full blur-[80px] opacity-20"></div>
          <h2 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 relative z-10">
            <span className="w-2 h-12 bg-gradient-to-b from-[#e31837] to-transparent rounded-full"></span>
            {category.name}
          </h2>
          <p className="text-gray-500 mt-3 font-medium ml-6 relative z-10">Bu kategorideki tüm lezzetleri keşfedin.</p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gray-600 rounded-full blur-[100px] opacity-10"></div>
            
            <svg className="w-24 h-24 text-gray-700 mx-auto mb-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Bu Kategoride Ürün Yok</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto relative z-10">Şu anda bu kategoride listelenen bir ürün bulunmuyor. Lütfen diğer kategorileri inceleyin.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}} />
    </div>
  );
}
