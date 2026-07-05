'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart, Store, Package, Calendar, FileText, PieChart, Settings, Search, Plus, 
  Minus, Trash2, Home, CreditCard, Banknote, Clock, Mail, Phone, MapPin, 
  CheckCircle, Loader2, Link as LinkIcon, User, Users, ChevronDown, UserPlus, MoreVertical, LogIn,
  Pencil, X, Zap, Percent, Receipt, Calendar as CalendarIcon, Headset, Layers
} from 'lucide-react';
import { ProductModal } from '@/components/pos/ProductModal';
import { printReceipt } from '@/components/pos/printer';
import { QuickProductsModal } from '@/components/pos/QuickProductsModal';
import { DiscountModal } from '@/components/pos/DiscountModal';
import type { Session, CartItem, Reservation } from './pos-types';

export default function POSSystem({ params }: { params?: { restaurantSlug?: string } }) {
  // Data State
  const [restaurant, setRestaurant] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // POS State
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sessions (Active tables/takeaways)
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isQuickProductsOpen, setIsQuickProductsOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [editingItemNoteId, setEditingItemNoteId] = useState<string | null>(null);
  const [itemNoteText, setItemNoteText] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(true);
  
  const [currentView, setCurrentView] = useState<string>('products');
  const pathname = usePathname();
  const isAdminMode = pathname?.startsWith('/admin/possystem');
  const [adminRestaurants, setAdminRestaurants] = useState<any[]>([]);

  const [profileName, setProfileName] = useState('Restoran Yetkilisi');
  const [profileId, setProfileId] = useState('ID-1001');
  const [selectedTableForOpen, setSelectedTableForOpen] = useState<string | null>(null);
  const [waiterName, setWaiterName] = useState('');
  const [pax, setPax] = useState<number>(2);
  
  const [takeawayForm, setTakeawayForm] = useState({ customerName: '', phone: '', address: '' });
  const [isAddingReservation, setIsAddingReservation] = useState(false);
  const [reservationForm, setReservationForm] = useState({ customerName: '', phone: '', date: new Date().toISOString().split('T')[0], time: '19:00', pax: 2, tableId: '', note: '', email: '' });
  const [settingsForm, setSettingsForm] = useState({ openTime: '09:00', closeTime: '22:00' });

  useEffect(() => {
    if (isAdminMode) {
      setCurrentView('products');
    }
  }, [isAdminMode]);

  const fetchAdminRestaurants = async () => {
    try {
      const res = await fetch('/api/super-admin/restaurants');
      const data = await res.json();
      if (data.success && data.restaurants) {
        setAdminRestaurants(data.restaurants);
      }
    } catch (e) {
      console.error('Error fetching restaurants list for admin mode:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      let slug = params?.restaurantSlug || (isAdminMode ? localStorage.getItem('gastro_active_restaurant_slug') : undefined);
      
      if (isAdminMode && !slug) {
        try {
          const res = await fetch('/api/super-admin/restaurants');
          const data = await res.json();
          if (data.success && data.restaurants && data.restaurants.length > 0) {
            const firstRest = data.restaurants[0];
            const calculatedSlug = firstRest.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
            localStorage.setItem('gastro_active_restaurant_id', firstRest.id);
            localStorage.setItem('gastro_active_restaurant_slug', calculatedSlug);
            slug = calculatedSlug;
          } else {
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error auto-selecting restaurant:', e);
          setIsLoading(false);
          return;
        }
      }
      
      if (!slug && !params?.restaurantSlug) {
        setIsLoading(false);
        return;
      }

      const menuRes = await fetch(`/api/admin/menu${slug ? `?slug=${slug}` : ''}`);
      const menuData = await menuRes.json();
      
      if (menuData.success) {
        setRestaurant(menuData.restaurant);
        setProducts(menuData.products || []);
        setCategories(menuData.categories || []);
        
        const tRes = await fetch(`/api/admin/tables?restaurantId=${menuData.restaurant.id}`);
        const tData = await tRes.json();
        if (tData.success) setTables(tData.tables);
        
        loadLocalReservations(menuData.restaurant.id);
      } else {
        // Fallback for reservations
        loadLocalReservations();
      }
      
      // Listen for cross-tab reservation additions
      window.addEventListener('storage', (e) => {
        if (e.key === 'gastro_reservations') {
          loadLocalReservations();
        }
      });
      const storedSettings = localStorage.getItem('gastro_restaurant_settings');
      if (storedSettings) setSettingsForm(JSON.parse(storedSettings));
    } catch (err) {
      console.error('POS veri yükleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const loadLocalReservations = (restaurantId?: string) => {
    try {
      const stored = localStorage.getItem('gastro_reservations');
      if (stored) {
        const allRes = JSON.parse(stored);
        const currentId = restaurantId || restaurant?.id || '1';
        const resForThisRestaurant = allRes.filter((r: any) => r.restaurantId === currentId || !r.restaurantId);
        setReservations(resForThisRestaurant);
      }
    } catch (e) {
      console.error('Error loading reservations', e);
    }
  };

  const handleAddTable = () => {
    const tableNumber = tables.length > 0 ? Math.max(...tables.map(t => parseInt(t.table_number) || 0)) + 1 : 1;
    const newTable = {
      id: `new-${Date.now()}`,
      table_number: tableNumber.toString(),
      status: 'available',
      seats: 4
    };
    setTables([...tables, newTable]);
  };

  const handleDeleteTable = (tableId: string) => {
    if (confirm('Bu masayı silmek istediğinize emin misiniz?')) {
      setTables(tables.filter(t => t.id !== tableId));
    }
  };

  const handleSaveProduct = (product: any) => {
    if (product.id) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, { ...product, id: `prod-${Date.now()}` }]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setProducts(products.filter(p => p.id !== productId));
      setIsProductModalOpen(false);
    }
  };

  const handleAddCategory = (categoryName: string) => {
    const newCategory = { id: `cat-${Date.now()}`, name: categoryName };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const openTableSession = (tableId: string, waiterName: string, pax: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    const sessionId = `table-${tableId}`;
    setSessions(prev => ({
      ...prev,
      [sessionId]: {
        id: sessionId,
        type: 'table',
        name: `Masa ${table.table_number}`,
        customerName: waiterName, // Keeping the key as customerName to avoid breaking other things, but passing waiterName
        pax,
        items: [],
        createdAt: new Date(),
        note: ''
      }
    }));
    setActiveSessionId(sessionId);
    setCurrentView('products');
    setIsEditingNote(false);
    setNoteText('');
  };

  const openTakeawaySession = (customerName: string, phone: string, address: string) => {
    const sessionId = `takeaway-${Date.now()}`;
    setSessions(prev => ({
      ...prev,
      [sessionId]: {
        id: sessionId,
        type: 'takeaway',
        name: customerName,
        phone,
        address,
        items: [],
        createdAt: new Date(),
        note: ''
      }
    }));
    setActiveSessionId(sessionId);
    setCurrentView('products');
    setIsEditingNote(false);
    setNoteText('');
  };

  const addReservation = (res: Omit<Reservation, 'id'>) => {
    const newRes = { ...res, id: `res-${Date.now()}` };
    
    // Update local state
    setReservations(prev => [...prev, newRes]);
    
    // Update localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('gastro_reservations') || '[]');
      // Inject restaurantId=1 so it belongs to this POS
      localStorage.setItem('gastro_reservations', JSON.stringify([...stored, { ...newRes, restaurantId: '1' }]));
    } catch (e) {
      console.error('Error saving reservation', e);
    }
  };

  const activeSession = activeSessionId ? sessions[activeSessionId] : null;

  const addToCart = (product: any) => {
    if (!activeSessionId) {
      alert('Lütfen önce bir masa açın veya paket sipariş oluşturun!');
      return setCurrentView('tables');
    }
    setSessions(prev => {
      const session = prev[activeSessionId];
      const existingItem = session.items.find(i => i.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = session.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        newItems = [...session.items, { id: product.id, name: product.name, price: product.price, quantity: 1, category_id: product.category_id }];
      }
      return { ...prev, [activeSessionId]: { ...session, items: newItems } };
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const session = prev[activeSessionId];
      const newItems = session.items.map(i => {
        if (i.id === productId) {
          const newQ = i.quantity + delta;
          return newQ > 0 ? { ...i, quantity: newQ } : i;
        }
        return i;
      });
      return { ...prev, [activeSessionId]: { ...session, items: newItems } };
    });
  };

  const removeFromCart = (productId: string) => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const session = prev[activeSessionId];
      return { ...prev, [activeSessionId]: { ...session, items: session.items.filter(i => i.id !== productId) } };
    });
  };

  const handleTakePayment = () => {
    if (!activeSessionId) return;
    const session = sessions[activeSessionId];
    if (!session || session.items.length === 0) return;

    if (confirm('Ödemeyi onaylıyor musunuz? (Adisyon kapatılacak)')) {
      const subT = session.items.reduce((sum, item) => sum + (item.price * item.quantity * (item.portion || 1)), 0);
      const disc = session.discount || 0;
      const total = subT - disc;

      const completedOrder = {
        ...session,
        id: `completed-${Date.now()}`,
        completedAt: new Date().toISOString(),
        totalAmount: total,
      };

      try {
        const stored = JSON.parse(localStorage.getItem('gastro_completed_orders') || '[]');
        localStorage.setItem('gastro_completed_orders', JSON.stringify([...stored, completedOrder]));
      } catch (e) {
        console.error('Error saving completed order', e);
      }

      setSessions(prev => {
        const copy = { ...prev };
        delete copy[activeSessionId];
        return copy;
      });
      setActiveSessionId(null);
      setIsEditingNote(false);
      setNoteText('');
      setEditingItemNoteId(null);
      setItemNoteText('');
    }
  };

  const clearSession = () => {
    if (!activeSessionId) return;
    if (confirm('Adisyonu kapatmak istediğinize emin misiniz? (Tüm ürünler silinecek)')) {
      setSessions(prev => {
        const copy = { ...prev };
        delete copy[activeSessionId];
        return copy;
      });
      setActiveSessionId(null);
      setIsEditingNote(false);
      setNoteText('');
      setEditingItemNoteId(null);
      setItemNoteText('');
    }
  };

  const handleSaveNote = () => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const session = prev[activeSessionId];
      return { ...prev, [activeSessionId]: { ...session, note: noteText } };
    });
    setIsEditingNote(false);
  };

  const handleSaveItemNote = (itemId: string) => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const session = prev[activeSessionId];
      const newItems = session.items.map(i => 
        i.id === itemId ? { ...i, note: itemNoteText } : i
      );
      return { ...prev, [activeSessionId]: { ...session, items: newItems } };
    });
    setEditingItemNoteId(null);
  };

  const handleGlobalPortionChange = () => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const session = prev[activeSessionId];
      if (session.items.length === 0) return prev;
      const lastItem = session.items[session.items.length - 1];
      const p = lastItem.portion || 1;
      const newPortion = p === 1 ? 1.5 : (p === 1.5 ? 2 : (p === 2 ? 0.5 : 1));
      const newItems = [...session.items];
      newItems[newItems.length - 1] = { ...lastItem, portion: newPortion };
      return { ...prev, [activeSessionId]: { ...session, items: newItems } };
    });
  };

  const togglePortion = (itemId: string) => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const session = prev[activeSessionId];
      const newItems = session.items.map(i => {
        if (i.id === itemId) {
          const p = i.portion || 1;
          const newPortion = p === 1 ? 1.5 : (p === 1.5 ? 2 : (p === 2 ? 0.5 : 1));
          return { ...i, portion: newPortion };
        }
        return i;
      });
      return { ...prev, [activeSessionId]: { ...session, items: newItems } };
    });
  };

  const handleApplyDiscount = (amount: number) => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const session = prev[activeSessionId];
      // If amount is 0, it removes the discount. We can toggle it by passing 0.
      return { ...prev, [activeSessionId]: { ...session, discount: amount } };
    });
  };

  const removeDiscount = () => handleApplyDiscount(0);

  const removeNote = () => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const session = prev[activeSessionId];
      return { ...prev, [activeSessionId]: { ...session, note: '' } };
    });
    setNoteText('');
  };

  const handleSendOrder = () => {
    if (!activeSession) return;
    
    // 1. Print receipts directly via thermal printing hidden iframe
    printReceipt(activeSession, 'kitchen', categories);
    printReceipt(activeSession, 'bar', categories);
    
    // 2. Save order to KDS / BDS via localStorage event
    const activeOrders = JSON.parse(localStorage.getItem('gastro_active_orders') || '[]');
    const newOrder = {
      ...activeSession,
      orderId: `ORD-${Date.now()}`,
      status: 'new' // 'new' -> 'preparing' -> 'ready'
    };
    localStorage.setItem('gastro_active_orders', JSON.stringify([...activeOrders, newOrder]));
    
    alert('Sipariş başarıyla mutfağa ve bara gönderildi! Fişler yazdırılıyor...');
  };

  const filteredProducts = products.filter(p => {
    if (!p.is_available) return false;
    if (searchQuery) return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory !== 'Tümü') {
      const cat = categories.find(c => c.name === activeCategory);
      return cat && p.category_id === cat.id;
    }
    return true;
  });

  const subTotal = activeSession?.items.reduce((sum, item) => sum + (item.price * item.quantity * (item.portion || 1)), 0) || 0;
  const cartTotal = subTotal - (activeSession?.discount || 0);
  const cartItemCount = activeSession?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 size={40} className="animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[72px] hover:w-64 group bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-20 transition-all duration-300 ease-in-out">
        <div className="p-5 flex items-center gap-3 overflow-hidden border-b border-slate-100">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white">G</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Gastro<span className="font-light">Sync</span></span>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <button onClick={() => setCurrentView('products')} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg font-semibold overflow-hidden transition-colors ${currentView === 'products' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Sipariş">
            <ShoppingCart size={20} className="shrink-0" /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Sipariş</span>
          </button>
          <button onClick={() => setCurrentView('tables')} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg font-semibold overflow-hidden transition-colors ${currentView === 'tables' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Masa Yönetimi">
            <Store size={20} className="shrink-0" /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Masa Yönetimi</span>
          </button>
          <button onClick={() => setCurrentView('takeaway')} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg font-semibold overflow-hidden transition-colors ${currentView === 'takeaway' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Paket Sipariş">
            <Package size={20} className="shrink-0" /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Paket Sipariş</span>
          </button>
          <button onClick={() => setCurrentView('reservations')} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg font-semibold overflow-hidden transition-colors ${currentView === 'reservations' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Rezervasyonlar">
            <Calendar size={20} className="shrink-0" /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Rezervasyonlar</span>
          </button>
          <button onClick={() => setCurrentView('tickets')} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg font-semibold overflow-hidden transition-colors ${currentView === 'tickets' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Adisyonlar">
            <FileText size={20} className="shrink-0" /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Adisyonlar</span>
          </button>
          <button onClick={() => setCurrentView('reports')} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg font-semibold overflow-hidden transition-colors ${currentView === 'reports' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Raporlar">
            <PieChart size={20} className="shrink-0" /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Raporlar</span>
          </button>
          <button onClick={() => setCurrentView('profile')} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg font-semibold overflow-hidden transition-colors ${currentView === 'profile' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Profil">
            <User size={20} className="shrink-0" /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Profil</span>
          </button>
          <button onClick={() => setCurrentView('settings')} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg font-semibold overflow-hidden transition-colors ${currentView === 'settings' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} title="Ayarlar">
            <Settings size={20} className="shrink-0" /> <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Ayarlar</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <Link href="/super-admin" className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shrink-0" title="Admin Paneline Dön">
              <Home size={20} />
            </Link>
            
            {restaurant && currentView !== 'restaurants' && (
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün veya kategori ara..." 
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
            )}
          </div>
          
          {restaurant && currentView !== 'restaurants' && (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsQuickProductsOpen(true)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">
                Hızlı Ürünler
              </button>
              <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-semibold rounded-lg text-sm transition-colors">
                Ürün Ekle
              </button>
              {/* Mobile menu trigger for cart */}
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)} 
                className="lg:hidden relative w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700"
              >
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </header>

        {/* Content Area */}
        {currentView === 'restaurants' ? (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Restoran Seçimi</h1>
                <p className="text-slate-500 font-medium mt-1">Yönetmek istediğiniz restoranı seçerek kasa sistemine erişebilirsiniz.</p>
              </div>

              {adminRestaurants.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-medium">
                  Yüklenecek restoran bulunamadı.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminRestaurants.map(rest => {
                    const slug = rest.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
                    return (
                      <div 
                        key={rest.id} 
                        onClick={async () => {
                          setIsLoading(true);
                          try {
                            const menuRes = await fetch(`/api/admin/menu?slug=${slug}`);
                            const menuData = await menuRes.json();
                            if (menuData.success) {
                              setRestaurant(menuData.restaurant);
                              setProducts(menuData.products || []);
                              setCategories(menuData.categories || []);
                              
                              const tRes = await fetch(`/api/admin/tables?restaurantId=${menuData.restaurant.id}`);
                              const tData = await tRes.json();
                              if (tData.success) setTables(tData.tables);
                              
                              loadLocalReservations(menuData.restaurant.id);
                              
                              localStorage.setItem('gastro_active_restaurant_id', menuData.restaurant.id);
                              localStorage.setItem('gastro_active_restaurant_slug', slug);
                              
                              setCurrentView('products');
                            } else {
                              alert('Restoran verileri yüklenemedi.');
                            }
                          } catch (err) {
                            console.error(err);
                            alert('Restoran yüklenirken bir hata oluştu.');
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-500 transition-all cursor-pointer group"
                      >
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{rest.name}</h3>
                        <p className="text-slate-500 text-sm mt-2 flex items-center gap-1"><MapPin size={14}/> {rest.address || 'Adres belirtilmemiş'}</p>
                        <div className="mt-4 flex items-center gap-2 text-indigo-600 font-bold text-sm">
                          Kasa Sistemini Yönet <LogIn size={16} className="transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : currentView === 'products' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Categories Tab Bar */}
          <div className="px-6 pt-4 border-b border-slate-200 bg-white shrink-0">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveCategory('Tümü')}
                className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                  activeCategory === 'Tümü' 
                    ? 'text-slate-900' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Tümü
                {activeCategory === 'Tümü' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>
                )}
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                    activeCategory === cat.name 
                      ? 'text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {cat.name}
                  {activeCategory === cat.name && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>
                  )}
                </button>
              ))}
              <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="pb-3 text-slate-400 hover:text-slate-600 ml-auto flex items-center gap-1 text-sm font-medium">
                <Plus size={16} /> Yeni Ürün Ekle
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => addToCart(product)} 
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-300 transition-all active:scale-95 flex flex-col h-28 relative group shadow-sm"
                >
                  <button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setIsProductModalOpen(true); }} className="absolute top-1 right-1 p-1.5 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil size={14} />
                  </button>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-semibold text-slate-700 text-sm leading-tight line-clamp-3">{product.name}</h3>
                  </div>
                  <div className="px-3 pb-2 flex justify-between items-end">
                    <span className="font-medium text-slate-500 text-xs">₺{product.price.toFixed(2)}</span>
                  </div>
                  <div className="h-1 w-full bg-red-600"></div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                 <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                   Sonuç bulunamadı.
                 </div>
              )}
            </div>
          </div>
        </div>
        ) : currentView === 'tables' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Store/> Masa Yönetimi</h2>
              <button onClick={handleAddTable} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"><Plus size={18}/> Masa Ekle</button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {tables.map(table => {
                const session = sessions[`table-${table.id}`];
                const isOccupied = !!session;
                
                return (
                  <div 
                    key={table.id}
                    onClick={() => {
                      const tableSessionId = `table-${table.id}`;
                      if (session) {
                        setActiveSessionId(tableSessionId);
                        setCurrentView('products');
                        setIsCartOpen(true);
                      } else {
                        setSelectedTableForOpen(table.id);
                      }
                    }}
                    className={`cursor-pointer relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border shadow-sm ${
                      isOccupied 
                        ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isOccupied ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Store size={24} />
                    </div>
                    <span className={`font-bold text-lg ${isOccupied ? 'text-indigo-900' : 'text-slate-700'}`}>{table.table_number}</span>
                    {isOccupied && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Users size={12} /> {session.pax}
                      </span>
                    )}
                    {!isOccupied && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteTable(table.id); }} 
                        className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
              {tables.length === 0 && <div className="col-span-full text-center text-slate-400 py-8">Sistemde kayıtlı masa bulunmuyor.</div>}
            </div>
          </div>
        ) : currentView === 'takeaway' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
            <div className="max-w-2xl mx-auto w-full">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6"><Package/> Paket Sipariş</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><User size={14}/> Müşteri Adı *</label>
                  <input type="text" value={takeawayForm.customerName} onChange={(e) => setTakeawayForm({...takeawayForm, customerName: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Ad Soyad" autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Phone size={14}/> Telefon</label>
                  <input type="tel" value={takeawayForm.phone} onChange={(e) => setTakeawayForm({...takeawayForm, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="05XX XXX XX XX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><MapPin size={14}/> Adres</label>
                  <textarea value={takeawayForm.address} onChange={(e) => setTakeawayForm({...takeawayForm, address: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none font-medium" placeholder="Açık Adres" />
                </div>
                <div className="pt-4">
                  <button onClick={() => openTakeawaySession(takeawayForm.customerName, takeawayForm.phone, takeawayForm.address)} disabled={!takeawayForm.customerName.trim()} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-colors">Siparişi Başlat</button>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'reservations' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Calendar/> Rezervasyonlar</h2>
              {!isAddingReservation && (
                <button onClick={() => setIsAddingReservation(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"><Plus size={18}/> Yeni Rezervasyon</button>
              )}
            </div>
            {isAddingReservation ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto w-full">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (reservationForm.customerName) {
                    addReservation(reservationForm);
                    setIsAddingReservation(false);
                    setReservationForm({ customerName: '', phone: '', date: new Date().toISOString().split('T')[0], time: '19:00', pax: 2, tableId: '', note: '', email: '' });
                  }
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1"><User size={14} className="inline mr-1"/>Müşteri Adı *</label><input required type="text" value={reservationForm.customerName} onChange={e => setReservationForm({...reservationForm, customerName: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1"><Phone size={14} className="inline mr-1"/>Telefon *</label><input required type="tel" value={reservationForm.phone} onChange={e => setReservationForm({...reservationForm, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" /></div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1"><Mail size={14} className="inline mr-1"/>E-Posta *</label><input required type="email" value={reservationForm.email} onChange={e => setReservationForm({...reservationForm, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1"><CalendarIcon size={14} className="inline mr-1"/>Tarih</label><input required type="date" value={reservationForm.date} onChange={e => setReservationForm({...reservationForm, date: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1"><Clock size={14} className="inline mr-1"/>Saat</label><input required type="time" value={reservationForm.time} onChange={e => setReservationForm({...reservationForm, time: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1"><User size={14} className="inline mr-1"/>Kişi Sayısı</label><input required type="number" min="1" value={reservationForm.pax} onChange={e => setReservationForm({...reservationForm, pax: parseInt(e.target.value) || 1})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" /></div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1"><Store size={14} className="inline mr-1"/>Masa (Opsiyonel)</label>
                      <select value={reservationForm.tableId} onChange={e => setReservationForm({...reservationForm, tableId: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium">
                        <option value="">Atanmadı</option>
                        {tables.map(t => <option key={t.id} value={t.id}>Masa {t.table_number}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1"><FileText size={14} className="inline mr-1"/>Not / Özel İstek</label><textarea value={reservationForm.note} onChange={e => setReservationForm({...reservationForm, note: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20 font-medium" /></div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsAddingReservation(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">İptal</button>
                    <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">Kaydet</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-3 max-w-4xl mx-auto w-full">
                {reservations.length === 0 ? (
                  <div className="text-center text-slate-400 py-12">Henüz rezervasyon bulunmuyor.</div>
                ) : (
                  reservations.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map(res => (
                    <div key={res.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{res.customerName}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1 font-medium">
                          <span className="flex items-center gap-1"><CalendarIcon size={14} className="text-indigo-500"/> {res.date}</span>
                          <span className="flex items-center gap-1"><Clock size={14} className="text-amber-500"/> {res.time}</span>
                          <span className="flex items-center gap-1"><User size={14} className="text-slate-400"/> {res.pax} Kişi</span>
                          {res.tableId && <span className="flex items-center gap-1"><Store size={14} className="text-emerald-500"/> Masa {tables.find(t=>t.id===res.tableId)?.table_number}</span>}
                        </div>
                        {res.note && (
                          <div className="mt-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 inline-block">
                            <span className="font-bold">Not:</span> {res.note}
                          </div>
                        )}
                      </div>
                      {res.phone && (
                        <div className="flex flex-col gap-2 shrink-0 items-end">
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 text-sm font-medium border border-slate-100">
                            <Phone size={14}/> {res.phone}
                          </div>
                          {res.email && (
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600 text-sm font-medium border border-slate-100">
                              <Mail size={14}/> {res.email}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : currentView === 'tickets' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Receipt/> Adisyonlar</h2>
              <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Aktif {Object.keys(sessions).length} sipariş bulunuyor</span>
            </div>
            
            {Object.keys(sessions).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <Receipt size={64} className="mb-4 opacity-30 text-slate-300" />
                <p className="text-xl font-medium text-slate-400">Açık Adisyon Bulunmuyor</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(sessions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(session => {
                  const totalAmount = session.items.reduce((sum, item) => sum + (item.price * item.quantity * (item.portion || 1)), 0);
                  const finalAmount = totalAmount - (session.discount || 0);
                  const timeDiff = Math.floor((new Date().getTime() - new Date(session.createdAt).getTime()) / 60000);
                  return (
                    <div 
                      key={session.id}
                      onClick={() => { setActiveSessionId(session.id); setCurrentView('products'); setIsCartOpen(true); }}
                      className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            {session.name}
                            {session.type === 'takeaway' && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md">Paket</span>}
                          </h3>
                          {session.pax && <p className="text-sm font-medium text-slate-500">{session.pax} Kişi</p>}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-slate-800">₺{finalAmount.toFixed(2)}</div>
                          <div className="text-xs font-medium text-slate-400 flex items-center justify-end gap-1 mt-1">
                            <Clock size={12} /> {timeDiff} dk önce
                          </div>
                        </div>
                      </div>
                      {session.type === 'takeaway' && (session.address || session.phone) && (
                        <div className="mt-2 space-y-1 mb-3 pb-3 border-b border-slate-100 text-sm font-medium text-slate-600">
                          {session.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {session.phone}</div>}
                          {session.address && <div className="flex items-start gap-2"><MapPin size={14} className="text-slate-400 mt-0.5"/> <span className="line-clamp-2">{session.address}</span></div>}
                        </div>
                      )}
                      <div className="mt-auto pt-3 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-500">
                          <span className="font-bold text-slate-700">{session.items.reduce((s, i) => s + i.quantity, 0)}</span> Ürün
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : currentView === 'reports' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6"><PieChart/> Satış Raporları</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 mb-6 font-medium">Günün satış özetleri ve ciro raporu aşağıda listelenmektedir.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                    <p className="text-sm text-indigo-700 font-bold mb-2">Açık Adisyon Sayısı</p>
                    <p className="text-4xl font-black text-indigo-900">{Object.keys(sessions).length}</p>
                  </div>
                  <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                    <p className="text-sm text-emerald-700 font-bold mb-2">Günlük Rezervasyon</p>
                    <p className="text-4xl font-black text-emerald-900">{reservations.length}</p>
                  </div>
                  <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 shadow-sm">
                    <p className="text-sm text-amber-700 font-bold mb-2">Kayıtlı Masa</p>
                    <p className="text-4xl font-black text-amber-900">{tables.length}</p>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                   <h3 className="text-lg font-bold text-slate-800 mb-2">Detaylı Ciro Raporu</h3>
                   <p className="text-slate-500 text-sm">Gelişmiş ciro ve ürün satış analizleri yakında bu alanda yer alacaktır. Lütfen daha sonra tekrar kontrol ediniz.</p>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'profile' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
            <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <button onClick={() => setCurrentView('products')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                  <User size={20} className="text-slate-500" />
                </button>
                <h2 className="text-lg font-medium text-slate-800">Profil</h2>
                <div className="w-10"></div>
              </div>
              
              <div className="p-6 md:p-10 space-y-8">
                {/* User Info */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center font-medium text-xl text-slate-700 shadow-sm shrink-0">
                    {profileName ? profileName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)}
                      className="text-lg font-medium text-slate-800 bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-100 rounded px-1 w-full"
                      placeholder="İsim Giriniz"
                    />
                    <input 
                      type="text" 
                      value={profileId} 
                      onChange={(e) => setProfileId(e.target.value)}
                      className="text-sm text-slate-500 bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-100 rounded px-1 mt-1 w-full"
                      placeholder="ID veya Unvan Giriniz"
                    />
                  </div>
                </div>

                <button className="w-full bg-[#1A1F2C] hover:bg-black text-white font-medium py-4 px-6 rounded-2xl flex justify-center items-center gap-3 transition-colors shadow-md">
                  <Headset size={20} />
                  7/24 Premium Destek
                </button>

                {/* Ödemeler */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-500 px-1">Ödemeler (Auszahlungen)</h4>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                    <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors text-left group">
                      <div className="flex items-center gap-4">
                        <Banknote size={20} className="text-slate-700" />
                        <span className="font-medium text-slate-700">Para Çekme / Ödemeler</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-600">›</span>
                    </button>
                  </div>
                </div>

                {/* Ödeme Yöntemleri */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-500 px-1">Ödeme Yöntemleri</h4>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                    <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors text-left group">
                      <div className="flex items-center gap-4">
                        <CreditCard size={20} className="text-slate-700" />
                        <span className="font-medium text-slate-700">Kart Terminali (POS)</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-600">›</span>
                    </button>
                    <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors text-left group">
                      <div className="flex items-center gap-4">
                        <Banknote size={20} className="text-slate-700" />
                        <span className="font-medium text-slate-700">Nakit Ödemeler</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-600">›</span>
                    </button>
                    <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors text-left group">
                      <div className="flex items-center gap-4">
                        <LinkIcon size={20} className="text-slate-700" />
                        <span className="font-medium text-slate-700">Link İle Ödeme</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-600">›</span>
                    </button>
                  </div>
                </div>

                {/* Vergiler */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-500 px-1">Vergiler</h4>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                    <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors text-left group">
                      <div className="flex items-center gap-4">
                        <FileText size={20} className="text-slate-700" />
                        <span className="font-medium text-slate-700">Vergiler (Steuern)</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-600">›</span>
                    </button>
                    <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors text-left group">
                      <div className="flex items-center gap-4">
                        <Store size={20} className="text-slate-700" />
                        <span className="font-medium text-slate-700">TSE Kasa Sistemi</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-600">›</span>
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        ) : currentView === 'settings' ? (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
            <div className="max-w-xl mx-auto w-full">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6"><Settings/> Restoran Ayarları</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem('gastro_restaurant_settings', JSON.stringify(settingsForm));
                  alert('Ayarlar başarıyla kaydedildi!');
                }} className="space-y-6">
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-1">Çalışma Saatleri</h3>
                    <p className="text-sm font-medium text-indigo-700">Müşteriler sadece bu saatler arasında rezervasyon ve sipariş oluşturabilir.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Clock size={16}/> Açılış</label>
                      <input required type="time" value={settingsForm.openTime} onChange={e => setSettingsForm({...settingsForm, openTime: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Clock size={16}/> Kapanış</label>
                      <input required type="time" value={settingsForm.closeTime} onChange={e => setSettingsForm({...settingsForm, closeTime: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-colors">Kaydet</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Table Open Modal */}
      {selectedTableForOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Masa {tables.find(t => t.id === selectedTableForOpen)?.table_number} Açılışı</h2>
                <button onClick={() => setSelectedTableForOpen(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Garson Adı</label>
                  <input type="text" value={waiterName} onChange={e => setWaiterName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Garson Adı" autoFocus />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kişi Sayısı</label>
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-2">
                    <button onClick={() => setPax(p => Math.max(1, p - 1))} className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100">-</button>
                    <span className="flex-1 text-center font-bold text-slate-800 text-xl">{pax}</span>
                    <button onClick={() => setPax(p => p + 1)} className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100">+</button>
                  </div>
               </div>
               <div className="flex gap-3 pt-4">
                 <button onClick={() => setSelectedTableForOpen(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">İptal</button>
                 <button onClick={() => {
                   if(waiterName.trim()) {
                     openTableSession(selectedTableForOpen, waiterName, pax);
                     setSelectedTableForOpen(null);
                     setWaiterName('');
                     setPax(2);
                   }
                 }} disabled={!waiterName.trim()} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors">Masayı Aç</button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Right Sidebar (Cart) */}
      {restaurant && currentView !== 'restaurants' && (
        <aside className={`fixed lg:relative top-0 right-0 h-full w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 z-30 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          
          {/* Mobile close button inside cart */}
          <div className="lg:hidden absolute top-4 left-4 z-50">
            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-600">
              <X size={18} />
            </button>
          </div>

          {/* Top Actions in Cart */}
          <div className="p-4 border-b border-slate-100 flex gap-2">
             <button onClick={() => setCurrentView('tables')} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors">
                Masa Aç
             </button>
             <button onClick={() => setCurrentView('tickets')} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors">
                Adisyonlar
             </button>
          </div>

          <div className="px-4 py-3 bg-slate-50 flex items-center justify-between border-b border-slate-100">
            <div className="font-bold text-slate-800 text-sm">
              {activeSession ? activeSession.name : 'Masa Seçilmedi'}
            </div>
            {activeSession && (
              <button onClick={clearSession} className="text-slate-400 hover:text-red-500 text-xs font-semibold flex items-center gap-1">
                <Trash2 size={14}/> Temizle
              </button>
            )}
          </div>

          {/* Cart Items Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            {!activeSession ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 p-6">
                <Store size={40} className="text-slate-300" />
                <div className="text-center font-medium text-sm">Sipariş almak için lütfen bir masa veya paket sipariş açın.</div>
              </div>
            ) : activeSession.items.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center font-medium text-sm">Ürün veya Tutar Ekleyin</div>
              </div>
            ) : (
              <div className="space-y-px bg-slate-200">
                {activeSession.items.map(item => (
                  <div key={item.id} className="bg-white p-3 flex justify-between items-start group">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-semibold text-slate-700 text-xs shrink-0 mt-0.5">
                        {item.quantity}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{item.name}</div>
                        {item.portion !== 1 && item.portion !== undefined && (
                          <div className="text-xs text-slate-500 mt-0.5">x{item.portion} Porsiyon</div>
                        )}
                        {item.note && (
                           <div className="text-[11px] text-amber-600 mt-0.5">Not: {item.note}</div>
                        )}
                        
                        {/* Quantity Controls (Hover) */}
                        <div className="hidden group-hover:flex items-center gap-1 mt-2">
                          <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }} className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"><Plus size={12}/></button>
                          <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }} className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"><Minus size={12}/></button>
                          <button onClick={(e) => { e.stopPropagation(); togglePortion(item.id); }} className="px-2 h-6 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium ml-1">Porsiyon</button>
                          <button onClick={(e) => { e.stopPropagation(); setItemNoteText(item.note || ''); setEditingItemNoteId(item.id); }} className="px-2 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium">Not</button>
                        </div>

                        {editingItemNoteId === item.id && (
                          <div className="mt-2 flex gap-1">
                            <input type="text" value={itemNoteText} onChange={e => setItemNoteText(e.target.value)} className="w-full text-xs border border-slate-200 rounded px-2 py-1" placeholder="Ürün notu..."/>
                            <button onClick={() => handleSaveItemNote(item.id)} className="bg-slate-800 text-white text-xs px-2 rounded">OK</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-semibold text-slate-800 text-sm">
                        ₺{(item.price * item.quantity * (item.portion || 1)).toFixed(2)}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Adisyon Notu Alanı */}
                <div className="bg-white p-3">
                   {isEditingNote ? (
                    <div className="flex gap-2">
                      <input 
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        className="flex-1 border border-slate-200 rounded text-sm px-2 py-1.5 focus:outline-none focus:border-slate-400"
                        placeholder="Adisyon notu..."
                        autoFocus
                      />
                      <button onClick={handleSaveNote} className="px-3 bg-slate-800 text-white rounded text-sm font-medium">OK</button>
                    </div>
                   ) : activeSession?.note ? (
                    <div className="flex justify-between items-start text-sm">
                      <div className="text-slate-600"><span className="font-semibold text-slate-800">Not:</span> {activeSession.note}</div>
                      <button onClick={() => { setNoteText(activeSession.note || ''); setIsEditingNote(true); }} className="text-slate-400 hover:text-slate-600"><Pencil size={12}/></button>
                    </div>
                   ) : (
                    <button onClick={() => setIsEditingNote(true)} className="text-sm text-slate-400 hover:text-slate-600 font-medium">+ Adisyon Notu Ekle</button>
                   )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Footer / Actions */}
          <div className="bg-white border-t border-slate-200 flex flex-col shrink-0">
            <div className="p-4 space-y-1.5 border-b border-slate-100 bg-slate-50/50">
               <div className="flex justify-between text-slate-500 text-sm">
                <span>Ara Toplam</span>
                <span>₺{subTotal.toFixed(2)}</span>
               </div>
               {activeSession?.discount ? (
                 <div className="flex justify-between text-emerald-600 text-sm font-medium">
                   <span>İndirim <button onClick={removeDiscount} className="text-emerald-400 hover:text-emerald-700 ml-1 inline-flex items-center"><X size={12}/></button></span>
                   <span>-₺{activeSession.discount.toFixed(2)}</span>
                 </div>
               ) : null}
               <div className="flex justify-between items-center font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                 <span className="text-lg">Toplam</span>
                 <span className="text-2xl tracking-tight">₺{cartTotal.toFixed(2)}</span>
               </div>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-2">
              <button 
                onClick={() => setIsDiscountModalOpen(true)}
                disabled={!activeSession || activeSession.items.length === 0}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm disabled:opacity-50 transition-colors"
              >
                 İndirim Uygula
              </button>
              <button 
                onClick={handleSendOrder}
                disabled={!activeSession || activeSession.items.length === 0}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm disabled:opacity-50 transition-colors"
              >
                 Siparişi Gönder
              </button>
              <button 
                onClick={handleTakePayment}
                disabled={!activeSession || activeSession.items.length === 0}
                className="py-4 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-lg text-base disabled:opacity-50 col-span-2 shadow-md transition-all active:scale-[0.98]"
              >
                 Ödeme Al (₺{cartTotal.toFixed(2)})
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
        onAddCategory={handleAddCategory}
      />

      <QuickProductsModal
        isOpen={isQuickProductsOpen}
        onClose={() => setIsQuickProductsOpen(false)}
        products={products}
        onAdd={addToCart}
      />

      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        total={subTotal}
        onApply={handleApplyDiscount}
      />
    </div>
  );
}
