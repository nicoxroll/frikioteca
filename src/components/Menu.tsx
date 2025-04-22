import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const menuItems = {
  "Café de Especialidad": {
    items: ["Latte", "Doppio", "Cappuccino", "Flat White", "Long Black"],
    image: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg",
  },
  "Café Frío": {
    items: ["Iced Coffee", "Iced Latte", "Espresso Tonic"],
    image: "https://images.pexels.com/photos/885021/pexels-photo-885021.jpeg",
  },
  Especiales: {
    items: ["Golden", "Chai", "Cacao", "Matcha", "Pink"],
    image: "https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg",
  },
  "Panadería Dulce": {
    items: ["Dulce", "Roll de Canela", "Cookie de Chips", "Medialunas"],
    image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
  },
  "Panadería Salado": {
    items: ["Tostados", "Chipá"],
    image: "https://images.pexels.com/photos/2280545/pexels-photo-2280545.jpeg",
  },
};

const Menu = () => {
  const navigate = useNavigate();

  // Navigation function with scroll to top
  const navigateToCarta = () => {
    navigate("/carta");
    window.scrollTo(0, 0);
  };

  return (
    <section id="menu" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#2851a3] mb-12 font-playfair">
          Nuestro Menú
        </h2>
        <p className="text-center text-gray-600 mb-8 font-playfair">
          Todo nuestro menú es 100% de elaboración propia
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(menuItems).map(
            ([category, { items, image }], index) => (
              <Card
                key={category}
                className="shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group opacity-0 animate-fade-up animate-fill-forwards"
                style={{
                  animationDelay: `${index * 150 + 200}ms`,
                }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={image}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-[#2851a3] font-playfair">
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="inline-block bg-blue-100 text-frikioteca-blue dark:text-blue-300 rounded-full px-3 py-1 text-sm font-playfair border border-[#2851a3]/20 hover:bg-blue-200 transition-colors duration-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>

        <div className="text-center mt-12 opacity-0 animate-fade-up animate-fill-forwards animate-delay-400">
          <Button
            className="bg-[#2851a3] hover:bg-[#1a3e7e] font-playfair text-lg px-8 py-6"
            onClick={navigateToCarta}
          >
            Ver Carta Completa
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
