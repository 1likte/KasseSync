'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Mail, Phone, Loader2, CheckCircle, MapPin, Bike, FileText, Check } from 'lucide-react';

export default function CourierApplyPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    vehicle_type: 'Motorlu',
    has_license: false,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/courier-apply', {
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
      <div className="min-h-screen bg-gradient-to-br from-[#FFD3B6] via-[#FFAAA5] to-[#FF8B94] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FFE5D9] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF9A9E] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div className="bg-white/20 backdrop-blur-xl rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl border border-white/30 text-white relative z-10">
          <div className="w-20 h-20 bg-white text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/20">
            <Check size={40} className="stroke-[3]" />
          </div>
          <h1 className="text-3xl font-black mb-3">Başvurunuz Alındı!</h1>
          <p className="text-white/80 mb-8 font-medium leading-relaxed">
            Kurye başvurunuz ekibimize ulaştı. Bilgileriniz incelenerek en kısa sürede sizinle iletişime geçilecektir.
          </p>
          <Link 
            href="/" 
            className="inline-block w-full bg-white hover:bg-rose-500 text-rose-600 hover:text-white font-black py-4 rounded-full transition-all duration-300 shadow-md hover:-translate-y-0.5"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD3B6] via-[#FFAAA5] to-[#FF8B94] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Blurred circles */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FFE5D9] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF9A9E] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="bg-white/20 backdrop-blur-xl rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl border border-white/30 text-white relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/85 hover:text-white mb-6 transition-all duration-300 font-bold hover:-translate-x-1"
        >
          <ArrowLeft size={18} /> Ana Sayfaya Dön
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Kurye Başvurusu</h1>
          <p className="text-white/80 font-medium">
            Paket servis kurye ekibimize katılmak için aşağıdaki formu doldurun.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-100 p-4 rounded-2xl mb-6 text-sm font-bold animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-white/90 mb-1.5">Adınız Soyadınız</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
              <input 
                required
                value={form.full_name}
                onChange={e => setForm({...form, full_name: e.target.value})}
                type="text" 
                className="w-full bg-white/10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-white placeholder-white/50"
                placeholder="Örn: Yunus Kalkan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/90 mb-1.5">E-posta Adresiniz</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                <input 
                  required
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  type="email" 
                  className="w-full bg-white/10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-white placeholder-white/50"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/90 mb-1.5">Telefon Numaranız</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                <input 
                  required
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  type="tel" 
                  className="w-full bg-white/10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-white placeholder-white/50"
                  placeholder="+90 555 555 55 55"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/90 mb-1.5">Çalışmak İstediğiniz Şehir</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                <input 
                  required
                  value={form.city}
                  onChange={e => setForm({...form, city: e.target.value})}
                  type="text" 
                  className="w-full bg-white/10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-white placeholder-white/50"
                  placeholder="Örn: İstanbul"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/90 mb-1.5">Taşıt Seçimi</label>
              <div className="relative">
                <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                <select 
                  value={form.vehicle_type}
                  onChange={e => setForm({...form, vehicle_type: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-white accent-rose-500 appearance-none cursor-pointer"
                >
                  <option className="text-gray-800" value="Motorlu">Motosiklet / Motorlu Kurye</option>
                  <option className="text-gray-800" value="Bisiklet">Elektrikli Bisiklet / Bisiklet</option>
                  <option className="text-gray-800" value="Otomobil">Kendi Otomobiliyle</option>
                  <option className="text-gray-800" value="Diger">Diğer / Yaya</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={form.has_license}
                onChange={e => setForm({...form, has_license: e.target.checked})}
                className="w-5 h-5 rounded border-white/30 text-rose-500 focus:ring-rose-500 bg-white/10 cursor-pointer accent-rose-500" 
              />
              <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">Geçerli bir sürücü ehliyetim var</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-white/90 mb-1.5">Deneyimler & Notlar</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-white/60" size={18} />
              <textarea 
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                rows={3}
                className="w-full bg-white/10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-white placeholder-white/50 resize-none"
                placeholder="Varsa önceki deneyimlerinizden kısaca bahsedin..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white hover:bg-rose-500 text-rose-600 hover:text-white font-black py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-rose-500/20 flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Başvuruyu Gönder'}
          </button>

        </form>
      </div>
    </div>
  );
}
