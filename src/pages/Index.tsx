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
                Categorías de Productos
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-playfair">
                Explora nuestra variedad de productos organizados por categorías, para que encuentres exactamente lo que estás buscando.
              </p>
            </div>
            
            {/* 2x2 Grid for Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Category 1: TCG */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 h-64">
                <div className="h-full relative group">
                  <img 
                    src="https://images.pexels.com/photos/6615071/pexels-photo-6615071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Trading Card Games" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <h3 className="text-2xl font-bold text-white font-playfair mb-2">TCG</h3>
                      <p className="text-gray-200 mb-4">Trading Card Games y accesorios para tus juegos favoritos</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Category 2: Remeras */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 h-64">
                <div className="h-full relative group">
                  <img 
                    src="https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Remeras" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <h3 className="text-2xl font-bold text-white font-playfair mb-2">Remeras</h3>
                      <p className="text-gray-200 mb-4">Encuentra tu estilo con nuestros diseños exclusivos</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Category 3: Items */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 h-64">
                <div className="h-full relative group">
                  <img 
                    src="https://images.pexels.com/photos/18054995/pexels-photo-18054995/free-photo-of-arte-pintura-pintando-cuadro.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load" 
                    alt="Items" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <h3 className="text-2xl font-bold text-white font-playfair mb-2">Items</h3>
                      <p className="text-gray-200 mb-4">Artículos coleccionables y figuras de tus sagas preferidas</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Category 4: Tazas */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 h-64">
                <div className="h-full relative group">
                  <img 
                    src="https://images.pexels.com/photos/8105034/pexels-photo-8105034.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Tazas" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <h3 className="text-2xl font-bold text-white font-playfair mb-2">Tazas</h3>
                      <p className="text-gray-200 mb-4">Disfruta tu bebida favorita con nuestros diseños exclusivos</p>
                    </div>
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
