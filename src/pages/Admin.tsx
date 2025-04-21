import AdminAuth from "@/components/admin/AdminAuth";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminProducts from "@/components/admin/AdminProducts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  const handleBack = () => {
    navigate("/");
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-playfair">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              className="mr-4 font-playfair"
            >
              Volver al Inicio
            </Button>
            <h1 className="text-2xl font-bold text-[#2851a3] font-playfair">
              Panel de Administración
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 transition-colors duration-200 font-playfair"
          >
            Cerrar Sesión
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 font-playfair">
            <TabsTrigger value="dashboard" className="font-playfair">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="font-playfair">
              Productos
            </TabsTrigger>
            <TabsTrigger value="orders" className="font-playfair">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="customers" className="font-playfair">
              Clientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrders />
          </TabsContent>

          <TabsContent value="customers">
            <AdminCustomers />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
