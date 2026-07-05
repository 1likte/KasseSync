import React, { useState, useEffect } from 'react';
import { X, Clock, Settings as SettingsIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [form, setForm] = useState({
    openTime: '09:00',
    closeTime: '22:00',
  });

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('gastro_restaurant_settings');
      if (stored) {
        setForm(JSON.parse(stored));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gastro_restaurant_settings', JSON.stringify(form));
    alert('Ayarlar başarıyla kaydedildi!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="text-indigo-500" /> Restoran Ayarları
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-2">
              <h3 className="font-bold text-indigo-900 mb-1">Çalışma Saatleri</h3>
              <p className="text-sm text-indigo-700">Müşteriler sadece bu saatler arasında rezervasyon ve sipariş oluşturabilir.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Clock size={16}/> Açılış</label>
                <input 
                  required 
                  type="time" 
                  value={form.openTime} 
                  onChange={e => setForm({...form, openTime: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Clock size={16}/> Kapanış</label>
                <input 
                  required 
                  type="time" 
                  value={form.closeTime} 
                  onChange={e => setForm({...form, closeTime: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">İptal</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-colors">Kaydet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
