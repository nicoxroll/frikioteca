import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type ProductStand = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  model_3d?: string; // Keep this field for reference but we won't use it here
};

const fetchProductsStand = async (): Promise<ProductStand[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_item", true) // Only fetch friki items
    .order("category", { ascending: true });

  if (error) throw error;
  return data || [];
};

// New component for product details view (simplified version without 3D)
const ProductDetail = ({
  product,
  onBack,
}: {
  product: ProductStand;
  onBack: () => void;
}) => {
  const { addItem } = useCart();

  // Function to add the current product to the cart
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    toast({
      title: "Producto agregado",
      description: `${product.name} se ha agregado al carrito`,
      variant: "default",
    });
  };

  return (
    <div>
      <Button onClick={onBack} variant="outline" className="mb-6 font-playfair">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a productos
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Product image */}
        <div className="h-96 overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2851a3] font-playfair mb-4">
              {product.name}
            </h1>
            <p className="text-gray-700 mb-6 font-playfair">
              {product.description}
            </p>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-[#2851a3]">
                ${product.price}
              </span>
              <span className="ml-3 text-sm font-medium text-green-600">
                Disponible
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-6">
              <p>
                Categoría:{" "}
                <span className="font-medium">{product.category}</span>
              </p>
            </div>
          </div>

          <Button
            className="w-full bg-[#2851a3] hover:bg-[#1a3e7e] py-6"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </Button>
        </div>
      </div>

      {/* If the product has a 3D model, show a button to view detailed page */}
      {product.model_3d && (
        <div className="mt-6 text-center">
          <Button 
            onClick={() => window.location.href = `/producto/${product.id}`}
            className="bg-[#2851a3] hover:bg-[#1a3e7e]"
          >
            Ver Producto en 3D
          </Button>
        </div>
      )}
    </div>
  );
};

// Main component
const Productos = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductStand | null>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  // Handle adding product to cart
  const handleAddToCart = (product: ProductStand, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigating to product details when clicking the button

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    toast({
      title: "Producto agregado",
      description: `${product.name} se ha agregado al carrito`,
      variant: "default",
    });
  };

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductsStand,
  });

  // Function to view product details
  const viewProductDetails = (product: ProductStand) => {
    setSelectedProduct(product);
    // Scroll to top when viewing details
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Function to go back to products list
  const backToProducts = () => {
    setSelectedProduct(null);
  };

  // Get unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 pt-20 pb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2851a3] font-playfair mb-4">
              Nuestros Productos
            </h1>
            <p className="text-red-500 max-w-2xl mx-auto font-playfair">
              Error al cargar productos. Por favor intenta de nuevo.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero section with parallax background */}
      <div className="relative flex items-center justify-center min-h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/264905/pexels-photo-264905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")`,
            transform: `translateY(${scrollPosition * 0.15}px)`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative text-center text-white px-4 max-w-3xl">
          <h1 className="text-5xl font-bold font-playfair mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Nuestros
            <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              {" "}
              Productos
            </span>
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto font-playfair text-xl">
            Explora nuestra selección de productos cuidadosamente seleccionados
            para ti.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 opacity-0 animate-fade-up animate-fill-forwards animate-delay-300">
        {selectedProduct ? (
          <ProductDetail product={selectedProduct} onBack={backToProducts} />
        ) : categories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 font-playfair">
              Aún no hay productos disponibles.
            </p>
          </div>
        ) : (
          // If a category filter is applied, only show that category first
          (categoryFilter ? categories.filter(cat => cat === categoryFilter) : categories).map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-[#2851a3] font-playfair mb-6">
                {category}
              </h2>
              <Separator className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter((product) => product.category === category)
                  .map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span className="text-[#2851a3] font-playfair">
                            {product.name}
                          </span>
                          <span className="text-gray-800 font-playfair">
                            ${product.price}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 font-playfair line-clamp-2">
                          {product.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/producto/${product.id}`)}
                          className="flex-1 bg-[#2851a3] hover:bg-[#1a3e7e]"
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          onClick={(e) => handleAddToCart(product, e)}
                          variant="outline"
                          className="flex-none"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          ))
        )}

        {/* If we're filtering by category, show a button to view all products */}
        {categoryFilter && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate("/productos")}
              variant="outline" 
              className="border-[#2851a3] text-[#2851a3] hover:bg-[#2851a3] hover:text-white"
            >
              Ver todas las categorías
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Productos;
