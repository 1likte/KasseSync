import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Package, ChevronDown } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  portion?: number;
}

interface CompletedOrder {
  id: string;
  type: string;
  completedAt: string;
  items: OrderItem[];
  totalAmount: number;
}

interface OrdersStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CompletedOrder[];
}

export function OrdersStatsModal({ isOpen, onClose, orders }: OrdersStatsModalProps) {
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [filteredOrders, setFilteredOrders] = useState<CompletedOrder[]>([]);

  useEffect(() => {
    const now = new Date();
    let filtered = orders;

    if (filter === 'daily') {
      filtered = orders.filter(o => {
        const d = new Date(o.completedAt);
        return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (filter === 'weekly') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = orders.filter(o => new Date(o.completedAt) >= oneWeekAgo);
    } else if (filter === 'monthly') {
      filtered = orders.filter(o => {
        const d = new Date(o.completedAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }

    setFilteredOrders(filtered);
  }, [filter, orders]);

  if (!isOpen) return null;

  // 1. Hourly Timeline
  const hourlyStats = filteredOrders.reduce((acc, order) => {
    const hour = new Date(order.completedAt).getHours();
    const timeKey = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
    if (!acc[timeKey]) acc[timeKey] = 0;
    acc[timeKey]++;
    return acc;
  }, {} as Record<string, number>);

  const hourlyTimeline = Object.entries(hourlyStats).sort((a, b) => a[0].localeCompare(b[0]));

  // 2. Product Aggregates
  const productStats = filteredOrders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.name]) acc[item.name] = 0;
      acc[item.name] += item.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedProducts = Object.entries(productStats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Toplam Sipariş İstatistikleri</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Sipariş dağılımı ve satılan ürün detayları</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20">
          
          {/* Filters */}
          <div className="flex gap-2 mb-8">
            <button 
              onClick={() => setFilter('daily')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${filter === 'daily' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Günlük
            </button>
            <button 
              onClick={() => setFilter('weekly')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${filter === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Haftalık
            </button>
            <button 
              onClick={() => setFilter('monthly')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${filter === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Aylık
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Hourly Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Saatlere Göre Siparişler</h3>
              </div>
              
              {hourlyTimeline.length === 0 ? (
                <p className="text-slate-400 text-center py-10">Bu dönemde sipariş bulunmamaktadır.</p>
              ) : (
                <div className="space-y-4">
                  {hourlyTimeline.map(([time, count], i) => (
                    <div key={i} className="flex items-center gap-4 relative">
                      <div className="w-24 text-sm font-bold text-slate-500">{time}</div>
                      <div className="w-3 h-3 rounded-full bg-indigo-500 relative z-10 border-2 border-white ring-2 ring-indigo-100"></div>
                      {i !== hourlyTimeline.length - 1 && (
                        <div className="absolute left-[3.25rem] top-3 bottom-[-1.5rem] w-px bg-slate-200 z-0"></div>
                      )}
                      <div className="flex-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-bold text-slate-700">
                        {count} Sipariş
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Aggregates */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package size={20} />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Satılan Ürünler</h3>
              </div>

              {sortedProducts.length === 0 ? (
                <p className="text-slate-400 text-center py-10">Bu dönemde satılan ürün bulunmamaktadır.</p>
              ) : (
                <div className="space-y-3">
                  {sortedProducts.map(([name, count], i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-300 w-5">{i + 1}</span>
                        <span className="font-bold text-slate-700">{name}</span>
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-sm">
                        x{count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
