import { Calendar, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { CardContent, CardHeader, CardTitle } from "./ui/card";

const events = [
  {
    title: "Torneo de TCG",
    date: "Todos los Sábados",
    description: "Ven a participar en nuestros torneos semanales",
    icon: <Trophy className="h-6 w-6 text-[#2851a3] mb-2" />,
    image: "https://images.pexels.com/photos/776654/pexels-photo-776654.jpeg",
  },
  {
    title: "Feria de Juegos",
    date: "Primer domingo de cada mes",
    description: "Exposición y venta de juegos de mesa",
    icon: <Calendar className="h-6 w-6 text-[#2851a3] mb-2" />,
    image: "https://images.pexels.com/photos/4691555/pexels-photo-4691555.jpeg",
  },
  {
    title: "Noche de Juegos",
    date: "Viernes",
    description: "Mesas abiertas para jugar con amigos",
    icon: <Users className="h-6 w-6 text-[#2851a3] mb-2" />,
    image: "https://images.pexels.com/photos/4929437/pexels-photo-4929437.jpeg",
  },
];

const Events = () => {
  const navigate = useNavigate();

  // Navigation function with scroll to top
  const navigateToEvents = () => {
    navigate("/eventos");
    window.scrollTo(0, 0);
  };

  return (
    <section id="eventos" className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#2851a3] mb-6 font-playfair">
          Eventos
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-playfair">
          Descubre nuestros eventos especiales y únete a una comunidad
          apasionada por los juegos y el buen café.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={event.title}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-up animate-fill-forwards"
              style={{ animationDelay: `${index * 150 + 100}ms` }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardHeader>
                {event.icon}
                <CardTitle className="text-[#2851a3] font-playfair">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-600 font-playfair">
                  {event.date}
                </p>
                <p className="text-gray-600 mt-2 font-playfair">
                  {event.description}
                </p>
              </CardContent>
            </div>
          ))}
        </div>

        {/* Add "Ver Todos" button */}
        <div className="text-center mt-12">
          <Button
            className="bg-[#2851a3] hover:bg-[#1a3e7e] font-playfair text-lg px-8 py-6"
            onClick={navigateToEvents}
          >
            Ver Todos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Events;
