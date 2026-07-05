-- Add table_number and waiter_name columns to orders table

ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS waiter_name TEXT;
