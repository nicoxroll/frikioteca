-- Create customers table
CREATE TABLE public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.customers
    FOR SELECT TO anon
    USING (true);

-- Create policy to allow admin to manage customers
CREATE POLICY "Allow admin to manage customers" ON public.customers
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

-- Create orders table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    CONSTRAINT valid_status CHECK (status IN ('pendiente', 'en_progreso', 'completado', 'cancelado'))
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.orders
    FOR SELECT TO anon
    USING (true);

-- Create policy to allow admin to manage orders
CREATE POLICY "Allow admin to manage orders" ON public.orders
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

-- Create order_products junction table
CREATE TABLE public.order_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.order_products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.order_products
    FOR SELECT TO anon
    USING (true);

-- Create policy to allow admin to manage order products
CREATE POLICY "Allow admin to manage order products" ON public.order_products
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

-- Add triggers for auto-updating updated_at
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_order_products_updated_at
    BEFORE UPDATE ON order_products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
