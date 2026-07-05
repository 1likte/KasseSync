'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Building2, ArrowLeft, FileText, Search, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Mama Mia Pizzeria', location: 'Kadıköy' },
  { id: '2', name: 'Burger King', location: 'Beşiktaş' },
  { id: '3', name: 'Sushi World', location: 'Şişli' },
  { id: '4', name: 'Kebapçı Celal', location: 'Kadıköy' },
  { id: '5', name: 'Vegan Cafe', location: 'Moda' }
];

export default function ReservationPage() {
  const [form, setForm] = useState({
    restaurantId: '',
    customerName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    pax: 2,
    note: '',
    email: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Optionally pre-fill if they happen to have a session, but not required
    const user = localStorage.getItem('gastro_user');
    if (user && !form.customerName) {
      const parsed = JSON.parse(user);
      setForm(prev => ({ ...prev, customerName: parsed.name, phone: parsed.phone }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.restaurantId) {
      alert('Lütfen bir restoran seçin.');
      return;
    }
    if (!form.customerName) return;

    // Validation for working hours (only checking if it's the POS restaurant for now, or just generic check)
    // In a real app, each restaurant would have its own settings.
    const storedSettings = localStorage.getItem('gastro_restaurant_settings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      if (settings.openTime && settings.closeTime) {
        if (form.time < settings.openTime || form.time > settings.closeTime) {
          alert(`Restoran sadece ${settings.openTime} - ${settings.closeTime} saatleri arasında hizmet vermektedir. Lütfen geçerli bir saat seçiniz.`);
          return;
        }
      }
    }

    const newReservation = {
      id: `res-web-${Date.now()}`,
      ...form
    };

    // Save to localStorage so POS can read it
    const existing = JSON.parse(localStorage.getItem('gastro_reservations') || '[]');
    localStorage.setItem('gastro_reservations', JSON.stringify([...existing, newReservation]));

    setIsSuccess(true);
  };

  const filteredRestaurants = MOCK_RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRestaurant = MOCK_RESTAURANTS.find(r => r.id === form.restaurantId);

  // Success View
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFD3B6] via-[#FFAAA5] to-[#FF8B94] flex flex-col items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-10 max-w-lg w-full text-center shadow-2xl border border-white/50">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Rezervasyon Onaylandı!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Sayın {form.customerName}, {selectedRestaurant?.name} için {form.date} tarihi saat {form.time}'de {form.pax} kişilik yeriniz başarıyla ayrılmıştır. Sizi aramızda görmek için sabırsızlanıyoruz!
          </p>
          <Link href="/" className="inline-flex px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all shadow-lg hover:-translate-y-0.5">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // Reservation View
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD3B6] via-[#FFAAA5] to-[#FF8B94] flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FFE5D9] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden relative z-10">
        <div className="p-8 md:p-10 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors shrink-0">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Masa Rezervasyonu</h1>
              <p className="text-gray-500 mt-1">Lütfen bilgilerinizi eksiksiz doldurun.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          {/* Restaurant Search / Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Building2 className="text-indigo-500" /> Restoran Ara & Seç
            </h3>
            
            <div className="relative">
              {form.restaurantId ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-indigo-900 text-lg">{selectedRestaurant?.name}</h4>
                    <p className="text-indigo-700 text-sm flex items-center gap-1 mt-1"><MapPin size={14}/> {selectedRestaurant?.location}</p>
                  </div>
                  <button type="button" onClick={() => { setForm({...form, restaurantId: ''}); setSearchQuery(''); }} className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-bold shadow-sm hover:bg-indigo-100 text-sm">Değiştir</button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setIsSearching(true); }}
                    onFocus={() => setIsSearching(true)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    placeholder="Restoran adı veya konum yazın (Örn: Kadıköy)..."
                  />
                  
                  {isSearching && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 max-h-60 overflow-y-auto">
                      {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => { setForm({...form, restaurantId: r.id}); setIsSearching(false); }}
                            className="w-full text-left px-5 py-4 hover:bg-indigo-50 border-b border-gray-50 last:border-0 transition-colors"
                          >
                            <div className="font-bold text-gray-800 text-lg">{r.name}</div>
                            <div className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin size={14}/> {r.location}</div>
                          </button>
                        ))
                      ) : (
                        <div className="p-5 text-center text-gray-500 font-medium">Sonuç bulunamadı.</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <User className="text-indigo-500" /> Kişisel Bilgiler
            </h3>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Adınız Soyadınız *</label>
                <input 
                  required 
                  type="text" 
                  value={form.customerName} 
                  onChange={e => setForm({...form, customerName: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                  placeholder="Örn: Yunus"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telefon Numarası *</label>
                <input 
                  required
                  type="tel" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                  placeholder="05..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><Mail size={14} /> E-Posta Adresi *</label>
                <input 
                  required
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                  placeholder="ornek@email.com"
                />
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Calendar className="text-indigo-500" /> Rezervasyon Detayları
            </h3>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tarih</label>
                <input 
                  required 
                  type="date" 
                  value={form.date} 
                  onChange={e => setForm({...form, date: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Saat</label>
                <input 
                  required 
                  type="time" 
                  value={form.time} 
                  onChange={e => setForm({...form, time: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kişi Sayısı</label>
                <input 
                  required 
                  type="number" 
                  min="1" 
                  value={form.pax} 
                  onChange={e => setForm({...form, pax: parseInt(e.target.value) || 1})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                />
              </div>
            </div>
          </div>

          {/* Special Requests / Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <FileText className="text-indigo-500" /> Özel İstekler & Notlar
            </h3>
            <div>
              <textarea 
                value={form.note} 
                onChange={e => setForm({...form, note: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none min-h-[120px]" 
                placeholder="Örn: Bebek sandalyesi istiyoruz, cam kenarı olabilir mi?"
              />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-xl shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1">
              Rezervasyonu Tamamla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
