import React from 'react';
import Link from 'next/link';

export function FooterSection() {
  return (
    <footer className="w-full bg-transparent relative z-50 pt-12 pb-8 border-t border-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: GastroSync'i Keşfet */}
          <div>
            <h3 className="text-primary font-bold text-lg text-gray-900 mb-4">GastroSync'i keşfet</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Hakkımızda</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Kariyer</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Teknoloji Kariyerleri</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">İletişim</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Sosyal Sorumluluk Projeleri</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Basın Bültenleri</Link></li>
            </ul>
          </div>

          {/* Column 2: Yardıma mı ihtiyacın var? */}
          <div>
            <h3 className="text-primary font-bold text-lg text-gray-900 mb-4">Yardıma mı ihtiyacın var?</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Kişisel Verilerin Korunması</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Gizlilik Politikası</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Kullanım Koşulları</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Çerez Politikası</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">İşlem Rehberi</Link></li>
            </ul>
          </div>

          {/* Column 3: İş Ortağımız Ol */}
          <div>
            <h3 className="text-primary font-bold text-lg text-gray-900 mb-4">İş Ortağımız Ol</h3>
            <ul className="space-y-3">
              <li><Link href="/partner-apply" className="text-gray-800 hover:text-white transition-colors text-sm font-semibold">GastroSync Ortağı Ol</Link></li>
              <li><Link href="/courier-apply" className="text-gray-800 hover:text-white transition-colors text-sm font-semibold">Kuryemiz Ol (Become a Courier)</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Bayimiz Olun</Link></li>
              <li><Link href="#" className="text-gray-800 hover:text-white transition-colors text-sm font-medium">Zincir Restoranlar</Link></li>
            </ul>
          </div>

          {/* Column 4: App Download Links (Getir style) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-primary font-bold text-lg text-gray-900 mb-2">Uygulamayı İndir</h3>
            <Link href="#" className="transition-transform hover:scale-105 inline-block">
              <img src="https://getir.com/_next/static/images/appstore-tr-141ed939fceebdcee96af608fa293b31.svg" alt="App Store" className="h-10 w-auto" />
            </Link>
            <Link href="#" className="transition-transform hover:scale-105 inline-block">
              <img src="https://getir.com/_next/static/images/googleplay-tr-6b0c941b7d1a65d781fb4b644498be75.svg" alt="Google Play" className="h-10 w-auto" />
            </Link>
            <Link href="#" className="transition-transform hover:scale-105 inline-block">
              <img src="https://getir.com/_next/static/images/huawei-appgallery-tr-4b890fa3167bc62f9069edaf45aa7f30.svg" alt="AppGallery" className="h-10 w-auto" />
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/30 pt-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-800 font-bold flex items-center gap-4">
            <span>© 2024 GastroSync. Tüm hakları saklıdır.</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-gray-800 hover:bg-white/50 hover:text-gray-900 transition-all shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-gray-800 hover:bg-white/50 hover:text-gray-900 transition-all shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-gray-800 hover:bg-white/50 hover:text-gray-900 transition-all shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
