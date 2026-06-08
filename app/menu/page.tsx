'use client';

import { useState } from 'react';
import { Search, Flame, Utensils, Coffee, IceCream, Info, ShoppingBag } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Tümü', icon: <Utensils size={18} /> },
  { id: 'popular', name: 'Popüler', icon: <Flame size={18} className="text-orange-500" /> },
  { id: 'burger', name: 'Burger', icon: <Utensils size={18} /> },
  { id: 'drinks', name: 'İçecekler', icon: <Coffee size={18} /> },
  { id: 'dessert', name: 'Tatlılar', icon: <IceCream size={18} /> },
];

const menuItems = [
  { 
    id: '1', categoryId: 'popular', name: 'Truffle Burger', 
    description: '180g dana köfte, trüf mayonez, karamelize soğan ve cheddar.', 
    price: 14.50, 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '2', categoryId: 'burger', name: 'Classic Burger', 
    description: '150g köfte, taze marul, domates, özel sos.', 
    price: 9.50, 
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '3', categoryId: 'drinks', name: 'Ev Yapımı Limonata', 
    description: 'Taze sıkılmış nane ve limon ile hazırlanır.', 
    price: 4.50, 
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '4', categoryId: 'dessert', name: 'San Sebastian', 
    description: 'Akışkan çikolata sosu ile servis edilir.', 
    price: 6.50, 
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop' 
  },
];

export default function QRMenu() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-900/40 to-transparent -z-10 blur-3xl"></div>
      
      {/* Header Profile / Restaurant Info */}
      <div className="pt-12 px-6 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Utensils size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              KasseSync Lounge
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Açık • Kapanış 23:00
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input 
            type="text" 
            placeholder="Lezzet ara..." 
            className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700/50 text-white rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 premium-transition shadow-lg"
          />
        </div>
      </div>

      {/* Category Horizontal Scroll */}
      <div className="px-6 mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl premium-transition whitespace-nowrap border ${
                activeCategory === cat.id 
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10' 
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.icon}
              <span className="font-medium text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 space-y-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="group relative glass-panel rounded-3xl p-4 flex gap-4 overflow-hidden premium-transition hover:border-slate-500/50 active:scale-[0.98]">
            <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 premium-transition" />
              {item.categoryId === 'popular' && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">
                  POPÜLER
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-1 py-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-100 leading-tight pr-2">{item.name}</h3>
                <button className="text-slate-400 hover:text-white">
                  <Info size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mb-auto leading-relaxed">
                {item.description}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-emerald-400">€{item.price.toFixed(2)}</span>
                <button className="bg-blue-600 hover:bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center premium-transition shadow-lg shadow-blue-500/30">
                  <span className="text-lg font-medium leading-none">+</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (Optional View Order) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[calc(448px-3rem)]">
        <button className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 premium-transition active:scale-95">
          <ShoppingBag size={20} />
          Siparişi Görüntüle (0)
        </button>
      </div>

    </div>
  );
}
