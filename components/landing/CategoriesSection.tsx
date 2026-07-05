'use client';

import React, { useRef, useEffect, useState } from 'react';

const CATEGORIES = [
  { name: '100% Halal', count: 3, bg: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=400&auto=format&fit=crop' },
  { name: 'American', count: 2, bg: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop' },
  { name: 'Asian', count: 1, bg: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop' },
  { name: 'Burgers', count: 7, bg: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop' },
  { name: 'Chicken', count: 2, bg: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop' },
  { name: 'Chinese', count: 4, bg: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop' },
  { name: 'Döner', count: 11, bg: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=400&auto=format&fit=crop' },
  { name: 'Greek', count: 1, bg: 'https://images.unsplash.com/photo-1532597311687-5c2dc87fff52?q=80&w=400&auto=format&fit=crop' },
  { name: 'Italian', count: 19, bg: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { name: 'Pasta', count: 4, bg: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?q=80&w=400&auto=format&fit=crop' },
  { name: 'Salads', count: 1, bg: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop' },
  { name: 'Sushi', count: 2, bg: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop' },
  { name: 'Turkish', count: 1, bg: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=400&auto=format&fit=crop' },
  { name: 'Vegan', count: 1, bg: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&auto=format&fit=crop' },
];

export function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Perfect smooth auto-scroll logic using time delta
  useEffect(() => {
    let animationFrameId: number;
    let floatScrollLeft = scrollRef.current?.scrollLeft || 0;
    let lastTime = performance.now();

    const scroll = (currentTime: number) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      if (scrollRef.current && firstSetRef.current) {
        if (!isHovered && !isDragging) {
          // 40 pixels per second - flawless speed calculation independent of framerate
          floatScrollLeft += (40 * dt) / 1000;
          
          // Exact mathematical loop without any pixel jump
          const loopPoint = firstSetRef.current.offsetWidth;
          if (floatScrollLeft >= loopPoint) {
            floatScrollLeft -= loopPoint;
          }
          scrollRef.current.scrollLeft = floatScrollLeft;
        } else {
          // If user dragged, sync the float to the actual scroll position smoothly
          floatScrollLeft = scrollRef.current.scrollLeft;
        }
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging]);

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

  return (
    <div className="w-[100vw] relative left-1/2 right-1/2 -mx-[50vw] z-10 -mb-4 overflow-hidden">
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
        <div ref={firstSetRef} className="flex gap-4 pr-4 shrink-0">
          {CATEGORIES.map((cat, index) => (
            <div 
              key={`set1-${cat.name}-${index}`} 
              className="shrink-0 relative w-24 h-24 md:w-28 md:h-28 rounded-[1.2rem] overflow-hidden shadow-md border border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_15px_30px_rgb(0,0,0,0.2)] group"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110" style={{ backgroundImage: `url(${cat.bg})`, pointerEvents: 'none' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/10 transition-colors duration-500" style={{ pointerEvents: 'none' }}></div>
              <div className="absolute bottom-3 left-0 right-0 px-2 flex flex-col items-center justify-center z-10 pointer-events-none transition-transform duration-300 group-hover:-translate-y-1">
                <span className="font-extrabold text-white text-xs md:text-sm drop-shadow-lg text-center leading-tight">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Duplicate sets for flawless infinite looping on ultra-wide screens */}
        {[2, 3, 4].map(setNum => (
          <div key={`set-${setNum}`} className="flex gap-4 pr-4 shrink-0">
            {CATEGORIES.map((cat, index) => (
              <div 
                key={`set${setNum}-${cat.name}-${index}`} 
                className="shrink-0 relative w-24 h-24 md:w-28 md:h-28 rounded-[1.2rem] overflow-hidden shadow-md border border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_15px_30px_rgb(0,0,0,0.2)] group"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110" style={{ backgroundImage: `url(${cat.bg})`, pointerEvents: 'none' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/10 transition-colors duration-500" style={{ pointerEvents: 'none' }}></div>
                <div className="absolute bottom-3 left-0 right-0 px-2 flex flex-col items-center justify-center z-10 pointer-events-none transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="font-extrabold text-white text-xs md:text-sm drop-shadow-lg text-center leading-tight">{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
