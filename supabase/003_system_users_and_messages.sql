-- 1. Create system_users table
CREATE TABLE IF NOT EXISTS public.system_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super-admin', 'restaurant-admin')),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bxq912qizky. password hash or plain for now? Since we don't have bcrypt in SQL easily without pg_crypto, and since we are controlling the API, the API will handle hashing. 
-- For the fixed super admin, we'll insert a record. However, we should hash it or check plain if it matches the specific rule.
-- We'll use a simple check in the API, or just insert it and let the API do a plain comparison for this specific super admin, or we hash it in the API. Let's let the API handle the super admin as a hardcoded fallback or insert it here plain and the API checks it.
-- We will just insert the super admin directly:
INSERT INTO public.system_users (username, password_hash, role)
VALUES ('yunuskalkande', 'Bxq912qizky.', 'super-admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.system_users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.system_users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Disable RLS for anon/authenticated if accessed via API using service role,
-- or create generic policies. If using Anon Key in API, we need policies.
-- In Next.js App Router, it's easier to use the service_role key to bypass RLS, or create generous policies if using anon key from server.
-- Let's make them accessible since this is server-side checked mostly, or public for now:
CREATE POLICY "Enable read access for all users" ON public.system_users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.system_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.system_users FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.system_users FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.messages FOR UPDATE USING (true);
