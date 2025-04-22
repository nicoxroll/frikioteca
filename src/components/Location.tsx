import { useTheme } from "@/providers/ThemeProvider";
import { Clock, MapPin, Phone } from "lucide-react";

const Location = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <section id="ubicacion" className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#2851a3] mb-12 font-playfair">
          Ubicación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 relative rounded-xl overflow-hidden shadow-lg">
            {/* Apply dark mode filter */}
            {isDarkMode && (
              <div className="absolute inset-0 bg-gray-900/30 mix-blend-multiply z-10 pointer-events-none"></div>
            )}

            <iframe
              title="Mapa de Frikioteca"
              className="w-full h-[400px]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.7758919821596!2d-57.95583228418842!3d-34.91779198038094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e62f17c527c3%3A0x7d3fb5f101b01d38!2sFrikioteca%20La%20Plata!5e0!3m2!1sen!2sar!4v1619450079822!5m2!1sen!2sar"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          <div className="space-y-6 self-center">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-[#2851a3] mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-2 font-playfair text-[#2851a3]">
                  Dirección
                </h3>
                <p className="text-gray-600 font-playfair">
                  Calle 8 n° 1742 e/ 68 y 69
                </p>
                <p className="text-gray-600 font-playfair">
                  La Plata, Buenos Aires
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-6 w-6 text-[#2851a3] mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-2 font-playfair text-[#2851a3]">
                  Horarios
                </h3>
                <p className="text-gray-600 font-playfair">
                  Lunes a Viernes: 9:00 - 21:00
                </p>
                <p className="text-gray-600 font-playfair">
                  Sábados y Domingos: 10:00 - 22:00
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 text-[#2851a3] mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-2 font-playfair text-[#2851a3]">
                  Contacto
                </h3>
                <p className="text-gray-600 font-playfair">
                  Tel: (221) 555-1234
                </p>
                <p className="text-gray-600 font-playfair">
                  Email: info@frikioteca.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
