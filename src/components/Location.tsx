import { Clock, MapPin, Phone } from "lucide-react";

const Location = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#2851a3] mb-12 font-playfair">
          Dónde Encontrarnos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="rounded-lg overflow-hidden shadow-lg opacity-0 animate-fade-up animate-fill-forwards">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d-57.956889!3d-34.921319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDU1JzE2LjgiUyA1N8KwNTcnMjQuOCJX!5e0!3m2!1ses!2sar!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="space-y-8 opacity-0 animate-fade-up animate-fill-forwards animate-delay-100">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-[#2851a3] mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-2 font-playfair text-[#2851a3]">
                  Dirección
                </h3>
                <p className="text-gray-600 font-playfair">
                  Calle 8 entre 58 y 59
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
                  Email: info@manacafe.com
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
