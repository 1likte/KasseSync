'use client';

import { useStoreCart } from '@/lib/contexts/StoreCartContext';
import { ShoppingBag, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStoreCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
  };

  return (
    <div className="group relative flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 ease-out">
      
      {/* Image Container with Parallax-like hover */}
      <div className="relative h-56 w-full overflow-hidden bg-black/40">
        {product.image_url ? (
          <>
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
            <ShoppingBag className="w-12 h-12 text-gray-600 opacity-50" strokeWidth={1} />
          </div>
        )}
        
        {/* Availability Badge */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg">
              Geçici Olarak Tükendi
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-grow p-6 relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0c]/80">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white group-hover:text-[#e31837] transition-colors duration-300">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-400 text-sm mt-3 line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {product.description}
            </p>
          )}
        </div>
        
        {/* Footer: Price & Button */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fiyat</span>
            <span className="text-2xl font-black text-white">€{Number(product.price).toFixed(2)}</span>
          </div>
          
          <button 
            disabled={!product.is_available}
            onClick={handleAddToCart}
            className={`relative overflow-hidden group/btn flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              product.is_available 
                ? 'bg-[#e31837] hover:bg-white text-white hover:text-[#e31837] hover:w-32 shadow-[0_0_15px_rgba(227,24,55,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                : 'bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed'
            }`}
          >
            {product.is_available ? (
              <>
                <span className="absolute left-4 opacity-0 group-hover/btn:opacity-100 font-bold tracking-wide transition-opacity duration-300 whitespace-nowrap">
                  Ekle
                </span>
                <Plus className="w-6 h-6 absolute right-3 group-hover/btn:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              </>
            ) : (
              <Plus className="w-6 h-6" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
