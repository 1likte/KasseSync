'use client';

import { ShoppingCart, Plus, Minus, Trash2, Hash, User, Loader2, Sparkles, CreditCard, Banknote } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { useState, useEffect } from 'react';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  total: number;
  tableNumber: string;
  setTableNumber: (val: string) => void;
  waiterName: string;
  setWaiterName: (val: string) => void;
  isProcessing: boolean;
  handlePayment: (method: 'cash' | 'card') => void;
}

export function Cart({
  cart,
  updateQuantity,
  removeFromCart,
  total,
  tableNumber,
  setTableNumber,
  waiterName,
  setWaiterName,
  isProcessing,
  handlePayment
}: CartProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length > 0) {
      const getRecommendation = async () => {
        try {
          const res = await fetch('/api/ai/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cart.map(c => c.name) })
          });
          const data = await res.json();
          if (data.suggestion) {
            setRecommendation(data.suggestion);
          }
        } catch (e) {
          console.error('AI Recommendation failed', e);
        }
      };
      
      const timeout = setTimeout(getRecommendation, 1000);
      return () => clearTimeout(timeout);
    } else {
      setRecommendation(null);
    }
  }, [cart]);

  return (
    <div className="w-80 md:w-96 bg-[#1a1a1a] border-l border-[#333333] flex flex-col z-10 relative h-full">
      {isProcessing && (
        <div className="absolute inset-0 bg-[#111111]/90 z-20 flex flex-col items-center justify-center">
          <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">İşlem Yapılıyor...</h3>
        </div>
      )}

      {/* Header Info */}
      <div className="p-3 border-b border-[#333333] bg-[#222222]">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <ShoppingCart size={16} />
            Sipariş
          </h2>
          <span className="text-xs font-mono text-zinc-500">#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Masa"
              className="w-full bg-[#111111] border border-[#444] rounded-sm pl-7 pr-2 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative flex-1">
            <User className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input
              value={waiterName}
              onChange={(e) => setWaiterName(e.target.value)}
              placeholder="Garson"
              className="w-full bg-[#111111] border border-[#444] rounded-sm pl-7 pr-2 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#1a1a1a]">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600">
            <ShoppingCart size={32} className="mb-2 opacity-50" />
            <p className="text-sm uppercase tracking-wide font-medium">Sepet Boş</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-[#222222] border border-[#333] p-2 flex flex-col group">
              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-start">
                  <span className="font-mono text-sm text-blue-400 font-bold">{item.quantity}</span>
                  <h4 className="font-bold text-zinc-200 text-sm leading-tight max-w-[180px] break-words">{item.name}</h4>
                </div>
                <p className="font-mono font-bold text-emerald-400 text-sm">€{(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#333]">
                <div className="flex items-center border border-[#444] rounded-sm overflow-hidden bg-[#111]">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-[#333] active:bg-[#444] text-zinc-400 hover:text-white transition-colors">
                    <Minus size={14} />
                  </button>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-[#333] active:bg-[#444] border-l border-[#444] text-zinc-400 hover:text-white transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {recommendation && (
        <div className="mx-2 mb-2 p-2 bg-[#1a2333] border border-blue-900/50 rounded-sm flex gap-2 items-start">
          <Sparkles className="text-blue-400 shrink-0 mt-0.5" size={14} />
          <p className="text-xs text-blue-200 leading-tight">
            <span className="font-bold uppercase tracking-wider text-blue-400 block mb-0.5 text-[10px]">AI Önerisi</span>
            {recommendation}
          </p>
        </div>
      )}

      {/* Footer / Total / Payment */}
      <div className="bg-[#111] border-t border-[#333] p-4 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg uppercase tracking-wide text-zinc-400 font-bold">Toplam</span>
          <span className="text-3xl font-mono font-bold text-emerald-400">€{total.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePayment('cash')}
            disabled={cart.length === 0 || isProcessing}
            className="flex flex-col items-center justify-center gap-1 bg-[#15803d] hover:bg-[#166534] disabled:opacity-50 disabled:grayscale text-white py-4 rounded-sm transition-colors shadow-sm"
          >
            <Banknote size={20} />
            <span className="font-bold uppercase tracking-wide text-sm">Nakit</span>
          </button>
          <button
            onClick={() => handlePayment('card')}
            disabled={cart.length === 0 || isProcessing}
            className="flex flex-col items-center justify-center gap-1 bg-[#0369a1] hover:bg-[#075985] disabled:opacity-50 disabled:grayscale text-white py-4 rounded-sm transition-colors shadow-sm"
          >
            <CreditCard size={20} />
            <span className="font-bold uppercase tracking-wide text-sm">Kart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
