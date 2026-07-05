import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/storefront/ProductCard';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 60;

export default async function StoreVitrinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name, banner_image_url')
    .eq('slug', slug)
    .single();

  if (!restaurant) {
    notFound();
  }

  // Fetch showcase products
  const { data: showcaseProducts } = await supabase
    .from('products')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_showcase', true)
    .eq('is_available', true);

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-[#e31837] selection:text-white pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {restaurant.banner_image_url ? (
            <img 
              src={restaurant.banner_image_url} 
              alt={restaurant.name} 
              className="w-full h-full object-cover opacity-50 scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1c23] to-[#0a0a0c]"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-transparent z-10"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16 md:mt-0 transform transition-all duration-1000 translate-y-0 opacity-100">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(227,24,55,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#e31837] animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300 tracking-wider uppercase">Sizin İçin Seçtiklerimiz</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter drop-shadow-2xl mb-6">
            {restaurant.name}
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Eşsiz lezzetler, özenle hazırlanan menüler ve unutulmaz bir deneyim için doğru yerdesiniz.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-xs tracking-widest uppercase text-gray-400">Keşfet</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-4">
              <span className="w-2 h-10 bg-[#e31837] rounded-full shadow-[0_0_15px_#e31837]"></span>
              Vitrin
            </h2>
            <p className="text-gray-500 mt-2 font-medium ml-6">Şefin özel tavsiyeleri ve en çok tercih edilenler.</p>
          </div>
        </div>

        {showcaseProducts && showcaseProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {showcaseProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#e31837] rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10"></div>
            
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Vitrin Şu An Boş</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto relative z-10">Restoran henüz öne çıkan bir ürün belirlememiş. Kategorilerden diğer ürünlere göz atabilirsiniz.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.05) translate(-1%, -1%); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}} />
    </div>
  );
}
