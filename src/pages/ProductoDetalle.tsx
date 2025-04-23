import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import {
  Center,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  Maximize,
  Minimize,
  RefreshCw,
  Smartphone,
  ShoppingCart,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Environment options for the model viewer (copied from Productos.tsx)
const ENVIRONMENT_OPTIONS = [
  { id: "sunset", label: "Atardecer" },
  { id: "dawn", label: "Amanecer" },
  { id: "night", label: "Noche" },
  { id: "warehouse", label: "Almacén" },
  { id: "forest", label: "Bosque" },
  { id: "apartment", label: "Apartamento" },
  { id: "studio", label: "Estudio" },
  { id: "city", label: "Ciudad" },
  { id: "park", label: "Parque" },
  { id: "lobby", label: "Lobby" },
];

// Type definition for Product
type ProductStand = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  model_3d?: string;
};

// AR support detection helper
const isXRSupported = () => {
  return (
    "xr" in navigator ||
    /android/i.test(navigator.userAgent) ||
    /iPad|iPhone|iPod/.test(navigator.userAgent)
  );
};

// Component to load and display the 3D model
function Model({ url }: { url: string }) {
  const [error, setError] = useState<Error | null>(null);
  const { scene, errors } = useGLTF(url, undefined, (e) => {
    console.error("Error loading model:", e);
    setError(e);
  });

  if (error) {
    return (
      <Html center>
        <div className="bg-white p-2 rounded text-red-500">
          Error loading model
        </div>
      </Html>
    );
  }

  return <primitive object={scene} />;
}

// 3D Model Viewer Component
function ThreeDModelViewer({ modelUrl, fallbackImage }: { modelUrl: string; fallbackImage?: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [supportsAR, setSupportsAR] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(ENVIRONMENT_OPTIONS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Format the Supabase URL
  const formattedUrl = modelUrl.startsWith("http")
    ? modelUrl
    : `https://znssmbdsvqftxfmycpvd.supabase.co/storage/v1/object/public/models/${modelUrl}`;

  // Fullscreen toggle function
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          toast({
            title: "Error al activar pantalla completa",
            description: err.message,
            variant: "destructive",
          });
        });
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      setIsMobile(isMobileDevice);
    };

    // Check AR support
    const checkARSupport = async () => {
      setSupportsAR(isXRSupported() && isMobile);
    };

    checkMobile();
    checkARSupport();
  }, []);

  useEffect(() => {
    // Reset error state when URL changes or on retry
    setError(null);
    setLoading(true);

    let isActive = true; // Flag to track if component is still mounted

    // Prefetch the model to check if it can be loaded
    const preloadModel = async () => {
      try {
        console.log("Attempting to load model from:", formattedUrl);
        // Check if the URL is accessible
        const response = await fetch(formattedUrl, {
          method: "HEAD",
        });

        if (!response.ok) {
          throw new Error(`Failed to load model: ${response.statusText}`);
        }

        // If component is still mounted, update state
        if (isActive) {
          setLoading(false);
        }
      } catch (err) {
        if (isActive) {
          setError(
            `Error cargando el modelo 3D. Por favor intenta de nuevo. ${
              err instanceof Error ? err.message : ""
            }`
          );
          setLoading(false);
        }
      }
    };

    preloadModel();

    // Clean up function
    return () => {
      isActive = false;
      try {
        // Clear Three.js cache when component unmounts
        THREE.Cache.clear();
        // Additional cleanup for any cached GLTF resources
        useGLTF.clear(formattedUrl);
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
    };
  }, [formattedUrl, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-md">
        <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin mb-2" />
        <p className="text-sm text-gray-600">Cargando modelo 3D...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-md p-4">
        <p className="text-red-500 text-center mb-4">{error}</p>
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt="Imagen del producto"
            className="max-h-48 object-contain mb-4"
          />
        )}
        <Button
          onClick={handleRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[70vh] bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-inner relative"
    >
      {/* Controls */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {/* Environment selector - Replace the broken dropdown with a proper one */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/80 dark:bg-gray-800/80 text-sm flex items-center gap-2"
            >
              Entorno: {selectedEnvironment.label}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
            {ENVIRONMENT_OPTIONS.map((env) => (
              <DropdownMenuItem
                key={env.id}
                onClick={() => setSelectedEnvironment(env)}
                className={`${
                  env.id === selectedEnvironment.id
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                } dark:hover:bg-gray-700 dark:focus:bg-gray-700`}
              >
                {env.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Movemos el botón AR aquí */}
        {isMobile && (
          <a
            href={`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
              formattedUrl
            )}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
            className="bg-white/80 dark:bg-gray-800/80 text-sm rounded-md px-3 py-2 border border-input flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
          >
            <Smartphone className="h-4 w-4" /> Ver en AR
          </a>
        )}

        {/* Fullscreen toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-white/80 dark:bg-gray-800/80"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
        shadows
        className="w-full h-full"
      >
        {/* Dynamic Environment based on selection */}
        {selectedEnvironment.file ? (
          <Environment files={selectedEnvironment.file} background={true} />
        ) : (
          <Environment
            preset={selectedEnvironment.id as any}
            background={true}
          />
        )}

        {/* Reduced lighting to let the environment map be more visible */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />

        {/* Rotating platform effect */}
        <group position={[0, -0.5, 0]}>
          <Center scale={1.5}>
            <Model url={formattedUrl} />
          </Center>
        </group>

        {/* Enhanced controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

// Main ProductoDetalle Component
const ProductoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [supportsAR, setSupportsAR] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Fetch single product by ID
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as ProductStand;
    }
  });

  // Add a query for related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["relatedProducts", product?.category, product?.id],
    queryFn: async () => {
      if (!product) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_item", true)
        .eq("category", product.category)
        .neq("id", product.id)
        .limit(4);
      
      if (error) throw error;
      return data as ProductStand[];
    },
    enabled: !!product // Only run this query if we have a product
  });

  // Add device detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      setIsMobile(isMobileDevice);
      setSupportsAR(isMobileDevice);
    };

    checkMobile();
  }, []);

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

  // Function to add the current product to the cart
  const handleAddToCart = () => {
    if (!product) return;
    
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

  const handleBack = () => {
    navigate("/productos");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 pt-20 pb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2851a3] font-playfair mb-4">
              Producto no encontrado
            </h1>
            <p className="text-red-500 max-w-2xl mx-auto font-playfair">
              No pudimos encontrar el producto solicitado. Por favor intenta de nuevo.
            </p>
            <Button onClick={handleBack} className="mt-4 bg-[#2851a3] hover:bg-[#1a3e7e]">
              Volver a Productos
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero section with parallax background */}
      <div className="relative flex items-center justify-center min-h-[30vh] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/4992952/pexels-photo-4992952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")`,
            transform: `translateY(${scrollPosition * 0.15}px)`,
          }}
        ></div>
        {/* Semi-transparent overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

        <div className="relative z-10 text-center px-4 py-10 opacity-0 animate-fade-up animate-fill-forwards animate-delay-200">
          <p className="text-gray-100 text-2xl md:text-3xl max-w-2xl mx-auto font-playfair font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            {product.category}
          </p>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <Button onClick={handleBack} variant="outline" className="mb-6 font-playfair">
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

        {/* 3D Model Section */}
        {product.model_3d && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[#2851a3] dark:text-blue-400 font-playfair mb-6">
              Vista 3D del Producto
            </h2>
            <Separator className="mb-6" />

            <ThreeDModelViewer 
              modelUrl={product.model_3d} 
              fallbackImage={product.image} 
            />

            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <p className="text-gray-600 dark:text-gray-300 font-playfair">
                  <span className="font-medium">Interactúa con el modelo:</span>{" "}
                  <span>Rotar</span> (clic y arrastrar), <span>Zoom</span>{" "}
                  (rueda del mouse), <span>Mover</span> (clic derecho y
                  arrastrar)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#2851a3] dark:text-blue-400 font-playfair mb-6">
              Productos Relacionados
            </h2>
            <Separator className="mb-6" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-[#2851a3] font-playfair text-base">
                        {relatedProduct.name}
                      </span>
                      <span className="text-gray-800 font-playfair">
                        ${relatedProduct.price}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-playfair line-clamp-2 text-sm">
                      {relatedProduct.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/producto/${relatedProduct.id}`)}
                      className="flex-1 bg-[#2851a3] hover:bg-[#1a3e7e]"
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      onClick={() => {
                        addItem({
                          id: relatedProduct.id,
                          name: relatedProduct.name,
                          price: relatedProduct.price,
                          quantity: 1,
                          image: relatedProduct.image,
                        });
                        toast({
                          title: "Producto agregado",
                          description: `${relatedProduct.name} se ha agregado al carrito`,
                          variant: "default",
                        });
                      }}
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
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductoDetalle;
