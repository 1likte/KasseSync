'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface StoreSidebarProps {
  categories: Category[];
  slug: string;
}

export default function StoreSidebar({ categories, slug }: StoreSidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-[#0a0a0c]/90 backdrop-blur-2xl border-r border-white/5 h-screen fixed left-0 top-0 overflow-y-auto z-40 hidden md:flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      
      {/* Brand Logo Area */}
      <div className="p-6 h-24 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e31837] to-transparent opacity-50"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e31837] to-[#8a0f21] flex items-center justify-center shadow-[0_0_15px_rgba(227,24,55,0.5)]">
            <span className="text-white font-black text-xl">K</span>
          </div>
          <span className="text-xl font-bold tracking-widest text-white">MENU</span>
        </div>
      </div>

      <div className="p-6 flex-grow">
        <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <UtensilsCrossed size={14} />
          <span>Kategoriler</span>
        </h2>
        
        <nav className="space-y-2 relative">
          {/* Vitrin Link */}
          <Link 
            href={`/store/${slug}`}
            className={`group flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden ${
              pathname === `/store/${slug}` 
                ? 'text-white shadow-[0_0_20px_rgba(227,24,55,0.15)] bg-gradient-to-r from-[#e31837]/20 to-transparent border border-[#e31837]/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {pathname === `/store/${slug}` && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e31837] rounded-full shadow-[0_0_10px_#e31837]"></div>
            )}
            <Sparkles size={18} className={pathname === `/store/${slug}` ? "text-[#e31837]" : "text-gray-500 group-hover:text-gray-300"} />
            <span className="tracking-wide">Öne Çıkanlar</span>
          </Link>
          
          {/* Categories Links */}
          {categories.map((category) => {
            const isSelected = pathname === `/store/${slug}/category/${category.id}`;
            return (
              <Link
                key={category.id}
                href={`/store/${slug}/category/${category.id}`}
                className={`group flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 relative ${
                  isSelected
                    ? 'text-white bg-white/10 border border-white/10 shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gray-300 rounded-r-full shadow-[0_0_10px_white]"></div>
                )}
                <span className="tracking-wide">{category.name}</span>
                
                {/* Subtle hover arrow */}
                <span className={`absolute right-4 transform transition-all duration-300 ${isSelected ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                  →
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Footer Area */}
      <div className="p-6 border-t border-white/5 text-center">
        <span className="text-xs text-gray-600 font-medium tracking-wider">POWERED BY KASSE</span>
      </div>
    </div>
  );
}
