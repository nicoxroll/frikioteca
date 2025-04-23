import Events from "@/components/Events";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import NavBar from "@/components/NavBar";
import Newsletter from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

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

  // Handle navigation when coming from another page with a section parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get("section");

    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Small delay to ensure page is loaded
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">
      <NavBar />
      <main className="pt-0">
        {" "}
        {/* Removed top padding */}
        <section
          id="inicio"
          className="opacity-0 animate-fade-up animate-fill-forwards"
        >
          <Hero />
        </section>
        <section
          id="eventos"
          className="opacity-0 animate-fade-up animate-fill-forwards animate-delay-100"
        >
          <Events />
        </section>
        <div
          className="chess-pattern-divider h-60 w-full bg-fixed bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/7018123/pexels-photo-7018123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: "fixed",
            backgroundPosition: "cover",
          }}
        ></div>
        
        {/* Featured Products Section */}
        <section
          id="productos-destacados"
          className="py-16 bg-white opacity-0 animate-fade-up animate-fill-forwards animate-delay-150"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2851a3] font-playfair mb-4">
                Productos Destacados
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-playfair">
                Descubre nuestra selección de productos exclusivos y ediciones limitadas para los verdaderos entusiastas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Product Card 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Producto destacado" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2851a3] font-playfair mb-2">Figura Coleccionable</h3>
                  <p className="text-gray-600 mb-4">Edición limitada de nuestra colección exclusiva para fanáticos.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#2851a3]">$120.00</span>
                    <Button 
                      onClick={() => navigate("/productos")}
                      variant="outline" 
                      className="border-[#2851a3] text-[#2851a3] hover:bg-[#2851a3] hover:text-white"
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Product Card 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/8105034/pexels-photo-8105034.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Producto destacado" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2851a3] font-playfair mb-2">Taza Temática</h3>
                  <p className="text-gray-600 mb-4">Disfruta tu bebida favorita con nuestras tazas de diseño único.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#2851a3]">$35.00</span>
                    <Button 
                      onClick={() => navigate("/productos")}
                      variant="outline" 
                      className="border-[#2851a3] text-[#2851a3] hover:bg-[#2851a3] hover:text-white"
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Product Card 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Producto destacado" 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2851a3] font-playfair mb-2">Set de Cartas</h3>
                  <p className="text-gray-600 mb-4">Colección premium de cartas con ilustraciones originales.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#2851a3]">$75.00</span>
                    <Button 
                      onClick={() => navigate("/productos")}
                      variant="outline" 
                      className="border-[#2851a3] text-[#2851a3] hover:bg-[#2851a3] hover:text-white"
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={() => navigate("/productos")}
                className="bg-[#2851a3] hover:bg-[#1a3e7e] text-lg px-8 py-6"
              >
                Ver todos los productos
              </Button>
            </div>
          </div>
        </section>
        
        <div
          className="chess-pattern-divider h-60 w-full bg-fixed bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg')",
            backgroundSize: "fixed",
            backgroundPosition: "cover",
          }}
        ></div>
        <section
          id="menu"
          className="opacity-0 animate-fade-up animate-fill-forwards animate-delay-200"
        >
          <Menu />
        </section>
        
        {/* Newsletter section with background image - removed chess pattern and shadow */}
        <div
          className="relative h-96 w-full bg-fixed bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/7978128/pexels-photo-7978128.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-xl p-8 opacity-0 animate-fade-up animate-fill-forwards animate-delay-300">
              <Newsletter />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
