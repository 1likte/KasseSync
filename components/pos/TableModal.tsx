import React, { useState } from 'react';
import { X, Users, Store, Plus, Trash2 } from 'lucide-react';
import type { Session } from '@/app/possystem/[restaurantSlug]/pos-types';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: any[];
  sessions: Record<string, Session>;
  onSelectTable: (tableId: string) => void;
  onOpenTable: (tableId: string, waiterName: string, pax: number) => void;
  onAddTable?: () => void;
  onDeleteTable?: (tableId: string) => void;
}

export function TableModal({ isOpen, onClose, tables, sessions, onSelectTable, onOpenTable, onAddTable, onDeleteTable }: TableModalProps) {
  const [selectedForOpen, setSelectedForOpen] = useState<string | null>(null);
  const [waiterName, setWaiterName] = useState('');
  const [pax, setPax] = useState<number>(2);

  if (!isOpen) return null;

  const handleTableClick = (tableId: string) => {
    const tableSessionId = `table-${tableId}`;
    if (sessions[tableSessionId]) {
      onSelectTable(tableSessionId);
    } else {
      setSelectedForOpen(tableId);
    }
  };

  const handleOpen = () => {
    if (selectedForOpen && waiterName.trim() !== '') {
      onOpenTable(selectedForOpen, waiterName, pax);
      setSelectedForOpen(null);
      setWaiterName('');
      setPax(2);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1C36] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col border border-indigo-500/20 overflow-hidden">
        <div className="p-6 border-b border-indigo-500/20 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Store className="text-indigo-400" /> Masa Yönetimi
          </h2>
          <div className="flex gap-2">
            {onAddTable && (
              <button onClick={onAddTable} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm">
                <Plus size={16} /> Masa Ekle
              </button>
            )}
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-slate-300">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto max-h-[70vh]">
          {selectedForOpen ? (
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-xl font-bold text-white text-center mb-6">Masa {tables.find(t => t.id === selectedForOpen)?.table_number} Açılışı</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Garson Adı</label>
                <input 
                  type="text" 
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Garson Adı"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Kişi Sayısı</label>
                <div className="flex items-center gap-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl p-2">
                  <button onClick={() => setPax(p => Math.max(1, p - 1))} className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-600/40">-</button>
                  <span className="flex-1 text-center font-bold text-white text-xl">{pax}</span>
                  <button onClick={() => setPax(p => p + 1)} className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-600/40">+</button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setSelectedForOpen(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold">İptal</button>
                <button onClick={handleOpen} disabled={!waiterName.trim()} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold">Masayı Aç</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {tables.map(table => {
                const session = sessions[`table-${table.id}`];
                const isOccupied = !!session;
                
                return (
                  <div 
                    key={table.id}
                    onClick={() => handleTableClick(table.id)}
                    className={`cursor-pointer relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${
                      isOccupied 
                        ? 'bg-indigo-600/20 border-indigo-500/50 hover:bg-indigo-600/30' 
                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isOccupied ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                      <Store size={24} />
                    </div>
                    <span className="font-bold text-white text-lg">{table.table_number}</span>
                    {isOccupied && (
                      <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Users size={10} /> {session.pax}
                      </span>
                    )}
                    {!isOccupied && onDeleteTable && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteTable(table.id); }} 
                        className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
              {tables.length === 0 && <div className="col-span-full text-center text-slate-400 py-8">Sistemde kayıtlı masa bulunmuyor.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
