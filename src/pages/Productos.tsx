import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Camera, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Environment, Center } from "@react-three/drei";
import * as THREE from 'three'; // Add explicit THREE import at the top

type ProductStand = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  model_3d?: string; // Add model_3d field
};

const fetchProductsStand = async (): Promise<ProductStand[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true });

  if (error) throw error;
  return data || [];
};

// Component to load and display the 3D model
function Model({ url }: { url: string }) {
  const [error, setError] = useState<Error | null>(null);
  const { scene, errors } = useGLTF(url, undefined, (e) => {
    console.error('Error loading model:', e);
    setError(e);
  });
  
  // If there was an error loading the model
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

type ModelViewerProps = {
  modelUrl: string;
  fallbackImage?: string;
};

function ThreeDModelViewer({ modelUrl, fallbackImage }: ModelViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Fix the Supabase URL to use your actual project URL
  const formattedUrl = modelUrl.startsWith('http') 
    ? modelUrl 
    : `https://znssmbdsvqftxfmycpvd.supabase.co/storage/v1/object/public/models/${modelUrl}`;
  
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
          method: 'HEAD',
          // Add cache control to avoid caching issues
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Model URL returned status ${response.status}`);
        }
        
        // Only update state if component is still mounted
        if (isActive) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading 3D model:", err);
        // Only update state if component is still mounted
        if (isActive) {
          setError("Error al cargar el modelo 3D. Por favor, intente de nuevo más tarde.");
          setLoading(false);
        }
      }
    };
    
    preloadModel();
    
    // Cleanup function to help prevent WebGL context issues
    return () => {
      isActive = false; // Mark component as unmounted
      
      // Use try-catch in case THREE is not fully loaded
      try {
        THREE.Cache.clear();
        // Additional cleanup for any cached GLTF resources
        useGLTF.clear(formattedUrl);
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
    };
  }, [formattedUrl, retryCount]);
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
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
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-md p-4">
        <p className="text-red-500 text-center mb-4">{error}</p>
        {fallbackImage && (
          <img 
            src={fallbackImage} 
            alt="Imagen del producto" 
            className="max-h-32 object-contain mb-4" 
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
    <div className="h-64 bg-gray-100 rounded-md">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Center>
          <Model url={formattedUrl} />
        </Center>
        <OrbitControls />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// Improve the Dialog to handle cleanup more effectively
const Productos = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Function to open 3D model viewer
  const openModelViewer = (url: string) => {
    setModelUrl(url);
    setIsDialogOpen(true);
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

  // Improved dialog close handler with better cleanup
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // First set a flag to prevent any further renders of the 3D content
      setIsDialogOpen(false);
      
      // Use a short delay to allow React to finish any pending state updates
      setTimeout(() => {
        // Then clear the model URL
        setModelUrl(null);
        
        // Force a garbage collection if possible (browser dependent)
        try {
          if (window.gc) {
            window.gc();
          }
        } catch (e) {
          // Ignore - gc() is not available in all browsers
        }
      }, 300);
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero section with parallax background */}
      <div className="relative flex items-center justify-center min-h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/1435737/pexels-photo-1435737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")`,
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
            Explora nuestra selección de productos cuidadosamente seleccionados para ti.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 opacity-0 animate-fade-up animate-fill-forwards animate-delay-300">
        {categories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 font-playfair">
              Aún no hay productos disponibles.
            </p>
          </div>
        ) : (
          categories.map((category) => (
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
                        <p className="text-gray-600 font-playfair">
                          {product.description}
                        </p>
                      </CardContent>
                      {product.model_3d && (
                        <CardFooter>
                          <Button 
                            onClick={() => openModelViewer(product.model_3d!)}
                            className="w-full bg-[#2851a3] hover:bg-[#1a3e7e]"
                          >
                            <Camera className="h-4 w-4 mr-2" /> Ver en 3D
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
              </div>
            </div>
          ))
        )}
      </main>
      
      {/* Improved 3D Model Viewer Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogChange}
      >
        <DialogContent className="sm:max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Visualización 3D</DialogTitle>
            <DialogDescription>
              Interactúa con el modelo 3D usando el mouse (rotar, zoom, mover)
            </DialogDescription>
          </DialogHeader>
          <div className="h-full w-full bg-gray-100 rounded-md">
            {modelUrl ? (
              <Suspense fallback={
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
                </div>
              }>
                <ThreeDModelViewer modelUrl={modelUrl} />
              </Suspense>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No se pudo cargar el modelo 3D</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Productos;
