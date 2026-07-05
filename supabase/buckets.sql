-- 1. Create the bucket
insert into storage.buckets (id, name, public) values ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to read images
create policy "Public Access" on storage.objects for select
using ( bucket_id = 'menu-images' );

-- 3. Allow anyone to upload, update, delete images (for simple admin access)
create policy "Anon Insert" on storage.objects for insert
with check ( bucket_id = 'menu-images' );

create policy "Anon Update" on storage.objects for update
using ( bucket_id = 'menu-images' );

create policy "Anon Delete" on storage.objects for delete
using ( bucket_id = 'menu-images' );
