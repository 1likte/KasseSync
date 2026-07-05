-- 1. Partner (Restoran) Başvuruları Tablosu
CREATE TABLE IF NOT EXISTS public.partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Herkes başvuru yapabilsin (INSERT), ama sadece giriş yapmış yetkililer okuyabilsin (SELECT)
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes başvuru yapabilir" 
  ON public.partner_applications FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Sadece super adminler başvuruları görebilir" 
  ON public.partner_applications FOR SELECT 
  USING (
    auth.uid() IN (SELECT id FROM public.system_users WHERE role = 'super-admin')
  );

CREATE POLICY "Sadece super adminler başvuruları güncelleyebilir" 
  ON public.partner_applications FOR UPDATE 
  USING (
    auth.uid() IN (SELECT id FROM public.system_users WHERE role = 'super-admin')
  );
