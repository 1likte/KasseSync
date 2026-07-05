import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Tag, DollarSign, Type, Trash2, Plus, Check } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any; // null for add, object for edit
  categories: any[];
  onSave: (product: any) => void;
  onDelete?: (productId: string) => void;
  onAddCategory?: (categoryName: string) => { id: string, name: string } | void;
}

export function ProductModal({ isOpen, onClose, product, categories, onSave, onDelete, onAddCategory }: ProductModalProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [form, setForm] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    image_url: '',
    is_available: true
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price?.toString() || '',
        category_id: product.category_id || (categories.length > 0 ? categories[0].id : ''),
        description: product.description || '',
        image_url: product.image_url || '',
        is_available: product.is_available ?? true
      });
    } else {
      setForm({
        name: '',
        price: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        description: '',
        image_url: '',
        is_available: true
      });
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...product,
      ...form,
      price: parseFloat(form.price) || 0
    });
  };

  const handleSaveCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() && onAddCategory) {
      const newCat = onAddCategory(newCategoryName.trim());
      if (newCat) {
        setForm({...form, category_id: newCat.id});
      }
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <div className="flex gap-2">
            {product && onDelete && (
              <button onClick={() => onDelete(product.id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors" title="Ürünü Sil">
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Type size={16}/> Ürün Adı</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Örn: Karışık Pizza" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><DollarSign size={16}/> Fiyat (₺)</label>
                <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Tag size={16}/> Kategori</label>
                {isAddingCategory ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={newCategoryName} 
                      onChange={e => setNewCategoryName(e.target.value)} 
                      className="flex-1 border border-indigo-300 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                      placeholder="Kategori Adı..." 
                      autoFocus
                    />
                    <button type="button" onClick={handleSaveCategory} disabled={!newCategoryName.trim()} className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                      <Check size={20} />
                    </button>
                    <button type="button" onClick={() => setIsAddingCategory(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none bg-white">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {onAddCategory && (
                      <button type="button" onClick={() => setIsAddingCategory(true)} className="w-12 h-12 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors shrink-0" title="Yeni Kategori Ekle">
                        <Plus size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><ImageIcon size={16}/> Resim / İkon (Yükle, Emoji veya URL)</label>
              <div className="flex gap-2">
                <input type="text" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Örn: 🍕 veya http://..." />
                <label className="flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition-colors whitespace-nowrap">
                  <span className="text-sm">Gözat</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Açıklama</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none h-24" placeholder="Ürün açıklaması..." />
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
