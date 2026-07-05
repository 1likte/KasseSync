'use client';

import React, { useState } from 'react';
import { MapPin, Phone, User, X, CheckCircle } from 'lucide-react';

export function OnlineOrderForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    submitter?.setAttribute('disabled', 'true');
    e.preventDefault();
    
    // Simulate getting items from a public cart (we'll just send a generic one for demo)
    // In a real app, you would read from a global store for the landing page cart
    const onlineOrder = {
      id: `online-${Date.now()}`,
      orderId: `ORD-${Date.now()}`,
      type: 'takeaway',
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      items: [
        { id: '1', name: 'Gastro Burger Menü', price: 180, quantity: 2, category_id: 'food', note: 'Bol soslu' },
        { id: '2', name: 'Coca Cola Zero', price: 40, quantity: 2, category_id: 'drink' }
      ],
      createdAt: new Date(),
      status: 'new'
    };

    // Send to POS system via localStorage (this simulates real-time sync across the same machine for demo)
    // In production, this would be an API call to Supabase to insert into `orders`
    try {
      const activeOrders = JSON.parse(localStorage.getItem('gastro_active_orders') || '[]');
      localStorage.setItem('gastro_active_orders', JSON.stringify([...activeOrders, onlineOrder]));
      
      // Also add to POS sessions so it appears in Adisyonlar
      const posSessions = JSON.parse(localStorage.getItem('gastro_sessions') || '{}');
      posSessions[onlineOrder.id] = onlineOrder;
      localStorage.setItem('gastro_sessions', JSON.stringify(posSessions));
      
      // Dispatch storage event manually for the same window (though usually it fires for other windows)
      window.dispatchEvent(new Event('storage'));
      
    } catch (err) {
      console.error(err);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSuccess(false);
      setFormData({ name: '', phone: '', address: '' });
    }, 3000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex-1 md:flex-none px-8 py-4 bg-[#42A860] hover:bg-[#348B4E] text-white font-bold rounded-full transition-all shadow-lg hover:-translate-y-0.5"
      >
        Hemen Sipariş Ver
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSuccess && setIsOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            
            {isSuccess ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Siparişiniz Alındı!</h2>
                <p className="text-slate-600 mb-6">Paket siparişiniz doğrudan restoranın mutfağına iletildi. En kısa sürede yola çıkacaktır.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">Paket Sipariş Bilgileri</h2>
                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 mb-4">
                    Sepetinizdeki ürünler sipariş olarak gönderilecektir. Teslimat için lütfen bilgilerinizi girin.
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                      <User size={16}/> Adınız Soyadınız
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#42A860] focus:ring-1 focus:ring-[#42A860] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                      <Phone size={16}/> Telefon Numarası
                    </label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#42A860] focus:ring-1 focus:ring-[#42A860] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                      <MapPin size={16}/> Teslimat Adresi
                    </label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#42A860] focus:ring-1 focus:ring-[#42A860] outline-none h-24 resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#42A860] hover:bg-[#348B4E] text-white font-bold rounded-xl mt-4 text-lg">
                    Siparişi Tamamla
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
