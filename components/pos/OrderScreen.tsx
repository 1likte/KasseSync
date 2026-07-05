'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, ChefHat, Coffee, AlertCircle } from 'lucide-react';

export function OrderScreen({ type }: { type: 'kitchen' | 'bar' }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Load categories to know what is food and what is drink
    fetch('/api/admin/menu')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setCategories(data.categories || []);
        }
      });

    const loadOrders = () => {
      const active = JSON.parse(localStorage.getItem('gastro_active_orders') || '[]');
      setOrders(active);
    };

    loadOrders();
    
    // Listen for cross-tab updates (when POS sends an order)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'gastro_active_orders') {
        loadOrders();
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const markAsReady = (orderId: string) => {
    const updated = orders.map(o => o.orderId === orderId ? { ...o, status: 'ready' } : o);
    setOrders(updated);
    localStorage.setItem('gastro_active_orders', JSON.stringify(updated));
  };

  const finishOrder = (orderId: string) => {
    const updated = orders.filter(o => o.orderId !== orderId);
    setOrders(updated);
    localStorage.setItem('gastro_active_orders', JSON.stringify(updated));
  };

  // Filter orders by department
  const departmentOrders = orders.map(order => {
    const relevantItems = order.items.filter((item: any) => {
      const cat = categories.find((c: any) => c.id === item.category_id);
      const catName = cat?.name?.toLowerCase() || '';
      const isDrink = ['içecek', 'kahve', 'bar', 'meşrubat', 'su', 'kola', 'soğuk', 'sıcak', 'çay', 'i̇çecek'].some(kw => catName.includes(kw));
      return type === 'kitchen' ? !isDrink : isDrink;
    });
    return { ...order, items: relevantItems };
  }).filter(order => order.items.length > 0);

  const title = type === 'kitchen' ? 'Mutfak Ekranı (KDS)' : 'Bar Ekranı (BDS)';
  const bgColor = type === 'kitchen' ? 'bg-orange-950' : 'bg-slate-950';
  const headerColor = type === 'kitchen' ? 'bg-orange-900' : 'bg-slate-900';
  const accentColor = type === 'kitchen' ? 'text-orange-400' : 'text-blue-400';
  const Icon = type === 'kitchen' ? ChefHat : Coffee;

  return (
    <div className={`min-h-screen ${bgColor} text-slate-200 font-sans p-6 overflow-y-auto`}>
      <header className={`flex items-center justify-between ${headerColor} p-4 rounded-2xl mb-6 border border-white/10 shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl">
            <Icon size={32} className={accentColor} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Aktif - {departmentOrders.length} Bekleyen Sipariş
            </p>
          </div>
        </div>
        <div className="text-xl font-bold text-slate-300 font-mono bg-black/30 px-6 py-3 rounded-xl border border-white/5">
          {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {departmentOrders.length === 0 ? (
          <div className="col-span-full h-[60vh] flex flex-col items-center justify-center text-slate-500 opacity-50">
            <CheckCircle size={80} className="mb-6" />
            <h2 className="text-3xl font-bold">Tüm Siparişler Hazır</h2>
            <p className="mt-2 text-lg">Bekleyen yeni sipariş yok.</p>
          </div>
        ) : (
          departmentOrders.map(order => {
            const isReady = order.status === 'ready';
            const timeDiff = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);
            const isLate = timeDiff > (type === 'kitchen' ? 15 : 5); // 15 mins for food, 5 mins for drinks
            
            return (
              <div key={order.orderId} className={`flex flex-col bg-white/5 rounded-2xl border ${isReady ? 'border-emerald-500/50 bg-emerald-950/20' : isLate ? 'border-red-500/50 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'} overflow-hidden shadow-xl transition-all`}>
                
                <div className={`p-4 border-b ${isReady ? 'border-emerald-500/20 bg-emerald-500/10' : isLate ? 'border-red-500/20 bg-red-500/10' : 'border-white/10 bg-black/20'} flex items-center justify-between`}>
                  <div>
                    <h3 className="text-xl font-bold text-white">{order.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/10 ${order.type === 'takeaway' ? 'text-amber-400' : 'text-indigo-300'}`}>
                        {order.type === 'takeaway' ? 'Paket' : 'İçeride'}
                      </span>
                      {order.pax && <span className="text-xs text-slate-400">{order.pax} Kişi</span>}
                    </div>
                  </div>
                  <div className={`flex flex-col items-end ${isLate && !isReady ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                    <div className="flex items-center gap-1.5 text-lg">
                      {isLate && !isReady && <AlertCircle size={18} className="animate-pulse" />}
                      <Clock size={18} />
                      {timeDiff} dk
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-3 bg-black/10">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-start pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex-1 pr-4">
                        <div className="font-bold text-lg text-white leading-tight">{item.name}</div>
                        {item.note && (
                          <div className="text-amber-400/90 text-sm mt-1 font-medium bg-amber-950/30 px-3 py-2 rounded-lg inline-block border border-amber-500/20">
                            ★ {item.note}
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-black bg-white/10 w-12 h-12 flex items-center justify-center rounded-xl text-white">
                        {item.quantity}
                      </div>
                    </div>
                  ))}
                  
                  {order.note && (
                    <div className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200">
                      <div className="font-bold text-xs uppercase tracking-wider mb-1 opacity-70">Sipariş Notu</div>
                      <div className="font-medium">{order.note}</div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-black/30 border-t border-white/5 flex gap-3">
                  {!isReady ? (
                    <button onClick={() => markAsReady(order.orderId)} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-2">
                      <CheckCircle size={24} /> Hazırla
                    </button>
                  ) : (
                    <button onClick={() => finishOrder(order.orderId)} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-lg shadow-lg transition-all">
                      Gönderildi (Kapat)
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
