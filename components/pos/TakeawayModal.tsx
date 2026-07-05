import React, { useState } from 'react';
import { X, Package, Phone, MapPin, User } from 'lucide-react';

interface TakeawayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTakeaway: (customerName: string, phone: string, address: string) => void;
}

export function TakeawayModal({ isOpen, onClose, onOpenTakeaway }: TakeawayModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleOpen = () => {
    if (customerName.trim() !== '') {
      onOpenTakeaway(customerName, phone, address);
      setCustomerName('');
      setPhone('');
      setAddress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1C36] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col border border-indigo-500/20 overflow-hidden">
        <div className="p-6 border-b border-indigo-500/20 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-indigo-400" /> Paket Sipariş
          </h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-slate-300">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><User size={14}/> Müşteri Adı *</label>
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ad Soyad"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><Phone size={14}/> Telefon</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="05XX XXX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><MapPin size={14}/> Adres</label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none"
              placeholder="Açık Adres"
            />
          </div>

          <div className="pt-4">
            <button onClick={handleOpen} disabled={!customerName.trim()} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/20">
              Siparişi Başlat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
