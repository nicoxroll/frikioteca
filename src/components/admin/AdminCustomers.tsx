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
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Loader2,
  Plus,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useState } from "react";

// Add DNI to the Customer type
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dni?: string;
  orderCount?: number;
  totalSpent?: number;
};

type OrderSummary = {
  id: string;
  created_at: string;
  total: number;
  status: "pendiente" | "en_progreso" | "completado" | "cancelado";
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
};

const fetchCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from("customers")
    .select("*, orders(count)")
    .order("name");

  if (error) throw error;

  // Calculate order count and total spent for each customer
  const customersWithStats = await Promise.all(
    (data || []).map(async (customer) => {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("total")
        .eq("customer_id", customer.id);

      if (ordersError) throw ordersError;

      const totalSpent =
        orders?.reduce((sum, order) => sum + order.total, 0) || 0;
      const orderCount = customer.orders?.length || 0;

      return {
        ...customer,
        orderCount,
        totalSpent,
      };
    })
  );

  return customersWithStats || [];
};

const fetchCustomerOrders = async (
  customerId: string
): Promise<OrderSummary[]> => {
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, created_at, total, status")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (ordersError) throw ordersError;

  const ordersWithItems = await Promise.all(
    (orders || []).map(async (order) => {
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_products")
        .select("quantity, price, products(name)")
        .eq("order_id", order.id);

      if (itemsError) throw itemsError;

      return {
        ...order,
        items: (orderItems || []).map((item) => ({
          product_name: item.products.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    })
  );

  return ordersWithItems || [];
};

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Add state for new customer dialog
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<
    Omit<Customer, "id" | "orderCount" | "totalSpent">
  >({
    name: "",
    email: "",
    phone: "",
    dni: "",
  });
  const queryClient = useQueryClient();

  // Fetch customers from Supabase
  const {
    data: customers = [],
    isLoading: customersLoading,
    error: customersError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  // Fetch orders for selected customer
  const {
    data: customerOrders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["customerOrders", selectedCustomer],
    queryFn: () =>
      selectedCustomer
        ? fetchCustomerOrders(selectedCustomer)
        : Promise.resolve([]),
    enabled: !!selectedCustomer,
  });

  // Add mutation for creating new customer
  const createCustomerMutation = useMutation({
    mutationFn: async (
      customer: Omit<Customer, "id" | "orderCount" | "totalSpent">
    ) => {
      const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente agregado correctamente");
      setIsNewCustomerOpen(false);
      resetNewCustomerForm();
    },
    onError: (error) => {
      console.error("Error creating customer:", error);
      toast.error("Error al crear cliente");
    },
  });

  // Add handler functions for new customer
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  const resetNewCustomerForm = () => {
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      dni: "",
    });
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCustomer.name || !newCustomer.email) {
      toast.error("Por favor completa al menos el nombre y el email");
      return;
    }

    createCustomerMutation.mutate(newCustomer);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (customerId: string) => {
    setSelectedCustomer(customerId);
    setIsDetailsOpen(true);
  };

  const getSelectedCustomer = () => {
    return customers.find((c) => c.id === selectedCustomer);
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

  const getStatusBadge = (status: OrderSummary["status"]) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 border-yellow-300 text-yellow-700">
            Pendiente
          </Badge>
        );
      case "en_progreso":
        return (
          <Badge className="bg-blue-100 border-blue-300 text-blue-700">
            En Progreso
          </Badge>
        );
      case "completado":
        return (
          <Badge className="bg-green-100 border-green-300 text-green-700">
            Completado
          </Badge>
        );
      case "cancelado":
        return (
          <Badge className="bg-red-100 border-red-300 text-red-700">
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  if (customersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
      </div>
    );
  }

  if (customersError) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-red-500 font-playfair">
          Error al cargar clientes. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-playfair">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-playfair"
          />
        </div>
        <Button
          onClick={() => setIsNewCustomerOpen(true)}
          className="bg-[#2851a3] hover:bg-[#1a3e7e] text-white rounded-lg shadow-sm transition-colors duration-200 font-playfair"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Cliente
        </Button>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 font-playfair">
            No hay clientes que coincidan con tu búsqueda
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell>{customer.orderCount}</TableCell>
                  <TableCell>${customer.totalSpent}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(customer.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" /> Ver Pedidos
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg font-playfair">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-playfair">
              <User className="h-5 w-5" /> Pedidos del Cliente
            </DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-lg">
                  {getSelectedCustomer()?.name}
                </h3>
                <p className="text-gray-600">{getSelectedCustomer()?.email}</p>
                <p className="text-gray-600">
                  {getSelectedCustomer()?.phone || "-"}
                </p>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Este cliente aún no ha realizado pedidos
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium">Historial de Pedidos</h4>
                  {customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-md p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right font-medium">
                            ${order.total}
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3 space-y-1 text-sm">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.product_name}
                            </span>
                            <span>${item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Customer Dialog */}
      <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
        <DialogContent className="sm:max-w-md font-playfair">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-playfair">
              <User className="h-5 w-5" /> Nuevo Cliente
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCustomer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dni" className="text-right">
                  DNI (opcional)
                </Label>
                <Input
                  id="dni"
                  name="dni"
                  value={newCustomer.dni || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsNewCustomerOpen(false);
                  resetNewCustomerForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createCustomerMutation.isPending}>
                {createCustomerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Crear Cliente
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
