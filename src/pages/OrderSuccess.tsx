import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Home, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = (location.state as { orderId?: string }) || {};

  // Si no hay orderId en el state, redirigir a la home
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <Card className="bg-white rounded-lg shadow-md overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-[#2851a3] font-playfair mb-4">
                ¡Pedido Confirmado!
              </h1>

              <p className="text-gray-600 max-w-md mb-6 font-playfair">
                Gracias por tu compra. Tu pedido #{orderId.slice(0, 8)} ha sido
                recibido y está siendo procesado.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg w-full max-w-lg mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 font-playfair">
                  Detalles de entrega
                </h2>
                <p className="text-gray-700 mb-1 font-playfair">
                  <strong>Lugar:</strong> Frikioteca - Calle Ejemplo 1234,
                  Ciudad
                </p>
                <p className="text-gray-700 mb-1 font-playfair">
                  <strong>Horarios:</strong> Lunes a Viernes 10hs a 19hs,
                  Sábados 10hs a 14hs
                </p>
                <p className="text-gray-600 mt-2 text-sm italic font-playfair">
                  Te contactaremos pronto para coordinar la entrega. Recibirás
                  un email con la confirmación.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="font-playfair"
                  onClick={() => navigate("/")}
                >
                  <Home className="h-4 w-4 mr-2" /> Volver al Inicio
                </Button>
                <Button
                  className="bg-[#2851a3] hover:bg-[#1a3e7e] font-playfair"
                  onClick={() => navigate("/productos")}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> Seguir Comprando
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
