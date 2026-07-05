'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Loader2, Building2, TrendingUp, Users, Calendar, Activity, MessageSquare, Plus, Trash2, Bike, Check, X, Key, Store, Monitor, ClipboardList, Star, Pencil
} from 'lucide-react';

export default function SuperAdminPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [courierApplications, setCourierApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'restaurants' | 'users' | 'messages' | 'applications' | 'couriers'>('dashboard');

  // New user form state
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'restaurant-admin', restaurantName: '' });
  const [isSaving, setIsSaving] = useState(false);

  // New message form state
  const [newMessage, setNewMessage] = useState({ receiverId: '', content: '' });

  // Credentials management modal states
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [credentialsForm, setCredentialsForm] = useState({ restaurantId: '', restaurantName: '', username: '', password: '' });

  // New restaurant modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', address: '', cuisine_type: '', description: '' });

  // Edit restaurant modal states
  const [isEditRestModalOpen, setIsEditRestModalOpen] = useState(false);
  const [editRestaurantForm, setEditRestaurantForm] = useState({ id: '', name: '', address: '', cuisine_type: '', description: '' });

  // Chat panel states
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'customer' | 'courier' | 'web_customer'>('customer');

  useEffect(() => {
    if (activeTab === 'dashboard') loadRestaurants();
    if (activeTab === 'restaurants') {
      loadRestaurants();
      loadUsers();
    }
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'messages') {
      loadMessages();
      loadUsers(); // Need users to select receiver
    }
    if (activeTab === 'applications') loadApplications();
    if (activeTab === 'couriers') loadCourierApplications();
  }, [activeTab]);

  async function loadRestaurants() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/super-admin/restaurants');
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Veriler yüklenemedi');
      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUsers() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/super-admin/customers');
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Kullanıcılar yüklenemedi');
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  const connectToRestaurant = (id: string, name: string) => {
    localStorage.setItem('gastro_active_restaurant_id', id);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '');
    localStorage.setItem('gastro_active_restaurant_slug', slug);
    router.push('/admin/possystem');
  };

  const deleteRestaurant = async (id: string) => {
    if (!confirm('Bu restoranı silmek istediğinize emin misiniz?')) return;
    
    if (id.startsWith('mock-')) {
      setRestaurants(restaurants.filter(r => r.id !== id));
      return;
    }

    try {
      const res = await fetch(`/api/super-admin/restaurants?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setRestaurants(restaurants.filter(r => r.id !== id));
    } catch (error: any) {
      alert('Restoran silinirken hata oluştu: ' + error.message + '\n\nNot: Bu restoranın ilişkili siparişleri, masaları veya menüleri varsa önce onların silinmesi gerekebilir.');
    }
  };

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/super-admin/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRestaurant)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setRestaurants([...restaurants, data.restaurant]);
      setIsAddModalOpen(false);
      setNewRestaurant({ name: '', address: '', cuisine_type: '', description: '' });
      alert('Restoran başarıyla eklendi');
      loadRestaurants();
    } catch (error: any) {
      alert('Restoran eklenirken hata oluştu: ' + error.message);
    }
  };

  const handleEditRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/super-admin/restaurants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editRestaurantForm)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      alert('Restoran detayları başarıyla güncellendi.');
      setIsEditRestModalOpen(false);
      loadRestaurants();
    } catch (error: any) {
      alert('Restoran güncellenirken hata oluştu: ' + error.message);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/super-admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: credentialsForm.restaurantId,
          username: credentialsForm.username,
          password: credentialsForm.password
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      alert('Giriş bilgileri başarıyla güncellendi.');
      setIsCredentialsModalOpen(false);
      loadUsers();
    } catch (error: any) {
      alert('Hata oluştu: ' + error.message);
    }
  };

  async function loadMessages() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Mesajlar yüklenemedi');
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadApplications() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/super-admin/applications');
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Başvurular yüklenemedi');
      setApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCourierApplications() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/super-admin/courier-applications');
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Kurye başvuruları yüklenemedi');
      setCourierApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateCourierStatus(id: string, status: 'approved' | 'rejected') {
    if (!confirm(`Başvuruyu ${status === 'approved' ? 'onaylamak' : 'reddetmek'} istediğinize emin misiniz?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/super-admin/courier-applications?id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setCourierApplications(courierApplications.map(app => app.id === id ? { ...app, status } : app));
      alert(`Kurye başvuru durumu güncellendi: ${status === 'approved' ? 'Onaylandı' : 'Reddedildi'}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let submitRole = newUser.role;
    let submitUsername = newUser.username;

    if (newUser.role === 'kurye') {
      submitRole = 'restaurant-admin';
      submitUsername = submitUsername.startsWith('kurye_') ? submitUsername : 'kurye_' + submitUsername;
    } else if (newUser.role === 'web') {
      submitRole = 'restaurant-admin';
      submitUsername = submitUsername.startsWith('web_') ? submitUsername : 'web_' + submitUsername;
    }

    try {
      const res = await fetch('/api/super-admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: submitUsername,
          password: newUser.password,
          role: submitRole,
          restaurantName: newUser.role === 'restaurant-admin' ? newUser.restaurantName : undefined
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setUsers([data.user, ...users]);
      setNewUser({ username: '', password: '', role: 'restaurant-admin', restaurantName: '' });
      alert('Kullanıcı başarıyla eklendi!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string, restaurantId: string | null) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/super-admin/customers?userId=${userId}&restaurantId=${restaurantId || 'null'}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setMessages([data.message, ...messages]);
      setNewMessage({ receiverId: '', content: '' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveApplication = async (appId: string) => {
    if (!confirm('Bu başvuruyu onaylayıp restoranı ve kullanıcıyı oluşturmak istediğinize emin misiniz?')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/super-admin/applications/approve?id=${appId}`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      alert(`Başarı! Restoran eklendi.\nKullanıcı Adı: ${data.user.username}\nŞifre: ${data.user.password}\n\nLütfen bu bilgileri restorana iletin.`);
      loadApplications();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading && !restaurants.length && !users.length && !messages.length) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 shadow-xl relative z-20">
        <div className="px-6 py-5 flex items-center justify-start border-b border-slate-800">
          <span className="text-xl font-black text-white tracking-tight">Super<span className="text-blue-500">Admin</span></span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Activity size={20} /> Ana Sayfa
          </button>
          
          <button 
            onClick={() => setActiveTab('restaurants')} 
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold transition-all ${activeTab === 'restaurants' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Building2 size={20} /> Restoranlar
          </button>

          <button 
            onClick={() => router.push('/admin/possystem')} 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Monitor size={20} /> Kasa Sistemi
          </button>

          <button 
            onClick={() => setActiveTab('users')} 
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} /> Kullanıcılar
          </button>

          <button 
            onClick={() => setActiveTab('applications')} 
            className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all ${activeTab === 'applications' ? 'bg-blue-600 text-white shadow-md font-bold' : 'text-slate-400 font-medium hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3"><ClipboardList size={20} /> Partnerler</div>
            {applications.filter(a => a.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {applications.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('couriers')} 
            className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all ${activeTab === 'couriers' ? 'bg-blue-600 text-white shadow-md font-bold' : 'text-slate-400 font-medium hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3"><Bike size={20} /> Kuryeler</div>
            {courierApplications.filter(a => a.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {courierApplications.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('messages')} 
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold transition-all ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <MessageSquare size={20} /> Mesajlar
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#0f172a]">
        {/* Header */}
        <header className="px-8 py-6 bg-slate-900/40 border-b border-slate-800/80 shrink-0 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {activeTab === 'dashboard' ? 'Ana Sayfa' :
               activeTab === 'restaurants' ? 'Restoranlar' :
               activeTab === 'users' ? 'Müşteriler / Kullanıcılar' :
               activeTab === 'applications' ? 'Partner Başvuruları' :
               activeTab === 'couriers' ? 'Kurye Başvuruları' : 'Mesajlar'}
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Süper Admin Yönetim Paneli</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-700/50">
              <ArrowLeft size={16} /> Ana Sayfa'ya Git
            </Link>
            {activeTab === 'restaurants' && (
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-600/10"
              >
                <Plus size={18}/> Yeni Ekle
              </button>
            )}
          </div>
        </header>

        {/* Content Box */}
        <div className="p-8">
          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Özet Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-2xl p-6 bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Building2 size={18} />
                    <span className="text-sm">Toplam Restoran</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{restaurants.length}</p>
                </div>
                <div className="glass-panel rounded-2xl p-6 bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <TrendingUp size={18} />
                    <span className="text-sm">Toplam Ciro</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-400">
                    €{restaurants.reduce((sum, r) => sum + (r.stats?.totalRevenue || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Restoran Listesi Özeti */}
              <section className="glass-panel rounded-2xl p-6 bg-slate-800/40 border border-slate-800">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                  <Building2 size={20} className="text-blue-400" />
                  Aktif Restoranlar
                </h2>
                {restaurants.length === 0 ? (
                  <p className="text-slate-400 py-4">Henüz kayıtlı restoran yok.</p>
                ) : (
                  <div className="space-y-4">
                    {restaurants.map((restaurant) => (
                      <div key={restaurant.id} className="bg-slate-800/50 rounded-xl p-4 flex justify-between items-center border border-slate-700/30">
                        <div>
                          <h3 className="font-semibold text-lg text-white">{restaurant.name}</h3>
                          <p className="text-slate-400 text-sm">{formatDate(restaurant.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold text-lg">€{(restaurant.stats?.totalRevenue || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'restaurants' && (
             <div className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-200">Kayıtlı Restoranlar ({restaurants.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {restaurants.map(rest => (
                    <div 
                      key={rest.id} 
                      onClick={() => connectToRestaurant(rest.id, rest.name)}
                      className="cursor-pointer bg-slate-800/40 rounded-2xl p-6 shadow-sm border border-slate-700/50 hover:border-blue-500/50 transition-all flex justify-between items-center group relative overflow-hidden"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">{rest.name}</h3>
                        {rest.cuisine_type && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {rest.cuisine_type.split(',').map((tag: string) => (
                              <span key={tag} className="text-[9px] bg-slate-800 text-slate-300 font-extrabold px-2 py-0.5 rounded-md">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {rest.description && (
                          <p className="text-slate-400 text-xs mt-1.5 truncate">{rest.description}</p>
                        )}
                        {rest.address && (
                          <p className="text-slate-500 text-[10px] mt-1 truncate">{rest.address}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {rest.is_featured && (
                          <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shrink-0"><Star size={12}/> Öne Çıkan</span>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditRestaurantForm({
                              id: rest.id,
                              name: rest.name,
                              address: rest.address || '',
                              cuisine_type: rest.cuisine_type || '',
                              description: rest.description || ''
                            });
                            setIsEditRestModalOpen(true);
                          }}
                          className="p-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl transition-all shadow-sm flex items-center justify-center border border-amber-500/20"
                          title="Restoran Detaylarını Düzenle"
                        >
                          <Pencil size={18}/>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const restUser = users.find(u => u.restaurant_id === rest.id && u.role === 'restaurant-admin');
                            setCredentialsForm({
                              restaurantId: rest.id,
                              restaurantName: rest.name,
                              username: restUser ? restUser.username : rest.name.toLowerCase().replace(/[^a-z0-9]+/g, '') + '_admin',
                              password: restUser ? restUser.password_hash : ''
                            });
                            setIsCredentialsModalOpen(true);
                          }}
                          className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all shadow-sm flex items-center justify-center border border-blue-500/20"
                          title="Giriş Bilgilerini Yönet"
                        >
                          <Key size={18}/>
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            deleteRestaurant(rest.id); 
                          }} 
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all shadow-sm flex items-center justify-center border border-red-500/20" 
                          title="Sil"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Yeni Kullanıcı Ekleme Formu */}
              <section className="glass-panel rounded-2xl p-6 bg-slate-800/40 border border-slate-800">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-blue-400">
                  <Plus size={20} />
                  Yeni Kullanıcı Ekle
                </h2>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Kullanıcı Adı</label>
                    <input
                      required
                      value={newUser.username}
                      onChange={e => setNewUser({...newUser, username: e.target.value})}
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                      placeholder="Giriş için kullanıcı adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Şifre</label>
                    <input
                      required
                      value={newUser.password}
                      onChange={e => setNewUser({...newUser, password: e.target.value})}
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                      placeholder="Giriş için şifre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Rol</label>
                    <select
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                    >
                      <option value="restaurant-admin">Müşteri (Restoran Sahibi)</option>
                      <option value="kurye">Kurye Müşteri (Kurye Girişi)</option>
                      <option value="web">Web Müşteri (Son Kullanıcı)</option>
                      <option value="super-admin">Super Admin (Yönetici)</option>
                    </select>
                  </div>
                  {newUser.role === 'restaurant-admin' && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Restoran / İşletme Adı</label>
                      <input
                        required
                        value={newUser.restaurantName}
                        onChange={e => setNewUser({...newUser, restaurantName: e.target.value})}
                        className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                        placeholder="Yeni açılacak restoranın adı"
                      />
                    </div>
                  )}
                  <div className="md:col-span-2 flex justify-end mt-2">
                    <button
                      disabled={isSaving}
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all shadow-md shadow-blue-600/10"
                    >
                      {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                      Kullanıcıyı Ekle
                    </button>
                  </div>
                </form>
              </section>

              {/* Kullanıcı Listesi */}
              <section className="glass-panel rounded-2xl p-6 bg-slate-800/40 border border-slate-800">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                  <Users size={20} className="text-blue-400" />
                  Sistem Kullanıcıları
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Kullanıcı Adı</th>
                        <th className="pb-3 font-semibold">Rol</th>
                        <th className="pb-3 font-semibold">Bağlı İşletme</th>
                        <th className="pb-3 font-semibold">Kayıt Tarihi</th>
                        <th className="pb-3 font-semibold text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/10 transition-colors">
                          <td className="py-4 font-bold text-white">{user.username.replace(/^(kurye_|web_)/, '')}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              user.role === 'super-admin' ? 'bg-purple-500/20 text-purple-400' :
                              user.username.startsWith('kurye_') ? 'bg-blue-500/20 text-blue-400' :
                              user.username.startsWith('web_') ? 'bg-indigo-500/20 text-indigo-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {user.role === 'super-admin' ? 'Super Admin' :
                               user.username.startsWith('kurye_') ? 'Kurye Müşteri' :
                               user.username.startsWith('web_') ? 'Web Müşteri' : 'Müşteri'}
                            </span>
                          </td>
                          <td className="py-4 text-slate-300">
                            {user.restaurants ? user.restaurants.name : '—'}
                          </td>
                          <td className="py-4 text-slate-400 text-sm">{formatDate(user.created_at)}</td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => handleDeleteUser(user.id, user.restaurant_id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                              title="Kullanıcıyı Sil"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-8 animate-in fade-in">
              <section className="glass-panel rounded-2xl p-6 bg-slate-800/40 border border-slate-800">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                  <ClipboardList size={20} className="text-amber-400" />
                  Gelen Partner Başvuruları
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Restoran / İşletme</th>
                        <th className="pb-3 font-semibold">Yetkili Adı</th>
                        <th className="pb-3 font-semibold">İletişim</th>
                        <th className="pb-3 font-semibold">Tam Adres</th>
                        <th className="pb-3 font-semibold">Durum</th>
                        <th className="pb-3 font-semibold">Tarih</th>
                        <th className="pb-3 font-semibold text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">Henüz başvuru bulunmuyor.</td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app.id} className="border-b border-slate-800/50 hover:bg-slate-800/10 transition-colors">
                            <td className="py-4 font-bold text-white">{app.restaurant_name}</td>
                            <td className="py-4 text-slate-300">{app.owner_name}</td>
                            <td className="py-4 text-sm text-slate-400">
                              <div>{app.phone}</div>
                              <div>{app.email}</div>
                            </td>
                            <td className="py-4 text-sm text-slate-400 max-w-[200px] truncate" title={app.address}>
                              {app.address}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                app.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {app.status === 'pending' ? 'Bekliyor' : app.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                              </span>
                            </td>
                            <td className="py-4 text-slate-400 text-sm">{formatDate(app.created_at)}</td>
                            <td className="py-4 text-right">
                              {app.status === 'pending' && (
                                <button 
                                  onClick={() => handleApproveApplication(app.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                  Onayla ve Kur
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'messages' && (() => {
             const customerUsers = users.filter(u => u.role === 'restaurant-admin' && !u.username.startsWith('kurye_') && !u.username.startsWith('web_'));
             const courierUsers = users.filter(u => u.username.startsWith('kurye_'));
             const webCustomerUsers = users.filter(u => u.username.startsWith('web_'));
             
             const activeCategoryUsers = 
               activeCategory === 'customer' ? customerUsers :
               activeCategory === 'courier' ? courierUsers : webCustomerUsers;
               
             const activeContact = users.find(u => u.id === activeContactId);
             const conversationMessages = messages
               .filter(m => m.sender_id === activeContactId || m.receiver_id === activeContactId)
               .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
               
             return (
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px] bg-slate-800/40 rounded-3xl border border-slate-800 overflow-hidden animate-in fade-in">
                 {/* Left Panel: Contacts List */}
                 <div className="lg:col-span-1 border-r border-slate-800 flex flex-col h-full bg-slate-900/20">
                   {/* Categories Selection Tabs */}
                   <div className="p-4 border-b border-slate-800 shrink-0">
                     <div className="grid grid-cols-3 gap-1 bg-slate-800/60 p-1 rounded-xl">
                       <button 
                         onClick={() => { setActiveCategory('customer'); setActiveContactId(null); }} 
                         className={`py-2 text-[11px] font-bold rounded-lg transition-all text-center ${activeCategory === 'customer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                       >
                         Müşteri
                       </button>
                       <button 
                         onClick={() => { setActiveCategory('courier'); setActiveContactId(null); }} 
                         className={`py-2 text-[11px] font-bold rounded-lg transition-all text-center ${activeCategory === 'courier' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                       >
                         Kurye
                       </button>
                       <button 
                         onClick={() => { setActiveCategory('web_customer'); setActiveContactId(null); }} 
                         className={`py-2 text-[11px] font-bold rounded-lg transition-all text-center ${activeCategory === 'web_customer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                       >
                         Web
                       </button>
                     </div>
                   </div>
                   
                   {/* Contacts Scroll Area */}
                   <div className="flex-1 overflow-y-auto p-3 space-y-1">
                     {activeCategoryUsers.length === 0 ? (
                       <div className="text-center text-slate-500 py-8 text-xs font-semibold">
                         Bu kategoride kullanıcı bulunmuyor.
                       </div>
                     ) : (
                       activeCategoryUsers.map(u => {
                         const displayUsername = u.username.replace(/^(kurye_|web_)/, '');
                         const isSelected = activeContactId === u.id;
                         return (
                           <div 
                             key={u.id}
                             onClick={() => setActiveContactId(u.id)}
                             className={`cursor-pointer w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'hover:bg-slate-800/50 text-slate-300'}`}
                           >
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                               {displayUsername.substring(0, 2).toUpperCase()}
                             </div>
                             <div className="min-w-0 flex-1">
                               <p className="font-bold text-sm truncate">{displayUsername}</p>
                               {u.restaurants && <p className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{u.restaurants.name}</p>}
                             </div>
                           </div>
                         );
                       })
                     )}
                   </div>
                 </div>
                 
                 {/* Right Panel: Chat Room */}
                 <div className="lg:col-span-3 flex flex-col h-full relative">
                   {activeContact ? (
                     <>
                       {/* Chat Header */}
                       <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/20 shrink-0">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                             {activeContact.username.replace(/^(kurye_|web_)/, '').substring(0, 2).toUpperCase()}
                           </div>
                           <div>
                             <p className="font-bold text-white text-base">{activeContact.username.replace(/^(kurye_|web_)/, '')}</p>
                             <p className="text-slate-500 text-xs font-semibold capitalize">
                               {activeCategory === 'customer' ? 'Müşteri (Restoran Sahibi)' :
                                activeCategory === 'courier' ? 'Kurye Müşteri' : 'Web Müşteri'}
                             </p>
                           </div>
                         </div>
                       </div>
                       
                       {/* Messages Viewport */}
                       <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/10">
                         {conversationMessages.length === 0 ? (
                           <div className="h-full flex items-center justify-center text-slate-500 font-medium text-sm">
                             Sohbeti başlatmak için aşağıdan ilk mesajı gönderin.
                           </div>
                         ) : (
                           conversationMessages.map(msg => {
                             const isMe = msg.sender?.role === 'super-admin';
                             return (
                               <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                 <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm font-medium leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-br-sm shadow-md' : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700/50'}`}>
                                   <p>{msg.content}</p>
                                 </div>
                                 <span className="text-[10px] text-slate-500 mt-1 px-1 font-semibold">
                                   {formatDate(msg.created_at)}
                                 </span>
                               </div>
                             );
                           })
                         )}
                       </div>
                       
                       {/* Input form */}
                       <div className="p-4 border-t border-slate-800 bg-slate-900/20 shrink-0">
                         <form 
                           onSubmit={(e) => {
                             e.preventDefault();
                             if (newMessage.content.trim()) {
                               handleSendMessage({
                                 preventDefault: () => {},
                                 target: e.target
                               } as any);
                             }
                           }}
                           className="flex gap-3"
                         >
                           <input 
                             required
                             type="text" 
                             value={newMessage.content}
                             onChange={e => setNewMessage({ receiverId: activeContact.id, content: e.target.value })}
                             placeholder="Mesajınızı yazın..." 
                             className="flex-1 bg-slate-850 border border-slate-700/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-5 py-3 outline-none text-sm text-white placeholder-slate-500 font-medium"
                           />
                           <button 
                             type="submit" 
                             disabled={isSaving || !newMessage.content.trim()}
                             className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/10 transition-all active:scale-[0.98] disabled:opacity-50"
                           >
                             Gönder
                           </button>
                         </form>
                       </div>
                     </>
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
                       <MessageSquare size={64} className="opacity-20 mb-4 text-slate-400" />
                       <p className="text-base font-bold text-slate-400">Sohbet Seçilmedi</p>
                       <p className="text-slate-500 text-sm mt-1 text-center max-w-sm font-medium">Sohbet etmek için sol taraftaki kategorilerden bir kullanıcı seçin.</p>
                     </div>
                   )}
                 </div>
               </div>
             );
          })()}

          {activeTab === 'couriers' && (
            <div className="space-y-6 animate-in fade-in">
              <section className="glass-panel rounded-2xl p-6 bg-slate-800/40 border border-slate-800">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                  <Bike size={24} className="text-blue-400" />
                  Motorlu & Elektrikli Kurye Başvuruları ({courierApplications.length})
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-sm font-semibold">
                        <th className="pb-3 pr-4">Ad Soyad</th>
                        <th className="pb-3 px-4">İletişim</th>
                        <th className="pb-3 px-4">Şehir</th>
                        <th className="pb-3 px-4">Taşıt / Ehliyet</th>
                        <th className="pb-3 px-4">Başvuru Tarihi</th>
                        <th className="pb-3 px-4">Notlar</th>
                        <th className="pb-3 px-4">Durum</th>
                        <th className="pb-3 pl-4 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm font-medium">
                      {courierApplications.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            Henüz kurye başvurusu bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        courierApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 pr-4 text-white font-bold">{app.full_name}</td>
                            <td className="py-4 px-4 text-slate-300">
                              <div>{app.phone}</div>
                              <div className="text-xs text-slate-500">{app.email}</div>
                            </td>
                            <td className="py-4 px-4 text-slate-300">{app.city}</td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold">
                                {app.vehicle_type}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-1">
                                {app.has_license ? 'Ehliyet Var' : 'Ehliyet Yok'}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-400 text-xs">
                              {formatDate(app.created_at)}
                            </td>
                            <td className="py-4 px-4 text-slate-300 text-xs max-w-[200px] truncate" title={app.notes}>
                              {app.notes || '—'}
                            </td>
                            <td className="py-4 px-4">
                              {app.status === 'pending' ? (
                                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold">
                                  Bekliyor
                                </span>
                              ) : app.status === 'approved' ? (
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold">
                                  Onaylandı
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-full text-xs font-bold">
                                  Reddedildi
                                </span>
                              )}
                            </td>
                            <td className="py-4 pl-4 text-right">
                              {app.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleUpdateCourierStatus(app.id, 'approved')}
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                                    title="Onayla"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateCourierStatus(app.id, 'rejected')}
                                    className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
                                    title="Reddet"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Yeni Restoran Ekleme Modalı */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
               <h2 className="text-xl font-bold text-white">Yeni Restoran Ekle</h2>
               <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddRestaurant} className="p-6 space-y-4 text-slate-100">
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Restoran Adı *</label>
                  <input required type="text" value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-white" placeholder="Örn: Burger Dünyası" />
               </div>
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Mutfak Türü / Etiketler</label>
                  <input type="text" value={newRestaurant.cuisine_type} onChange={e => setNewRestaurant({...newRestaurant, cuisine_type: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-white" placeholder="Örn: Tayland yemekleri, Uzak Doğu, Çorba" />
               </div>
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Kısa Açıklama</label>
                  <input type="text" value={newRestaurant.description} onChange={e => setNewRestaurant({...newRestaurant, description: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-white" placeholder="Örn: En taze deniz ürünleri..." />
               </div>
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Açık Adres</label>
                  <textarea value={newRestaurant.address} onChange={e => setNewRestaurant({...newRestaurant, address: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none min-h-[80px] text-white" placeholder="Örn: Kadıköy, İstanbul" />
               </div>
               <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors">İptal</button>
                 <button type="submit" disabled={!newRestaurant.name.trim()} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50">Ekle</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Restoran Düzenleme Modalı */}
      {isEditRestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
               <h2 className="text-xl font-bold text-white">Restoran Detaylarını Düzenle</h2>
               <button onClick={() => setIsEditRestModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleEditRestaurant} className="p-6 space-y-4 text-slate-100">
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Restoran Adı *</label>
                  <input required type="text" value={editRestaurantForm.name} onChange={e => setEditRestaurantForm({...editRestaurantForm, name: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-white" placeholder="Örn: Burger Dünyası" />
               </div>
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Mutfak Türü / Etiketler</label>
                  <input type="text" value={editRestaurantForm.cuisine_type} onChange={e => setEditRestaurantForm({...editRestaurantForm, cuisine_type: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-white" placeholder="Örn: Tayland yemekleri, Uzak Doğu, Çorba" />
               </div>
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Kısa Açıklama</label>
                  <input type="text" value={editRestaurantForm.description} onChange={e => setEditRestaurantForm({...editRestaurantForm, description: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-white" placeholder="Örn: En taze deniz ürünleri..." />
               </div>
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Açık Adres</label>
                  <textarea value={editRestaurantForm.address} onChange={e => setEditRestaurantForm({...editRestaurantForm, address: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none min-h-[80px] text-white" placeholder="Örn: Kadıköy, İstanbul" />
               </div>
               <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setIsEditRestModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors">İptal</button>
                 <button type="submit" disabled={!editRestaurantForm.name.trim()} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50">Güncelle</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Giriş Bilgilerini Yönetme Modalı */}
      {isCredentialsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
               <h2 className="text-xl font-bold text-white">Giriş Bilgilerini Yönet</h2>
               <button onClick={() => setIsCredentialsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            <div className="px-6 pt-4">
               <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Restoran</p>
               <p className="text-white font-bold text-lg mt-0.5">{credentialsForm.restaurantName}</p>
            </div>
            <form onSubmit={handleSaveCredentials} className="p-6 space-y-4">
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Kullanıcı Adı *</label>
                  <input required type="text" value={credentialsForm.username} onChange={e => setCredentialsForm({...credentialsForm, username: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-white" placeholder="Kullanıcı adı girin" />
               </div>
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Kasa Giriş Şifresi *</label>
                  <input required type="text" value={credentialsForm.password} onChange={e => setCredentialsForm({...credentialsForm, password: e.target.value})} className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-white" placeholder="Yeni şifre girin" />
               </div>
               <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-400 font-medium leading-relaxed">
                 Bu bilgiler, restoran yetkililerinin kasa sistemine ve yönetim paneline giriş yaparken kullanacağı yetkili kullanıcı adı ve şifresidir.
               </div>
               <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setIsCredentialsModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors">İptal</button>
                 <button type="submit" disabled={!credentialsForm.username.trim() || !credentialsForm.password.trim()} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50">Bilgileri Kaydet</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
