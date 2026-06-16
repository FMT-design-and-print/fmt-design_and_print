-- Create product_categories table for Sales & Expenses
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdBy" JSONB,
    "updatedBy" JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id to product_types and keep category string for backwards compatibility but not strictly required
ALTER TABLE public.product_types
ADD COLUMN IF NOT EXISTS "category_id" UUID REFERENCES public.product_categories(id);

-- Insert a default category to link existing uncategorized items to it, just as a placeholder if needed
INSERT INTO public.product_categories (name, description, "createdBy") 
VALUES ('Uncategorized', 'Default category for uncategorized product types', null)
ON CONFLICT (name) DO NOTHING;

-- Update existing product types to point to the 'Uncategorized' category if they have no category
UPDATE public.product_types
SET category_id = (SELECT id FROM public.product_categories WHERE name = 'Uncategorized' LIMIT 1)
WHERE category_id IS NULL;
