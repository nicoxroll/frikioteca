import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center opacity-0 animate-fade-up animate-fill-forwards animate-delay-200">
        <div className="max-w-md text-center p-8">
          <Coffee className="h-16 w-16 text-[#2851a3] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-[#2851a3] mb-4 font-playfair">
            Página No Encontrada
          </h1>
          <p className="text-gray-600 mb-8 font-playfair">
            Lo sentimos, la página que estás buscando no existe.
          </p>
          <Button
            className="bg-[#2851a3] hover:bg-[#1a3e7e] font-playfair"
            onClick={() => navigate("/")}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
