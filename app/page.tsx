'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  MapPin,
  ShieldCheck,
  ThumbsUp,
  TrendingUp,
  Eye,
  Percent,
  Clock,
  ShoppingCart,
  Search,
  Star,
  Store,
  ChevronDown,
  Bike
} from 'lucide-react';
import { ReservationSection } from '@/components/landing/ReservationSection';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { FeaturedRestaurantsSection } from '@/components/landing/FeaturedRestaurantsSection';
import { FooterSection } from '@/components/landing/FooterSection';
import { OnlineOrderForm } from '@/components/landing/OnlineOrderForm';

export default function GastroSyncLandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (location.trim()) {
      params.set('location', location.trim());
    }
    router.push(`/marketplace?${params.toString()}`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD3B6] via-[#FFAAA5] to-[#FF8B94] flex flex-col relative overflow-hidden">
      
      {/* Decorative blurry gradients */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FFE5D9] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF9A9E] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      {/* Full-width Header pushed to edges and top */}
      <header className="w-full px-6 sm:px-10 lg:px-16 pt-2 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-50">
        <Link href="/" className="block">
          <Image 
            src="/logo.png" 
            alt="GastroSync Logo" 
            width={400} 
            height={130} 
            className="object-contain drop-shadow-md h-auto w-auto max-h-32 scale-110 origin-left"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-md border border-white/30 transition-all text-sm shadow-sm">
            İşletme Girişi
          </Link>
          <div className="relative">
            <button 
              onClick={() => setIsPartnerDropdownOpen(!isPartnerDropdownOpen)}
              onBlur={() => setTimeout(() => setIsPartnerDropdownOpen(false), 200)}
              className="px-6 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all text-sm shadow-lg shadow-teal-600/30 flex items-center gap-1.5 focus:outline-none"
            >
              Partner Ol <ChevronDown size={14} className={`transition-transform duration-200 ${isPartnerDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isPartnerDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-150 overflow-hidden z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link href="/partner-apply" className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-bold transition-colors">
                  <Store size={16} className="text-teal-600 shrink-0" />
                  Restoran Başvurusu
                </Link>
                <div className="h-[1px] bg-slate-100 mx-2"></div>
                <Link href="/courier-apply" className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-bold transition-colors">
                  <Bike size={16} className="text-teal-600 shrink-0" />
                  Kurye Başvurusu
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 relative z-40 flex flex-col">
        
        {/* Hero Content */}
        <div className="text-center relative z-10 mb-6 mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10 drop-shadow-sm tracking-tight">
            Acıktın mı? En sevdiğin yemekler kapında!
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 bg-white/30 p-3 rounded-[2.5rem] backdrop-blur-lg border border-white/50 shadow-xl">
            <div className="flex-1 flex items-center bg-white rounded-full px-6 py-4 w-full shadow-inner">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Lokasyonunuz..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none w-2/5 text-gray-700 placeholder-gray-400 font-medium"
              />
              <div className="w-[1px] h-8 bg-gray-200 mx-4"></div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value === '') setSearchResults([]); // clear results if empty
                }}
                placeholder="Yemek arayın... (Örn: Adana Kebap)" 
                className="bg-transparent border-none outline-none flex-1 text-gray-700 placeholder-gray-400 font-medium"
              />
              <button type="submit" disabled={isSearching} className="ml-2 bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full transition-colors disabled:opacity-50">
                <Search size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <ReservationSection />
              <OnlineOrderForm />
            </div>
          </form>
        </div>

        {/* Search Results or Default Sections */}
        {searchQuery && searchResults.length > 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">"{searchQuery}" için sonuçlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl shadow-inner shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-sm font-medium text-gray-500 line-clamp-1 flex items-center gap-1">
                        <Store size={14}/> {item.restaurant}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-rose-500">₺{item.price.toFixed(2)}</span>
                      <span className="flex items-center text-sm font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
                        <Star size={12} className="mr-1 fill-amber-500"/> {item.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery && searchResults.length === 0 && !isSearching ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-12 text-center border border-white/50 shadow-xl mt-6">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sonuç bulunamadı</h2>
            <p className="text-gray-500">Farklı bir yemek veya restoran aramayı deneyin.</p>
          </div>
        ) : (
          <>
            <CategoriesSection />
            <FeaturedRestaurantsSection />
          </>
        )}
      </div>

      {/* Main Container (Bottom half) - only show if not searching */}
      {!searchQuery && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            {/* Customers */}
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 border border-white/50 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Müşteriler İçin Avantajlar</h3>
              <ul className="space-y-5">
                <li className="flex items-center gap-4 text-gray-700 font-semibold">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  Hızlı Teslimat
                </li>
                <li className="flex items-center gap-4 text-gray-700 font-semibold">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  Güvenli Ödeme
                </li>
                <li className="flex items-center gap-4 text-gray-700 font-semibold">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-500 shadow-sm">
                    <ThumbsUp className="w-6 h-6" />
                  </div>
                  Doğru Yorumlar
                </li>
              </ul>
            </div>

            {/* Restaurants */}
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 border border-white/50 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Restoranlar İçin Avantajlar</h3>
              <ul className="space-y-5">
                <li className="flex items-center gap-4 text-gray-700 font-semibold">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-500 shadow-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  İşinizi Büyütün
                </li>
                <li className="flex items-center gap-4 text-gray-700 font-semibold">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500 shadow-sm">
                    <Eye className="w-6 h-6" />
                  </div>
                  Daha Fazla Görünürlük
                </li>
                <li className="flex items-center gap-4 text-gray-700 font-semibold">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-500 shadow-sm">
                    <Percent className="w-6 h-6" />
                  </div>
                  Rekabetçi Komisyon
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
}
