'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu, 
  X, 
  User, 
  List, 
  Award, 
  HelpCircle, 
  Gift, 
  Sun, 
  Globe, 
  LogIn, 
  Store, 
  Bike,
  ShoppingCart,
  Percent
} from 'lucide-react';

export default function MarketplaceHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg w-full px-4 sm:px-10 lg:px-16 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="block">
          <Image 
            src="/logo.png" 
            alt="GastroSync Logo" 
            width={240} 
            height={78} 
            className="object-contain drop-shadow-md h-12 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          {/* Desktop links */}
          <Link href="/login" className="hidden md:block px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-md border border-white/30 transition-all text-xs shadow-sm">
            İşletme Girişi
          </Link>
          
          {/* Shopping Cart */}
          <button className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition-all group shadow-sm">
            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center font-bold text-white shadow-sm border border-white/20">2</span>
            </span>
          </button>

          {/* User Profile / Hamburger trigger */}
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition-all shadow-sm group font-bold text-xs"
          >
            <Menu className="w-4 h-4 text-white" />
            <User className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      {/* Sliding Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
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
    </>
  );
}
