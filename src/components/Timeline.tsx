import {
  Award,
  CalendarDays,
  Coffee,
  Star,
  Users,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Timeline = () => {
  const navigate = useNavigate();

  const timelineEvents = [
    {
      year: "2018",
      title: "Nuestros inicios",
      description:
        "Comenzamos como un pequeño café con sólo cuatro mesas, pero con una gran visión.",
      icon: <Coffee className="h-8 w-8 text-white" />,
      image: "/images/cafe-1.webp",
    },
    {
      year: "2019",
      title: "Comunidad de juegos",
      description:
        "Comenzamos a organizar eventos y torneos de juegos de mesa y TCG, formando una comunidad única.",
      icon: <Users className="h-8 w-8 text-white" />,
      image: "/images/cafe-2.webp",
    },
    {
      year: "2020",
      title: "Expansión",
      description:
        "Nos mudamos a un local más grande para poder dar cabida a nuestra creciente comunidad.",
      icon: <CalendarDays className="h-8 w-8 text-white" />,
      image: "/images/cafe-3.webp",
    },
    {
      year: "2022",
      title: "Reconocimiento local",
      description:
        "Fuimos reconocidos como uno de los mejores cafés temáticos de la ciudad.",
      icon: <Award className="h-8 w-8 text-white" />,
      image: "/images/cafe-4.webp",
    },
    {
      year: "2023",
      title: "Innovación gastronómica",
      description:
        "Expandimos nuestro menú con creaciones únicas que fusionan el café con sabores locales.",
      icon: <Utensils className="h-8 w-8 text-white" />,
      image: "/images/cafe-5.webp",
    },
    {
      year: "2024",
      title: "Comunidad internacional",
      description:
        "Nos convertimos en punto de encuentro para jugadores y aficionados al café de todo el mundo.",
      icon: <Star className="h-8 w-8 text-white" />,
      image: "/images/cafe-6.webp",
    },
  ];

  return (
    <section id="timeline" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#2851a3] mb-6 font-playfair">
          Trayecto
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-playfair">
          El recorrido que nos ha traído hasta donde estamos hoy
        </p>

        <div className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>

          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className={`mb-16 flex ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } opacity-0 animate-fade-up animate-fill-forwards`}
              style={{ animationDelay: `${index * 200 + 100}ms` }}
            >
              <div className="w-1/2 px-6">
                <div
                  className={`${index % 2 === 0 ? "text-right" : "text-left"}`}
                >
                  <span className="text-3xl font-bold text-[#2851a3] font-playfair">
                    {event.year}
                  </span>
                  <h3 className="text-xl font-bold text-[#2851a3] mt-2 font-playfair">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mt-2 font-playfair">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute z-10 w-12 h-12 rounded-full bg-[#2851a3] flex items-center justify-center">
                  {event.icon}
                </div>
              </div>

              <div className="w-1/2 px-6">
                <div className="h-96 overflow-hidden rounded-lg shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center opacity-0 animate-fade-up animate-fill-forwards animate-delay-400">
          <Button
            className="bg-[#2851a3] hover:bg-[#1a3e7e] font-playfair text-lg px-8 py-6"
            onClick={() => navigate("/nosotros")}
          >
            Ver Nuestra Historia Completa
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
