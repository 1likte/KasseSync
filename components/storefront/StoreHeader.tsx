'use client';

import Link from 'next/link';
import { useStoreCart } from '@/lib/contexts/StoreCartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import LanguageToggle from '@/components/LanguageToggle';

interface StoreHeaderProps {
  restaurantName: string;
}

export default function StoreHeader({ restaurantName }: StoreHeaderProps) {
  const { totalItems, totalPrice, setIsCartOpen } = useStoreCart();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for glassmorphism header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 right-0 left-0 md:left-64 z-30 flex items-center justify-between px-6 transition-all duration-300 ${
        scrolled 
          ? 'h-20 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 shadow-lg' 
          : 'h-24 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <Link 
          href="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 hover:scale-105"
          title="Marketplace'e Dön"
        >
          <ArrowLeft size={18} />
        </Link>
        
        {/* Responsive title, hidden on desktop if hero banner is huge, but let's keep it subtle */}
        <div className={`transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
          <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-md">{restaurantName}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageToggle className="hidden sm:flex" />
        <button 
          onClick={() => setIsCartOpen(true)}
          className={`group flex items-center gap-3 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden ${
            totalItems > 0 
              ? 'bg-gradient-to-r from-[#e31837] to-[#c4152f] text-white shadow-[0_5px_20px_rgba(227,24,55,0.4)] hover:shadow-[0_5px_25px_rgba(227,24,55,0.6)] hover:-translate-y-0.5' 
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
          }`}
        >
          {totalItems > 0 && (
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl"></div>
          )}
          
          <div className="relative z-10 flex items-center gap-2">
            <div className="relative">
              <ShoppingCart size={20} className={totalItems > 0 ? "text-white" : "text-gray-400 group-hover:text-white transition-colors"} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-[#e31837] rounded-full text-[10px] font-black flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            
            <span className="hidden sm:inline">Sepet</span>
            
            {totalItems > 0 && (
              <>
                <span className="w-px h-4 bg-white/30 mx-1"></span>
                <span className="font-bold">€{totalPrice.toFixed(2)}</span>
              </>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
