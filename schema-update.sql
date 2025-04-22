-- Add model_3d column to products table
ALTER TABLE public.products 
ADD COLUMN model_3d TEXT;

-- Example comment for this column
COMMENT ON COLUMN public.products.model_3d IS 'URL to a GLB 3D model file for product visualization';
