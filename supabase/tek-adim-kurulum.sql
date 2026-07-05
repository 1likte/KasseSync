-- TEK ADIM KURULUM — SQL Editor'da yapıştır, Run de, bitti.
-- Secret key aramana gerek yok.

-- Güvenlik kurallarını kapat (geliştirme için)
ALTER TABLE restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Uygulamanın okuma/yazma izni
GRANT SELECT, INSERT, UPDATE, DELETE ON restaurants, categories, products, tables, orders, order_items TO anon, authenticated;

-- Test restoranı
INSERT INTO restaurants (name, address)
SELECT 'KasseSync Test Restaurant', 'Berlin'
WHERE NOT EXISTS (SELECT 1 FROM restaurants);

-- Kategoriler
INSERT INTO categories (restaurant_id, name, sort_order)
SELECT r.id, v.name, v.sort_order
FROM restaurants r
CROSS JOIN (VALUES ('Burger', 1), ('İçecekler', 2), ('Tatlılar', 3)) AS v(name, sort_order)
WHERE r.name = 'KasseSync Test Restaurant'
  AND NOT EXISTS (SELECT 1 FROM categories c WHERE c.restaurant_id = r.id);

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
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.restaurant_id = r.id);
