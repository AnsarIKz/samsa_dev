"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Order {
  "Customer Name": string;
  "Product Name": string;
  Quantity: number;
  "Total Amount": number;
  Date: string;
  Status: string;
}

interface Sale {
  "Product Name": string;
  Quantity: number;
  "Total Amount": number;
  Date: string;
}

interface CustomerStats {
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  favoriteProduct: string;
  status: "active" | "inactive";
}

export default function CustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<CustomerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        const [ordersRes, salesRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/sales"),
        ]);

        const [ordersData, salesData] = await Promise.all([
          ordersRes.json(),
          salesRes.json(),
        ]);

        setOrders(ordersData);
        setSales(salesData);

        // Process customer statistics
        const customerMap = new Map<string, CustomerStats>();

        // Process orders
        ordersData.forEach((order: Order) => {
          const customerName = order["Customer Name"];
          if (!customerName) return;

          if (!customerMap.has(customerName)) {
            customerMap.set(customerName, {
              name: customerName,
              totalOrders: 0,
              totalSpent: 0,
              lastOrderDate: order.Date,
              favoriteProduct: order["Product Name"],
              status: "active",
            });
          }

          const customer = customerMap.get(customerName)!;
          customer.totalOrders++;
          customer.totalSpent += order["Total Amount"] || 0;

          if (new Date(order.Date) > new Date(customer.lastOrderDate)) {
            customer.lastOrderDate = order.Date;
          }
        });

        // Determine status based on last order date
        customerMap.forEach((customer) => {
          const daysSinceLastOrder = Math.floor(
            (Date.now() - new Date(customer.lastOrderDate).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          customer.status = daysSinceLastOrder > 30 ? "inactive" : "active";
        });

        setCustomers(Array.from(customerMap.values()));
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerData();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (order) =>
      order["Customer Name"]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order["Product Name"]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue =
    customers.length > 0
      ? totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0)
      : 0;

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Клиенты</h1>
            <p className="text-gray-600">Управление клиентской базой</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Клиенты</h1>
          <p className="text-gray-600">Управление клиентской базой</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-700">
                {customers.length}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Всего клиентов
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-700">
                {activeCustomers}
              </div>
              <div className="text-sm text-green-600 font-medium">
                Активных клиентов
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-700">
                ₽{totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-purple-600 font-medium">
                Общая выручка
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-700">
                ₽{Math.round(avgOrderValue).toLocaleString()}
              </div>
              <div className="text-sm text-orange-600 font-medium">
                Средний чек
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Поиск клиентов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customers Table */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>База клиентов</CardTitle>
              <CardDescription>
                Информация о всех клиентах и их заказах
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">Клиент</th>
                      <th className="text-right p-3 font-medium">Заказов</th>
                      <th className="text-right p-3 font-medium">Потрачено</th>
                      <th className="text-left p-3 font-medium">
                        Последний заказ
                      </th>
                      <th className="text-center p-3 font-medium">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{customer.name}</td>
                        <td className="p-3 text-right">
                          {customer.totalOrders}
                        </td>
                        <td className="p-3 text-right font-medium">
                          ₽{customer.totalSpent.toLocaleString()}
                        </td>
                        <td className="p-3">
                          {new Date(customer.lastOrderDate).toLocaleDateString(
                            "ru"
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <Badge
                            variant={
                              customer.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {customer.status === "active"
                              ? "Активный"
                              : "Неактивный"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredCustomers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Клиенты не найдены
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Топ клиенты</CardTitle>
              <CardDescription>По общей сумме покупок</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers
                  .sort((a, b) => b.totalSpent - a.totalSpent)
                  .slice(0, 5)
                  .map((customer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.totalOrders} заказов
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ₽{customer.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          ₽
                          {Math.round(
                            customer.totalSpent / customer.totalOrders
                          ).toLocaleString()}{" "}
                          средний чек
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Последние заказы</CardTitle>
              <CardDescription>Недавняя активность клиентов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredOrders.slice(0, 10).map((order, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {order["Customer Name"]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order["Product Name"]} × {order.Quantity}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <span>
                            {new Date(order.Date).toLocaleDateString("ru")}
                          </span>
                          <Badge
                            variant={
                              order.Status === "Completed"
                                ? "default"
                                : order.Status === "Pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {order.Status === "Completed"
                              ? "Выполнен"
                              : order.Status === "Pending"
                              ? "В ожидании"
                              : order.Status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ₽{(order["Total Amount"] || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
