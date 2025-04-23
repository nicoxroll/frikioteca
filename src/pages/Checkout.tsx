import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2, MapPin, User, Wallet2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Define el esquema de validación para el formulario de cliente
const customerSchema = z.object({
  name: z.string().min(2, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z
    .string()
    .min(8, { message: "Teléfono debe tener al menos 8 dígitos" }),
  notes: z.string().optional(),
  paymentMethod: z.enum(["efectivo", "transferencia"], {
    required_error: "Selecciona un método de pago",
  }),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalPrice = getTotalPrice();

  // Si no hay items en el carrito, redirige a productos
  if (items.length === 0) {
    navigate("/productos");
    return null;
  }

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
      paymentMethod: "efectivo",
    },
  });

  const handleSubmitOrder = async (values: CustomerFormValues) => {
    setIsSubmitting(true);

    try {
      // 1. Crear cliente o encontrar existente
      const { data: existingCustomers } = await supabase
        .from("customers")
        .select("*")
        .eq("email", values.email);

      let customerId;

      if (existingCustomers && existingCustomers.length > 0) {
        customerId = existingCustomers[0].id;

        // Actualizar datos del cliente
        await supabase
          .from("customers")
          .update({
            name: values.name,
            phone: values.phone,
          })
          .eq("id", customerId);
      } else {
        // Crear nuevo cliente
        const { data: newCustomer, error: customerError } = await supabase
          .from("customers")
          .insert({
            name: values.name,
            email: values.email,
            phone: values.phone,
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // 2. Crear la orden
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,
          total: totalPrice,
          status: "pendiente",
          payment_method: values.paymentMethod,
          notes: values.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Crear los items de la orden
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_products")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Mostrar éxito y vaciar carrito
      toast.success("¡Pedido realizado con éxito!", {
        description: "Te contactaremos pronto para coordinar la entrega.",
      });

      clearCart();
      navigate("/order-success", { state: { orderId: orderData.id } });
    } catch (error) {
      console.error("Error al procesar la orden:", error);
      toast.error("Error al procesar tu pedido. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2851a3] font-playfair">
            Finalizar Compra
          </h1>
          <p className="text-gray-600 mt-2 font-playfair">
            Complete sus datos para procesar su pedido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de datos del cliente */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2851a3] font-playfair">
                  <User className="mr-2 h-5 w-5" /> Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmitOrder)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu nombre completo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="tu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Tu número de teléfono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas (Opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Añade notas o instrucciones especiales para tu pedido"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Wallet2 className="h-5 w-5 text-[#2851a3] mr-2" />
                        <h3 className="text-lg font-medium text-[#2851a3] font-playfair">
                          Método de Pago
                        </h3>
                      </div>

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                  <RadioGroupItem
                                    value="efectivo"
                                    id="efectivo"
                                  />
                                  <FormLabel
                                    htmlFor="efectivo"
                                    className="flex items-center cursor-pointer"
                                  >
                                    <Wallet2 className="h-4 w-4 mr-2 text-green-600" />
                                    Efectivo (al retirar)
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                  <RadioGroupItem
                                    value="transferencia"
                                    id="transferencia"
                                  />
                                  <FormLabel
                                    htmlFor="transferencia"
                                    className="flex items-center cursor-pointer"
                                  >
                                    <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                                    Transferencia Bancaria
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-[#2851a3] mr-2" />
                        <h3 className="text-lg font-medium text-[#2851a3] font-playfair">
                          Lugar de Entrega
                        </h3>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="font-medium">Retiro en Frikioteca</p>
                        <p className="text-gray-600">
                        Calle 10 n° 1267 e/ 58 y 59
                        </p>
                        <p className="text-gray-600 mt-2">
                          Horarios: Lunes a Viernes 10hs a 19hs, Sábados 10hs a
                          14hs
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/productos")}
                      >
                        <X className="h-4 w-4 mr-2" /> Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#2851a3] hover:bg-[#1a3e7e]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                            Procesando...
                          </>
                        ) : (
                          "Confirmar Pedido"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-[#2851a3] font-playfair">
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between pb-2 border-b"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="font-medium">
                            {item.quantity} x {item.name}
                          </p>
                        </div>
                      </div>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}

                  <div className="pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
