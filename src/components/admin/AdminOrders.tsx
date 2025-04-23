import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  Check,
  Clock,
  FileText,
  Loader2,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customer_id: string;
  customer_name?: string;
  items?: OrderItem[];
  total: number;
  status: "pendiente" | "en_progreso" | "completado" | "cancelado";
  created_at: string;
};

// New type for the new order form
type NewOrderItem = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
};

type NewCustomer = {
  name: string;
  email: string;
  phone: string;
  dni?: string; // Add optional DNI field
};

const fetchOrders = async (): Promise<Order[]> => {
  // Get orders with customer names
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      customer_id,
      total,
      status,
      created_at,
      customers(name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Format orders with customer names
  const formattedOrders = (orders || []).map((order) => ({
    id: order.id,
    customer_id: order.customer_id,
    customer_name: order.customers?.name || "Unknown",
    total: order.total,
    status: order.status as
      | "pendiente"
      | "en_progreso"
      | "completado"
      | "cancelado",
    created_at: order.created_at,
  }));

  return formattedOrders;
};

const fetchOrderDetails = async (
  orderId: string
): Promise<Order & { items: OrderItem[] }> => {
  // Get basic order info
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id, 
      customer_id,
      total,
      status,
      created_at,
      customers(name)
    `
    )
    .eq("id", orderId)
    .single();

  if (error) throw error;

  // Get order items
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_products")
    .select(
      `
      id,
      quantity,
      price,
      products(name)
    `
    )
    .eq("order_id", orderId);

  if (itemsError) throw itemsError;

  // Format order with items
  const formattedOrder = {
    id: order.id,
    customer_id: order.customer_id,
    customer_name: order.customers?.name || "Unknown",
    total: order.total,
    status: order.status as
      | "pendiente"
      | "en_progreso"
      | "completado"
      | "cancelado",
    created_at: order.created_at,
    items: (orderItems || []).map((item) => ({
      id: item.id,
      product_name: item.products.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  return formattedOrder;
};

// Add fetchCustomers function
const fetchCustomers = async (): Promise<
  { id: string; name: string; email: string; phone: string }[]
> => {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email, phone")
    .order("name");

  if (error) throw error;
  return data || [];
};

// Add fetchProducts function
const fetchProducts = async (): Promise<
  { id: string; name: string; price: number; category: string }[]
> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, category")
    .order("category", { ascending: true });

  if (error) throw error;
  return data || [];
};

const AdminOrders = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  // New state for the new order dialog
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<NewOrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerOption, setCustomerOption] = useState<
    "existing" | "new" | "none"
  >("none");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch all orders
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // Fetch single order details
  const { data: selectedOrder, isLoading: detailsLoading } = useQuery({
    queryKey: ["order", selectedOrderId],
    queryFn: () =>
      selectedOrderId
        ? fetchOrderDetails(selectedOrderId)
        : Promise.resolve(null),
    enabled: !!selectedOrderId,
  });

  // Add queries for customers and products
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    enabled: isNewOrderOpen, // Only fetch when dialog is open
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    enabled: isNewOrderOpen, // Only fetch when dialog is open
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Order["status"];
    }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", selectedOrderId] });
      toast.success("Estado del pedido actualizado");
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
      toast.error("Error al actualizar el estado del pedido");
    },
  });

  // Create new order mutation
  const createOrderMutation = useMutation({
    mutationFn: async ({
      customerId,
      items,
      total,
      newCustomer,
    }: {
      customerId: string | null;
      items: NewOrderItem[];
      total: number;
      newCustomer?: NewCustomer;
    }) => {
      // First create a new customer if needed
      let finalCustomerId = customerId;

      if (!customerId && newCustomer) {
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .insert([newCustomer])
          .select()
          .single();

        if (customerError) throw customerError;
        finalCustomerId = customerData.id;
      }

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_id: finalCustomerId,
            total,
            status: "pendiente",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
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

      return orderData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido creado correctamente");
      setIsNewOrderOpen(false);
      resetNewOrderForm();
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Error al crear el pedido");
    },
  });

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 border-yellow-300 text-yellow-700 px-2 py-1">
            <Clock className="h-3 w-3 mr-1 inline" /> Pendiente
          </Badge>
        );
      case "en_progreso":
        return (
          <Badge className="bg-blue-100 border-blue-300 text-blue-700 px-2 py-1">
            <Truck className="h-3 w-3 mr-1 inline" /> En Progreso
          </Badge>
        );
      case "completado":
        return (
          <Badge className="bg-green-100 border-green-300 text-green-700 px-2 py-1">
            <Check className="h-3 w-3 mr-1 inline" /> Completado
          </Badge>
        );
      case "cancelado":
        return (
          <Badge className="bg-red-100 border-red-300 text-red-700 px-2 py-1">
            <X className="h-3 w-3 mr-1 inline" /> Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsOpen(true);
  };

  // Helper functions for the new order form
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product: {
    id: string;
    name: string;
    price: number;
  }) => {
    const existing = selectedProducts.find((item) => item.id === product.id);

    if (existing) {
      setSelectedProducts(
        selectedProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((item) => item.id !== productId)
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectedProducts(
      selectedProducts.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const resetNewOrderForm = () => {
    setSelectedProducts([]);
    setCustomerOption("none");
    setSelectedCustomerId(null);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
    });
    setSearchTerm("");
  };

  const handleCreateOrder = () => {
    if (selectedProducts.length === 0) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }

    const total = calculateTotal();

    if (customerOption === "existing" && !selectedCustomerId) {
      toast.error("Debe seleccionar un cliente");
      return;
    }

    if (customerOption === "new" && !newCustomer.name) {
      toast.error("Debe ingresar al menos el nombre del cliente");
      return;
    }

    createOrderMutation.mutate({
      customerId: customerOption === "existing" ? selectedCustomerId : null,
      items: selectedProducts,
      total,
      newCustomer: customerOption === "new" 
        ? newCustomer 
        : customerOption === "none" 
          ? { name: "Cliente sin registrar", email: "sin_registro@frikioteca.com", phone: "" } 
          : undefined,
    });
  };

  const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-red-500 font-playfair">
          Error al cargar pedidos. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-playfair">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
            className="font-playfair"
          >
            Todos
          </Button>
          <Button
            variant={filter === "pendiente" ? "default" : "outline"}
            onClick={() => setFilter("pendiente")}
            size="sm"
            className={
              filter === "pendiente" ? "bg-yellow-600 hover:bg-yellow-700" : ""
            }
          >
            <Clock className="h-4 w-4 mr-1" /> Pendientes
          </Button>
          <Button
            variant={filter === "en_progreso" ? "default" : "outline"}
            onClick={() => setFilter("en_progreso")}
            size="sm"
            className={
              filter === "en_progreso" ? "bg-blue-600 hover:bg-blue-700" : ""
            }
          >
            <Truck className="h-4 w-4 mr-1" /> En Progreso
          </Button>
          <Button
            variant={filter === "completado" ? "default" : "outline"}
            onClick={() => setFilter("completado")}
            size="sm"
            className={
              filter === "completado" ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            <Check className="h-4 w-4 mr-1" /> Completados
          </Button>
          <Button
            variant={filter === "cancelado" ? "default" : "outline"}
            onClick={() => setFilter("cancelado")}
            size="sm"
            className={
              filter === "cancelado" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            <X className="h-4 w-4 mr-1" /> Cancelados
          </Button>
        </div>
        <Button
          onClick={() => setIsNewOrderOpen(true)}
          className="bg-[#2851a3] hover:bg-[#1a3e7e] text-white rounded-lg shadow-sm transition-colors duration-200 font-playfair"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Pedido
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 font-playfair">
            No hay pedidos que coincidan con tu filtro
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" /> Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
        <DialogContent className="sm:max-w-4xl font-playfair">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-playfair">
              <ShoppingCart className="h-5 w-5" /> Nuevo Pedido
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left panel - Product selection */}
            <div className="md:col-span-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
                </div>
              ) : (
                <div className="border rounded-md max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            No se encontraron productos
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddProduct(product)}
                              >
                                <Plus className="h-4 w-4 mr-1" /> Agregar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Right panel - Order summary */}
            <div className="space-y-6 border-t md:border-t-0 md:border-l pt-4 md:pl-4 md:pt-0">
              <div>
                <h3 className="font-medium mb-2">Resumen del Pedido</h3>
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-4 border rounded-md">
                    <ShoppingCart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      No hay productos seleccionados
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">
                            ${item.price} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 text-center"
                            min={1}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProduct(item.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center font-medium text-lg pt-2">
                      <span>Total:</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Cliente</h3>
                <Tabs
                  value={customerOption}
                  onValueChange={(v) => setCustomerOption(v as any)}
                >
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="none">Sin Cliente</TabsTrigger>
                    <TabsTrigger value="existing">Existente</TabsTrigger>
                    <TabsTrigger value="new">Nuevo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="none" className="pt-4">
                    <p className="text-sm text-gray-500">
                      El pedido se creará sin asociarse a un cliente.
                    </p>
                  </TabsContent>
                  <TabsContent value="existing" className="pt-4">
                    {customersLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 text-[#2851a3] animate-spin" />
                      </div>
                    ) : customers.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No hay clientes registrados
                      </p>
                    ) : (
                      <Select
                        value={selectedCustomerId || ""}
                        onValueChange={setSelectedCustomerId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} - {customer.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TabsContent>
                  <TabsContent value="new" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newCustomer.name}
                        onChange={handleNewCustomerChange}
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={handleNewCustomerChange}
                        placeholder="Email del cliente"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newCustomer.phone}
                        onChange={handleNewCustomerChange}
                        placeholder="Teléfono del cliente"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI (opcional)</Label>
                      <Input
                        id="dni"
                        name="dni"
                        value={newCustomer.dni || ""}
                        onChange={handleNewCustomerChange}
                        placeholder="DNI del cliente"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsNewOrderOpen(false);
                resetNewOrderForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCreateOrder}
              disabled={
                selectedProducts.length === 0 || createOrderMutation.isPending
              }
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Crear Pedido
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto font-playfair">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-playfair">
              <FileText className="h-5 w-5" /> Detalles del Pedido
            </DialogTitle>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
            </div>
          ) : (
            selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <CalendarClock className="h-4 w-4 mr-1" /> Fecha
                    </p>
                    <p className="font-medium">
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <User className="h-4 w-4 mr-1" /> Cliente
                    </p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Productos</p>
                  <div className="bg-gray-50 rounded-md p-3 space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.product_name}
                        </span>
                        <span>${item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-bold flex justify-between">
                      <span>Total</span>
                      <span>${selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Estado</p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={
                        selectedOrder.status === "pendiente"
                          ? "default"
                          : "outline"
                      }
                      className={
                        selectedOrder.status === "pendiente"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : ""
                      }
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, "pendiente")
                      }
                    >
                      <Clock className="h-4 w-4 mr-1" /> Pendiente
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedOrder.status === "en_progreso"
                          ? "default"
                          : "outline"
                      }
                      className={
                        selectedOrder.status === "en_progreso"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : ""
                      }
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, "en_progreso")
                      }
                    >
                      <Truck className="h-4 w-4 mr-1" /> En Progreso
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedOrder.status === "completado"
                          ? "default"
                          : "outline"
                      }
                      className={
                        selectedOrder.status === "completado"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, "completado")
                      }
                    >
                      <Check className="h-4 w-4 mr-1" /> Completado
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedOrder.status === "cancelado"
                          ? "default"
                          : "outline"
                      }
                      className={
                        selectedOrder.status === "cancelado"
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, "cancelado")
                      }
                    >
                      <X className="h-4 w-4 mr-1" /> Cancelado
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
