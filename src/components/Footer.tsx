import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-50 text-gray-700 pt-12 pb-8 border-t border-blue-100 opacity-0 animate-fade-up animate-fill-forwards animate-delay-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Logo and info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Maná Cafe Logo"
                className="h-8 w-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]"
              />
              <span className="ml-2 text-xl font-bold text-[#2851a3] font-playfair">
                Maná Cafe
              </span>
            </div>
            <p className="text-sm font-playfair">
              Café de especialidad y juegos de mesa en un ambiente único y
              acogedor.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com"
                className="text-blue-500 hover:text-blue-700"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                className="text-blue-500 hover:text-blue-700"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="text-blue-500 hover:text-blue-700"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#2851a3] font-playfair">
              Enlaces
            </h3>
            <ul className="space-y-2 font-playfair">
              <li>
                <Button
                  variant="link"
                  className="p-0 text-gray-600 hover:text-[#2851a3]"
                  onClick={() => navigate("/")}
                >
                  Inicio
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 text-gray-600 hover:text-[#2851a3]"
                  onClick={() => navigate("/carta")}
                >
                  Carta
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 text-gray-600 hover:text-[#2851a3]"
                  onClick={() => navigate("/nosotros")}
                >
                  Nosotros
                </Button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#2851a3] font-playfair">
              Contacto
            </h3>
            <ul className="space-y-2 font-playfair">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-[#2851a3]" />
                <span className="text-sm">Calle 8 entre 58 y 59, La Plata</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-[#2851a3]" />
                <span className="text-sm">Tel: (221) 555-1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-[#2851a3]" />
                <span className="text-sm">info@frikioteca.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#2851a3] font-playfair">
              Horarios
            </h3>
            <ul className="space-y-2 font-playfair text-sm">
              <li>Lunes a Viernes: 9:00 - 21:00</li>
              <li>Sábados y Domingos: 10:00 - 22:00</li>
              <li>Feriados: 10:00 - 20:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-100 mt-8 pt-8 text-center">
          <p className="text-sm font-playfair text-gray-500">
            © {currentYear} Maná Cafe. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
