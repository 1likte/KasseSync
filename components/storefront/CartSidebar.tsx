'use client';

import { useState } from 'react';
import { useStoreCart } from '@/lib/contexts/StoreCartContext';
import { useRouter } from 'next/navigation';

interface CartSidebarProps {
  restaurantId: string;
}

export default function CartSidebar({ restaurantId }: CartSidebarProps) {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useStoreCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          items,
          customerDetails: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulamadı');
      }

      alert('Siparişiniz başarıyla alındı!');
      clearCart();
      setIsCartOpen(false);
      router.push('/marketplace');
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-40"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-[#1a1c23] border-l border-[#2a2d36] z-50 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-[#2a2d36] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Sepetiniz
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Sepetiniz şu an boş.
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-[#2a2d36] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <div className="text-[#e31837] font-bold mt-1">€{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#2a2d36] rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="text-white font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-10 border-t border-[#2a2d36] pt-6">
              <h3 className="text-lg font-bold text-white mb-4">Teslimat Bilgileri</h3>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input 
                    required
                    type="text" 
                    placeholder="Adınız Soyadınız" 
                    className="w-full bg-[#2a2d36] border border-[#3a3d46] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31837]"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <input 
                    required
                    type="tel" 
                    placeholder="Telefon Numaranız" 
                    className="w-full bg-[#2a2d36] border border-[#3a3d46] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31837]"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <textarea 
                    required
                    placeholder="Açık Adresiniz" 
                    rows={3}
                    className="w-full bg-[#2a2d36] border border-[#3a3d46] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31837]"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Sipariş Notu (Opsiyonel)" 
                    rows={2}
                    className="w-full bg-[#2a2d36] border border-[#3a3d46] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e31837]"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[#2a2d36] bg-[#1a1c23]">
            <div className="flex justify-between items-center mb-6 text-lg">
              <span className="text-gray-400">Toplam:</span>
              <span className="text-white font-bold text-2xl">€{totalPrice.toFixed(2)}</span>
            </div>
            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-[#e31837] hover:bg-[#c4152f] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'İşleniyor...' : 'Siparişi Tamamla'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
