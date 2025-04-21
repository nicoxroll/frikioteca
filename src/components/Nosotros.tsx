import { BookOpen, Coffee, Mail, Send, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { toast } from "./ui/sonner";
import { Textarea } from "./ui/textarea";

const Nosotros = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // In the future, this would send to Supabase or an email service
    toast.success("¡Mensaje enviado correctamente!");
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section id="nosotros" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#2851a3] mb-12 font-playfair">
          Nuestra Historia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <BookOpen className="h-8 w-8 text-[#2851a3] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-[#2851a3] font-playfair mb-3">
                  Nuestra Pasión
                </h3>
                <p className="text-gray-600 font-playfair">
                  Frikioteca nació en 2020 como un espacio que combina dos
                  grandes pasiones: el café de especialidad y los juegos. Desde
                  entonces, nos hemos convertido en un punto de encuentro para
                  amantes del buen café, juegos de mesa y cartas coleccionables.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Users className="h-8 w-8 text-[#2851a3] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-[#2851a3] font-playfair mb-3">
                  Comunidad
                </h3>
                <p className="text-gray-600 font-playfair">
                  Nos enorgullece haber creado una comunidad vibrante donde
                  personas de todas las edades pueden disfrutar de momentos
                  agradables entre amigos, mientras saboren nuestras deliciosas
                  opciones gastronómicas y participan en torneos y eventos
                  especiales.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Coffee className="h-8 w-8 text-[#2851a3] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-[#2851a3] font-playfair mb-3">
                  Café de Especialidad
                </h3>
                <p className="text-gray-600 font-playfair">
                  Trabajamos con los mejores granos de café, tostados
                  artesanalmente, para ofrecerte una experiencia sensorial
                  única. Nuestros baristas están capacitados para preparar el
                  café perfecto, resaltando sus notas y características únicas.
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg"
                alt="Nuestro local"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#2851a3] font-playfair mb-3">
                Un Lugar Para Compartir
              </h3>
              <p className="text-gray-600 font-playfair">
                En Frikioteca encontrarás mesas dedicadas a juegos de mesa y
                torneos de TCG, donde puedes desafiar a tus amigos o conocer
                nuevos jugadores. Contamos con una amplia colección de juegos y
                organizamos eventos semanales para nuestra comunidad.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 pt-10 border-t">
          <div
            className="relative py-16 px-4 rounded-xl overflow-hidden min-h-[600px]"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/31587233/pexels-photo-31587233/free-photo-of-fachada-arquitectonica-geometrica-con-patrones-repetitivos.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark overlay for better readability */}
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10 max-w-2xl mx-auto"></div>
            {/* Overlay to improve readability */}
            <div className="absolute inset-0 bg-black/20"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-12 font-playfair flex items-center justify-center">
                <Mail className="mr-3 h-8 w-8" /> Contáctanos
              </h2>

              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="font-playfair text-gray-700 font-medium"
                      >
                        Nombre
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                        className="font-playfair bg-transparent border-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="font-playfair text-gray-700 font-medium"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Tu email"
                        className="font-playfair bg-transparent border-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="font-playfair text-gray-700 font-medium"
                    >
                      Mensaje
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="¿En qué podemos ayudarte?"
                      className="h-32 resize-none font-playfair bg-transparent border-gray-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-[#2851a3] hover:bg-[#1a3e7e] font-playfair"
                  >
                    <Send className="mr-2 h-4 w-4" /> Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
