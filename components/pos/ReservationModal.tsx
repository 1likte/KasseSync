import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Store, FileText, Mail } from 'lucide-react';
import type { Reservation } from '@/app/possystem/[restaurantSlug]/pos-types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onAddReservation: (res: Omit<Reservation, 'id'>) => void;
  tables: any[];
}

export function ReservationModal({ isOpen, onClose, reservations, onAddReservation, tables }: ReservationModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    pax: 2,
    tableId: '',
    note: '',
    email: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.customerName) {
      onAddReservation(form);
      setIsAdding(false);
      setForm({
        ...form,
        customerName: '',
        phone: '',
        pax: 2,
        tableId: '',
        note: '',
        email: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1C36] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col border border-indigo-500/20 overflow-hidden max-h-[80vh]">
        <div className="p-6 border-b border-indigo-500/20 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-indigo-400" /> Rezervasyonlar
          </h2>
          <div className="flex gap-3">
            {!isAdding && (
              <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm">
                Yeni Rezervasyon
              </button>
            )}
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-slate-300">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {isAdding ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><User size={14}/> Müşteri Adı *</label>
                  <input required type="text" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><Phone size={14}/> Telefon *</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><Mail size={14}/> E-Posta *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><Calendar size={14}/> Tarih</label>
                  <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><Clock size={14}/> Saat</label>
                  <input required type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><User size={14}/> Kişi Sayısı</label>
                  <input required type="number" min="1" value={form.pax} onChange={e => setForm({...form, pax: parseInt(e.target.value) || 1})} className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><Store size={14}/> Masa (Opsiyonel)</label>
                  <select value={form.tableId} onChange={e => setForm({...form, tableId: e.target.value})} className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none">
                    <option value="">Atanmadı</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>Masa {t.table_number}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><FileText size={14}/> Not / Özel İstek</label>
                <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none h-20" placeholder="Örn: Cam kenarı vs." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold">İptal</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold">Kaydet</button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {reservations.length === 0 ? (
                <div className="text-center text-slate-400 py-12">Henüz rezervasyon bulunmuyor.</div>
              ) : (
                reservations.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map(res => (
                  <div key={res.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-lg">{res.customerName}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-indigo-400"/> {res.date}</span>
                        <span className="flex items-center gap-1"><Clock size={14} className="text-amber-400"/> {res.time}</span>
                        <span className="flex items-center gap-1"><User size={14}/> {res.pax} Kişi</span>
                        {res.tableId && <span className="flex items-center gap-1"><Store size={14} className="text-emerald-400"/> Masa {tables.find(t=>t.id===res.tableId)?.table_number}</span>}
                      </div>
                      {res.note && (
                        <div className="mt-2 text-sm text-amber-400 bg-amber-400/10 px-3 py-2 rounded-lg border border-amber-400/20">
                          <span className="font-bold">Not:</span> {res.note}
                        </div>
                      )}
                    </div>
                    {res.phone && (
                      <div className="flex flex-col gap-2 shrink-0 items-end">
                        <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg text-slate-300 text-sm">
                          <Phone size={14}/> {res.phone}
                        </div>
                        {res.email && (
                          <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg text-slate-300 text-sm">
                            <Mail size={14}/> {res.email}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
