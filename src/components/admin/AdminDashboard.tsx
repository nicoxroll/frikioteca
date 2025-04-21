import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Constants for chart colors
const CHART_COLORS = {
  primary: "#2851a3",
  secondary: "#90cdf4",
  tertiary: "#4c9be8",
  quaternary: "#1a3e7e",
  success: "#48bb78",
  warning: "#ed8936",
  error: "#f56565",
  gradient: ["#2851a3", "#90cdf4"],
};

// Types for dashboard data
type OrderStats = {
  total: number;
  count: number;
  avgOrderValue: number;
  pendingCount: number;
  completedCount: number;
  canceledCount: number;
};

type TimeSeriesData = {
  date: string;
  value: number;
  count: number;
};

type CategoryData = {
  name: string;
  value: number;
  count: number;
};

type CustomerStats = {
  total: number;
  newCustomers: number;
  returningCustomers: number;
};

// Fetch dashboard statistics
const fetchDashboardStats = async (
  period: string
): Promise<{
  orderStats: OrderStats;
  timeSeriesData: TimeSeriesData[];
  categoryData: CategoryData[];
  customerStats: CustomerStats;
  topProducts: { name: string; value: number; count: number }[];
}> => {
  // Calculate date range based on period
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case "day":
      startDate.setDate(now.getDate() - 1);
      break;
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1); // Default to month
  }

  // Format dates for Supabase query
  const startDateStr = startDate.toISOString();

  // Fetch order statistics
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .gte("created_at", startDateStr);

  if (orderError) throw orderError;

  // Fetch product categories data
  const { data: productData, error: productError } = await supabase
    .from("order_products")
    .select(
      `
      id,
      quantity, 
      price, 
      products(name, category),
      orders!inner(created_at)
    `
    )
    .gte("orders.created_at", startDateStr);

  if (productError) throw productError;

  // Fetch customer data
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .select("id, created_at");

  if (customerError) throw customerError;

  // Calculate order statistics
  const orders = orderData || [];
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = orders.length;
  const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

  const pendingCount = orders.filter(
    (order) => order.status === "pendiente"
  ).length;
  const completedCount = orders.filter(
    (order) => order.status === "completado"
  ).length;
  const canceledCount = orders.filter(
    (order) => order.status === "cancelado"
  ).length;

  // Prepare time series data based on the selected period
  const timeSeriesData: TimeSeriesData[] = [];

  if (orders.length > 0) {
    // Group data by appropriate time unit
    const dateFormat =
      period === "day"
        ? "hour"
        : period === "week"
        ? "day"
        : period === "month"
        ? "day"
        : "month";

    const groupedByDate = orders.reduce(
      (acc: { [key: string]: { value: number; count: number } }, order) => {
        const date = new Date(order.created_at);
        let key;

        if (dateFormat === "hour") {
          key = `${date.getHours()}:00`;
        } else if (dateFormat === "day") {
          key = `${date.getDate()}/${date.getMonth() + 1}`;
        } else {
          key = new Intl.DateTimeFormat("es-ES", { month: "short" }).format(
            date
          );
        }

        if (!acc[key]) {
          acc[key] = { value: 0, count: 0 };
        }

        acc[key].value += order.total;
        acc[key].count += 1;

        return acc;
      },
      {}
    );

    // Convert to array format for charts
    Object.entries(groupedByDate).forEach(([date, data]) => {
      timeSeriesData.push({
        date,
        value: data.value,
        count: data.count,
      });
    });

    // Sort by date if needed
    timeSeriesData.sort((a, b) => {
      if (dateFormat === "hour") {
        return parseInt(a.date) - parseInt(b.date);
      }
      return 0; // For other formats, might need more complex sorting
    });
  }

  // Calculate category data
  const categoryMap = new Map<string, { value: number; count: number }>();

  productData?.forEach((item) => {
    const category = item.products?.category || "Otro";
    const value = item.price * item.quantity;

    if (!categoryMap.has(category)) {
      categoryMap.set(category, { value: 0, count: 0 });
    }

    const current = categoryMap.get(category)!;
    categoryMap.set(category, {
      value: current.value + value,
      count: current.count + item.quantity,
    });
  });

  const categoryData: CategoryData[] = Array.from(categoryMap)
    .map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count,
    }))
    .sort((a, b) => b.value - a.value);

  // Top products calculation
  const productMap = new Map<string, { value: number; count: number }>();

  productData?.forEach((item) => {
    const name = item.products?.name || "Desconocido";
    const value = item.price * item.quantity;

    if (!productMap.has(name)) {
      productMap.set(name, { value: 0, count: 0 });
    }

    const current = productMap.get(name)!;
    productMap.set(name, {
      value: current.value + value,
      count: current.count + item.quantity,
    });
  });

  const topProducts = Array.from(productMap)
    .map(([name, data]) => ({ name, value: data.value, count: data.count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Customer statistics
  const newCustomers =
    customerData?.filter((c) => {
      const createdAt = new Date(c.created_at);
      return createdAt >= startDate;
    }).length || 0;

  // For returning customers, we'd need order history
  // This is a simplified version
  const returningCustomers = 0; // Would need more complex logic with order history

  return {
    orderStats: {
      total: totalSales,
      count: orderCount,
      avgOrderValue,
      pendingCount,
      completedCount,
      canceledCount,
    },
    timeSeriesData,
    categoryData,
    customerStats: {
      total: customerData?.length || 0,
      newCustomers,
      returningCustomers,
    },
    topProducts,
  };
};

// Main dashboard component
const AdminDashboard = () => {
  const [timePeriod, setTimePeriod] = useState<string>("month");

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", timePeriod],
    queryFn: () => fetchDashboardStats(timePeriod),
  });

  // Conditional formatting based on data
  const getTrendIndicator = (value: number) => {
    if (value > 0)
      return <TrendingUp className="ml-2 h-4 w-4 text-green-500" />;
    return null;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-[#2851a3]">{formatCurrency(payload[0].value)}</p>
          <p className="text-gray-500">{payload[0].payload.count} pedidos</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font-playfair">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#2851a3]">Dashboard</h1>

        <div className="flex items-center">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Último día</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ventas Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#2851a3]" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold text-[#2851a3]">
                {formatCurrency(data?.orderStats.total || 0)}
                {getTrendIndicator(5)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pedidos
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#2851a3]" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold text-[#2851a3]">
                {data?.orderStats.count || 0}
                {getTrendIndicator(3)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Valor Promedio
            </CardTitle>
            <CreditCard className="h-4 w-4 text-[#2851a3]" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold text-[#2851a3]">
                {formatCurrency(data?.orderStats.avgOrderValue || 0)}
                {getTrendIndicator(2)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-[#2851a3]" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold text-[#2851a3]">
                {data?.customerStats.total || 0}
                <span className="text-xs text-green-500 ml-2 font-normal">
                  (+{data?.customerStats.newCustomers || 0} nuevos)
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Estado de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge className="bg-yellow-100 border-yellow-300 text-yellow-700 mr-2">
                      Pendiente
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">
                    {data?.orderStats.pendingCount || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge className="bg-green-100 border-green-300 text-green-700 mr-2">
                      Completado
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">
                    {data?.orderStats.completedCount || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge className="bg-red-100 border-red-300 text-red-700 mr-2">
                      Cancelado
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">
                    {data?.orderStats.canceledCount || 0}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ventas por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : data?.categoryData && data.categoryData.length > 0 ? (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {data.categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              CHART_COLORS.primary,
                              CHART_COLORS.secondary,
                              CHART_COLORS.tertiary,
                              CHART_COLORS.quaternary,
                              CHART_COLORS.success,
                            ][index % 5]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex justify-center items-center h-[200px] text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Tendencia de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : data?.timeSeriesData && data.timeSeriesData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart
                  data={data.timeSeriesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS.primary}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[300px] text-gray-500">
              No hay datos disponibles para este periodo
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Productos Más Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : data?.topProducts && data.topProducts.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={data.topProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar
                    dataKey="value"
                    fill={CHART_COLORS.primary}
                    radius={[0, 4, 4, 0]}
                  >
                    {data.topProducts.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS.primary}
                        fillOpacity={
                          (data.topProducts.length - index) /
                          data.topProducts.length
                        }
                      />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[250px] text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
