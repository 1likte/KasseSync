-- 1. Create system_users table
CREATE TABLE IF NOT EXISTS public.system_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super-admin', 'restaurant-admin')),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Varsayılan Super Admin
INSERT INTO public.system_users (username, password_hash, role)
VALUES ('yunuskalkande', 'Bxq912qizky.', 'super-admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.system_users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.system_users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create partner_applications table
CREATE TABLE IF NOT EXISTS public.partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Bypasses for API (Supabase Service Role is used in APIs so it bypasses automatically)
-- But we can add generic policies just in case
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.system_users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.system_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.system_users FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.system_users FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.messages FOR UPDATE USING (true);

CREATE POLICY "Herkes başvuru yapabilir" ON public.partner_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Super admin görebilir" ON public.partner_applications FOR SELECT USING (true);
CREATE POLICY "Super admin güncelleyebilir" ON public.partner_applications FOR UPDATE USING (true);
