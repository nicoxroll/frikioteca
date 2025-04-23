import Footer from "@/components/Footer";
import Location from "@/components/Location";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Coffee, Mail, Send, Users } from "lucide-react";
import { useState } from "react";

const NosotrosPage = () => {
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            backgroundAttachment: "fixed",
            filter: "brightness(0.7)",
          }}
        ></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Nuestra Historia
          </h1>
          <p className="text-xl text-white font-playfair drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] max-w-3xl mx-auto">
            Conoce más sobre Frikioteca, un espacio donde la pasión por los
            juegos y el café se unen para crear experiencias inolvidables.
          </p>
        </div>
      </div>

      <main className="pt-20">
        <section className="py-16 px-4 bg-white opacity-0 animate-fade-up animate-fill-forwards animate-delay-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#2851a3] mb-12 font-playfair">
              Quiénes Somos
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
                      grandes pasiones: el café de especialidad y los juegos.
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
                      agradables entre amigos, mientras saboren nuestras
                      deliciosas opciones gastronómicas y participan en torneos
                      y eventos especiales.
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
                      única. Nuestros baristas están capacitados para preparar
                      el café perfecto, resaltando sus notas y características
                      únicas.
                    </p>
                  </div>
                </div>
              </div>

              <Card className="overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/3679601/pexels-photo-3679601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
                    nuevos jugadores. Contamos con una amplia colección de
                    juegos y organizamos eventos semanales para nuestra
                    comunidad.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 opacity-0 animate-fade-up animate-fill-forwards animate-delay-300">
          <Location />
        </section>

        <section className="py-16 px-4 bg-blue-50 opacity-0 animate-fade-up animate-fill-forwards animate-delay-400">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#2851a3] mb-12 font-playfair flex items-center justify-center">
              <Mail className="mr-3 h-8 w-8" /> Contáctanos
            </h2>

            <div className="bg-white rounded-xl shadow-lg p-8">
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
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NosotrosPage;
