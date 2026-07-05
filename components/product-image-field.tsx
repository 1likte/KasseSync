'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImageIcon, Loader2, Upload } from 'lucide-react';

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ProductImageField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.error ?? 'Yükleme başarısız');
      onChange(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Resim yüklenemedi');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="md:col-span-2 space-y-2">
      <label className="text-sm text-slate-400 flex items-center gap-2">
        <ImageIcon size={16} />
        Ürün resmi
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Resim URL veya dosya yükle"
          className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          Dosya Yükle
        </button>
      </div>
      {value && (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-700">
          <Image src={value} alt="Önizleme" fill className="object-cover" unoptimized />
        </div>
      )}
    </div>
  );
}
