'use client';

import React from 'react';
import Link from 'next/link';

export function ReservationSection() {
  return (
    <Link 
      href="/reservation"
      className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all shadow-lg hover:-translate-y-0.5 text-center flex items-center justify-center"
    >
      Masa Rezervasyonu
    </Link>
  );
}
