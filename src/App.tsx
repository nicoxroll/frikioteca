import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Carrito from "./pages/Carrito";
import Carta from "./pages/Carta";
import Checkout from "./pages/Checkout";
import EventosPage from "./pages/Eventos";
import Index from "./pages/Index";
import NosotrosPage from "./pages/Nosotros";
import NotFound from "./pages/NotFound";
import OrderSuccess from "./pages/OrderSuccess";
import Productos from "./pages/Productos";
import { ThemeProvider } from "./providers/ThemeProvider";
import { CartProvider } from "./providers/cart-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/carta" element={<Carta />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
