'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, KeyRound, CheckCircle2, ExternalLink } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const [serviceRoleKey, setServiceRoleKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSetup = async () => {
    if (!serviceRoleKey.trim()) {
      setError('Lütfen anahtarı yapıştır.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceRoleKey: serviceRoleKey.trim() }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error ?? 'Kurulum başarısız');
      }

      setDone(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-6">
        <div className="text-center">
          <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Kurulum Tamamlandı!</h1>
          <p className="text-slate-400">Kasa ekranına yönlendiriliyorsun...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
            <KeyRound className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">KasseSync Kurulumu</h1>
            <p className="text-slate-400 text-sm">Tek seferlik, 1 dakika sürer</p>
          </div>
        </div>

        <ol className="space-y-4 mb-8 text-sm text-slate-300">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">1</span>
            <span>
              Bu linke tıkla:{' '}
              <a
                href="https://supabase.com/dashboard/project/lxulqzrvrgrqatzfhczc/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Supabase API Ayarları <ExternalLink size={14} />
              </a>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">2</span>
            <span>
              <strong className="text-red-400">service_role</strong> satırını bul —{' '}
              <strong className="text-white">sb_secret_</strong> veya <strong className="text-white">eyJ...</strong> ile başlar.
              <br />
              <span className="text-red-400 text-xs mt-1 block">
                sb_publishable_ veya URL yapıştırma!
              </span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">3</span>
            <span>Kopyala ve aşağıya yapıştır</span>
          </li>
        </ol>

        <textarea
          value={serviceRoleKey}
          onChange={(e) => setServiceRoleKey(e.target.value)}
          placeholder="sb_secret_... veya eyJhbGciOi..."
          rows={3}
          className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleSetup}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Kuruluyor...
            </>
          ) : (
            'Kurulumu Başlat'
          )}
        </button>

        <p className="text-slate-500 text-xs text-center mt-4">
          Bu anahtar sadece senin bilgisayarında saklanır, kimseyle paylaşılmaz.
        </p>
      </div>
    </div>
  );
}
