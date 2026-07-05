-- 1. Updates to Restaurants Table
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_marketplace_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS minimum_order DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

-- 2. Updates to Products Table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_showcase BOOLEAN DEFAULT false;

-- 3. Updates to Orders Table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'table', -- 'table', 'delivery', 'pickup'
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- Create an index on the slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
