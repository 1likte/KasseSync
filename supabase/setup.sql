-- KasseSync tek seferlik kurulum: izinler + test verisi
-- Supabase Dashboard > SQL Editor > yapıştır > Run

-- Okuma izinleri (kasa ekranı ürünleri görsün)
GRANT SELECT ON restaurants, categories, products TO anon, authenticated;

-- Sipariş kaydetme izinleri
GRANT INSERT ON orders, order_items TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- RLS aç ve herkese izin ver (geliştirme aşaması)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes restoran okuyabilir" ON restaurants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Herkes kategori okuyabilir" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Herkes ürün okuyabilir" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Herkes sipariş ekleyebilir" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Herkes sipariş kalemi ekleyebilir" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Test restoranı (yoksa ekle)
INSERT INTO restaurants (name, address)
SELECT 'KasseSync Test Restaurant', 'Berlin'
WHERE NOT EXISTS (SELECT 1 FROM restaurants);

-- Kategoriler
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT r.id, v.name, v.sort_order
FROM restaurants r
CROSS JOIN (VALUES ('Burger', 1), ('İçecekler', 2), ('Tatlılar', 3)) AS v(name, sort_order)
WHERE r.name = 'KasseSync Test Restaurant'
  AND NOT EXISTS (SELECT 1 FROM categories WHERE restaurant_id = r.id);

-- Ürünler
INSERT INTO products (restaurant_id, category_id, name, price)
SELECT r.id, c.id, v.name, v.price
FROM restaurants r
JOIN categories c ON c.restaurant_id = r.id
JOIN (
  VALUES
    ('Burger', 'Classic Burger', 8.50),
    ('Burger', 'Cheeseburger', 9.50),
    ('Burger', 'BBQ Bacon Burger', 11.50),
    ('İçecekler', 'Kola', 2.50),
    ('İçecekler', 'Ayran', 2.00),
    ('İçecekler', 'Su', 1.50)
) AS v(cat, name, price) ON c.name = v.cat
WHERE r.name = 'KasseSync Test Restaurant'
  AND NOT EXISTS (SELECT 1 FROM products WHERE restaurant_id = r.id);
