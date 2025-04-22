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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
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
} from "lucide-react";
import { env } from "process";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Environment options for the model viewer
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
  { id: "medieval", label: "Café Medieval", file: "/images/medieval_hdr.hdr" },
];

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
    .eq("is_item", true) // Only fetch friki items
    .order("category", { ascending: true });

  if (error) throw error;
  return data || [];
};

// Mejoramos la detección de soporte AR para ser más inclusiva
const isXRSupported = () => {
  // Verificación más completa para AR que funciona mejor en dispositivos móviles
  return (
    "xr" in navigator ||
    /android/i.test(navigator.userAgent) || // Android soporta Scene Viewer
    /iPad|iPhone|iPod/.test(navigator.userAgent)
  ); // iOS soporta Quick Look
};

// Component to load and display the 3D model
function Model({ url }: { url: string }) {
  const [error, setError] = useState<Error | null>(null);
  const { scene, errors } = useGLTF(url, undefined, (e) => {
    console.error("Error loading model:", e);
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
  const [isMobile, setIsMobile] = useState(false);
  const [supportsAR, setSupportsAR] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(
    ENVIRONMENT_OPTIONS[0]
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fix the Supabase URL to use your actual project URL
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
      // Check if the browser supports WebXR
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
          // Add cache control to avoid caching issues
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache",
          },
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
          setError(
            "Error al cargar el modelo 3D. Por favor, intente de nuevo más tarde."
          );
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
        {/* Environment selector */}
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

        {/* Movemos el botón AR aquí y le damos el mismo estilo */}
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

      {/* Eliminamos el botón AR de la esquina superior derecha */}

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
          {/* Eliminamos el círculo blanco/plataforma */}
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

// New component for product details view
const ProductDetail = ({
  product,
  onBack,
}: {
  product: ProductStand;
  onBack: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [supportsAR, setSupportsAR] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(
    ENVIRONMENT_OPTIONS[0]
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

          <Button className="w-full bg-[#2851a3] hover:bg-[#1a3e7e] py-6">
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

          <div
            ref={containerRef}
            className="relative bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Controls */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              {/* Environment selector */}
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

              {/* Movemos el botón AR aquí y le damos el mismo estilo */}
              {isMobile && (
                <a
                  href={`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
                    product.model_3d.startsWith("http")
                      ? product.model_3d
                      : `https://znssmbdsvqftxfmycpvd.supabase.co/storage/v1.object/public/models/${product.model_3d}`
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

            {/* Eliminamos el botón AR de la esquina superior derecha */}

            <div className="h-[50vh]">
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 text-[#2851a3] dark:text-blue-400 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Cargando modelo 3D...
                      </p>
                    </div>
                  </div>
                }
              >
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 45 }}
                  gl={{ antialias: true }}
                  shadows
                  className="w-full h-full"
                >
                  {/* Dynamic Environment based on selection */}
                  {selectedEnvironment.file ? (
                    <Environment
                      files={selectedEnvironment.file}
                      background={true}
                    />
                  ) : (
                    <Environment
                      preset={selectedEnvironment.id as any}
                      background={true}
                    />
                  )}

                  {/* Minimal lighting */}
                  <ambientLight intensity={0.2} />
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={0.8}
                    castShadow
                  />

                  {/* Model display */}
                  <group position={[0, -0.5, 0]}>
                    <Center scale={1.5}>
                      <Model
                        url={
                          product.model_3d.startsWith("http")
                            ? product.model_3d
                            : `https://znssmbdsvqftxfmycpvd.supabase.co/storage/v1.object/public/models/${product.model_3d}`
                        }
                      />
                    </Center>
                    {/* Eliminamos el círculo blanco/plataforma */}
                  </group>

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
              </Suspense>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <p className="text-gray-600 dark:text-gray-300 font-playfair">
                  <span className="font-medium">Interactúa con el modelo:</span>{" "}
                  <span>Rotar</span> (clic y arrastrar), <span>Zoom</span>{" "}
                  (rueda del mouse), <span>Mover</span> (clic derecho y
                  arrastrar)
                </p>

                {/* Mobile environment selector for better UX on small screens */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs flex items-center gap-1 dark:bg-gray-700 dark:text-gray-200"
                      >
                        Cambiar entorno
                        <ChevronDown className="h-3 w-3" />
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
                </div>
              </div>

              {isMobile && supportsAR && (
                <p className="text-green-600 dark:text-green-400 font-medium mt-2 font-playfair">
                  ¡Dispositivo compatible con AR! Usa el botón "Ver en AR" para
                  visualizar el modelo en tu espacio real.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
const Productos = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductStand | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [supportsAR, setSupportsAR] = useState(false);

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

  // Add device detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      setIsMobile(isMobileDevice);
      // Simplificamos esto para considerar cualquier dispositivo móvil como compatible con AR
      setSupportsAR(isMobileDevice);
    };

    checkMobile();
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
                        <p className="text-gray-600 font-playfair line-clamp-2">
                          {product.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          onClick={() => viewProductDetails(product)}
                          className="w-full bg-[#2851a3] hover:bg-[#1a3e7e]"
                        >
                          Ver Detalles
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Productos;
