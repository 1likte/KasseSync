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
  Bike,
  Menu,
  X,
  User,
  List,
  Award,
  HelpCircle,
  Gift,
  Sun,
  Globe,
  LogIn
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

      {/* Header */}
      <header className="w-full px-4 sm:px-10 lg:px-16 py-3 flex items-center justify-between gap-4 relative z-50 bg-transparent">
        <Link href="/" className="block">
          <Image 
            src="/logo.png" 
            alt="GastroSync Logo" 
            width={240} 
            height={78} 
            className="object-contain drop-shadow-md h-16 md:h-20 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-md border border-white/30 transition-all text-xs shadow-sm">
              İşletme Girişi
            </Link>
            <div className="relative">
              <button 
                onClick={() => setIsPartnerDropdownOpen(!isPartnerDropdownOpen)}
                onBlur={() => setTimeout(() => setIsPartnerDropdownOpen(false), 200)}
                className="px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all text-xs shadow-lg shadow-teal-600/30 flex items-center gap-1.5 focus:outline-none"
              >
                Partner Ol <ChevronDown size={12} className={`transition-transform duration-200 ${isPartnerDropdownOpen ? 'rotate-180' : ''}`} />
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
          
          {/* User Profile / Hamburger trigger */}
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition-all shadow-sm group font-bold text-xs"
          >
            <Menu className="w-4 h-4 text-white" />
            <User className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      {/* Sliding Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />
          
          {/* Drawer content panel */}
          <div className="relative w-[320px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-150">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-rose-500" />
                Hesabım
              </h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Scrollable list content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
              {/* Promo Card (Lieferando-style) */}
              <div className="bg-gradient-to-br from-indigo-50 to-rose-50 border border-indigo-100/50 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm mb-2">Daha fazla avantaj için giriş yapın ✨</h3>
                <ul className="text-xs text-slate-600 space-y-1.5 mb-4 list-disc list-inside">
                  <li>Özel teklifler ve indirimler</li>
                  <li>Hızlı ve kolay sipariş adımları</li>
                  <li>Anlık sipariş takibi</li>
                </ul>
                <Link 
                  href="/login"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block w-full py-3 text-center text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-md shadow-rose-500/25"
                >
                  Giriş Yap veya Üye Ol
                </Link>
              </div>

              {/* Navigation list */}
              <div className="space-y-1">
                <Link href="/login" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors group">
                  <List className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Siparişlerim</span>
                </Link>
                <Link href="/marketplace" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors group">
                  <Award className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Avantajlar & Kampanyalar</span>
                </Link>
                <Link href="/marketplace" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors group">
                  <Percent className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Kuponlarım</span>
                </Link>
                <Link href="/marketplace" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors group">
                  <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Yardım Alın</span>
                </Link>
                <Link href="/marketplace" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors group">
                  <Gift className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Hediye Kartı</span>
                </Link>
                
                <div className="h-[1px] bg-slate-100 my-4 mx-2"></div>
                
                <div className="flex items-center justify-between px-3 py-3 text-slate-700 text-sm font-semibold">
                  <div className="flex items-center gap-3">
                    <Sun className="w-4 h-4 text-slate-400" />
                    <span>Tema Modu</span>
                  </div>
                  <span className="text-xs text-slate-400">Sistem</span>
                </div>
                <div className="flex items-center justify-between px-3 py-3 text-slate-700 text-sm font-semibold">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>Dil</span>
                  </div>
                  <span className="text-xs text-slate-400">Türkçe (TR)</span>
                </div>
                
                <div className="h-[1px] bg-slate-100 my-4 mx-2"></div>
                
                <Link href="/partner-apply" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors group">
                  <Store className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Restoran Ortağımız Olun</span>
                </Link>
                <Link href="/courier-apply" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors group">
                  <Bike className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Kuryemiz Olun</span>
                </Link>
                <Link href="/login" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors group">
                  <LogIn className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>İşletme Girişi</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 relative z-40 flex flex-col">
        
        {/* Hero Content */}
        <div className="text-center relative z-10 mb-6 mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10 drop-shadow-sm tracking-tight">
            Acıktın mı? En sevdiğin yemekler kapında!
          </h1>

          {/* Search Area Container */}
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 items-center">
            {/* Main Search Form */}
            <form onSubmit={handleSearch} className="w-full bg-white p-2 md:p-3 rounded-[2rem] md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/60">
              {/* Location Input */}
              <div className="flex items-center w-full md:w-1/3 px-4 py-3 md:py-2 md:border-r border-gray-100">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mr-3" />
                <input 
                  type="text" 
                  placeholder="Lokasyonunuz..." 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 font-medium text-base"
                />
              </div>

              {/* Search Query Input */}
              <div className="flex items-center flex-1 w-full px-4 py-3 md:py-2 border-t md:border-t-0 border-gray-100">
                <Search className="w-5 h-5 text-rose-500 shrink-0 mr-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value === '') setSearchResults([]);
                  }}
                  placeholder="Yemek veya restoran arayın..." 
                  className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 font-medium text-base"
                />
              </div>

              {/* Search Submit Button */}
              <button 
                type="submit" 
                disabled={isSearching} 
                className="w-full md:w-auto px-8 py-3.5 md:py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all shadow-md shadow-rose-500/25 disabled:opacity-50 text-base flex items-center justify-center gap-2 shrink-0 mt-2 md:mt-0"
              >
                <Search size={20} />
                <span>Restoran Bul</span>
              </button>
            </form>

            {/* Quick Actions (Rezervasyon & Hızlı Sipariş) */}
            <div className="flex flex-wrap items-center justify-center gap-4 w-full">
              <ReservationSection />
              <OnlineOrderForm />
            </div>
          </div>
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
