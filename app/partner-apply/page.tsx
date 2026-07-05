'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, User, Mail, Phone, Loader2, CheckCircle2, MapPin } from 'lucide-react';

export default function PartnerApplyPage() {
  const [form, setForm] = useState({
    restaurant_name: '',
    owner_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/partner-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Başvuru sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-indigo-50">
          <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Başvurunuz Alındı!</h1>
          <p className="text-slate-600 mb-6">
            Teşekkür ederiz. Ekibimiz en kısa sürede sizinle iletişime geçecek ve sistem kurulumunuzu tamamlayacaktır.
          </p>
          <Link href="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-indigo-50">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-6 transition-colors font-medium">
          <ArrowLeft size={18} /> Ana Sayfaya Dön
        </Link>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Partner Başvurusu</h1>
          <p className="text-slate-500 text-sm">
            KasseSync ailesine katılmak için aşağıdaki formu doldurun.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Restoran / İşletme Adı</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                value={form.restaurant_name}
                onChange={e => setForm({...form, restaurant_name: e.target.value})}
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800"
                placeholder="Örn: Lezzet Dünyası"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Yetkili Adı Soyadı</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                value={form.owner_name}
                onChange={e => setForm({...form, owner_name: e.target.value})}
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                type="email" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800"
                placeholder="Örn: ahmet@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Telefon Numarası</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                type="tel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800"
                placeholder="Örn: 0532 123 45 67"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tam Adres</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-4 text-slate-400" size={18} />
              <textarea 
                required
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 resize-none h-24"
                placeholder="Örn: İstiklal Cad. No:123 Beyoğlu / İstanbul"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Başvuruyu Gönder'}
          </button>
        </form>
      </div>
    </div>
  );
}
