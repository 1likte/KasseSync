'use client';

import type { Product } from '@/lib/types';
import { useMemo } from 'react';

// Endüstriyel POS standartlarında solid, kontrastlı arka plan renkleri
const PRODUCT_COLORS = [
  'bg-[#b91c1c] text-white', // Koyu Kırmızı
  'bg-[#0369a1] text-white', // Koyu Mavi
  'bg-[#15803d] text-white', // Koyu Yeşil
  'bg-[#b45309] text-white', // Kahverengi/Turuncu
  'bg-[#4338ca] text-white', // İndigo
  'bg-[#0f766e] text-white', // Teal
  'bg-[#6d28d9] text-white', // Mor
  'bg-[#334155] text-white', // Arduvaz Gri
];

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
  searchQuery: string;
  addToCart: (product: Product) => void;
}

export function ProductGrid({ products, activeCategory, searchQuery, addToCart }: ProductGridProps) {
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = !activeCategory || product.category_id === activeCategory;
      const matchesSearch = !query || product.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  if (filteredProducts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 font-medium">
        <p>Bu kategoride ürün bulunamadı.</p>
      </div>
    );
  }

  // Kategorilere göre renk eşleştirme (aynı kategori hep aynı renk olsun diye basit bir hash)
  const getCategoryColor = (categoryId: string) => {
    if (!categoryId) return PRODUCT_COLORS[7];
    const hash = categoryId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return PRODUCT_COLORS[hash % PRODUCT_COLORS.length];
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
      {filteredProducts.map((product) => (
        <button
          key={product.id}
          onClick={() => addToCart(product)}
          className={`relative p-3 h-24 flex flex-col justify-between items-start rounded-md border border-black/20 shadow-sm active:scale-95 transition-transform ${getCategoryColor(product.category_id)} hover:brightness-110`}
        >
          <h3 className="text-sm sm:text-base font-bold text-left leading-tight break-words w-full line-clamp-3">
            {product.name}
          </h3>
          <div className="text-sm font-bold bg-black/30 px-1.5 py-0.5 rounded self-end mt-1">
            €{product.price.toFixed(2)}
          </div>
        </button>
      ))}
    </div>
  );
}
