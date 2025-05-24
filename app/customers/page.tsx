import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CustomersPage() {
  const customers = [
    {
      id: "C001",
      name: "Иван Петров",
      email: "ivan@example.com",
      phone: "+7 999 123-45-67",
      totalOrders: 15,
      totalSpent: 125000,
      averageOrder: 8333,
      lastOrder: "2024-01-15",
      status: "VIP",
      location: "Москва",
    },
    {
      id: "C002",
      name: "Мария Сидорова",
      email: "maria@example.com",
      phone: "+7 999 234-56-78",
      totalOrders: 8,
      totalSpent: 75000,
      averageOrder: 9375,
      lastOrder: "2024-01-12",
      status: "Regular",
      location: "СПб",
    },
    {
      id: "C003",
      name: "Алексей Козлов",
      email: "alex@example.com",
      phone: "+7 999 345-67-89",
      totalOrders: 3,
      totalSpent: 25000,
      averageOrder: 8333,
      lastOrder: "2023-12-20",
      status: "New",
      location: "Екатеринбург",
    },
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      VIP: {
        variant: "default" as const,
        className: "bg-purple-100 text-purple-800",
      },
      Regular: { variant: "secondary" as const, className: "" },
      New: {
        variant: "outline" as const,
        className: "bg-green-100 text-green-800",
      },
    };

    const statusConfig = config[status as keyof typeof config];
    return (
      <Badge variant={statusConfig.variant} className={statusConfig.className}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Клиенты</h1>
        <p className="text-gray-600 mt-2">
          Управление клиентской базой и аналитика
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {customers.length}
              </div>
              <div className="text-sm text-gray-500">Всего клиентов</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ₽
                {Math.round(
                  customers.reduce((sum, c) => sum + c.totalSpent, 0) /
                    customers.length /
                    1000
                )}
                K
              </div>
              <div className="text-sm text-gray-500">Средний LTV</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  customers.reduce((sum, c) => sum + c.totalOrders, 0) /
                    customers.length
                )}
              </div>
              <div className="text-sm text-gray-500">Заказов на клиента</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₽
                {Math.round(
                  customers.reduce((sum, c) => sum + c.averageOrder, 0) /
                    customers.length /
                    1000
                )}
                K
              </div>
              <div className="text-sm text-gray-500">Средний чек</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <CardDescription>ID: {customer.id}</CardDescription>
                </div>
                {getStatusBadge(customer.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-mono">{customer.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Телефон:</span>
                  <span className="font-mono">{customer.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Город:</span>
                  <span>{customer.location}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Всего заказов:</span>
                  <span className="font-semibold">{customer.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Потрачено:</span>
                  <span className="font-semibold text-green-600">
                    ₽{customer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Средний чек:</span>
                  <span className="font-semibold">
                    ₽{customer.averageOrder.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Последний заказ:
                  </span>
                  <span className="text-sm">{customer.lastOrder}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
