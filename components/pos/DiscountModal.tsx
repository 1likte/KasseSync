import React, { useState } from 'react';
import { X, Percent, DollarSign } from 'lucide-react';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onApply: (discountAmount: number) => void;
}

export function DiscountModal({ isOpen, onClose, total, onApply }: DiscountModalProps) {
  const [type, setType] = useState<'percent' | 'flat'>('flat');
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    const val = parseFloat(value);
    if (isNaN(val) || val <= 0) return;

    let discount = 0;
    if (type === 'percent') {
      discount = total * (val / 100);
    } else {
      // flat implies setting new total or setting discount amount?
      // "25 euro ben 15 e çekmişim gibi" means setting the NEW total to 15. So discount is total - 15.
      discount = total - val;
    }

    if (discount > 0 && discount <= total) {
      onApply(discount);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">İndirim Uygula</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setType('flat')} 
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 ${type === 'flat' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'}`}
          >
            <DollarSign size={20} /> Yeni Tutar Belirle
          </button>
          <button 
            onClick={() => setType('percent')} 
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 ${type === 'percent' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'}`}
          >
            <Percent size={20} /> Yüzde (%)
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {type === 'flat' ? 'Ödenecek Yeni Tutar (₺)' : 'İndirim Yüzdesi (%)'}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-4 border-2 border-slate-200 rounded-xl text-2xl font-bold text-center focus:border-indigo-600 focus:outline-none"
            placeholder="0"
          />
          {type === 'flat' && value && (
            <p className="text-sm text-center text-emerald-600 font-bold mt-3">
              Uygulanacak İndirim: ₺{(total - parseFloat(value)).toFixed(2)}
            </p>
          )}
        </div>

        <button 
          onClick={handleApply}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg"
        >
          İndirimi Uygula
        </button>
      </div>
    </div>
  );
}
