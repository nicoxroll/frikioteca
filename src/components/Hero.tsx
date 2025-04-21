import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        transform: "translateZ(0)",
        backgroundPosition: "center top", // Changed to 'top' for better alignment
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <div className="relative z-10 text-center px-4 animate-fade-up">
        <img
          src="/images/logo.png"
          alt="Maná Cafe Logo"
          className="h-24 w-auto mx-auto mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-playfair text-shadow">
          <span className="text-[#2851a3] drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            Maná
          </span>{" "}
          <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
            Cafe
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white mb-8 font-playfair">
          Café de especialidad · Juegos de mesa · Ambiente único
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            className="bg-[#2851a3] hover:bg-[#1a3e7e] text-white px-6 py-2 text-lg font-playfair"
            onClick={() => navigate("/carta")}
          >
            Carta
          </Button>
          <Button
            className="bg-white text-[#2851a3] hover:bg-gray-100 px-6 py-2 text-lg font-playfair"
            onClick={() => {
              const eventsSection = document.getElementById("eventos");
              if (eventsSection) {
                eventsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Descubre Eventos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
