'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white font-bold text-sm uppercase tracking-wider ${className}`}
      title="Dil Değiştir / Change Language"
    >
      <Globe size={18} />
      <span>{locale === 'tr' ? 'DE' : 'TR'}</span>
    </button>
  );
}
