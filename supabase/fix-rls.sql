-- Sadece yanlış anahtar kullandıysan veya RLS hatası alıyorsan çalıştır
-- Supabase SQL Editor > New query > yapıştır > Run

ALTER TABLE restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

GRANT ALL ON restaurants, categories, products, tables, orders, order_items TO anon, authenticated, service_role;
