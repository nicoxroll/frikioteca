import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/use-cart";
import {
  CheckCircle,
  ChevronRight,
  MinusCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LOCATIONS = [
  { id: "sede1", name: "Sede Principal", address: "Av. Corrientes 1234, CABA" },
  { id: "sede2", name: "Sede Palermo", address: "Thames 1450, CABA" },
  { id: "sede3", name: "Sede Belgrano", address: "Av. Cabildo 1567, CABA" },
];

const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", description: "Pago en efectivo al retirar" },
  {
    id: "transfer",
    name: "Transferencia",
    description: "Transferencia bancaria previa",
  },
];

type CustomerData = {
  name: string;
  email: string;
  phone: string;
  dni: string;
  address: string;
  notes: string;
};

const Carrito = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    dni: "",
    address: "", // We'll keep this in the state but remove it from the UI
    notes: "",
  });
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].id);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCustomerDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCustomerData = () => {
    if (!customerData.name || !customerData.email || !customerData.phone) {
      toast({
        title: "Información incompleta",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de continuar",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2 && !validateCustomerData()) {
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmitOrder = () => {
    // Here you would normally send the order to your backend
    toast({
      title: "¡Pedido realizado!",
      description: "Tu pedido ha sido recibido correctamente",
    });

    // Clear cart and redirect to home
    clearCart();
    navigate("/");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this to your backend or newsletter service
    setIsSubscribed(true);
    toast({
      title: "¡Gracias por suscribirte!",
      description: "Recibirás nuestras novedades en tu correo.",
    });
  };

  // Determine if we can proceed to the next step
  const canProceed = () => {
    if (currentStep === 1) return items.length > 0;
    if (currentStep === 2)
      return customerData.name && customerData.email && customerData.phone;
    if (currentStep === 3) return selectedLocation;
    return true;
  };

  // Define steps with their labels
  const steps = [
    { number: 1, label: "Carrito" },
    { number: 2, label: "Datos del Cliente" },
    { number: 3, label: "Entrega" },
    { number: 4, label: "Método de Pago" },
  ];

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update the navigation function
  const navigateToProduct = (productId: string) => {
    navigate(`/producto/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      {/* Hero section with parallax background */}
      <div className="relative flex items-center justify-center h-[40vh] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/31680068/pexels-photo-31680068.jpeg")`,
            backgroundAttachment: "fixed",
            transform: `translateY(${scrollPosition * 0.15}px)`,
          }}
        ></div>
        {/* Semi-transparent overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        <div className="relative z-10 text-center px-4 py-10 opacity-0 animate-fade-up animate-fill-forwards animate-delay-200">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-shadow">
            <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              Mi Carrito
            </span>
          </h1>
          <p className="text-xl text-white font-playfair drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] max-w-3xl mx-auto mb-8">
            Revisa tus productos y completa el proceso de compra
          </p>

          {/* Removed newsletter subscription form from here */}
        </div>
      </div>

      <main className="flex-1 pt-12 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Steps indicator */}
          <div className="mb-8 mt-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto relative">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                      step.number === currentStep
                        ? "bg-[#2851a3]"
                        : step.number < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <CheckCircle size={20} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 ${
                      step.number === currentStep ? "font-bold" : ""
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}

              {/* Horizontal connector line - now a single element behind the step indicators */}
              <div className="absolute h-0.5 bg-gray-200 top-5 left-0 right-0 z-0"></div>
            </div>

            {/* Removed the progress line section that was here */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main content area - changes based on the current step */}
            <div className="md:col-span-2 space-y-8">
              {/* Step 1: Cart Contents */}
              {currentStep === 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 font-playfair">
                    Productos en tu carrito
                  </h2>
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4 font-playfair">
                        Tu carrito está vacío
                      </p>
                      <Button
                        onClick={() => navigate("/productos")}
                        className="bg-[#2851a3] hover:bg-[#1a3e7e]"
                      >
                        Ver Productos
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <Card
                          key={item.id}
                          className="p-4 mb-4 flex items-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border dark:border-gray-700"
                          onClick={() => navigateToProduct(item.id)}
                        >
                          <div className="h-16 w-16 mr-4 overflow-hidden rounded">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-gray-500">${item.price}</p>
                          </div>
                          <div
                            className="flex items-center space-x-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                          <div
                            className="text-right ml-4 w-24"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="font-semibold">
                              ${item.price * item.quantity}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="text-xs">Eliminar</span>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Customer Information */}
              {currentStep === 2 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 font-playfair">
                    Datos del Cliente
                  </h2>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={customerData.name}
                          onChange={handleCustomerDataChange}
                          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={customerData.email}
                          onChange={handleCustomerDataChange}
                          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={customerData.phone}
                          onChange={handleCustomerDataChange}
                          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                          id="dni"
                          name="dni"
                          value={customerData.dni}
                          onChange={handleCustomerDataChange}
                          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        />
                      </div>
                    </div>
                    {/* Address field has been removed */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas adicionales</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={customerData.notes}
                        onChange={handleCustomerDataChange}
                        placeholder="Instrucciones especiales, alergias, etc."
                        className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Delivery Location */}
              {currentStep === 3 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 font-playfair">
                    Selecciona Ubicación para Retirar
                  </h2>
                  <RadioGroup
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                    className="space-y-4"
                  >
                    {LOCATIONS.map((location) => (
                      <div
                        key={location.id}
                        className={`flex items-start space-x-3 border p-4 rounded-md cursor-pointer ${
                          selectedLocation === location.id
                            ? "border-[#2851a3] bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                        onClick={() => setSelectedLocation(location.id)}
                      >
                        <RadioGroupItem
                          value={location.id}
                          id={location.id}
                          className="mt-1"
                        />
                        <div className="grid gap-1">
                          <Label
                            htmlFor={location.id}
                            className="font-medium cursor-pointer"
                          >
                            {location.name}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {location.address}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-2">Horarios de atención</h3>
                    <p className="text-sm text-gray-500">
                      Lunes a Viernes: 8:00 - 20:00
                      <br />
                      Sábados: 9:00 - 18:00
                      <br />
                      Domingos: 10:00 - 15:00
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Payment Method */}
              {currentStep === 4 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 font-playfair">
                    Método de Pago
                  </h2>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-start space-x-3 border p-4 rounded-md cursor-pointer ${
                          paymentMethod === method.id
                            ? "border-[#2851a3] bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <RadioGroupItem
                          value={method.id}
                          id={method.id}
                          className="mt-1"
                        />
                        <div className="grid gap-1">
                          <Label
                            htmlFor={method.id}
                            className="font-medium cursor-pointer"
                          >
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  {paymentMethod === "transfer" && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md border">
                      <h3 className="font-medium mb-2">
                        Datos para la transferencia
                      </h3>
                      <p className="text-sm text-gray-700">
                        <span className="block">
                          <strong>Banco:</strong> Banco Nación
                        </span>
                        <span className="block">
                          <strong>Titular:</strong> Frikioteca S.A.
                        </span>
                        <span className="block">
                          <strong>CUIT:</strong> 30-71234567-8
                        </span>
                        <span className="block">
                          <strong>CBU:</strong> 0110012345678901234567
                        </span>
                        <span className="block">
                          <strong>Alias:</strong> FRIKIO.CAFE.TIENDA
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Enviar comprobante al email: pagos@frikioteca.com
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Atrás
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button
                    className="ml-auto bg-[#2851a3] hover:bg-[#1a3e7e]"
                    onClick={handleNextStep}
                    disabled={!canProceed()}
                  >
                    Continuar <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="ml-auto bg-green-600 hover:bg-green-700"
                    onClick={handleSubmitOrder}
                  >
                    Finalizar compra
                  </Button>
                )}
              </div>
            </div>

            {/* Order summary - always visible on the right */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-24">
                <h2 className="text-lg font-semibold mb-4 font-playfair">
                  Resumen del Pedido
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      Subtotal (
                      {items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      productos)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      $
                      {items
                        .reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>

                  {/* Can add tax, shipping, etc. here if needed */}

                  <Separator className="dark:bg-gray-700" />

                  <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>
                      $
                      {items
                        .reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Show order details as they are completed with animations */}
                {currentStep >= 2 && (
                  <div
                    className="mt-6 text-sm space-y-4 opacity-0 animate-fade-up animate-fill-forwards"
                    style={{ animationDuration: "0.3s" }}
                  >
                    <Separator />
                    <div>
                      <h3 className="font-medium text-[#2851a3] dark:text-blue-400">
                        Datos del cliente
                      </h3>
                      {currentStep >= 2 && customerData.name ? (
                        <div className="mt-1 space-y-1 text-gray-600 dark:text-gray-300">
                          <p>{customerData.name}</p>
                          <p>{customerData.email}</p>
                          <p>{customerData.phone}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Pendiente</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep >= 3 && (
                  <div
                    className="mt-4 text-sm opacity-0 animate-fade-up animate-fill-forwards"
                    style={{
                      animationDuration: "0.3s",
                      animationDelay: "0.1s",
                    }}
                  >
                    <h3 className="font-medium text-[#2851a3] dark:text-blue-400">
                      Retirar en
                    </h3>
                    {currentStep >= 3 && selectedLocation ? (
                      <div className="mt-1 text-gray-600 dark:text-gray-300">
                        <p>
                          {
                            LOCATIONS.find((l) => l.id === selectedLocation)
                              ?.name
                          }
                        </p>
                        <p className="text-xs">
                          {
                            LOCATIONS.find((l) => l.id === selectedLocation)
                              ?.address
                          }
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">Pendiente</p>
                    )}
                  </div>
                )}

                {currentStep >= 4 && (
                  <div
                    className="mt-4 text-sm opacity-0 animate-fade-up animate-fill-forwards"
                    style={{
                      animationDuration: "0.3s",
                      animationDelay: "0.2s",
                    }}
                  >
                    <h3 className="font-medium text-[#2851a3] dark:text-blue-400">
                      Método de pago
                    </h3>
                    {currentStep >= 4 && paymentMethod ? (
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        {
                          PAYMENT_METHODS.find((m) => m.id === paymentMethod)
                            ?.name
                        }
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">Pendiente</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Carrito;
