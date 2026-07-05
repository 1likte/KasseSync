'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Giriş başarısız');
      }

      // Başarılı giriş
      if (data.role === 'super-admin') {
        router.push('/super-admin');
      } else if (data.restaurantSlug) {
        localStorage.setItem('gastro_active_restaurant_id', data.restaurantId || '');
        localStorage.setItem('gastro_active_restaurant_slug', data.restaurantSlug);
        router.push(`/possystem/${data.restaurantSlug}`);
      } else {
        router.push('/super-admin');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD3B6] via-[#FFAAA5] to-[#FF8B94] flex items-center justify-center p-4 text-white font-sans relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#FFE5D9] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF9A9E] rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="bg-white/20 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-white/30 text-white relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/20">
            <Lock className="text-rose-500" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-none">
            Yönetici Girişi
          </h1>
          <p className="text-white/80 font-medium text-sm mt-3">GastroSync yönetim paneline erişin</p>
        </div>

        {error && (
          <div className="bg-rose-500/20 border border-rose-500/30 text-white text-sm font-bold px-4 py-3 rounded-2xl mb-6 text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-white/90 mb-1.5">Kullanıcı Adı</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-white/60" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Yönetici adınız"
                required
                className="w-full bg-white/10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/50 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-white/90 mb-1.5">Şifre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-white/60" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full bg-white/10 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/50 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-rose-500 text-rose-600 hover:text-white font-black py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-rose-500/20 flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Giriş Yap <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/25 text-center text-xs text-white/60 font-semibold">
          <Link href="/" className="hover:text-white transition-colors">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
