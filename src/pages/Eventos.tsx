import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, ChevronRight, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Types for our events
type EventStatus = "upcoming" | "past";

type EventItem = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  capacity: string;
  status: EventStatus;
};

// Sample event data - in a real app, this would come from a database
const eventData: EventItem[] = [
  {
    id: 1,
    title: "Torneo de Magic: The Gathering",
    date: "15 de Octubre, 2023",
    time: "18:00 - 22:00",
    location: "Frikioteca - Salón Principal",
    description:
      "¡Únete a nuestro torneo mensual de Magic! Formato Commander. Inscripción previa requerida. Premios para los tres primeros lugares.",
    image:
      "https://images.pexels.com/photos/6615071/pexels-photo-6615071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    capacity: "32 jugadores",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Noche de Juegos de Mesa",
    date: "22 de Octubre, 2023",
    time: "19:00 - 23:00",
    location: "Frikioteca - Área de Juegos",
    description:
      "Ven a disfrutar de nuestra colección de más de 100 juegos de mesa. Entrada libre. Consumición mínima requerida.",
    image:
      "https://images.pexels.com/photos/4929437/pexels-photo-4929437.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    capacity: "Entrada libre",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Torneo de Pokémon TCG",
    date: "5 de Noviembre, 2023",
    time: "16:00 - 20:00",
    location: "Frikioteca - Salón Principal",
    description:
      "Torneo oficial de Pokémon TCG en formato Estándar. Inscripción previa requerida. Premios oficiales de Pokémon para los ganadores.",
    image:
      "https://images.pexels.com/photos/776654/pexels-photo-776654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    capacity: "24 jugadores",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Lanzamiento de Expansión",
    date: "12 de Noviembre, 2023",
    time: "12:00 - 20:00",
    location: "Frikioteca - Tienda",
    description:
      "Celebra con nosotros el lanzamiento de la nueva expansión de Magic. Habrá torneos relámpago, intercambios y sorpresas.",
    image:
      "https://images.pexels.com/photos/7245480/pexels-photo-7245480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    capacity: "Entrada libre",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Torneo de Yu-Gi-Oh!",
    date: "8 de Septiembre, 2023",
    time: "17:00 - 22:00",
    location: "Frikioteca - Salón Principal",
    description:
      "Nuestro primer torneo oficial de Yu-Gi-Oh! Formato Avanzado. Los participantes recibieron sobres promocionales.",
    image:
      "https://images.pexels.com/photos/6330644/pexels-photo-6330644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    capacity: "28 jugadores",
    status: "past",
  },
  {
    id: 6,
    title: "Torneo de Warhammer 40k",
    date: "30 de Agosto, 2023",
    time: "15:00 - 21:00",
    location: "Frikioteca - Área de Juegos",
    description:
      "Intensas batallas en el universo de Warhammer 40k. Sistema de puntos estándar. Incluía pintado de miniaturas y mejor ejército.",
    image:
      "https://images.pexels.com/photos/6498990/pexels-photo-6498990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    capacity: "16 jugadores",
    status: "past",
  },
];

const EventosPage = () => {
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

  const upcomingEvents = eventData.filter(
    (event) => event.status === "upcoming"
  );
  const pastEvents = eventData.filter((event) => event.status === "past");

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero section with parallax background */}
      <div className="relative flex items-center justify-center min-h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/7180611/pexels-photo-7180611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")`,
            transform: `translateY(${scrollPosition * 0.15}px)`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative text-center text-white px-4 max-w-3xl">
          <h1 className="text-5xl font-bold font-playfair mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Nuestros Eventos
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto font-playfair text-xl">
            Descubre y participa en nuestros torneos, encuentros y actividades
            especiales para la comunidad gamer.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 opacity-0 animate-fade-up animate-fill-forwards animate-delay-300">
        {/* Upcoming Events Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#2851a3] font-playfair mb-4">
            Próximos Eventos
          </h2>
          <p className="text-gray-600 mb-8 font-playfair">
            No te pierdas nuestros próximos eventos y torneos. ¡Reserva tu lugar
            con anticipación!
          </p>
          <Separator className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#2851a3] text-white font-playfair">
                      Próximamente
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-[#2851a3] font-playfair">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2 text-[#2851a3]" />
                      <span className="font-playfair">
                        {event.date} | {event.time}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 mr-2 text-[#2851a3]" />
                      <span className="font-playfair">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="h-4 w-4 mr-2 text-[#2851a3]" />
                      <span className="font-playfair">{event.capacity}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 font-playfair">
                    {event.description}
                  </p>

                  <Button className="w-full bg-[#2851a3] hover:bg-[#1a3e7e] mt-4">
                    Más Información <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[#2851a3] font-playfair mb-4">
              Eventos Pasados
            </h2>
            <p className="text-gray-600 mb-8 font-playfair">
              Revive los mejores momentos de nuestros eventos anteriores.
            </p>
            <Separator className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative">
                    <div className="h-40 overflow-hidden opacity-80">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover grayscale-[30%]"
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="outline"
                        className="bg-gray-800/70 text-white font-playfair"
                      >
                        Finalizado
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#2851a3] font-playfair">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Calendar className="h-3 w-3 mr-2 text-[#2851a3]" />
                      <span className="font-playfair">{event.date}</span>
                    </div>
                    <p className="text-gray-600 font-playfair text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EventosPage;
