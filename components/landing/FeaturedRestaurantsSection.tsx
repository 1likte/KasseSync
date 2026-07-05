'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function FeaturedRestaurantsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/restaurants/featured');
        const { success, restaurants: data } = await res.json();
        
        if (success && data) {
          setRestaurants(data.map((r: any) => ({
            id: r.id,
            name: r.name,
            rating: r.rating || 5.0,
            time: '20-30 dk',
            price: '₺₺',
            type: r.cuisine_type || 'Restoran'
          })));
        }
      } catch (err) {
        console.error('Error fetching featured restaurants', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Perfect smooth auto-scroll logic to the RIGHT (decreasing scrollLeft)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    // Initialize floatScrollLeft to loopPoint so it can scroll left immediately
    let floatScrollLeft = scrollRef.current?.scrollLeft || 0;

    const scroll = (currentTime: number) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      if (scrollRef.current && firstSetRef.current) {
        if (!isHovered && !isDragging) {
          // 40 pixels per second to the RIGHT (moving scrollLeft LEFT)
          floatScrollLeft -= (40 * dt) / 1000;
          
          const loopPoint = firstSetRef.current.offsetWidth;
          
          // Loop when we reach 0 or below
          if (floatScrollLeft <= 0) {
            floatScrollLeft += loopPoint;
          }
          scrollRef.current.scrollLeft = floatScrollLeft;
        } else {
          // Sync float with actual scroll if user dragged or hovered
          floatScrollLeft = scrollRef.current.scrollLeft;
        }
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging, restaurants]);

  // Mouse Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  if (!loading && restaurants.length === 0) {
    return null;
  }

  return (
    <div className="w-[100vw] relative left-1/2 right-1/2 -mx-[50vw] z-10 mb-16 bg-white/20 backdrop-blur-md py-8 border-y border-white/40 shadow-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 drop-shadow-sm">Featured Restaurants</h2>
      </div>
      
      <div className="relative">
        {/* Edge Gradients for smooth fade out */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#FFD3B6] via-[#FFD3B6]/80 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#FFD3B6] via-[#FFD3B6]/80 to-transparent z-20 pointer-events-none"></div>

        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto scrollbar-hide py-4 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div ref={firstSetRef} className="flex gap-5 pr-5 shrink-0">
            {restaurants.map((rest, index) => (
              <div key={`first-${rest.id}-${index}`} className="shrink-0 w-[260px] bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-md border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
                <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{rest.name}</h3>
                <div className="flex items-center text-sm text-orange-400 mb-3">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
                  <span className="text-gray-600 ml-1 font-bold">{rest.rating}</span>
                </div>
                <div className="text-[12px] text-gray-600 font-medium bg-gray-100/50 px-3 py-2 rounded-xl inline-block">
                  Delivery: {rest.time} • {rest.price} • {rest.type}
                </div>
              </div>
            ))}
          </div>
          
          {/* Duplicate sets for flawless infinite looping on ultra-wide screens */}
          {[2, 3, 4, 5].map(setNum => (
            <div key={`set-${setNum}`} className="flex gap-5 pr-5 shrink-0">
              {restaurants.map((rest, index) => (
                <div key={`set${setNum}-${rest.id}-${index}`} className="shrink-0 w-[260px] bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-md border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{rest.name}</h3>
                  <div className="flex items-center text-sm text-orange-400 mb-3">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
                    <span className="text-gray-600 ml-1 font-bold">{rest.rating}</span>
                  </div>
                  <div className="text-[12px] text-gray-600 font-medium bg-gray-100/50 px-3 py-2 rounded-xl inline-block">
                    Delivery: {rest.time} • {rest.price} • {rest.type}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
