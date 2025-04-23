import Events from "@/components/Events";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import NavBar from "@/components/NavBar";
import Newsletter from "@/components/Newsletter";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
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
