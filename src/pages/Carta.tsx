import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Filter, Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

const fetchProducts = async (): Promise<Product[]> => {
  // We want cafe items, not merchandise
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_item", false) // Only fetch cafe menu items
    .order("category", { ascending: true });

  if (error) throw error;
  return data || [];
};

const Carta = () => {
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    isInitialLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Get unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  // Filter products based on search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle a filter
  const toggleFilter = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSearchTerm("");
  };

  // Open product detail modal
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Close product detail modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Show loading state for initial data fetch and when filters change
  if (isLoading || isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-[#2851a3] animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-playfair">Cargando productos...</p>
          </div>
        </div>
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
              Nuestra Carta Completa
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
            backgroundImage: `url("https://images.pexels.com/photos/1309778/pexels-photo-1309778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")`,
            transform: `translateY(${scrollPosition * 0.15}px)`,
          }}
        ></div>
        {/* Semi-transparent overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        <div className="relative z-10 text-center px-4 py-20 opacity-0 animate-fade-up animate-fill-forwards animate-delay-200">
          <img
            src="/images/logo.png"
            alt="Frikioteca Logo"
            className="h-24 w-auto mx-auto mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-shadow">
            <span className="text-[#2851a3] drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              Nuestra
            </span>
            <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              {" "}
              Carta
            </span>
            <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              {" "}
              Completa
            </span>
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto font-playfair text-xl">
            Disfruta de nuestros productos elaborados artesanalmente con
            ingredientes de alta calidad.
          </p>
        </div>
      </div>

      {/* Subtle filter toggle button positioned at the right */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-end -mt-6 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full shadow-md border-[#2851a3] text-[#2851a3] hover:bg-[#2851a3]/10 bg-white"
                >
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">
                    {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search and Filter Section - conditionally rendered */}
      {showFilters && (
        <div className="max-w-7xl mx-auto px-4 py-4 relative z-10 opacity-0 animate-fade-up animate-fill-forwards animate-delay-150">
          <Card className="shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Search Input */}
                <div className="md:col-span-1 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar en la carta..."
                      className="pl-10 w-full rounded-md font-playfair"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="md:col-span-3 flex flex-wrap gap-2 justify-end">
                  <div className="mr-2 flex items-center">
                    <span className="text-gray-600 text-sm font-playfair">Filtrar por:</span>
                  </div>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter(category)}
                      className={`transition-all duration-300 ${
                        selectedCategory === category 
                          ? "bg-[#2851a3] hover:bg-[#1a3e7e] text-white"
                          : "border-[#2851a3] text-[#2851a3] hover:bg-[#2851a3]/10"
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                  {(selectedCategory || searchTerm) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 opacity-0 animate-fade-up animate-fill-forwards animate-delay-300">
        {categories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 font-playfair">
              Aún no hay productos disponibles.
            </p>
          </div>
        ) : (
          // Now we only map through categories that have products after filtering
          categories
            .filter(category => 
              filteredProducts.some(product => product.category === category)
            )
            .map((category) => (
              <div 
                key={category} 
                className="mb-12 opacity-0 animate-fade-up animate-fill-forwards" 
                style={{ animationDelay: "50ms" }}
              >
                <h2 className="text-2xl font-bold text-[#2851a3] font-playfair mb-6">
                  {category}
                </h2>
                <Separator className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts
                    .filter((product) => product.category === category)
                    .map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 opacity-0 animate-fade-up animate-fill-forwards cursor-pointer"
                        style={{ animationDelay: "100ms" }}
                        onClick={() => handleProductClick(product)}
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
                      </Card>
                    ))}
                </div>
              </div>
          ))
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-10 animate-fade-up">
            <p className="text-gray-500 font-playfair">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2851a3] font-playfair">
              {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription>
              <span className="text-xl font-semibold text-[#2851a3] font-playfair">
                ${selectedProduct?.price}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 md:h-80 overflow-hidden rounded-md">
              {selectedProduct?.image && (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2851a3] font-playfair">Descripción</h3>
                  <p className="text-gray-600 font-playfair mt-2">
                    {selectedProduct?.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-[#2851a3] font-playfair">Categoría</h3>
                  <p className="text-gray-600 font-playfair mt-2">
                    {selectedProduct?.category}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 font-playfair">
                  Todos nuestros productos son elaborados artesanalmente con ingredientes de alta calidad.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Carta;
