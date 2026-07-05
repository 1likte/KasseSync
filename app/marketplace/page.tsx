import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Clock, Sparkles, Filter, X, ArrowLeft, ShoppingCart } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

// We use the service role or a standard client to fetch active marketplace restaurants
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function MarketplacePage(props: {
  searchParams: Promise<{ q?: string; location?: string; [key: string]: string | string[] | undefined }>
}) {
  const { q = '', location = '' } = await props.searchParams;
  let restaurants = null;
  
  try {
    let query = supabase
      .from('restaurants')
      .select('id, name, slug, address, delivery_fee, minimum_order, banner_image_url, cuisine_type, description')
      .eq('is_marketplace_active', true);

    if (q) {
      query = query.or(`name.ilike.%${q}%,cuisine_type.ilike.%${q}%,description.ilike.%${q}%`);
    }
    if (location) {
      query = query.ilike('address', `%${location}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch failed (project might be paused). Falling back to mock data.');
    } else {
      restaurants = data;
    }
  } catch (err) {
    console.warn('Network error fetching from Supabase. Falling back to mock data.');
  }

  // Fallback mock data for UI demonstration
  if (!restaurants || restaurants.length === 0) {
    restaurants = [
      {
        id: 'mock-1',
        name: 'Gastro Burger',
        slug: 'gastro-burger',
        address: 'Merkez Mah. Lezzet Sok. No:1',
        delivery_fee: 0,
        minimum_order: 150,
        banner_image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
        cuisine_type: 'Burger, Fast Food',
        description: 'En lezzetli gurme burgerler'
      },
      {
        id: 'mock-2',
        name: 'Pizza Sync',
        slug: 'pizza-sync',
        address: 'Sahil Yolu Cad. No:45',
        delivery_fee: 20,
        minimum_order: 200,
        banner_image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
        cuisine_type: 'Pizza, İtalyan',
        description: 'Taş fırında gerçek İtalyan pizzası'
      },
      {
        id: 'mock-3',
        name: 'Kebab Master',
        slug: 'kebab-master',
        address: 'Meydan Sok. No:12',
        delivery_fee: 15,
        minimum_order: 250,
        banner_image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800&auto=format&fit=crop',
        cuisine_type: 'Kebap, Türk Mutfağı',
        description: 'Geleneksel lezzetler ve zengin mezeler'
      }
    ];

    if (q) {
      restaurants = restaurants.filter(r => 
        r.name.toLowerCase().includes(q.toLowerCase()) || 
        r.address.toLowerCase().includes(q.toLowerCase()) ||
        (r.cuisine_type && r.cuisine_type.toLowerCase().includes(q.toLowerCase())) ||
        (r.description && r.description.toLowerCase().includes(q.toLowerCase()))
      );
    }
    if (location) {
      restaurants = restaurants.filter(r => 
        r.address.toLowerCase().includes(location.toLowerCase())
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD3B6] via-[#FFAAA5] to-[#FF8B94] text-white font-sans relative overflow-hidden flex flex-col pb-16">
      
      {/* Decorative blurry glowing orbs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FFE5D9] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF9A9E] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      {/* Glassmorphic Sticky Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg w-full px-6 sm:px-10 lg:px-16 py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="block">
          <Image 
            src="/logo.png" 
            alt="GastroSync Logo" 
            width={400} 
            height={130} 
            className="object-contain drop-shadow-md h-auto w-auto max-h-32 scale-110 origin-left cursor-pointer"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-md border border-white/30 transition-all text-sm shadow-sm">
            İşletme Girişi
          </Link>
          <button className="relative p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition-all group shadow-sm ml-2">
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center font-bold text-white shadow-sm border border-white/20">2</span>
            </span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-40 flex flex-col">
        
        {/* Dynamic Search Banner */}
        <div className="mb-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem] p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-wider mb-3 shadow-md shadow-rose-500/20">
              <Sparkles size={12} className="animate-pulse" /> Keşfet
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-sm">Lezzeti Kapınıza Getirin</h2>
            <p className="text-white/80 mt-3 text-base md:text-lg font-medium leading-relaxed">
              {q || location ? (
                <span className="flex items-center flex-wrap gap-2">
                  Arama filtreleri uygulandı: 
                  {q && <span className="bg-white/20 border border-white/35 px-3 py-1 rounded-xl text-white font-bold text-sm">"{q}"</span>} 
                  {location && <span className="bg-white/20 border border-white/35 px-3 py-1 rounded-xl text-white font-bold text-sm">Konum: "{location}"</span>}
                </span>
              ) : (
                "En sevdiğiniz restoranlardan hemen sipariş verin."
              )}
            </p>
          </div>
          {(q || location) && (
            <Link 
              href="/marketplace" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-rose-500 text-rose-600 hover:text-white font-black rounded-full transition-all duration-300 text-sm shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5"
            >
              <X size={16} /> Filtreleri Temizle
            </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6 bg-white/25 backdrop-blur-xl border border-white/30 rounded-[2rem] p-6 shadow-2xl sticky top-28">
            <div className="flex items-center gap-2 pb-4 border-b border-white/20">
              <Filter size={18} className="text-white" />
              <h3 className="font-black text-white tracking-wider text-sm uppercase">Filtreleme</h3>
            </div>
            
            <div>
              <h4 className="font-extrabold text-white/95 mb-3 text-xs uppercase tracking-wider">Hızlı Seçenekler</h4>
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-white/30 text-rose-500 focus:ring-rose-500 bg-white/10 cursor-pointer accent-rose-500" />
                    <span className="text-white/80 font-bold group-hover:text-white transition-colors text-sm">Ücretsiz Teslimat</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-white/30 text-rose-500 focus:ring-rose-500 bg-white/10 cursor-pointer accent-rose-500" />
                    <span className="text-white/80 font-bold group-hover:text-white transition-colors text-sm">4.5+ Yıldız</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-white/30 text-rose-500 focus:ring-rose-500 bg-white/10 cursor-pointer accent-rose-500" />
                    <span className="text-white/80 font-bold group-hover:text-white transition-colors text-sm">Şu An Açık</span>
                  </label>
                </li>
              </ul>
            </div>

            <div className="border-t border-white/20 pt-4">
              <h4 className="font-extrabold text-white/95 mb-3 text-xs uppercase tracking-wider">Beslenme Türü</h4>
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded border-white/30 text-rose-500 focus:ring-rose-500 bg-white/10 cursor-pointer accent-rose-500" />
                      <span className="text-white/80 font-bold group-hover:text-white transition-colors text-sm">Vejetaryen</span>
                    </div>
                  </label>
                </li>
                <li>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded border-white/30 text-rose-500 focus:ring-rose-500 bg-white/10 cursor-pointer accent-rose-500" />
                      <span className="text-white/80 font-bold group-hover:text-white transition-colors text-sm">Vegan</span>
                    </div>
                  </label>
                </li>
                <li>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded border-white/30 text-rose-500 focus:ring-rose-500 bg-white/10 cursor-pointer accent-rose-500" />
                      <span className="text-white/80 font-bold group-hover:text-white transition-colors text-sm">Helal</span>
                    </div>
                  </label>
                </li>
              </ul>
            </div>
          </aside>

          {/* Restaurant Grid */}
          <div className="flex-1 w-full">
            {restaurants && restaurants.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <Link key={restaurant.id} href={`/store/${restaurant.slug || restaurant.id}`}>
                    <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-500 group cursor-pointer h-full flex flex-col">
                      <div className="h-52 bg-slate-100 relative overflow-hidden">
                        {restaurant.banner_image_url ? (
                          <img 
                            src={restaurant.banner_image_url} 
                            alt={restaurant.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-400 group-hover:scale-105 transition-transform duration-700">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-amber-500 shadow-md border border-amber-100 font-black text-sm">
                          <Star size={14} className="fill-amber-500 text-amber-500" />
                          <span>4.8</span>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-rose-500 transition-colors tracking-tight leading-tight">{restaurant.name}</h3>
                          {restaurant.cuisine_type && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {restaurant.cuisine_type.split(',').map((tag: string) => (
                                <span key={tag} className="text-[10px] bg-rose-500/10 text-rose-600 font-extrabold px-2 py-0.5 rounded-full">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-gray-500 text-sm mt-3 flex items-start gap-1.5 leading-snug">
                            <MapPin size={15} className="shrink-0 text-rose-500 mt-0.5" />
                            <span className="line-clamp-2 font-medium">{restaurant.address || 'Adres bilgisi yok'}</span>
                          </p>
                        </div>
                        
                        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gray-600">
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Teslimat</span>
                            <span className="text-sm font-extrabold text-gray-900 flex items-center gap-1">
                              <Clock size={13} className="text-gray-400" />
                              {restaurant.delivery_fee > 0 ? `₺${Number(restaurant.delivery_fee).toFixed(0)}` : 'Ücretsiz'}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Min. Sipariş</span>
                            <span className="text-sm font-extrabold text-gray-900">₺{Number(restaurant.minimum_order || 0).toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-xl rounded-[2rem] p-16 text-center border border-white/30 shadow-2xl text-white animate-fade-in">
                <svg className="w-20 h-20 text-white/50 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <h3 className="text-3xl font-black mb-3 drop-shadow-sm">Restoran Bulunamadı</h3>
                <p className="text-white/80 max-w-md mx-auto font-medium text-lg leading-relaxed">Arama kriterlerinize veya seçilen konuma uygun aktif restoran bulunamadı. Lütfen filtreleri temizleyerek tekrar deneyin.</p>
                <Link 
                  href="/marketplace" 
                  className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-rose-500 text-rose-600 hover:text-white font-black rounded-full transition-all duration-300 text-base shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5"
                >
                  <ArrowLeft size={18} /> Tüm Restoranları Göster
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
