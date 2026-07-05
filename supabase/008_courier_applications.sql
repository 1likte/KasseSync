-- Create courier_applications table
CREATE TABLE IF NOT EXISTS public.courier_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    vehicle_type TEXT NOT NULL, -- e.g., 'Motorlu', 'Bisiklet', 'Otomobil', 'Diger'
    has_license BOOLEAN DEFAULT FALSE,
    notes TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.courier_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable insert access for all users" ON public.courier_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON public.courier_applications FOR SELECT USING (true);
CREATE POLICY "Enable update access for all users" ON public.courier_applications FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.courier_applications FOR DELETE USING (true);
