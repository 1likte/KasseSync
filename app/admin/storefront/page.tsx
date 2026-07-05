'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Store, Save, Loader2 } from 'lucide-react';
import type { Restaurant } from '@/lib/types';

export default function AdminStorefrontPage() {
  const [restaurant, setRestaurant] = useState<Restaurant & { 
    slug?: string, 
    is_marketplace_active?: boolean,
    delivery_fee?: number,
    minimum_order?: number,
    banner_image_url?: string
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/menu');
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Veriler yüklenemedi');

      // Fetch additional storefront settings if available, or just use what we have
      setRestaurant(data.restaurant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async () => {
    if (!restaurant) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/restaurant/${restaurant.id}/storefront`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: restaurant.slug,
          is_marketplace_active: restaurant.is_marketplace_active,
          delivery_fee: restaurant.delivery_fee,
          minimum_order: restaurant.minimum_order,
          banner_image_url: restaurant.banner_image_url,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      alert('Ayarlar kaydedildi!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <header className="border-b border-slate-700/50 bg-slate-800/40 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/super-admin" className="flex items-center gap-2 text-slate-400 hover:text-white premium-transition">
            <ArrowLeft size={20} />
            Admin Panele Dön
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Store size={20} className="text-orange-500" />
            Vitrin & Pazar Yeri Ayarları
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 mt-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">{error}</div>
        )}

        <div className="glass-panel rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4">Pazar Yeri (Marketplace)</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={restaurant?.is_marketplace_active || false}
                onChange={(e) => setRestaurant(prev => prev ? {...prev, is_marketplace_active: e.target.checked} : null)}
                className="w-5 h-5 rounded border-slate-700 bg-slate-900/60"
              />
              <span>Restoranı Pazar Yerinde (Marketplace) Aktif Et</span>
            </label>
            <p className="text-sm text-slate-400 mt-2 ml-8">Müşteriler restoranınızı /marketplace adresinde görebilecek.</p>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <h2 className="text-lg font-bold mb-4">Vitrin Profiliniz</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Mağaza URL (Slug)</label>
                <div className="flex items-center">
                  <span className="bg-slate-800 border border-slate-700 border-r-0 rounded-l-xl px-4 py-3 text-slate-400">/store/</span>
                  <input 
                    type="text" 
                    value={restaurant?.slug || ''}
                    onChange={(e) => setRestaurant(prev => prev ? {...prev, slug: e.target.value} : null)}
                    placeholder="ornek-restoran"
                    className="flex-1 bg-slate-900/60 border border-slate-700 rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Banner Görseli (URL)</label>
                <input 
                  type="text" 
                  value={restaurant?.banner_image_url || ''}
                  onChange={(e) => setRestaurant(prev => prev ? {...prev, banner_image_url: e.target.value} : null)}
                  placeholder="https://.../banner.jpg"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <h2 className="text-lg font-bold mb-4">Teslimat Ayarları</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Teslimat Ücreti (€)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={restaurant?.delivery_fee || 0}
                  onChange={(e) => setRestaurant(prev => prev ? {...prev, delivery_fee: parseFloat(e.target.value)} : null)}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Minimum Sipariş Tutarı (€)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={restaurant?.minimum_order || 0}
                  onChange={(e) => setRestaurant(prev => prev ? {...prev, minimum_order: parseFloat(e.target.value)} : null)}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Ayarları Kaydet
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
