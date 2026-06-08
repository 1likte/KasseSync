'use client';

import { useState } from 'react';
import { ShoppingCart, Search, Utensils, Coffee, CreditCard, Banknote, Plus, Minus, Trash2, CheckCircle2, Loader2, X } from 'lucide-react';

// Mock data for initial UI
const categories = [
  { id: '1', name: 'Burger', icon: <Utensils size={20} /> },
  { id: '2', name: 'İçecekler', icon: <Coffee size={20} /> },
  { id: '3', name: 'Tatlılar', icon: <Utensils size={20} /> },
];

const products = [
  { id: '101', categoryId: '1', name: 'Classic Burger', price: 8.50, color: 'from-blue-500/20 to-blue-600/20' },
  { id: '102', categoryId: '1', name: 'Cheeseburger', price: 9.50, color: 'from-yellow-500/20 to-yellow-600/20' },
  { id: '103', categoryId: '1', name: 'BBQ Bacon Burger', price: 11.50, color: 'from-red-500/20 to-red-600/20' },
  { id: '104', categoryId: '2', name: 'Kola', price: 2.50, color: 'from-slate-500/20 to-slate-600/20' },
  { id: '105', categoryId: '2', name: 'Ayran', price: 2.00, color: 'from-white/10 to-white/20' },
  { id: '106', categoryId: '2', name: 'Su', price: 1.50, color: 'from-cyan-500/20 to-cyan-600/20' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('1');
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  
  // Payment states
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async (method: 'cash' | 'card') => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const res = await fetch('/api/fiskaly/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total, items: cart, method })
      });
      
      const result = await res.json();
      
      if (result.success) {
        setReceiptData({
          items: [...cart],
          total,
          method,
          tseData: result.data
        });
        setCart([]); // Clear cart
      }
    } catch (error) {
      console.error('Payment failed', error);
      alert('Ödeme işleminde bir hata oluştu!');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 overflow-hidden font-sans relative">
      
      {/* Receipt Modal */}
      {receiptData && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-50 w-full max-w-sm rounded-xl shadow-2xl p-6 text-slate-900 flex flex-col relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setReceiptData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold">Ödeme Alındı</h2>
              <p className="text-sm text-slate-500">KasseSync Test Restaurant</p>
            </div>
            
            <div className="border-t border-dashed border-slate-300 py-4 mb-4">
              {receiptData.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm mb-2">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>TOPLAM</span>
              <span>€{receiptData.total.toFixed(2)}</span>
            </div>
            
            {/* TSE Section (KassenSichV compliance proof) */}
            <div className="bg-slate-100 p-3 rounded-lg text-[10px] text-slate-500 font-mono break-all leading-tight border border-slate-200">
              <p className="font-bold text-slate-700 mb-1">TSE İMZA VERİSİ (MOCK)</p>
              <p>TX: {receiptData.tseData.fiskaly_transaction_id}</p>
              <p>Start: {new Date(receiptData.tseData.tse_start_time).toLocaleString()}</p>
              <p className="mt-1">Sign: {receiptData.tseData.fiskaly_signature}</p>
            </div>
            
            <button 
              onClick={() => setReceiptData(null)}
              className="mt-6 w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              Yeni Sipariş
            </button>
          </div>
        </div>
      )}

      {/* Left Area: Categories & Products */}
      <div className="flex-1 flex flex-col p-6">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              KasseSync POS
            </h1>
            <p className="text-slate-400 text-sm mt-1">Hızlı ve güvenli satış sistemi</p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input 
              type="text" 
              placeholder="Ürün ara..." 
              className="bg-slate-800/50 border border-slate-700 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 premium-transition w-64"
            />
          </div>
        </header>

        {/* Categories */}
        <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl premium-transition whitespace-nowrap ${
                activeCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'glass-panel text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              {cat.icon}
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.filter(p => p.categoryId === activeCategory).map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className={`relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center p-4 premium-transition hover:scale-105 active:scale-95 glass-panel bg-gradient-to-br ${product.color} group border border-slate-700/50 hover:border-slate-500/50`}
              >
                <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-bold text-emerald-400">
                  €{product.price.toFixed(2)}
                </div>
                <h3 className="text-lg font-semibold text-center mt-4 group-hover:text-white premium-transition">
                  {product.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Area: Cart / Ticket */}
      <div className="w-[400px] glass-panel border-l border-slate-700/50 flex flex-col z-10 shadow-2xl relative">
        {/* Loading Overlay for Payment */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-l-2xl">
            <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white">Ödeme Alınıyor...</h3>
            <p className="text-slate-400 text-sm mt-2">TSE İmzasI Bekleniyor (Fiskaly)</p>
          </div>
        )}

        <div className="p-6 border-b border-slate-700/50 bg-slate-800/40">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="text-blue-400" /> 
            Güncel Sipariş
          </h2>
          <p className="text-sm text-slate-400 mt-1">Masa 12 • Kasiyer: Yunus</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Sepetiniz boş.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-slate-800/80 rounded-xl p-3 flex items-center justify-between group premium-transition hover:bg-slate-700/80">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">{item.name}</h4>
                  <p className="text-emerald-400 font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-900/50 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-500 hover:text-red-400 bg-slate-900/30 rounded-lg opacity-0 group-hover:opacity-100 premium-transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & Payment */}
        <div className="p-6 bg-slate-800/60 border-t border-slate-700/50 backdrop-blur-xl">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-slate-400">
              <span>Ara Toplam</span>
              <span>€{(total * 0.81).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>KDV (19%)</span>
              <span>€{(total * 0.19).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-white mt-2 pt-2 border-t border-slate-700/50">
              <span>Toplam</span>
              <span className="text-emerald-400">€{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button 
              onClick={() => handlePayment('cash')}
              disabled={cart.length === 0 || isProcessing}
              className="flex flex-col items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white p-4 rounded-2xl premium-transition active:scale-95 shadow-lg"
            >
              <Banknote size={24} />
              <span className="font-medium">Nakit</span>
            </button>
            <button 
              onClick={() => handlePayment('card')}
              disabled={cart.length === 0 || isProcessing}
              className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white p-4 rounded-2xl premium-transition active:scale-95 shadow-lg shadow-blue-500/25"
            >
              <CreditCard size={24} />
              <span className="font-medium">Kart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
