import { Menu as MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setScrolled(position > 100); // Track if scrolled more than 100px
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check
    setScrolled(window.scrollY > 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Updated function to always scroll to top when navigation buttons are clicked
  const navigateToPage = (path: string) => {
    if (location.pathname === path) {
      // If already on the page, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navigate to the page and then scroll to top
      navigate(path);
      // Force scroll to top after navigation
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Frikioteca Logo"
              className="h-10 w-auto"
            />
            <span
              className={`ml-2 text-xl font-bold font-playfair cursor-pointer ${
                scrolled ? "text-[#2851a3] dark:text-blue-300" : "text-white"
              }`}
              onClick={() => navigateToPage("/")}
            >
              Frikioteca
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button
                variant="ghost"
                className={`font-playfair ${
                  scrolled
                    ? "text-[#2851a3] dark:text-blue-300 hover:text-[#2851a3] hover:bg-blue-50 dark:hover:bg-gray-800"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
                onClick={() => navigateToPage("/")}
              >
                Inicio
              </Button>
              <Button
                variant="ghost"
                className={`font-playfair ${
                  scrolled
                    ? "text-[#2851a3] hover:text-[#2851a3] hover:bg-blue-50"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
                onClick={() => navigateToPage("/carta")}
              >
                Carta
              </Button>
              <Button
                variant="ghost"
                className={`font-playfair ${
                  scrolled
                    ? "text-[#2851a3] hover:text-[#2851a3] hover:bg-blue-50"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
                onClick={() => navigateToPage("/productos")}
              >
                Productos
              </Button>
              <Button
                variant="ghost"
                className={`font-playfair ${
                  scrolled
                    ? "text-[#2851a3] hover:text-[#2851a3] hover:bg-blue-50"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
                onClick={() => navigateToPage("/eventos")}
              >
                Eventos
              </Button>
              <Button
                variant="ghost"
                className={`font-playfair ${
                  scrolled
                    ? "text-[#2851a3] hover:text-[#2851a3] hover:bg-blue-50"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
                onClick={() => navigateToPage("/nosotros")}
              >
                Nosotros
              </Button>
              <ThemeToggle scrolled={scrolled} />
            </div>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle scrolled={scrolled} />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon
                    className={
                      scrolled
                        ? "h-6 w-6 text-[#2851a3] dark:text-blue-300"
                        : "h-6 w-6 text-white"
                    }
                  />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Button
                    variant="ghost"
                    className="font-playfair text-[#2851a3] justify-start"
                    onClick={() => navigateToPage("/")}
                  >
                    Inicio
                  </Button>
                  <Button
                    variant="ghost"
                    className="font-playfair text-[#2851a3] justify-start"
                    onClick={() => navigateToPage("/carta")}
                  >
                    Carta
                  </Button>
                  <Button
                    variant="ghost"
                    className="font-playfair text-[#2851a3] justify-start"
                    onClick={() => navigateToPage("/productos")}
                  >
                    Productos
                  </Button>
                  <Button
                    variant="ghost"
                    className="font-playfair text-[#2851a3] justify-start"
                    onClick={() => navigateToPage("/eventos")}
                  >
                    Eventos
                  </Button>
                  <Button
                    variant="ghost"
                    className="font-playfair text-[#2851a3] justify-start"
                    onClick={() => navigateToPage("/nosotros")}
                  >
                    Nosotros
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
