-- Add Expenses and Income Sources tables for financial tracking

-- 7. Expenses (Giderler)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- kira, personel, elektrik, su, malzeme, diger
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(4,2) DEFAULT 19.00,
  expense_date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Income Sources (Gelir kaynakları - sipariş dışı)
CREATE TABLE IF NOT EXISTS income_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- catering, teslimat, diger
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(4,2) DEFAULT 19.00,
  income_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Restaurants can view their own expenses"
  ON expenses FOR SELECT
  USING (restaurant_id IN (SELECT id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Restaurants can insert their own expenses"
  ON expenses FOR INSERT
  WITH CHECK (restaurant_id IN (SELECT id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Restaurants can update their own expenses"
  ON expenses FOR UPDATE
  USING (restaurant_id IN (SELECT id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Restaurants can delete their own expenses"
  ON expenses FOR DELETE
  USING (restaurant_id IN (SELECT id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Restaurants can view their own income"
  ON income_sources FOR SELECT
  USING (restaurant_id IN (SELECT id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Restaurants can insert their own income"
  ON income_sources FOR INSERT
  WITH CHECK (restaurant_id IN (SELECT id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Restaurants can update their own income"
  ON income_sources FOR UPDATE
  USING (restaurant_id IN (SELECT id FROM restaurants WHERE id = restaurant_id));

CREATE POLICY "Restaurants can delete their own income"
  ON income_sources FOR DELETE
  USING (restaurant_id IN (SELECT id FROM restaurants WHERE id = restaurant_id));
