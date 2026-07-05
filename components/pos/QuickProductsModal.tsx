import React from 'react';
import { X, Zap } from 'lucide-react';

interface QuickProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onAdd: (product: any) => void;
}

export function QuickProductsModal({ isOpen, onClose, products, onAdd }: QuickProductsModalProps) {
  if (!isOpen) return null;

  // Simulate quick products (maybe the first 12 products that are available)
  const quickProducts = products.filter(p => p.is_available).slice(0, 12);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Zap size={24} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Hızlı Ürünler</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onAdd(p);
                // Optionally close after adding, or leave open for multiple adds
              }}
              className="aspect-square bg-slate-50 hover:bg-indigo-50 border-2 border-slate-100 hover:border-indigo-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all hover:scale-105"
            >
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded-full mb-3 shadow-md" />
              ) : (
                <div className="w-16 h-16 bg-white rounded-full shadow-md mb-3 flex items-center justify-center">
                  <span className="text-xl font-black text-indigo-300">{p.name.substring(0, 1)}</span>
                </div>
              )}
              <h3 className="font-bold text-slate-700 leading-tight mb-1">{p.name}</h3>
              <p className="font-black text-indigo-600">₺{p.price}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
