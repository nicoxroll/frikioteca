import { useCart } from "@/hooks/use-cart";
import { Menu as MenuIcon, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCart();
  const itemCount = items.length;

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

  // Check if a route is active
  const isRouteActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Determine button class based on scrolled state and active route
  const getButtonClass = (path: string) => {
    const isActive = isRouteActive(path);
    return `font-playfair relative ${
      scrolled
        ? "text-[#2851a3] hover:text-[#2851a3] hover:bg-blue-50"
        : "text-white hover:text-white hover:bg-white/10"
    } ${
      isActive
        ? "after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-current"
        : ""
    }`;
  };

  // Determine mobile button class for active route
  const getMobileButtonClass = (path: string) => {
    const isActive = isRouteActive(path);
    return `font-playfair text-[#2851a3] justify-start ${
      isActive ? "bg-blue-50 font-semibold" : ""
    }`;
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
                className={getButtonClass("/")}
                onClick={() => navigateToPage("/")}
              >
                Inicio
              </Button>
              <Button
                variant="ghost"
                className={getButtonClass("/carta")}
                onClick={() => navigateToPage("/carta")}
              >
                Carta
              </Button>
              <Button
                variant="ghost"
                className={getButtonClass("/productos")}
                onClick={() => navigateToPage("/productos")}
              >
                Productos
              </Button>
              <Button
                variant="ghost"
                className={getButtonClass("/eventos")}
                onClick={() => navigateToPage("/eventos")}
              >
                Eventos
              </Button>
              <Button
                variant="ghost"
                className={getButtonClass("/nosotros")}
                onClick={() => navigateToPage("/nosotros")}
              >
                Nosotros
              </Button>

              {/* Carrito */}
              <Button
                variant="ghost"
                className={`${getButtonClass("/carrito")} relative`}
                onClick={() => navigateToPage("/carrito")}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 px-1.5 min-w-[20px] h-5"
                    variant="destructive"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              <ThemeToggle scrolled={scrolled} />
            </div>
          </div>
          <div className="md:hidden flex items-center gap-2">
            {/* Carrito versión móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigateToPage("/carrito")}
            >
              <ShoppingCart
                className={
                  scrolled
                    ? "h-5 w-5 text-[#2851a3] dark:text-blue-300"
                    : "h-5 w-5 text-white"
                }
              />
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 px-1 min-w-[18px] h-4 text-xs"
                  variant="destructive"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

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
                    className={getMobileButtonClass("/")}
                    onClick={() => navigateToPage("/")}
                  >
                    Inicio
                  </Button>
                  <Button
                    variant="ghost"
                    className={getMobileButtonClass("/carta")}
                    onClick={() => navigateToPage("/carta")}
                  >
                    Carta
                  </Button>
                  <Button
                    variant="ghost"
                    className={getMobileButtonClass("/productos")}
                    onClick={() => navigateToPage("/productos")}
                  >
                    Productos
                  </Button>
                  <Button
                    variant="ghost"
                    className={getMobileButtonClass("/eventos")}
                    onClick={() => navigateToPage("/eventos")}
                  >
                    Eventos
                  </Button>
                  <Button
                    variant="ghost"
                    className={getMobileButtonClass("/nosotros")}
                    onClick={() => navigateToPage("/nosotros")}
                  >
                    Nosotros
                  </Button>
                  <Button
                    variant="ghost"
                    className={getMobileButtonClass("/carrito")}
                    onClick={() => navigateToPage("/carrito")}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Carrito ({itemCount})
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
