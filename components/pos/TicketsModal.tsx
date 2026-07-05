import React from 'react';
import { X, Receipt, Clock, User, Phone, MapPin } from 'lucide-react';
import type { Session } from '@/app/possystem/[restaurantSlug]/pos-types';

interface TicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Record<string, Session>;
  onSelectSession: (id: string) => void;
}

export function TicketsModal({ isOpen, onClose, sessions, onSelectSession }: TicketsModalProps) {
  if (!isOpen) return null;

  const activeSessions = Object.values(sessions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1C1C36] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] border border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Receipt size={24} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Adisyonlar</h2>
              <p className="text-sm text-slate-400">Aktif {activeSessions.length} sipariş bulunuyor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#151528]">
          {activeSessions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Receipt size={64} className="mb-4 opacity-50" />
              <p className="text-xl font-medium">Açık Adisyon Bulunmuyor</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSessions.map((session) => {
                const totalAmount = session.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity * (item.portion || 1)), 0);
                const finalAmount = totalAmount - (session.discount || 0);
                const timeDiff = Math.floor((new Date().getTime() - new Date(session.createdAt).getTime()) / 60000);

                return (
                  <div 
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    className="bg-white/5 hover:bg-indigo-500/10 border border-white/10 rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02] flex flex-col group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 flex items-center gap-2">
                           {session.name}
                           {session.type === 'takeaway' && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-md">Paket</span>}
                        </h3>
                        {session.pax && <p className="text-sm text-slate-400">{session.pax} Kişi</p>}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">₺{finalAmount.toFixed(2)}</div>
                        <div className="text-xs text-slate-400 flex items-center justify-end gap-1 mt-1">
                          <Clock size={12} /> {timeDiff} dk önce
                        </div>
                      </div>
                    </div>

                    {session.type === 'takeaway' && (session.address || session.phone) && (
                      <div className="mt-2 space-y-1 mb-3 pb-3 border-b border-white/5 text-sm text-slate-300">
                        {session.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-slate-500"/> {session.phone}</div>}
                        {session.address && <div className="flex items-start gap-2"><MapPin size={14} className="text-slate-500 mt-0.5"/> <span className="line-clamp-2">{session.address}</span></div>}
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-white/5">
                      <p className="text-sm text-slate-400">
                        <span className="font-medium text-slate-300">{session.items.reduce((s: number, i: any) => s + i.quantity, 0)}</span> Ürün
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
