-- 1. Restoranlar tablosuna yeni sütunlar ekleyelim (Eğer önceden varsa hata vermemesi için ALTER kullanıyoruz, ancak sıfırdan kuruyorsanız üstüne yazabilirsiniz)
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS pos_stripe_public_key TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS pos_stripe_secret_key TEXT;

-- 2. Sistem Kullanıcıları (Personel) tablosu
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'waiter', -- admin, waiter, kitchen
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) KURALLARI
-- ==========================================

-- Tablolarda RLS'i aktif edelim
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- KURAL 1: Restoran Sahipleri (owner_id) sadece kendi restoran bilgilerini görebilir ve silebilir.
CREATE POLICY "Restoran sahipleri kendi restoranlarını görebilir" ON restaurants
  FOR ALL
  USING (auth.uid() = owner_id);

-- KURAL 2: Personeller (profiles tablosunda kayıtlı olanlar) çalıştıkları restoranın verilerini görebilir
CREATE POLICY "Personel kendi restoran verilerini görebilir" ON categories
  FOR ALL
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Personel kendi ürünlerini görebilir" ON products
  FOR ALL
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Personel kendi masalarını görebilir" ON tables
  FOR ALL
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Personel kendi siparişlerini görebilir" ON orders
  FOR ALL
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Personel kendi sipariş detaylarını görebilir" ON order_items
  FOR ALL
  USING (
    order_id IN (
      SELECT id FROM orders WHERE restaurant_id IN (
        SELECT restaurant_id FROM profiles WHERE id = auth.uid()
        UNION
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
      )
    )
  );
