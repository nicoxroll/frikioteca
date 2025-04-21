
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Coffee, Lock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const AdminAuth = ({ onAuthenticated }: AdminAuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For simplicity, we'll just check if it's our admin email/password
      // In a production app, you would use proper authentication
      if (email === "admin@manacafe.com" && password === "admin123!") {
        localStorage.setItem("adminAuth", "true");
        onAuthenticated();
        toast.success("Acceso concedido");
      } else {
        toast.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Error de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Coffee className="h-12 w-12 text-[#2851a3]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#2851a3] font-playfair">
            Panel de Administración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="font-playfair text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Email de administrador"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="font-playfair text-gray-700">Contraseña</label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña de administrador"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#2851a3] hover:bg-[#1a3e7e]"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Acceder"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
