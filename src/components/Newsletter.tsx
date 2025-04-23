import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/sonner";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Por favor ingresa un email válido");
      return;
    }
    
    // Here you would typically send this to your backend or newsletter service
    setIsSubscribed(true);
    toast.success("¡Gracias por suscribirte!", {
      description: "Recibirás nuestras novedades en tu correo."
    });
    setEmail("");
  };

  return (
    <div className="w-full p-8">
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-2xl font-bold text-white font-playfair mb-2">
          Mantente Informado
        </h3>
        <p className="text-white mb-4 font-playfair">
          Suscríbete para recibir novedades sobre eventos y promociones especiales
        </p>
        
        {isSubscribed ? (
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-green-500">
            <p className="text-white font-playfair">
              ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200 border-white/20"
            />
            <Button 
              type="submit" 
              className="bg-[#2851a3]/90 hover:bg-[#1a3e7e] whitespace-nowrap backdrop-blur-sm"
            >
              <Mail className="mr-2 h-4 w-4" />
              Suscribirse
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
