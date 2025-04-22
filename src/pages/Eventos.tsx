import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// Types for our events
type EventStatus = "upcoming" | "live" | "past";

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
  organizer?: string;
  registrationRequired?: boolean;
  registrationLink?: string;
  price?: string;
  tags?: string[];
  longDescription?: string;
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
    organizer: "Equipo Frikioteca",
    registrationRequired: true,
    registrationLink: "https://forms.frikioteca.com/mtg-tournament",
    price: "$10.00",
    tags: ["Magic", "Torneo", "Commander"],
    longDescription:
      "Nuestro torneo mensual de Magic: The Gathering en formato Commander es uno de los eventos más populares. Todos los participantes reciben un sobre de la última expansión y los tres primeros lugares recibirán premios especiales. El torneo sigue las reglas oficiales de Commander y contamos con jueces certificados por Wizards of the Coast. Recomendamos llegar 30 minutos antes para el registro. Habrá servicio de cafetería disponible durante todo el evento.",
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
    organizer: "Equipo Frikioteca",
    registrationRequired: false,
    price: "Consumición mínima: $5.00",
    tags: ["Juegos de Mesa", "Social", "Casual"],
    longDescription:
      "Nuestra noche de juegos de mesa es perfecta para conocer gente nueva, probar juegos que nunca has jugado o disfrutar de tus favoritos. Tenemos una colección de más de 100 juegos que van desde clásicos como Catan y Ticket to Ride hasta novedades como Wingspan y Gloomhaven. Nuestro personal estará disponible para explicar reglas y recomendar juegos según tus preferencias. No es necesario reservar, pero te recomendamos llegar temprano para asegurar mesa.",
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
    organizer: "Liga Pokémon La Plata & Frikioteca",
    registrationRequired: true,
    registrationLink: "https://forms.frikioteca.com/pokemon-tournament",
    price: "$8.00",
    tags: ["Pokémon", "Torneo", "Oficial"],
    longDescription:
      "Participa en nuestro torneo oficial de Pokémon Trading Card Game en formato Estándar. Este evento está avalado por la Liga Oficial de Pokémon y otorga puntos para el campeonato regional. Los ganadores recibirán premios exclusivos de Pokémon. Todos los participantes deben traer su propio mazo conforme a las reglas actuales del formato Estándar. Se realizarán 4 rondas con sistema suizo y luego top 8 por eliminación directa.",
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
    organizer: "Equipo Frikioteca",
    registrationRequired: false,
    price: "Varía según actividad",
    tags: ["Magic", "Lanzamiento", "Casual"],
    longDescription:
      "Celebra con nosotros el lanzamiento de la nueva expansión de Magic: The Gathering. Durante todo el día organizaremos torneos relámpago en diversos formatos (Draft, Sealed, Standard) con premios exclusivos. También habrá una zona de intercambio donde podrás conseguir las cartas que necesitas para tus mazos. Nuestro personal estará disponible para asesorarte sobre las nuevas mecánicas y cartas más destacadas de la expansión. La entrada es libre pero cada actividad tiene su propio costo.",
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
    organizer: "Equipo Frikioteca",
    tags: ["Yu-Gi-Oh", "Torneo"],
    longDescription:
      "Este fue nuestro primer torneo oficial de Yu-Gi-Oh en formato Avanzado. Contamos con 28 participantes que disfrutaron de intensos duelos. Tuvimos la visita de jugadores destacados de la región y todos los participantes recibieron sobres promocionales. El evento fue un gran éxito y estamos planeando convertirlo en un torneo mensual.",
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
    organizer: "Club Warhammer La Plata & Frikioteca",
    tags: ["Warhammer", "Miniaturas", "Torneo"],
    longDescription:
      "Nuestro último torneo de Warhammer 40k reunió a 16 jugadores con sus impresionantes ejércitos. La competición se desarrolló en 3 rondas usando el sistema de puntos estándar. Además de las batallas, realizamos un concurso de pintado de miniaturas y mejor ejército. Los participantes destacaron la calidad de los tableros de juego y la organización del evento. Planes futuros incluyen una liga permanente de Warhammer en nuestras instalaciones.",
  },
  {
    id: 7,
    title: "Torneo de Smash Bros Ultimate EN VIVO",
    date: "Hoy",
    time: "18:00 - 22:00",
    location: "Frikioteca - Zona de Videojuegos",
    description:
      "¡Torneo de Super Smash Bros Ultimate en curso! Ven a presenciar los combates o únete a última hora si hay espacios disponibles.",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    capacity: "32 jugadores",
    status: "live",
    organizer: "Frikioteca Gaming",
    registrationRequired: false,
    price: "$5.00 para participantes de última hora",
    tags: ["Videojuegos", "Smash Bros", "Torneo", "En Vivo"],
    longDescription:
      "Nuestro torneo mensual de Super Smash Bros Ultimate está sucediendo ahora mismo. Los participantes compiten por premios en efectivo y productos gaming. Aunque las inscripciones oficiales ya cerraron, aceptamos participantes de última hora si hay espacios disponibles. Si no quieres competir, ¡ven a animar a los jugadores y disfrutar del ambiente! Transmitiremos las finales en nuestra pantalla principal.",
  },
  {
    id: 8,
    title: "Sesión D&D Aventureros EN VIVO",
    date: "Hoy",
    time: "19:00 - 23:00",
    location: "Frikioteca - Sala de Rol",
    description:
      "Campaña continua de Dungeons & Dragons 5e transmitida en vivo desde nuestra sala. Ven a ver a nuestros aventureros enfrentarse a nuevos peligros.",
    image:
      "https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    capacity: "Espectadores limitados",
    status: "live",
    organizer: "Club de Rol Frikioteca",
    tags: ["D&D", "Rol", "En Vivo"],
    longDescription:
      "Nuestra campaña semanal de Dungeons & Dragons está sucediendo ahora mismo. El grupo de aventureros está explorando las Minas Perdidas de Phandelver en esta sesión. Puedes unirte como espectador y disfrutar de la narrativa, las interpretaciones de los jugadores y todas las sorpresas que el Dungeon Master tiene preparadas. Transmitimos también en nuestro canal de Twitch para quienes no pueden asistir presencialmente.",
  },
];

const EventosPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

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

  // Filter events based on search term and status
  const filteredEvents = eventData.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesSearch;
  });

  const liveEvents = filteredEvents.filter((event) => event.status === "live");
  const upcomingEvents = filteredEvents.filter(
    (event) => event.status === "upcoming"
  );
  const pastEvents = filteredEvents.filter((event) => event.status === "past");

  // Handle event click to show details
  const handleEventClick = (event: EventItem) => {
    setSelectedEvent(event);
    // Scroll to top when showing event details
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
        {/* Search Box */}
        <div className="mb-10">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar eventos por nombre, descripción o categoría..."
              className="pl-10 py-6 font-playfair"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Live Events Section */}
        {liveEvents.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-4">
              <h2 className="text-3xl font-bold text-[#2851a3] font-playfair">
                Eventos en Vivo
              </h2>
              <div className="ml-4 relative">
                <span className="absolute -inset-0.5 animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative rounded-full h-3 w-3 bg-red-500"></span>
              </div>
            </div>
            <p className="text-gray-600 mb-8 font-playfair">
              Eventos que están sucediendo en este momento. ¡Ven a unirte!
            </p>
            <Separator className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {liveEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-red-400 border-2"
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
                      <Badge className="bg-red-500 text-white font-playfair animate-pulse">
                        En Vivo Ahora
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
                        <Clock className="h-4 w-4 mr-2 text-red-500" />
                        <span className="font-playfair">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        <span className="font-playfair">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="h-4 w-4 mr-2 text-red-500" />
                        <span className="font-playfair">{event.capacity}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 font-playfair">
                      {event.description}
                    </p>

                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 mt-4"
                      onClick={() => handleEventClick(event)}
                    >
                      Ver Detalles <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#2851a3] font-playfair mb-4">
              Próximos Eventos
            </h2>
            <p className="text-gray-600 mb-8 font-playfair">
              No te pierdas nuestros próximos eventos y torneos. ¡Reserva tu
              lugar con anticipación!
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

                    <Button
                      className="w-full bg-[#2851a3] hover:bg-[#1a3e7e] mt-4"
                      onClick={() => handleEventClick(event)}
                    >
                      Ver Detalles <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-[#2851a3] border-[#2851a3]"
                      onClick={() => handleEventClick(event)}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-gray-700 font-playfair mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-gray-500 font-playfair mb-6">
              No hay eventos que coincidan con tu búsqueda "{searchTerm}"
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="font-playfair"
            >
              Mostrar todos los eventos
            </Button>
          </div>
        )}

        {/* Event Details Dialog */}
        <Dialog
          open={selectedEvent !== null}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          {selectedEvent && (
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#2851a3] font-playfair">
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription className="font-playfair">
                  {selectedEvent.status === "live" ? (
                    <Badge className="bg-red-500 text-white font-playfair mt-2">
                      En Vivo Ahora
                    </Badge>
                  ) : selectedEvent.status === "upcoming" ? (
                    <Badge className="bg-[#2851a3] text-white font-playfair mt-2">
                      Próximamente
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-800/70 text-white font-playfair mt-2"
                    >
                      Finalizado
                    </Badge>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="relative h-64 md:h-80 overflow-hidden rounded-md mb-6">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className={`w-full h-full object-cover ${
                    selectedEvent.status === "past" ? "grayscale-[30%]" : ""
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#2851a3] font-playfair">
                    Fecha y Hora
                  </h3>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-[#2851a3]" />
                    <span className="font-playfair">{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2 text-[#2851a3]" />
                    <span className="font-playfair">{selectedEvent.time}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#2851a3] font-playfair">
                    Ubicación
                  </h3>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-4 w-4 mr-2 text-[#2851a3]" />
                    <span className="font-playfair">
                      {selectedEvent.location}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#2851a3] font-playfair">
                    Capacidad
                  </h3>
                  <div className="flex items-center text-gray-700">
                    <Users className="h-4 w-4 mr-2 text-[#2851a3]" />
                    <span className="font-playfair">
                      {selectedEvent.capacity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4 mb-6">
                {selectedEvent.organizer && (
                  <div>
                    <h3 className="text-lg font-bold text-[#2851a3] font-playfair mb-2">
                      Organizador
                    </h3>
                    <p className="text-gray-700 font-playfair">
                      {selectedEvent.organizer}
                    </p>
                  </div>
                )}

                {selectedEvent.price && (
                  <div>
                    <h3 className="text-lg font-bold text-[#2851a3] font-playfair mb-2">
                      Precio
                    </h3>
                    <p className="text-gray-700 font-playfair">
                      {selectedEvent.price}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-[#2851a3] font-playfair mb-2">
                    Descripción
                  </h3>
                  <p className="text-gray-700 font-playfair">
                    {selectedEvent.longDescription || selectedEvent.description}
                  </p>
                </div>

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[#2851a3] font-playfair mb-2">
                      Categorías
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-[#2851a3] font-playfair"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Call to Action Buttons */}
              {selectedEvent.status === "upcoming" && (
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  {selectedEvent.registrationRequired &&
                  selectedEvent.registrationLink ? (
                    <Button className="w-full bg-[#2851a3] hover:bg-[#1a3e7e] font-playfair">
                      Registrarse
                    </Button>
                  ) : (
                    <Button className="w-full bg-[#2851a3] hover:bg-[#1a3e7e] font-playfair">
                      Confirmar Asistencia
                    </Button>
                  )}
                  <Button variant="outline" className="w-full font-playfair">
                    Añadir a Calendario
                  </Button>
                </div>
              )}

              {selectedEvent.status === "live" && (
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button className="w-full bg-red-500 hover:bg-red-600 font-playfair">
                    Unirse Ahora
                  </Button>
                </div>
              )}
            </DialogContent>
          )}
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default EventosPage;
